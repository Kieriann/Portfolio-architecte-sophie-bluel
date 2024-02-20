/*Définition de la fonction initialiserCategories*/
function initialiserCategories(data) {
    const categoriesSet = new Set();
    data.forEach(travail => {
        categoriesSet.add(travail.category.name);
    });

    const categories = Array.from(categoriesSet);
    const menuCategorie = document.getElementById('menu-categorie');
    const portfolio = document.getElementById('portfolio');

    const boutonTous = creerBoutonCategorie('Tous');
    boutonTous.addEventListener('click', () => {
        mettreAJourPortfolio(data);
        mettreAJourStyleBouton('Tous');
    });
    menuCategorie.appendChild(boutonTous);

    categories.forEach(categorie => {
        const boutonCategorie = creerBoutonCategorie(categorie);
        boutonCategorie.addEventListener('click', () => {
            const travauxFiltres = data.filter(travail => travail.category.name === categorie);
            mettreAJourPortfolio(travauxFiltres);
            mettreAJourStyleBouton(categorie);
        });
        menuCategorie.appendChild(boutonCategorie);
    });
}

function creerBoutonCategorie(categorie) {
    const boutonCategorie = document.createElement('button');
    boutonCategorie.textContent = categorie;
    boutonCategorie.classList.add('stylebouton');
    return boutonCategorie;
}

function mettreAJourStyleBouton(categorieSelectionnee) {
    const boutonsCategories = document.querySelectorAll('.stylebouton');
    boutonsCategories.forEach(bouton => {
        bouton.classList.remove('bouton-selectionne');
        if (bouton.textContent === categorieSelectionnee) {
            bouton.classList.add('bouton-selectionne');
        }
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