let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];
let previouslyFocusedElement = null;
let miniGalleryInitialized = false;

function openModal(e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"));
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusedElement = document.querySelector(":focus");
    modal.style.display = null;
    focusables[0].focus();
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);

    if (!miniGalleryInitialized) {
        initializeMiniGallery();
        miniGalleryInitialized = true;
    }
}


function initializeMiniGallery() {
    const mainGallery = document.getElementById('portfolio');
    const miniGallery = document.getElementById('miniGallery');

    if (!miniGalleryInitialized) {
        const miniatures = mainGallery.querySelectorAll('img');

        miniatures.forEach(image => {
            const miniatureContainer = document.createElement('div');
            miniatureContainer.classList.add('miniature-container');

            const clonedImage = image.cloneNode(true);
            miniatureContainer.appendChild(clonedImage);

            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
            deleteIcon.addEventListener("click", function(){
                deleteImageFromGallery(miniatureContainer);
               });
            miniatureContainer.appendChild(deleteIcon);
            miniGallery.appendChild(miniatureContainer);
        });

        miniGalleryInitialized = true;
    }    
}

function openFileInput() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
}
const addPicButton = document.getElementById('addpic');
addPicButton.addEventListener('click', openFileInput);

function deleteImageFromGallery(miniatureContainer) {
    const imageGallery = document.getElementById('miniGallery');
    const index = Array.from(imageGallery.children).indexOf(miniatureContainer);
    console.log
    if (index !== -1) {
        
        imageGallery.removeChild(miniatureContainer);
    }
}
function closeModal(e) {
    if (modal === null) return;
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
    e.preventDefault();
    window.setTimeout(function () {
        modal = null;
    }, 500);
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);

    modal = null;
}

function stopPropagation(e) {
    e.stopPropagation();
}

function focusInModal(e) {
    e.preventDefault();
    let index = focusables.findIndex(f => f === modal.querySelector(":focus"));
    if (e.shiftKey === true) {
        index--;
    } else {
        index++;
    }
    if (index >= focusables.length) {
        index = 0;
    }
    if (index < 0) {
        index = focusables.length - 1;
    }
    focusables[index].focus();
}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal);
});

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }

    if (e.key === "Tab" && modal !== null) {
        focusInModal(e);
    }
});

function handleFileSelection(input) {
    const file = input.files[0];

    if (file) {
        const imgElement = document.createElement('img');
     
        // Créez un conteneur pour l'image (facultatif, selon votre structure)
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('miniature-container');

        // Ajoutez l'image au conteneur
        imageContainer.appendChild(imgElement);

        // Ajoutez le conteneur à la mini-galerie
        const miniGallery = document.getElementById('miniGallery');
        miniGallery.appendChild(imageContainer);

        // Chargez le contenu de l'image depuis le fichier sélectionné
        const reader = new FileReader();
        reader.onload = function (e) {
            imgElement.src = e.target.result;

            // Ajoutez l'image au portfolio (ajout de code supplémentaire ici si nécessaire)
            const portfolio = document.getElementById('portfolio');
            const portfolioImage = imgElement.cloneNode(true);
            portfolio.appendChild(portfolioImage);
        };
        reader.readAsDataURL(file);
    }
}

// Ajoutez cet événement pour gérer la sélection de fichier à partir de l'input file
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', function() {
    handleFileSelection(this);
});


