const table = document.querySelector("table");
const includesButon = document.getElementById("includesButton");
const products = [];
const editButton = "assets/edit.png";
const deleteButton = "assets/trash.png";

window.addEventListener("load", () => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
        products.push(...JSON.parse(storedProducts));
    }
    renderProducts();
});

function renderProducts() {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
        try {
            const parsedProducts = JSON.parse(storedProducts);
            const tbody = document.querySelector('table tbody');
            tbody.innerHTML = '';

            for (const product of parsedProducts) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="productName">${product.name}</td>
                    <td>${product.price}</td>
                    <td><img src="${editButton}" class="editButton" id="${product.id}"></td>
                    <td><img src="${deleteButton}" class="deleteButton" id="${product.id}"></td>
                `;
                tbody.appendChild(row);
            }
        } catch (error) {
            console.error("Error parsing stored products:", error);
        }
    }
}

function updateLocalStorage() {
    localStorage.setItem("products", JSON.stringify(products));
}

includesButon.addEventListener("click", function(){
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const id = new Date().getTime();

    if(name == "" || description == "" || Number(price) == ""){
        alert("Please insert a valid data.");
        return;
    }

    if(Number(price) <= 0){
        alert("Price cannot be 0 or negative.");
        return;
    }

    const productObj = {name: name, description: description, price: price, id: id};
    products.push(productObj);

    const tbody = document.querySelector('table tbody');
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="productName">${productObj.name}</td>
        <td>${productObj.price}</td>
        <td><img src="${editButton}" class="editButton" id="${productObj.id}"></td>
        <td><img src="${deleteButton}" class="deleteButton" id="${productObj.id}"></td>
    `;
    tbody.appendChild(row);

    alert(`Product ${productObj.name} successfully included!`);
    updateLocalStorage();

    document.getElementById("name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
});

const tableBody = document.querySelector("table tbody");
const modalProduct = document.getElementById("modalProduct");
const modalProductId = document.getElementById("modalProductId");
const modalProductName = document.getElementById("modalProductName");
const modalProductDescription = document.getElementById("modalProductDescription");
const modalProductPrice = document.getElementById("modalProductPrice");
const closeButtonProduct = document.getElementById("closeProduct");

tableBody.addEventListener("click", function(event) {
    const target = event.target;
    if (target.classList.contains("productName")) {
        const productName = target.textContent;
        const product = products.find(p => p.name === productName);
        modalProductId.textContent = `ID: ${product.id}`;
        modalProductName.textContent = `Name: ${product.name}`;
        modalProductDescription.textContent = `Description: ${product.description}`;
        modalProductPrice.textContent = `Price: ${product.price}`;
        modalProduct.style.display = "block";
    }
});

closeButtonProduct.addEventListener("click", function() {
    modalProduct.style.display = "none";
});

window.addEventListener("click", function(event) {
    if (event.target == modalProduct) {
        modalProduct.style.display = "none";
    }
});

const modalEdit = document.getElementById("modalEdit");
const modalEditProductId = document.getElementById("modalEditProductId");
const modalEditProductName = document.getElementById("modalEditProductName");
const modalEditProductDescription = document.getElementById("modalEditProductDescription");
const modalEditProductPrice = document.getElementById("modalEditProductPrice");
const saveEditButton = document.getElementById("saveEditButton");
const closeButtonEdit = document.getElementById("closeEdit");

tableBody.addEventListener("click", function(event) {
    const target = event.target;
    if (target.classList.contains("editButton")) {
        const productId = parseInt(target.id);
        const product = products.find(p => p.id === productId);
        if (product) {
            modalEditProductId.value = productId;
            modalEditProductName.value = product.name;
            modalEditProductDescription.value = product.description;
            modalEditProductPrice.value = product.price;
            modalEdit.style.display = "block";
        } else {
            console.error("Product not found for ID:", productId);
        }
    }
});

closeButtonEdit.addEventListener("click", function() {
    modalEdit.style.display = "none";
});

saveEditButton.addEventListener("click", function() {
    const id = Number(modalEditProductId.value);
    const name = modalEditProductName.value;
    const description = modalEditProductDescription.value;
    const price = modalEditProductPrice.value;
    const index = products.findIndex(p => p.id === id);
    
    if (index !== -1) {
        products[index].name = name;
        products[index].description = description;
        products[index].price = price;
        modalEdit.style.display = "none";

        const tbody = document.querySelector('table tbody');
        tbody.innerHTML = '';

        for (const product of products) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="productName">${product.name}</td>
                <td>${product.price}</td>
                <td><img src="${editButton}" class="editButton" id="${product.id}"></td>
                <td><img src="${deleteButton}" class="deleteButton" id="${product.id}"></td>
            `;
            tbody.appendChild(row);
        }
        updateLocalStorage();
    }
});

tableBody.addEventListener("click", function(event) {
    const target = event.target;
    if (target.classList.contains("deleteButton")) {
        const productId = Number(target.id);
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products.splice(index, 1);

            const row = target.closest("tr");
            row.remove();
            updateLocalStorage();
        }
    }
});