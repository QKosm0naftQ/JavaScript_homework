document.addEventListener("DOMContentLoaded", function () {
    //Modal window
    const modalWindow = document.getElementById('PictureCropModal');
    const SaveImage = document.getElementById('SaveImage');
    //Main window
    const pictureInput = document.getElementById('picture_input');
    const pictureResult = document.getElementById('result_image');
    const leftArrow = document.getElementById('leftArrow');
    const RightArrow = document.getElementById('RightArrow');
    //New funkc
    const croppingImage = document.getElementById("croppingImage");
    let uploadedImageURL;
    let cropper;
    function openModal(event) {
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
    function closeModal(MyPicture,image) {
        if (MyPicture.classList.contains("hidden"))
            MyPicture.classList.remove("hidden");
        modalWindow.classList.add('hidden');
        MyPicture.src = image;
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
    pictureInput.addEventListener('change', openModal);
});