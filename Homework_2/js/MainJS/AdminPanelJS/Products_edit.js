function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

const categorySelect = document.getElementById("category");
let selectedCategoryId = null;
let selectedImages = []; // Збереження нових вибраних зображень
let uploadedImageIds = [];

async function loadCategoriesAndFillSelect(selectedId = null) {
    try {
        const res = await axios.get(`${window.API_BASE_URL}/api/Categories/list`, {
            headers: { 'Accept': '*/*' }
        });

        const categories = res.data;
        categorySelect.innerHTML = `<option value="0">Оберіть категорію</option>`;

        categories.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat.id;
            opt.textContent = cat.title;
            if (selectedId && cat.id === selectedId) opt.selected = true;
            categorySelect.appendChild(opt);
        });

        categorySelect.addEventListener("change", () => {
            selectedCategoryId = parseInt(categorySelect.value);
        });

    } catch (error) {
        console.error("Помилка при завантаженні категорій:", error);
    }
}

async function loadProductData(id) {
    try {
        const itemGet = await axios.get(`${window.API_BASE_URL}/api/Products/get/${id}`);
        const { data } = itemGet;

        document.getElementById("title").value = data.name;
        document.getElementById("priority").value = data.priority;
        document.getElementById("price").value = data.price;
        await tinymce.get("description").setContent(data.description);

        await loadCategoriesAndFillSelect(data.categoryId);

        //const imgList = document.getElementById("imagesList");
        //imgList.innerHTML = "";
        //data.images.forEach(img => {
        //    const imageElement = document.createElement("img");
        //    imageElement.src = `${window.API_BASE_URL}/images/200_${img.name}`;
        //    imageElement.alt = "product image";
        //    imageElement.className = "h-24 rounded border";
        //    imgList.appendChild(imageElement);
        //});

    } catch (err) {
        console.error("Помилка при завантаженні продукту:", err);
        alert("Не вдалося завантажити продукт.");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    show_loading();
    const productId = getProductIdFromUrl();
    if (productId) {
        await loadProductData(productId);
    } else {
        console.log("ID продукту не вказано в URL");
    }
    hide_loading();
});

const imageInput = document.getElementById("imageInput");
const imagesList = document.getElementById("imagesList");

imageInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);

    imagesList.innerHTML = "";
    selectedImages = [];

    files.forEach(file => {
        selectedImages.push(file);

        const reader = new FileReader();
        reader.onload = function (event) {
            const img = document.createElement("img");
            img.src = event.target.result;
            img.className = "h-24 rounded border";
            img.alt = "selected image";
            imagesList.appendChild(img);
        }
        reader.readAsDataURL(file);
    });
});

const editProductForm = document.getElementById("editProductPage");

// Завантаження на сервер
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
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                });
                //resolve(base64String);
                const { data } = response;
                resolve(data.id);
            } catch (error) {
                reject(error);
            }
        };
        img.src = objectURL;
    });
}

editProductForm.onsubmit = async (e) => {
    e.preventDefault();

    uploadedImageIds = [];

    for (const file of selectedImages) {
        const objectURL = URL.createObjectURL(file);
        try {
            const id = await uploadImage(file, objectURL);
            uploadedImageIds.push(id);
        } catch (err) {
            console.error("Помилка при завантаженні зображення:", err);
        }
    }

    const data = {
        id: parseInt(getProductIdFromUrl()),
        name: document.getElementById("title").value,
        categoryId: parseInt(categorySelect.value),
        priority: parseInt(document.getElementById("priority").value),
        price: parseInt(document.getElementById("price").value),
        description: tinymce.get("description").getContent(),
        ids: uploadedImageIds,
        image: "string"
    };


    try {
        const response = await axios.put(`${window.API_BASE_URL}/api/Products/edit`, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log("Продукт оновлено:", response.data);
        location.href = "/html/Page/AdminPanel/AdminPage.html";
    } catch (error) {
        console.error("Помилка при оновленні продукту:", error.response?.data || error);
    }
};

tinymce.init({
    selector: '#description',
    plugins: 'advlist autolink link image lists charmap preview anchor pagebreak searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media table emoticons help',
    toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | preview media fullscreen | forecolor backcolor emoticons | help',
    menubar: 'file edit view insert format tools table help'
});
