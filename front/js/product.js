const IMG_PRODUCT = document.querySelector(".item__img");
const NAME_PRODUCT = document.getElementById("title");
const PRICE_PRODUCT = document.getElementById("price");
const DESCRIPTION_PRODUCT = document.getElementById("description");
const COLOR_PRODUCT = document.getElementById("colors");
const QUANTITY_PRODUCT = document.getElementById("quantity");
const BTN_ADD_TO_CART = document.getElementById("addToCart");

// Récuperation de l'URL de chaque ID
const URL_ID = window.location.search;
const URL_PARAMS = new URLSearchParams(URL_ID);
const ID_ITEM = URL_PARAMS.get("id");

// Redirection vers la page du panier
function redirectToCart() {
    window.location.href = "cart.html"
};


// Sauvegarde le panier dans le localStorage
function saveOrder(product) {
    let order = {
        id: product._id,
        name: NAME_PRODUCT,
        color: COLOR_PRODUCT.value,
        quantity: Number(QUANTITY_PRODUCT.value),
        imageUrl: IMG_PRODUCT,
        description: DESCRIPTION_PRODUCT,
        altTxt: product.altTxt
    }
    let orderKey = `${ID_ITEM}-${COLOR_PRODUCT.value}`
    localStorage.setItem(orderKey, JSON.stringify(order))
};

// Condition panier valide
function invalidOrder(color, quantity) {
    if( quantity === 0 ) {
        alert("Veuillez choisir une quantité pour cet article")
        return true
    }else if ( quantity > 100 ) {
        alert("La quantité maximum pour cet article est de 100 exemplaires")
        return true
    }else if ( color === null || color === '' ) {
        alert(" Veuillez choisir une couleur disponible pour cet article")
        return true
    }
}; 

// Ajouter le choix des couleurs pour chaques items
function getColors(product) {
    for( let color of product.colors) {
        const CHOICE_COLORS = document.createElement("option");
        CHOICE_COLORS.value = `${color}`;
        CHOICE_COLORS.innerText = `${color}`;
        COLOR_PRODUCT.appendChild(CHOICE_COLORS);
    } 
};

// Ajouter les éléments dans le HTML
function displayProduct(product) {
    IMG_PRODUCT.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`;
    NAME_PRODUCT.innerHTML = `<h1 id="title">${product.name}</h1>`;
    PRICE_PRODUCT.innerHTML = `<span id="price">${product.price}</span>`;
    DESCRIPTION_PRODUCT.innerHTML = `<p id="description">${product.description}</p>`;
    getColors(product); // On apelle la fonction getColors pour l'ajouter dans le DOM
}

// Recuperation des données des produits et les utiliser dans la fonction displayProduct
function recoverDataProduct() {
    fetch(`http://localhost:3000/api/products/${ID_ITEM}`)
        .then(response => response.json())
        .then((product) => displayProduct(product)) 
        .catch((error) => console.log(error)) 
    };

// Validation panier
function validItemInCart() {
    fetch(`http://localhost:3000/api/products/${ID_ITEM}`)
    .then(response => response.json())
    .then((product) => {
        let colorProduct = document.getElementById("colors").value;
        let quantityProduct = Number(document.getElementById("quantity").value);
        if(invalidOrder(colorProduct, quantityProduct) === true) {
            return
        } 
            saveOrder(product)
            alert(`Votre produit ${product.name} en ${QUANTITY_PRODUCT.value} exemplaire(s) à bien été ajouter a votre panier !`)
            redirectToCart();
    }
)};

// Evénement "Ajouter au panier"
function EventBtnAddToCart() {
    BTN_ADD_TO_CART.addEventListener('click', validItemInCart);
    };

// On appelle la fonction   
recoverDataProduct();    

// On appelle la fonction
EventBtnAddToCart();