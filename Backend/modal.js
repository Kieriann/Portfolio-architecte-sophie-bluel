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
    
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);

    const addPicButton = document.getElementById('addpic');
    addPicButton.addEventListener('click', function () {
        closeModal(e);
        openModal2(); 
    });
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

function openModal2() {
    const modal2 = document.getElementById('modal2');
    modal2.style.display = null;
    modal2.removeAttribute("aria-hidden");
    modal2.setAttribute("aria-modal", "true");
    modal2.addEventListener("click", closeModal);
    modal2.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
    modal2.querySelector(".js-modal-close").addEventListener("click", function(e) {
        closeModal(e, modal2);
    });

    modal2.addEventListener("click", function(e) {
        if (e.target === modal2) {
            closeModal(e, modal2);
        }
    });

    modal2.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
}

    document.getElementById('fileInputModal2').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            updateImageUploadContainer(this);
        } else {
            console.error("Aucun fichier sélectionné");
        }
    }); 


    function deleteImageFromGallery(miniatureContainer, portfolioFigure) {
        const imageGallery = document.getElementById('miniGallery');
        const portfolio = document.getElementById('portfolio');
    
        imageGallery.removeChild(miniatureContainer);
    
        if (portfolioFigure && portfolio.contains(portfolioFigure)) {
            portfolio.removeChild(portfolioFigure);
        } else {
            console.error("Élément non trouvé dans le portfolio ou undefined:", portfolioFigure);
        }
    }
    


function closeModal(e, modalElement = null) {
    const modalToClose = modalElement || modal;
    if (modalToClose === null) return;

    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
    e.preventDefault();
    modalToClose.style.display = "none";
    modalToClose.setAttribute("aria-hidden", "true");
    modalToClose.removeAttribute("aria-modal");
    modalToClose.removeEventListener("click", closeModal);
    modalToClose.querySelector(".js-modal-close").removeEventListener("click", closeModal);
    modalToClose.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);

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

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM entièrement chargé et analysé');

    const imageTitle = document.getElementById('imageTitle');
    const categoryList = document.getElementById('categorylist');
    const fileInputModal2 = document.getElementById('fileInputModal2');
    const validateButton = document.getElementById('validateButton');

    console.log(fileInputModal2); 

    fileInputModal2.addEventListener('change', function() {
        console.log("Événement change déclenché pour fileInputModal2");
        updateImageUploadContainer(this);
    });

    function checkInputs() {
        const title = imageTitle.value.trim();
        const category = categoryList.value;
        const fileSelected = fileInputModal2.files.length > 0;

        if (title && category && fileSelected) {
            validateButton.classList.add('validateButton-active');
            validateButton.classList.remove('validateButton');
        } else {
            validateButton.classList.remove('validateButton-active');
            validateButton.classList.add('validateButton');
        }
    }

    imageTitle.addEventListener('input', checkInputs);
    categoryList.addEventListener('change', checkInputs);
    fileInputModal2.addEventListener('change', checkInputs);

    checkInputs();
});

        
 function updateImageUploadContainer(fileInput) {
    console.log("Mise à jour du conteneur d'images");
    const imageUploadContainer = document.getElementById('image-upload-container');
    console.log(imageUploadContainer); 

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            console.log("Fichier chargé"); 
            const image = new Image();
            image.src = e.target.result;
            image.onload = function () {
                console.log("Image chargée dans le navigateur"); 
                imageUploadContainer.innerHTML = '';
                imageUploadContainer.appendChild(image);
                console.log("Image ajoutée au conteneur"); 
            };
            image.onerror = function () {
                console.error('Erreur lors du chargement de l\'image');
            };
        };

        reader.readAsDataURL(fileInput.files[0]);
        console.log("Début de la lecture du fichier");
    } else {
        console.log("Aucun fichier sélectionné");
    }
}

const addImageBtn = document.getElementById('addImageBtn');
const fileInputModal2 = document.getElementById('fileInputModal2'); 
let fileInputOpened = false; 

if (addImageBtn && fileInputModal2) {
    addImageBtn.addEventListener('click', function () {
        if (!fileInputOpened) {
            fileInputOpened = true;
            setTimeout(() => {
                fileInputModal2.click(); 
            }, 0);
        }
    });

    fileInputModal2.addEventListener('change', function() {
        console.log("Événement change déclenché pour fileInputModal2");
        updateImageUploadContainer(fileInputModal2);
        fileInputOpened = false; 
    });
}

function addImageToPortfolio(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageSrc = e.target.result;
        const imageTitle = document.getElementById('imageTitle').value;

        const figure = createPortfolioFigure(imageSrc, imageTitle);
        const portfolio = document.getElementById('portfolio');
        portfolio.appendChild(figure);

        const miniature = createMiniature(imageSrc, imageTitle, figure);
        const miniGallery = document.getElementById('miniGallery');
        miniGallery.appendChild(miniature);
    };
    reader.readAsDataURL(file);
}


function createPortfolioFigure(imageSrc, imageTitle) {
    const figure = document.createElement('figure');
    const imageElement = document.createElement('img');
    imageElement.src = imageSrc;
    imageElement.alt = imageTitle;
    figure.appendChild(imageElement);
    return figure;
}


document.addEventListener('DOMContentLoaded', (event) => {
    const fileInputModal2 = document.getElementById('fileInputModal2'); 
    const validateButton = document.getElementById('validateButton');

    validateButton.addEventListener('click', function(e) {
        if (fileInputModal2 && fileInputModal2.files.length > 0) {
            addImageToPortfolio(fileInputModal2.files[0]);
            closeModal(e, document.getElementById('modal2'));
        } else {
            console.error("Aucun fichier sélectionné.");
        }
    });
});


function createMiniature(imageSrc, imageTitle, portfolioFigure) {
    const miniatureContainer = document.createElement('div');
    miniatureContainer.classList.add('miniature-container');

    const clonedImage = document.createElement('img');
    clonedImage.src = imageSrc;
    clonedImage.alt = imageTitle;
    miniatureContainer.appendChild(clonedImage);

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
    deleteIcon.addEventListener("click", function() {
        deleteImageFromGallery(miniatureContainer, portfolioFigure);
    });
    miniatureContainer.appendChild(deleteIcon);

    return miniatureContainer;
}
