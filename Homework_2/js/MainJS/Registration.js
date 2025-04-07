const formRegistration = document.getElementById('formRegistration'); 

formRegistration.onsubmit = async (e) => {
    e.preventDefault();
    ClearErrors();
    const formData = {
        first_name: document.getElementById("user_first_name").value,
        last_name: document.getElementById("user_last_name").value,
        email: document.getElementById("user_email").value,
        password: document.getElementById("user_password").value,
        phone: document.getElementById("user_phone").value,
        avatar: document.getElementById("user_avatar").src
    }
    const xhr = new XMLHttpRequest();
    const url = "https://goose.itstep.click/api/Account/register";

    let newAvatar = await fetchImageAsBase64(formData.avatar); 

    const data = {
        email: formData.email,
        firstName: formData.first_name,
        secondName: formData.last_name,
        photo: newAvatar,
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
                user_successSubmit.hidden = false;
            } else {
                ErrorMessage(xhr.responseText);
            }
        }
    };
    xhr.send(JSON.stringify(data));
    
    function ErrorMessage(Message) {
        const response = JSON.parse(Message);
        if (response.errors) {
            for (const field in response.errors) {
                if (response.errors.hasOwnProperty(field)) {
                    const fieldErrors = response.errors[field];
                    console.log("field:", field, "error", fieldErrors);
                    errorMessages = fieldErrors;
                    switch (field) {
                        case "email": { user_emailError.hidden = false; user_emailError.textContent = errorMessages; break; }
                        case "password": { user_passwordError.hidden = false; user_passwordError.textContent = errorMessages; break; }
                    }
                }
            }
        }
    }
    function ClearErrors() {
        user_emailError.hidden = true;
        user_passwordError.hidden = true;
        user_successSubmit.hidden = true;
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
}