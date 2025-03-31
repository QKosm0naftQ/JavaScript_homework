document.addEventListener("DOMContentLoaded", function () {
    // //Modal window
    const modalWindow = document.getElementById('PictureCropModal');

    const SaveImage = document.getElementById('SaveImage');
    const CancelSaveImage = document.getElementById('CancelSaveImage');
    const leftArrow = document.getElementById('leftArrow');
    const RightArrow = document.getElementById('RightArrow');
    const croppingImage = document.getElementById("croppingImage");
    let uploadedImageURL;
    let cropper;
    function openModal(event) {
        console.log('Modal відкритий!');
        modalWindow.classList.remove('hidden');

        const file = event.target.files[0];
        if (file) {
            croppingImage.src = URL.createObjectURL(file);
            console.log("uploadedImageURL", uploadedImageURL);
            if (cropper) {
                cropper.destroy();
            }

            cropper = new Cropper(croppingImage, { 
                aspectRatio: 1,
                viewMode: 1,
            });
        }
    }
    function saveImage() {
        if (cropper) {
            var base64 = cropper.getCroppedCanvas().toDataURL();
            closeModal(pictureResult, base64);
        }
    }
    function closeModal(MyPicture, image) {
        if (MyPicture && image) {
            if (MyPicture.classList.contains("hidden"))
                MyPicture.classList.remove("hidden");
            MyPicture.src = image;
        }
        modalWindow.classList.add('hidden');
    }


    leftArrow.onclick = function () {
        if (cropper) {
            cropper.rotate(-45);
        }
    }
    RightArrow.onclick = function () {
        if (cropper) {
            cropper.rotate(45);
        }
    }
    SaveImage.addEventListener('click', saveImage);
    CancelSaveImage.addEventListener('click', closeModal);
    // //Main window
    const pictureResult = document.getElementById('result_image');
    const pictureInput = document.getElementById('picture_input');

    const formRegister = document.getElementById("formRegister");

    formRegister.onsubmit = (e) => {
        e.preventDefault(); 
        const formData = {
            first_name: document.getElementById("floating_first_name").value,
            last_name: document.getElementById("floating_last_name").value,
            email: document.getElementById("floating_email").value,
            password: document.getElementById("floating_password").value,
            phone: document.getElementById("floating_phone").value,
            avatar: document.getElementById("result_image").src
        }
        const xhr = new XMLHttpRequest();
        const url = "https://goose.itstep.click/api/Account/register";


        const data = {
            email: formData.email,
            firstName: formData.first_name,
            secondName: formData.last_name,
            photo: formData.avatar,
            phone: formData.phone,
            password: formData.password,
            confirmPassword: formData.password
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log("Success:", xhr.responseText);
                } else {
                    console.error("Error:", xhr.status, xhr.responseText);
                }
            }
        };
        xhr.send(JSON.stringify(data));

        //LocalStorage save - old version
        //const oldItems = JSON.parse(localStorage.users ?? "[]");
        //console.log("Old list", oldItems);

        //let items = [...oldItems, formData];

        //let json = JSON.stringify(items);
        //localStorage.setItem("users", json);
        //console.log("Submit form", json);
        //location.href = "Page/_UserWindow.html"; 
    }



    pictureInput.addEventListener('change', openModal);
});
