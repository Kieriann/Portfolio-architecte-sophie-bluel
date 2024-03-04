/*Définition de la fonction initialiserCategories*/
function initialiserCategories(data) {
    const categoriesSet = new Set();
    data.forEach(travail => {
        categoriesSet.add(travail.category.name);
    });

    const categories = Array.from(categoriesSet);
    const menuCategorie = document.getElementById('menu-categorie');
      menuCategorie.innerHTML = ''; // Nettoie les boutons précédents

    const boutonTous = document.createElement('button');
    boutonTous.textContent = 'Tous';
    boutonTous.classList.add('stylebouton');
    boutonTous.addEventListener('click', () => {
        mettreAJourPortfolio(data);
        mettreAJourStyleBouton('Tous');
    });
    menuCategorie.appendChild(boutonTous);

    categories.forEach(categorie => {
        const boutonCategorie = document.createElement('button');
        boutonCategorie.textContent = categorie;
        boutonCategorie.classList.add('stylebouton');
        boutonCategorie.addEventListener('click', () => {
            const travauxFiltres = data.filter(travail => travail.category.name === categorie);
            mettreAJourPortfolio(travauxFiltres);
            mettreAJourStyleBouton(categorie);
        });
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

function mettreAJourStyleBouton(categorieSelectionnee) {
    const boutonsCategories = document.querySelectorAll('#menu-categorie .stylebouton'); 
        boutonsCategories.forEach(bouton => {
        if (bouton.textContent === categorieSelectionnee) {
            bouton.classList.add('bouton-selectionne'); 
        } else {
            bouton.classList.remove('bouton-selectionne'); 
        }
    });
}


