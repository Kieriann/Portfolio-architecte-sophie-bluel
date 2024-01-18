let data;

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
    gallerydiv.classList.add("gallery")
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
  })
  .catch(error => console.error('Erreur lors de la récupération des travaux:', error));
