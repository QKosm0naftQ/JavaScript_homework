const formRegistration = document.getElementById('formLogin');

formRegistration.onsubmit = async (e) => {
    show_loading();
    e.preventDefault();
    ClearErrors();
    const formData = {
        email: document.getElementById("user_email").value,
        password: document.getElementById("user_password").value,
    }
    const xhr = new XMLHttpRequest();
    const url = "https://goose.itstep.click/api/Account/login";

    const data = {
        email: formData.email,
        password: formData.password,
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                    //console.log("Success:", xhr.responseText);
                const resp = xhr.responseText;
                const token = JSON.parse(resp).token;
                    //console.log("Success:", token);
                localStorage.setItem("token", token);
                    // if admin 
                try {
                    const response = await axios.get('https://goose.itstep.click/api/Users/all', {
                        headers: {
                            'accept': '*/*',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    localStorage.setItem("UserRights", "Admin");
                    location.href = "/html/Page/AdminPanel/MainWindow.html";
                } catch (error) {
                    localStorage.setItem("UserRights", "Default");
                    location.href = "/html/Page/Profile.html";
                }


                user_successSubmit.hidden = false;
                hide_loading();
            } else {
                ErrorMessage(xhr.responseText);
                hide_loading();
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
                        //case "email": { user_emailError.hidden = false; user_emailError.textContent = errorMessages; break; }
                        case "password": { user_passwordError.hidden = false; user_passwordError.textContent = errorMessages; break; }
                        case "invalid": { user_passwordError.hidden = false; user_passwordError.textContent = errorMessages; break; }
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

}