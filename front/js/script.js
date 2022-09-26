function getArticle () {
    // Methode fetch pour récuperer les données des canapés
    fetch('http://localhost:3000/api/products')
    .then(response => {
        if(response.ok) {
            return response.json()
        }
    })
    // Fonction pour afficher les données reçues dynamiquement dans la page d'accueil
    .then(function (productArticle) {
        const nbArticle = productArticle.length
        for(let x = 0; x < nbArticle; x += 1) {
            const items = document.getElementById('items') 
            items.innerHTML +=
            `<a href="./product.html?id=${productArticle[x]._id}">
                <article>
                    <img src="${productArticle[x].imageUrl}" alt=${productArticle[x].altTxt}>
                    <h3 class="productName">${productArticle[x].name}</h3>
                    <p class="productDescription">${productArticle[x].description}</p>
                </article>
            </a>`
        }
    })
    .catch(error => console.log("Une erreur est survenue"))
    
}
getArticle();
