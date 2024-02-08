let data;

// Fonction pour mettre à jour le portfolio
function mettreAJourPortfolio(travaux) {
    const portfolio = document.getElementById('portfolio');
    portfolio.classList.add("gallery");

    while (portfolio.firstChild) {
        portfolio.removeChild(portfolio.firstChild);
    }   travaux.forEach(travail => {
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
        while (portfolio.firstChild) {
            portfolio.removeChild(portfolio.firstChild);
        }
        

        /*Ajout dynamique travaux récupérés*/

       // Ajout dynamique travaux récupérés
        const gallerydiv = document.createElement('div');
        gallerydiv.classList.add("gallery");
        data.forEach(travail => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = travail.imageUrl;
        img.alt = travail.title;
        img.id = travail.id; // Assurez-vous que l'ID est unique dans le document
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = travail.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallerydiv.appendChild(figure);
        });
        portfolio.appendChild(gallerydiv);

        initialiserCategories(data);

        initializeMiniGallery();
        document.getElementById('fileInputModal2').addEventListener('change', function() {
            updateImageUploadContainer(this);
        });
    })
    .catch(error => console.error('Erreur lors de la récupération des travaux:', error));

    document.addEventListener('DOMContentLoaded', () => {
        if (localStorage.getItem("loggedIn")) {
            document.getElementById('editModeBanner').style.display = 'flex';
            localStorage.removeItem("loggedIn"); 
        }
    });
    
    document.addEventListener('DOMContentLoaded', () => {
        const loginLogoutLink = document.getElementById('loginLogoutLink');
    
        if (localStorage.getItem('token')) {
            loginLogoutLink.textContent = 'logout';
            loginLogoutLink.href = '#';
            loginLogoutLink.addEventListener('click', (event) => {
                event.preventDefault();
                localStorage.removeItem('token');
                window.location.href = 'index.html'; 
            });
        }
    });

document.addEventListener('DOMContentLoaded', () => {
    const editLinkContainer = document.getElementById('editLinkContainer'); // Récupère le conteneur

    if (!localStorage.getItem('token')) {
        if (editLinkContainer) {
            editLinkContainer.style.display = 'none';
        }
    } else {
        if (editLinkContainer) {
            editLinkContainer.style.display = 'block';
        }
    }
});


    