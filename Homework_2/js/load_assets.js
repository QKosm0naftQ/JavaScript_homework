window.onload = function () {
    axios.get('/Homework_2/html/Assets.html')
        .then(response => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.data, 'text/html');

            doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                if (!document.querySelector(`link[href="${link.href}"]`)) {
                    document.head.appendChild(link.cloneNode());
                }
            });

            doc.querySelectorAll('script').forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                    document.body.appendChild(newScript);
                } else {
                    newScript.textContent = script.textContent;
                    document.body.appendChild(newScript);
                }
            });

            console.log('Завантаження assets.html успішно завершено');
        })
        .catch(error => console.error('Помилка завантаження assets.html:', error));
};
