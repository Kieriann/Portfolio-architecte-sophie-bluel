/*appel API avec fetch*/
fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => console.error('Erreur lors de la récupération des travaux:', error));

  /*suppression travaux statiques sur le HTML*/
  const galerie = document.getElementById('galerie');
galerie.innerHTML = '';

/*ajout dynamique travaux récupérés*/
data.forEach(travail => {
    const elementTravail = document.createElement('div');
    elementTravail.innerHTML = `
      <div>
        <img src="${travail.imageUrl}" alt="${travail.title}">
        <h3>${travail.title}</h3>
        <p>${travail.category.name}</p>
      </div>
    `;
    galerie.appendChild(elementTravail);
  });