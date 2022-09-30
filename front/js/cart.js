// Tableau du contenu du panier
const cart = [];

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
let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");
let texteRegExp = new RegExp("^[a-zA-Z ,.'-]+$");

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
