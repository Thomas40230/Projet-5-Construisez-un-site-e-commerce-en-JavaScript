// Tableau du contenu du panier
const cart = [];
const products = [];

// Donnée du formulaire
const INPUT_NAME = document.getElementById("firstName");
const INPUT_LAST_NAME = document.getElementById("lastName");
const INPUT_ADRESS = document.getElementById("address");
const INPUT_CITY = document.getElementById("city");
const INPUT_MAIL = document.getElementById("email");
const BTN_ORDER = document.querySelector('#order');
const SECTION_CART = document.getElementById("cart__items");

// Message d'erreur du formulaire
const ERROR_FIRST_NAME_FORM = document.getElementById("firstNameErrorMsg");
const ERROR_LAST_NAME_FORM = document.getElementById("lastNameErrorMsg");
const ERROR_ADDRESS_FORM = document.getElementById("addressErrorMsg");
const ERROR_CITY_FORM = document.getElementById("cityErrorMsg");
const ERROR_MAIL_FORM = document.getElementById("emailErrorMsg");

// Expression réguliere pour étudier les correspondances de texte du formulaire
let emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$");
let addressRegExp = new RegExp("^[0-9]{1,4}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");
let texteRegExp = new RegExp("^[a-zA-Z ,.'-]{3,15}$");

// Recuperer les items du localstorage pour les mettre dans le panier
function retrieveLocalStorageItems() {
    for( x = 0; x < localStorage.length; x++)  {
        const ITEM = localStorage.getItem(localStorage.key(x));
        const item_object = JSON.parse(ITEM);
        console.log(item_object);
        cart.push(item_object);
        console.log(cart);
    };
};

retrieveLocalStorageItems();

// Recuperer l'ID des produits du panier
function getIdFromCache() {
    const idOrder = [];
    for (let i = 0; i < localStorage.length; i++) {
      const KEY = localStorage.key(i);
      const ID = KEY.split("-")[0];
      idOrder.push(ID);
    }
    return idOrder;
};

// Validation du champ prenom
function firstNameValid() {
    if(!texteRegExp.test(INPUT_NAME.value)) {
        ERROR_FIRST_NAME_FORM.innerHTML = "Prénom incorrect";
        return false;
    }else {
        ERROR_FIRST_NAME_FORM.innerHTML = "Prénom correct";
        return true;
    };
};

// Validation du champ nom
function lastNameValid() {
    if(!texteRegExp.test(INPUT_LAST_NAME.value)) {
        ERROR_LAST_NAME_FORM.innerHTML = "Nom incorrect";
        return false;
    }else {
        ERROR_LAST_NAME_FORM.innerHTML = "Nom correct";
        return true;
    };
};

// Validation du champ adresse
function addressNameValid() {
    if(!addressRegExp.test(INPUT_ADRESS.value)) {
        ERROR_ADDRESS_FORM.innerHTML = "Adresse incorrect";
        return false;
    }else {
        ERROR_ADDRESS_FORM.innerHTML = "Adresse correct";
        return true;
    };
};

// Validation du champ ville
function cityValid() {
    if(!texteRegExp.test(INPUT_CITY.value)) {
        ERROR_CITY_FORM.innerHTML = "Nom de Ville incorrect";
        return false;
    }else {
        ERROR_CITY_FORM.innerHTML = "Nom de Ville correct";
        return true;
    };
};

// Validation du champ Email
function emailValid() {
    if(!emailRegExp.test(INPUT_MAIL.value)) {
        ERROR_MAIL_FORM.innerHTML = "Email incorrect";
        return false;
    }else {
        ERROR_MAIL_FORM.innerHTML = "Email correct";
        return true;
    };
};

// Verification de la validation du formulaire
function formValid() {
    return firstNameValid() &&
            lastNameValid() &&
            addressNameValid() &&
            cityValid() &&
            emailValid(); 
};

// Objet qui contient les informations des clients
function makeBodyRequest() {
    const BODY = {
        contact:{
          firstName: INPUT_NAME.value,
          lastName: INPUT_LAST_NAME.value,
          address: INPUT_ADRESS.value,
          city: INPUT_CITY.value,
          email: INPUT_MAIL.value 
        },
        products: getIdFromCache()
    };
    return BODY;
};

// Méthode POST, on envoie les données du client et l'id des produits à l'API
function orderRequest() {
    const ORDER = makeBodyRequest();
    fetch('http://localhost:3000/api/products/order', {
        method: "POST",
        body: JSON.stringify(ORDER),
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((res) => res.json())
    .then((data) => {
        localStorage.clear()
        document.location.href = `confirmation.html?_id=${data.orderId}`
    });
};

// Envoyer les données des clients au serveur
function submitForm(e) {
    e.preventDefault();
    if(cart.length === 0) { 
        alert(" Veuillez remplir votre panier car celui-ci est vide !");
        return;
    }else if(formValid()) {
    orderRequest();
    }
};

// Le bouton confirmer appelle la fonction submitform
BTN_ORDER.addEventListener('click', (e) => submitForm(e));

// Calcul du nombre total d'article dans le panier
function totalItemsInCart() {
    let itemQuantity = 0;
    const TOTAL_ITEMS_IN_CART = document.getElementById("totalQuantity");
    const TOTAL_QUANTITY = cart.reduce((total, item) => total + item.quantity, itemQuantity);
    TOTAL_ITEMS_IN_CART.textContent = TOTAL_QUANTITY;   
}; 

// Récupérer les données des canapés
function getArticle() {
    fetch('http://localhost:3000/api/products')
    .then(response => response.json())
    .then(product => {
        product.forEach(item => products.push(item));
        totalCartPrice();
        displayArticleEltForEachItemInCart();
    })
    .catch(error => console.log(error));
}; 
getArticle(); 

// Calcul le prix total du panier 
function totalCartPrice() {
    let total = 0
    const TOTAL_PRICE = document.getElementById("totalPrice");
    cart.forEach((item) => {
        products.forEach((product) => {
            if (item.id === product._id) { 
                const ITEM_PRICE = product.price * item.quantity
                item.price = product.price
                total += ITEM_PRICE   
             } 
        })
    })
    TOTAL_PRICE.innerText = Number(total)
};

// Mise à jour du prix total et de la quantité total lors de l'evènement
function updateQuantityAndPrice(id, updateQuantity, item) {
    const ITEM_TO_UPDATE = cart.find(item => item.id === id);
    if (updateQuantity > 100) {
        ITEM_TO_UPDATE.quantity = 100
    } else {
        ITEM_TO_UPDATE.quantity = Number(updateQuantity);
    }
    item.quantity = ITEM_TO_UPDATE.quantity;
    const NEW_ITEM_TO_SAVE = JSON.stringify(item);
    const ORDER_KEY = `${item.id}-${item.color}`;
    localStorage.setItem(ORDER_KEY, NEW_ITEM_TO_SAVE);
    totalItemsInCart();
    totalCartPrice();
    };

// Supprimer l' "article" de l'élément supprimer dans le DOM
function removeArticleFromDom(item) {
    const ITEM_ARTICLE_TO_DELETE = document.querySelector(
        `article[data-id="${item.id}"][data-color="${item.color}"]`);
        console.log("Deleting article", ITEM_ARTICLE_TO_DELETE);
        ITEM_ARTICLE_TO_DELETE.remove();
        alert("Votre produit a bien été supprimé du panier !");
        };

// Supprimer un article du localstorage
function removeItemFromLocalStorage(item) {
    const ORDER_KEY = `${item.id}-${item.color}`;
    localStorage.removeItem(ORDER_KEY);
    };    

// Supprimer un élément du panier => cart[]
function removeItemFromCart(item) {
    const ITEM_TO_DELETE = cart.find((product) => product.id === item.id && product.color === item.color)
    //Utilisation de la méthode ".splice", elle modifie le contenu d'un tableau en retirant et/ou ajoutant de nouveaux éléments
    const ITEM_TO_DELETE_FROM_CART = cart.splice(ITEM_TO_DELETE, 1)
    totalCartPrice();
    totalItemsInCart();
    removeItemFromLocalStorage(item);
    removeArticleFromDom(item);
    };

// Afficher les éléments de chaques article dans le panier (titre / prix / couleur)
function makeDivDescriptionElt(item) {
    const DIV_ELT = document.createElement("div");
    DIV_ELT.classList.add("cart__item__content__description");
  
    const TITLE_ELT = document.createElement("h2");
    TITLE_ELT.innerText = item.name;
    const COLOR_ELT = document.createElement("p");
    COLOR_ELT.innerText = item.color;
    const PRICE_ELT = document.createElement("p");
    PRICE_ELT.innerText = item.price + " €";
  
    DIV_ELT.appendChild(TITLE_ELT);
    DIV_ELT.appendChild(COLOR_ELT);
    DIV_ELT.appendChild(PRICE_ELT);
    return DIV_ELT
    };

// Créer l'article dans le DOM
function makeArticleElt(item) {
    const ARTICLE_ELT = document.createElement("article");
    ARTICLE_ELT.classList.add("cart__item");
    ARTICLE_ELT.dataset.id = item.id;
    ARTICLE_ELT.dataset.color = item.color;
    return ARTICLE_ELT
    };

// Créer la div class"cart__item__img" dans le DOM
function makeDivImgElt(item) {
    const DIV_ELT = document.createElement("div");
    DIV_ELT.classList.add("cart__item__img");
    const IMG_ELT = document.createElement("img");
    IMG_ELT.src = item.imageUrl;
    IMG_ELT.alt = item.altTxt;
    DIV_ELT.appendChild(IMG_ELT);
    return DIV_ELT
    };

// Afficher les éléments de chaques article dans le panier (bouton supprimer)
function makeDivDeleteElt(DIV_SETTINGS_ELT, item) {
    const DIV_DELETE_ELT = document.createElement("div");
    DIV_DELETE_ELT.classList.add("cart__item__content__settings__delete");
  
    const DELETE_ITEM_ELT = document.createElement("p");
    DELETE_ITEM_ELT.classList.add("deleteItem");
    DELETE_ITEM_ELT.innerText = "Supprimer";
    DELETE_ITEM_ELT.addEventListener('click', () => removeItemFromCart(item));
    
    DIV_DELETE_ELT.appendChild(DELETE_ITEM_ELT);
    DIV_SETTINGS_ELT.appendChild(DIV_DELETE_ELT);
    };

// Afficher les éléments de chaques article dans le panier (quantité)  
function makeDivQuantityElt(DIV_SETTINGS_ELT, item) {
    const DELETE_ITEM_ELT = document.createElement("div");
    DELETE_ITEM_ELT.classList.add("cart__item__content__settings__quantity");
  
    const QUANTITY_ELT = document.createElement("p");
    QUANTITY_ELT.innerText = "Qté : ";
  
    const INPUT_QUANTITY_ELT = document.createElement("input");
    INPUT_QUANTITY_ELT.classList.add("itemQuantity");
    INPUT_QUANTITY_ELT.type = "number";
    INPUT_QUANTITY_ELT.name = "itemQuantity";
    INPUT_QUANTITY_ELT.min = 1;
    INPUT_QUANTITY_ELT.max = 100;
    INPUT_QUANTITY_ELT.value = Number(item.quantity);

    INPUT_QUANTITY_ELT.onkeyup = e => {
    if (parseFloat(INPUT_QUANTITY_ELT.value) < INPUT_QUANTITY_ELT.min) {
        INPUT_QUANTITY_ELT.value = INPUT_QUANTITY_ELT.min;
    } else if (parseFloat(INPUT_QUANTITY_ELT.value) > INPUT_QUANTITY_ELT.max) {
        INPUT_QUANTITY_ELT.value = INPUT_QUANTITY_ELT.max;
    } else {
        INPUT_QUANTITY_ELT.value = parseFloat(INPUT_QUANTITY_ELT.value);
    }};

    INPUT_QUANTITY_ELT.addEventListener('input', () => updateQuantityAndPrice(item.id, INPUT_QUANTITY_ELT.value, item));

    DELETE_ITEM_ELT.appendChild(QUANTITY_ELT);
    DELETE_ITEM_ELT.appendChild(INPUT_QUANTITY_ELT);
    DIV_SETTINGS_ELT.appendChild(DELETE_ITEM_ELT);
    };

// Afficher les éléments de chaques article dans le panier    
  function makeDivSettingsElt(item) {
    const DIV_SETTINGS_ELT = document.createElement("div");
    DIV_SETTINGS_ELT.classList.add("cart__item__content__settings");

    makeDivQuantityElt(DIV_SETTINGS_ELT, item);
    makeDivDeleteElt(DIV_SETTINGS_ELT, item);
    return DIV_SETTINGS_ELT
};

// Afficher les éléments de chaques article dans le panier
function makeDivContentElt(item) {
    const DIV_CONTENT_ELT = document.createElement("div");
    DIV_CONTENT_ELT.classList.add("cart__item__content");
    const DIV_DESCRIPTION_ELT = makeDivDescriptionElt(item);
    const DIV_SETTINGS_ELT = makeDivSettingsElt(item);
  
    DIV_CONTENT_ELT.appendChild(DIV_DESCRIPTION_ELT );
    DIV_CONTENT_ELT.appendChild(DIV_SETTINGS_ELT);
    return DIV_CONTENT_ELT
    };

// Afficher les éléments de chaques article dans le panier
function displayArticleElt(item) {
    totalItemsInCart();
    const ARTICLE_ELT = makeArticleElt(item);
    SECTION_CART.appendChild(ARTICLE_ELT);
  
    const DIV_IMAGE_ELT = makeDivImgElt(item);
    ARTICLE_ELT.appendChild(DIV_IMAGE_ELT);
  
    const DIV_CONTENT_ELT = makeDivContentElt(item); 
    ARTICLE_ELT.appendChild(DIV_CONTENT_ELT);
    };

// Méthode .forEach pour permettre d'exécuter displayArticleElt sur chaque élément du tableau
function displayArticleEltForEachItemInCart() {
    cart.forEach((item) => displayArticleElt(item));
    };
