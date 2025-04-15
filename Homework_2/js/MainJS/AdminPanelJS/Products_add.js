let ids = [];
const fileInput = document.getElementById('imageInput');
const imageContainer = document.getElementById('imagesList');

fileInput.addEventListener('change', async function () {
        const files = fileInput.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                let objectURL = URL.createObjectURL(file);
                let data = await uploadImage(file, objectURL);
                imageContainer.innerHTML += `
                <img class="w-full h-24 p-1 rounded-lg shadow-lg" src="${window.API_BASE_URL}/images/100_${data.name}" />
                `;
                ids.push(data.id);
            }
        }
    });

async function uploadImage(file, objectURL) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = async function () {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const base64String = canvas.toDataURL(file.type);
                URL.revokeObjectURL(objectURL);
                const response = await axios.post(`${window.API_BASE_URL}/api/Products/upload`, {
                    image: base64String
                },{
                    headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                    }
                });
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        };
            img.src = objectURL;
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const list = await axios.get(`${window.API_BASE_URL}/api/Categories/list`);
        const selectElement = document.getElementById('category');
        list.data.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.title;
            selectElement.appendChild(option);
        });
        } catch (error) {
            console.error("error loading categories", error);
        }
    });

tinymce.init({
    selector: '#description',
    plugins: 'advlist autolink link image lists charmap preview anchor pagebreak searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media table emoticons help',
    toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | preview media fullscreen | forecolor backcolor emoticons | help',
    menubar: 'file edit view insert format tools table help'
});

const createProductForm = document.getElementById("createProductForm");
createProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const request = {
        name: document.getElementById('title').value,
        priority: document.getElementById('priority').value,
        categoryId: document.getElementById('category').value,
        price: document.getElementById('price').value,
        description: tinymce.activeEditor.getContent(),
        ids
    };

try {
    const response = await axios.post(`${window.API_BASE_URL}/api/Products/add`, request, {
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
        }
    });
        console.log("Продукт додано", response.data);
        location.href = "/html/Page/AdminPanel/AdminPage.html";
    } catch (error) {
        console.error("Помилка при додаванні продукту:", error.response?.data || error);
    }
});
