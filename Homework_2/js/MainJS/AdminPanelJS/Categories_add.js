const categiryForm = document.getElementById("addCategoryPage");
categiryForm.onsubmit = async (e) => {
    e.preventDefault();
    let tmp_picture = document.getElementById("user_avatar").src;
    let newAvatar = await fetchImageAsBase64(tmp_picture); 
    
    const data = {
        title: document.getElementById("name").value,
        priority: document.getElementById("priority").value,
        urlSlug: document.getElementById("slug").value,
        image: newAvatar
    }
    const xhr = new XMLHttpRequest();
    const url = "https://goose.itstep.click/api/Categories/add";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                if (document.getElementById("slug_error").hidden == false) {
                    document.getElementById("slug_error").hidden = true;
                }
                console.log("Success:", xhr.responseText);
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
            } else {
                console.log("Error:", xhr.responseText);
                document.getElementById("slug_error").hidden = false;
                document.getElementById("slug_error").textContent = "Такий slug вже існує";
            }
        }
    };
    xhr.send(JSON.stringify(data));


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
}

//                      поки помилка може бути тільки коли url-slug вже існує
//function ErrorMessage(Message) {
//    const response = JSON.parse(Message);
//    console.log("response:", response);
//    //if (response.errors) {
//    //    for (const field in response.errors) {
//    //        if (response.errors.hasOwnProperty(field)) {
//    //            const fieldErrors = response.errors[field];
//    //            console.log("field:", field, "error", fieldErrors);
//    //            errorMessages = fieldErrors;
//    //            switch (field) {
//    //                case "email": { user_emailError.hidden = false; user_emailError.textContent = errorMessages; break; }
//    //                case "password": { user_passwordError.hidden = false; user_passwordError.textContent = errorMessages; break; }
//    //            }
//    //        }
//    //    }
//    //}
//}