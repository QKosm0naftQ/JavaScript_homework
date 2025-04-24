const key_api = "1ad4620160127199f21bae2fc7e7945c"; // OpenWeatherMap API key

const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");
const btnSend = document.getElementById("btnSend");
//
const weatherBlock = document.getElementById("imageInfoWeather");
//
let sessionSeconds = 0;
let requestCount = 0;
const sessionTimeEl = document.getElementById('session_time');
const requestCountEl = document.getElementById('request_count');


document.addEventListener("DOMContentLoaded", async function () {
    try {
        setInterval(() => {
            sessionSeconds++;
            sessionTimeEl.textContent = `${sessionSeconds} с`;
        }, 1000);
        // Отримання даних з API по країнам і містам // //// //// ////
        const response = await axios.get('https://countriesnow.space/api/v0.1/countries', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        });
        const countriesData = response.data.data;

        countriesData.forEach(item => {
            const option = document.createElement("option");
            option.value = item.iso2;
            option.textContent = item.country;
            countrySelect.appendChild(option);
        });
        let cityData = [];

        countrySelect.addEventListener("change", function () {
            cityData = [];
            citySelect.innerHTML = "";
            const selectedIso2 = this.value;

            const selectedCountry = countriesData.find(c => c.iso2 === selectedIso2)?.country;

            cityData = countriesData.find(c => c.iso2 === selectedIso2)?.cities || [];

            cityData.forEach(item => {
                const option = document.createElement("option");
                option.value = item;
                option.textContent = item;
                citySelect.appendChild(option);
            });
        });


        let selectedCity = "";
        citySelect.addEventListener("change", function () {
            selectedCity = this.value;
        });

        //// //// ////
        btnSend.addEventListener("click", async function () {
            const result = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${selectedCity}&limit=1&appid=${key_api}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                }
            });
            const dataPlace = await axios.get('https://api.openweathermap.org/data/2.5/weather', { // &exclude=${part}
                params: {
                    lat: result.data[0].lat,
                    lon: result.data[0].lon,
                    appid: key_api
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                }
            });
            console.log("dataPlace Search:", dataPlace.data);

            const weatherIcon = dataPlace.data.weather[0].icon;
            const kelvinToCelsius = k => Math.round(k - 273.15);

            weatherBlock.innerHTML = `
              <div class="p-4 bg-white rounded-lg shadow-lg space-y-2 text-gray-800">  
                  <div class="flex items-center space-x-4">
                      <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="icon" class="w-16 h-16">
                      <div>
                        <h2 class="text-xl font-bold">${dataPlace.data.name}, ${dataPlace.data.sys.country}</h2>
                        <p class="text-sm capitalize text-gray-500">${dataPlace.data.weather[0].description}</p>
                      </div>
                </div>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div>🌡 Температура: <strong>${kelvinToCelsius(dataPlace.data.main.temp)}°C</strong></div>
                  <div>🤒 Відчувається: <strong>${kelvinToCelsius(dataPlace.data.main.feels_like)}°C</strong></div>
                  <div>💧 Вологість: <strong>${dataPlace.data.main.humidity}%</strong></div>
                  <div>🌬 Вітер: <strong>${dataPlace.data.wind.speed} м/с</strong></div>
                  <div>☁️ Хмарність: <strong>${dataPlace.data.clouds.all}%</strong></div>
                  <div>🌧 Опади: <strong>${dataPlace.data.rain?.["1h"] ?? 0} мм/год</strong></div>
                </div>
              </div>
            `
            requestCount++;
            requestCountEl.textContent = requestCount;
        });





    }
    catch (error) {
        console.log("Error:", error);
        alert("Error: " + error.message + "- Попробуйте вибрати ще раз ");
    };

});


// SITE https://countriesnow.space/api/v0.1/countries