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
        img.id = `work-${travail.id}`; 
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
            data = responseData; 

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

            initialiserCategories(data);

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



function addImageInDOM(travail) {
    const gallerydiv = document.getElementsByClassName("gallery")[0]; 
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = travail.imageUrl;
    img.alt = travail.title;
    img.id = `work-${travail.id}`; // Identifie le travail avec un id unique

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = travail.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallerydiv.appendChild(figure);
}

document.addEventListener('DOMContentLoaded', () => {
    
    const editModeBanner = document.getElementById('editModeBanner');
    const loginLogoutLink = document.getElementById('loginLogoutLink');
    const editLinkContainer = document.getElementById('editLinkContainer');

    if (localStorage.getItem('token')) {
        // L'utilisateur est connecté
        editModeBanner.style.display = 'flex'; // Affiche le bandeau de mode édition
        loginLogoutLink.textContent = 'logout';
        loginLogoutLink.href = '#';
        loginLogoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('token'); // Supprime le token lors de la déconnexion
            window.location.href = 'index.html'; // Redirige vers la page principale
        });
        editLinkContainer.style.display = 'block'; 
    } else {
        // L'utilisateur n'est pas connecté
        editModeBanner.style.display = 'none'; // Cache le bandeau de mode édition
        loginLogoutLink.textContent = 'login';
        loginLogoutLink.href = 'connexion.html'; 
        editLinkContainer.style.display = 'none'; 
    }
});



