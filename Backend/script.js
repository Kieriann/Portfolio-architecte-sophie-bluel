let data;

// Fonction pour mettre à jour le portfolio
function mettreAJourPortfolio(travaux) {
    const portfolio = document.getElementById('portfolio');
    portfolio.classList.add("gallery");

    portfolio.innerHTML = '';
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


/*Appel API avec fetch*/
fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(responseData => {

        data = responseData;

        /*Suppression travaux statiques sur le HTML*/
        const portfolio = document.getElementById('portfolio');
        portfolio.innerHTML = '';

        /*Ajout dynamique travaux récupérés*/

        const gallerydiv = document.createElement('div');
        gallerydiv.classList.add("gallery");
        data.forEach(travail => {
            const figure = document.createElement('figure');
            figure.innerHTML = `
                <img src="${travail.imageUrl}" alt="${travail.title}">
                <figcaption>${travail.title}</figcaption>
            `;
            gallerydiv.appendChild(figure);
        });
        portfolio.appendChild(gallerydiv);

        /*Appel de la fonction initialiserCategories avec les données*/
        initialiserCategories(data);

        // Appel de la fonction initializeMiniGallery après avoir chargé les travaux
        initializeMiniGallery();
        document.getElementById('fileInputModal2').addEventListener('change', function() {
            updateImageUploadContainer(this);
        });
    })
    .catch(error => console.error('Erreur lors de la récupération des travaux:', error));

    document.addEventListener('DOMContentLoaded', () => {
        if (localStorage.getItem("loggedIn")) {
            document.getElementById('editModeBanner').style.display = 'flex';
            localStorage.removeItem("loggedIn"); // Enlever l'indicateur après l'affichage
        }
    });
    
    document.addEventListener('DOMContentLoaded', () => {
        const loginLogoutLink = document.getElementById('loginLogoutLink');
    
        if (localStorage.getItem('token')) {
            loginLogoutLink.textContent = 'logout';
            loginLogoutLink.href = '#'; // Changez ceci si vous avez une URL spécifique pour le logout
            loginLogoutLink.addEventListener('click', (event) => {
                event.preventDefault();
                localStorage.removeItem('token');
                window.location.href = 'index.html'; // Redirige vers la page d'accueil après déconnexion
            });
        }
    });

 // Vérifiez si l'utilisateur est connecté et affichez/masquez le conteneur "editLinkContainer"
document.addEventListener('DOMContentLoaded', () => {
    const editLinkContainer = document.getElementById('editLinkContainer'); // Récupère le conteneur

    if (!localStorage.getItem('token')) {
        // Si l'utilisateur n'est pas connecté, masquez le conteneur "editLinkContainer"
        if (editLinkContainer) {
            editLinkContainer.style.display = 'none';
        }
    } else {
        // Si l'utilisateur est connecté, affichez le conteneur "editLinkContainer"
        if (editLinkContainer) {
            editLinkContainer.style.display = 'block';
        }
    }
});


    