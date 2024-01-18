/*Définition de la fonction initialiserCategories*/
function initialiserCategories(data) {
    const categoriesSet = new Set();
    data.forEach(travail => {
        categoriesSet.add(travail.category.name);
    });

    /*Convertir l'ensemble en tableau*/
    const categories = Array.from(categoriesSet);

    /*Création du menu de catégories*/
    const menuCategorie = document.getElementById('menu-categorie');
    const portfolio = document.getElementById('portfolio');

    /*Ajout du bouton "tous"*/
    const boutonTous = document.createElement('button');
    boutonTous.textContent = 'Tous';
    boutonTous.classList.add('stylebouton');
    boutonTous.addEventListener('click', () => {
        mettreAJourPortfolio(data);
        
    });
    menuCategorie.appendChild(boutonTous);

    categories.forEach(categorie => {
        const boutonCategorie = document.createElement('button');
        boutonCategorie.textContent = categorie;
        boutonCategorie.classList.add('stylebouton');

        /*Ajout du gestionnaire d'événements pour le clic*/
        boutonCategorie.addEventListener('click', () => {
            /*Filtrer les travaux en fonction de la catégorie sélectionnée*/
            const travauxFiltres = data.filter(travail => travail.category.name === categorie);

            /*Mettre à jour le portfolio avec les travaux filtrés*/
            mettreAJourPortfolio(travauxFiltres);
        });

        /*Ajouter le bouton au menu*/
        menuCategorie.appendChild(boutonCategorie);
    });   
}


 /*Fonction pour mettre à jour le portfolio*/
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

function filtrerParCategorie(categorie) {
    const travauxFiltres = data.filter(travail => {
        if (categorie === 'Tous') {
            return true;
        } else {
            return travail.category.name === categorie;
        }
    });

    mettreAJourPortfolio(travauxFiltres);
}