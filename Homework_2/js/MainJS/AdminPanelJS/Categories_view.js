console.log("view log");

let search = {
    page: 1,
};


async function fetchCategories() {
    try {   
        const query = Qs.stringify(search);
        const response = await axios.get(`https://goose.itstep.click/api/Categories/search?${query}`, {
            headers: {
                'Accept': '*/*'
            }
        });
        const { data } = response;
        const { categories, pages, total, currentPage } = data;
        loadPagination(pages, currentPage);
        const listCategories = document.getElementById("listCategories");
        listCategories.innerHTML = "";
        categories.forEach(item => {
            listCategories.innerHTML += `
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td class="p-4">
                            <img src="https://goose.itstep.click/images/200_${item.image}" class="" alt="Apple Watch">
                        </td>
                        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            ${item.title}
                        </td>
                        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            ${item.urlSlug}
                        </td>

                        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            ${item.priority}
                        </td>
                        <td class="px-6 py-4">
                            <a href="${item.id}" class="font-medium text-red-600 dark:text-red-500 hover:underline">Remove</a>
                        </td>
                    </tr>
                        `;
        });
        searchDataPage();
        //console.log("Server Result", data);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}
fetchCategories();

document.getElementById("searchBtn").addEventListener("click", async function (event) {
    try {
        const allItemList = await axios.get('https://goose.itstep.click/api/Categories/list', {
            headers: {
                'Accept': '*/*'
            }
        });
        const { data } = allItemList;
        const listCategories = document.getElementById("listCategories");
        listCategories.innerHTML = "";
        data.forEach(item => {
            if (item.title.toLowerCase() == document.getElementById("name").value.toLowerCase()) {
                listCategories.innerHTML +=
                    `
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td class="p-4">
                                <img src="https://goose.itstep.click/images/200_${item.image}" class="" alt="Apple Watch">
                            </td>
                            <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                ${item.title}
                            </td>
                            <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                ${item.urlSlug}
                            </td>

                            <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                ${item.priority}
                            </td>
                            <td class="px-6 py-4">
                                <a href="${item.id}" class="font-medium text-red-600 dark:text-red-500 hover:underline">Remove</a>
                            </td>
                        </tr>
                    `;
            }
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
    }
});

function searchDataPage() {
    document.querySelectorAll('[data-page]').forEach(element => {
        element.addEventListener('click', event => {
            //event.preventDefault(); // Запобігаємо переходу за посиланням
            const page = event.target.getAttribute('data-page'); // Отримуємо значення data-page
            search.page = page;
            fetchCategories();
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
