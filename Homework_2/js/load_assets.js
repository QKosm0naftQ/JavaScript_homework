fetch('/Homework_2/html/Assets.html')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');

        // Додаємо CSS файли
        doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            if (!document.querySelector(`link[href="${link.href}"]`)) {
                document.head.appendChild(link.cloneNode());
            }
        });

        // Додаємо JS файли (уникаємо дублювання)
        doc.querySelectorAll('script').forEach(script => {
            if (script.src && !document.querySelector(`script[src="${script.src}"]`)) {
                const newScript = document.createElement('script');
                newScript.src = script.src;
                newScript.defer = true;
                document.body.appendChild(newScript);
            } else if (!script.src) {
                // Виконання inline-скриптів
                const inlineScript = document.createElement('script');
                inlineScript.textContent = script.textContent;
                document.body.appendChild(inlineScript);
            }
        });

        console.log('Завантаження assets.html успішно завершено');
    })
    .catch(error => console.error('Помилка завантаження assets.html:', error));
