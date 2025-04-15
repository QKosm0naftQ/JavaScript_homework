const loadFileHtml = (path) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", path, false);
    xhr.send();
    document.write(xhr.response);
}
const loadFileHtml_returnSome = (path) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", path, false);
    xhr.send();
    return xhr.response;
}
const loadFileHtml_returnSomeAsync = async (path) => {
    return await new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", path, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(new Error("Failed to load file .loadPartCode"));
                }
            }
        };
        xhr.send();
    });
}



window.API_BASE_URL = 'http://localhost:5227';