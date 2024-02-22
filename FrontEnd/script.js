
// Initialisation d'une variable globale pour stocker les données des travaux
let data;

// Fonction pour mettre à jour le portfolio avec de nouveaux travaux.
function mettreAJourPortfolio(travaux) {
    const portfolio = document.getElementById('portfolio');
    // Ajoute la classe "gallery" pour appliquer le style de la galerie
    portfolio.classList.add("gallery");

    // Supprime tous les éléments enfants actuels pour nettoyer l'affichage
    while (portfolio.firstChild) {
        portfolio.removeChild(portfolio.firstChild);
    }

    // Crée et ajoute les nouveaux éléments pour chaque travail
    travaux.forEach(travail => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = travail.imageUrl;
        img.alt = travail.title;
        figcaption.textContent = travail.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        portfolio.appendChild(figure);
    });
}

// Fonction principale pour récupérer et afficher les travaux depuis une API.
(function fetchWorksAndDisplay() {
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(responseData => {
            data = responseData; // Stocke les données récupérées

            // Nettoie le contenu actuel de la galerie
            const portfolio = document.getElementById('portfolio');
            while (portfolio.firstChild) {
                portfolio.removeChild(portfolio.firstChild);
            }

            // Crée une nouvelle div "gallery" et ajoute les travaux récupérés
            const gallerydiv = document.createElement('div');
            gallerydiv.classList.add("gallery");
            portfolio.appendChild(gallerydiv);
            data.forEach(travail => addImageInDOM(travail));
            

            document.getElementById('fileInputModal2').addEventListener('change', function() {
                let imageUploadContainer = document.getElementById('image-upload-container');

                while (imageUploadContainer.firstChild) {
                    imageUploadContainer.removeChild(imageUploadContainer.firstChild);
                }
                if (fileInput.files && fileInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const image = new Image();
                        image.src = e.target.result;
                        imageUploadContainer.appendChild(image);
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                }
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des travaux:', error));
})();

function addImageInDOM (travail){
        const gallerydiv = document.getElementsByClassName("gallery")   
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = travail.imageUrl;
        img.alt = travail.title;
        img.id = travail.id; 
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = travail.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallerydiv[0].appendChild(figure);
}




// Gestion de l'affichage conditionnel en fonction de l'état de connexion de l'utilisateur
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem("loggedIn")) {
        document.getElementById('editModeBanner').style.display = 'flex';
        localStorage.removeItem("loggedIn"); 
    }

    const loginLogoutLink = document.getElementById('loginLogoutLink');
    if (localStorage.getItem('token')) {
        loginLogoutLink.textContent = 'logout';
        loginLogoutLink.href = '#';
        loginLogoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    } else {
        const editLinkContainer = document.getElementById('editLinkContainer');
        editLinkContainer.style.display = localStorage.getItem('token') ? 'block' : 'none';
    }
});

