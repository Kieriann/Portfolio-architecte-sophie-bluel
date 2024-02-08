let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];
let previouslyFocusedElement = null;
let miniGalleryInitialized = false;


 //Ouvre un modal et initialise le focus sur le premier élément focusable.
 
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

    document.getElementById('addpic').addEventListener('click', function () {
        closeModal(e);
        openModal2(); 
    });
}


 //Initialise une mini galerie d'images.
 
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
            const workId = image.getAttribute("id")
            deleteIcon.addEventListener("click", function() {
                deleteImageFromGallery(workId);
            });
            miniatureContainer.appendChild(deleteIcon);
            miniGallery.appendChild(miniatureContainer);
        });

        miniGalleryInitialized = true;
    }    
}


 //Ouvre un second modal.
 
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
}


 //Supprime une image de la galerie.
 
async function deleteImageFromGallery(workId) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'image:", error);
    }
}


 // Ferme le modal actuellement ouvert.
 
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


 //Empêche la propagation de l'événement.
 
function stopPropagation(e) {
    e.stopPropagation();
}


  //Gère le focus à l'intérieur du modal lors de la navigation au clavier.
 
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
    const imageTitle = document.getElementById('imageTitle');
    const categoryList = document.getElementById('categorylist');
    const fileInputModal2 = document.getElementById('fileInputModal2');
    const validateButton = document.getElementById('validateButton');

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


 //Met à jour le conteneur d'upload d'image avec l'image sélectionnée.
 
function updateImageUploadContainer(fileInput) {
    const imageUploadContainer = document.getElementById('image-upload-container');

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const image = new Image();
            image.src = e.target.result;
            image.onload = function () {
                while (imageUploadContainer.firstChild) {
                    imageUploadContainer.removeChild(imageUploadContainer.firstChild);
                }
                imageUploadContainer.appendChild(image);
            };
        };

        reader.readAsDataURL(fileInput.files[0]);
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
        updateImageUploadContainer(fileInputModal2);
        fileInputOpened = false; 
    });
}


 // Ajoute une image au portfolio.
 
async function addImageToPortfolio(file) {
    const imageTitle = document.getElementById('imageTitle').value;
    const category = document.getElementById('categorylist').value;
    const formData = new FormData();

    formData.append("image", file);
    formData.append("title", imageTitle);
    formData.append("category", category);

    try {
        const response = await fetch(`http://localhost:5678/api/works`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'image:", error);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const fileInputModal2 = document.getElementById('fileInputModal2'); 
    const validateButton = document.getElementById('validateButton');

    validateButton.addEventListener('click', function(e) {
        if (fileInputModal2 && fileInputModal2.files.length > 0) {
            addImageToPortfolio(fileInputModal2.files[0]);
            closeModal(e, document.getElementById('modal2'));
        }
    });
});
