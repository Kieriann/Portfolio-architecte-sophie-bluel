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
