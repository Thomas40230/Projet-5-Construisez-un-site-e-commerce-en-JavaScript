// Afficher les articles
function productArticles(product) {
    for(let x = 0; x < product.length; x += 1) {
        const ITEMS = document.getElementById('items')
        ITEMS.innerHTML +=
        `<a href="./product.html?id=${product[x]._id}">
            <article>
                <img src="${product[x].imageUrl}" alt=${product[x].altTxt}>
                <h3 class="productName">${product[x].name}</h3>
                <p class="productDescription">${product[x].description}</p>
            </article>
        </a>`
    }
};

function getArticle () {
    // Récupérer les données des canapés
    fetch('http://localhost:3000/api/products')
    .then(response => response.json() )
    .then(product => productArticles(product))
    .catch(error => console.log(error));
};  

// On apelle notre fonction
getArticle();