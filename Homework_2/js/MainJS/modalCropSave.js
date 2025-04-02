document.addEventListener('DOMContentLoaded', (event) => {

    let cropper;
    let uploadImageURL;
    const avatar = document.getElementById('user_avatar');


    const croppingImage = document.getElementById('croppingImage');
    const photoEditModal = document.getElementById('photoEditModal');
    const OpenModal = document.getElementById('user_input_picture');

    const leftRotate = document.getElementById('leftRotate');
    const rightRotate = document.getElementById('rightRotate');

    OpenModal.onchange = (event) => {
        photoEditModal.classList.remove('hidden');

        const file = event.target.files[0];
        if (file) {

            if (uploadImageURL) {
                URL.revokeObjectURL(uploadImageURL);
            }

            croppingImage.src = uploadImageURL = URL.createObjectURL(file);

            if (cropper) {
                cropper = cropper.destroy();
            }
            cropper = new Cropper(croppingImage, {
                aspectRatio: 1,
                viewMode: 1
            });
        }
    }

    SaveCroppingImage.onclick = (event) => {
        if (cropper) {
            var base64 = cropper.getCroppedCanvas().toDataURL();
            avatar.src = uploadImageURL = base64;
        }
        photoEditModal.classList.add('hidden');

    }
    CancelSaveCroppingImage.onclick = (event) => {
        photoEditModal.classList.add('hidden');
    }
    leftRotate.onclick = function () {
        if (cropper) {
            cropper.rotate(-45);
        }
    }
    rightRotate.onclick = function () {
        if (cropper) {
            cropper.rotate(45);
        }
    }
});