console.log("view products");

let search = {
    page: 1,
};

async function fetchProducts() {
    try {
        const query = Qs.stringify(search);
        const response = await axios.get(`${window.API_BASE_URL}/api/Products/search?${query}`, {
            headers: {
                'Accept': '*/*'
            }
        });

        const { data } = response;
        const { products, pages, currentPage } = data;
        loadPagination(pages, currentPage);

        const listProducts = document.getElementById("listCategories");
        listProducts.innerHTML = "";

        products.forEach(item => {
            let imagesHTML = '';
            if (item.images && item.images.length > 0) {
                imagesHTML = item.images.map(img => `
            <img src="${window.API_BASE_URL}/images/200_${img}" 
                 class="w-20 h-20 object-cover rounded-lg mr-2 mb-2 border" 
                 alt="Product Image">
        `).join('');
            } else {
                imagesHTML = '<span class="text-gray-400">Немає фото</span>';
            }

            listProducts.innerHTML += `
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td class="p-4 flex flex-wrap">
                ${imagesHTML}
            </td>
            <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                ${item.name}
            </td>
            <td class="px-6 py-4 text-gray-900 dark:text-white">
                ${item.categoryName}
            </td>
            <td class="px-6 py-4 text-gray-900 dark:text-white">
                ${item.priority}
            </td>
            <td class="px-6 py-4 text-gray-900 dark:text-white">
                ${item.price}
            </td>
            <td class="px-6 py-4 text-gray-900 dark:text-white max-w-xs">
                ${item.description}
            </td>
            <td class="px-6 py-4 text-gray-900 dark:text-white">
                <ul>
                    <li> <a href="/html/Page/AdminPanel/Products/Edit.html?id=${item.id}" class="font-medium text-red-600 dark:text-red-500 hover:underline">Редагувати</a></li>
                </ul>
            </td>
        </tr>
    `;
        });


        searchDataPage();

    } catch (error) {
        console.error('Помилка при завантаженні продуктів:', error);
    }
}

fetchProducts();
function searchDataPage() {
    document.querySelectorAll('[data-page]').forEach(element => {
        element.addEventListener('click', event => {
            //event.preventDefault(); // Запобігаємо переходу за посиланням
            const page = event.target.getAttribute('data-page'); // Отримуємо значення data-page
            search.page = page;
            fetchProducts();
            console.log('Вибрано сторінку:', page);
        });
    });
}

function loadPagination(pages, currentPage) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = `
    <li>
            <a href="#" data-page="${1}" class="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">First</a>
    </li>
    `;

    for (let i = 1; i <= pages; i++) {
        if (i == currentPage) {
            pagination.innerHTML += `
            <li>
                <a href="#" data-page="${i}" aria-current="page" class="flex items-center justify-center px-4 h-10 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">${i}</a>
            </li>
            `;

        }
        else {
            pagination.innerHTML += `
            <li>
                <a href="#" data-page="${i}" class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">${i}</a>
            </li>
            `;
        }
    }

    pagination.innerHTML += `
    <li>
        <a href="#" data-page="${pages}" class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Last</a>
    </li>
        `;
}