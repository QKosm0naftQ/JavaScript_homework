function updateSlug() {
    document.getElementById("slug").value = getSlug(document.getElementById("name").value);
}

function getCategoryIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function loadCategoryData(id) {
    const itemGet = await axios.get(`https://goose.itstep.click/api/Categories/get/${id}`, {
        headers: {
            'Accept': '*/*'
        }
    });
    const { data } = itemGet;

    document.getElementById("name").value = data.title;
    document.getElementById("slug").value = data.urlSlug;
    document.getElementById("priority").value = data.priority;
    document.getElementById("user_avatar").src = `https://goose.itstep.click/images/200_${data.image}`;
}

document.addEventListener("DOMContentLoaded", async () => {
    show_loading();
    const categoryId = getCategoryIdFromUrl();
    if (categoryId) {
        await loadCategoryData(categoryId);
    } else {
        alert("ID категорії не вказано в URL");
    }
    hide_loading();
});

const editCategoryForm = document.getElementById("editCategoryForm");
editCategoryForm.onsubmit = async (e) => {
    e.preventDefault();
    let tmp_picture = document.getElementById("user_avatar").src;
    let newAvatar = await fetchImageAsBase64(tmp_picture); 
    const data = {
        id: getCategoryIdFromUrl(),
        title: document.getElementById("name").value,
        priority: document.getElementById("priority").value,
        urlSlug: document.getElementById("slug").value,
        image: newAvatar
    }
    axios.put("https://goose.itstep.click/api/Categories/edit", data, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(function (response) {
        console.log("Success:", response.data);
        pbContainer.hidden = false;
        let promise = new Promise(function (resolve, reject) {
            let i = 0;
            let interval = setInterval(() => {
                if (i <= 100) {
                    categoryPB.style.width = i + "%";
                    i += 12.5;
                } else {
                    clearInterval(interval);
                    location.href = "/html/Page/AdminPanel/AdminPage.html";
                    resolve();
                }
            }, 500);
        });
    })
    .catch(function (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    });

    //const xhr = new XMLHttpRequest();
    //const url = "https://goose.itstep.click/api/Categories/edit";

    //xhr.open("POST", url, true);
    //xhr.setRequestHeader("Content-Type", "application/json");

    //xhr.onreadystatechange = function () {
    //    if (xhr.readyState === 4) {
    //        if (xhr.status >= 200 && xhr.status < 300) {
    //            console.log("Success:", xhr.responseText);
    //            //pbContainer.hidden = false;
    //            //let promise = new Promise(function (resolve, reject) {
    //            //    let i = 0;
    //            //    let interval = setInterval(() => {
    //            //        if (i <= 100) {
    //            //            categoryPB.style.width = i + "%";
    //            //            i += 5;
    //            //        } else {
    //            //            clearInterval(interval);
    //            //            location.href = "/html/Page/AdminPanel/AdminPage.html";
    //            //            resolve();
    //            //        }
    //            //    }, 500);
    //            //});
    //        } else {
    //            console.log("Error:", xhr.responseText);
    //        }
    //    }
    //}
    //xhr.send(JSON.stringify(data));

    
}

async function fetchImageAsBase64(imagePath) {
    try {
        const response = await axios.get(imagePath, { responseType: 'blob' });
        const blob = response.data;

        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}