let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];
let previouslyFocusedElement = null;
let miniGalleryInitialized = false;
let fileInputOpened = false;

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

function initializeMiniGallery() {
    const mainGallery = document.getElementById('portfolio');
    const miniGallery = document.getElementById('miniGallery');

    if (!window.miniGalleryInitialized) {
        const miniatures = mainGallery.querySelectorAll('img');

        miniatures.forEach(image => {
            const workId = image.getAttribute("id");

            const miniatureContainer = document.createElement('div');
            miniatureContainer.classList.add('miniature-container');

            const clonedImage = image.cloneNode(true);
            miniatureContainer.appendChild(clonedImage);

            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
            deleteIcon.addEventListener("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                deleteImageFromGallery(workId);
            });

            miniatureContainer.appendChild(deleteIcon);
            miniGallery.appendChild(miniatureContainer);
        });

        window.miniGalleryInitialized = true;
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
}

async function deleteImageFromGallery(workId) {
    const numericId = workId.replace('work-', '');

    console.log(`Début de la suppression pour l'ID numérique : ${numericId}`); // Log pour début de fonction avec l'ID numérique

    try {
        const response = await fetch(`http://localhost:5678/api/works/${numericId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        console.log(`Statut de la réponse : ${response.status}`); // Log pour vérifier le statut de la réponse

        if (response.status === 204) {
            console.log("Suppression réussie, pas de contenu dans la réponse."); // Confirmation de suppression réussie

            // Supprime la miniature dans modal1
            document.querySelectorAll(`#work-${numericId}`).forEach(element => {
                const container = element.closest('.miniature-container');
                if (container) {
                    container.remove(); // Supprime la miniature
                    console.log(`Miniature work-${numericId} supprimée du modal`); // Log pour confirmation de suppression dans le modal
                }
            });

            // Supprime l'élément correspondant dans la galerie portfolio
            const galleryElement = document.getElementById(`work-${numericId}`);
            if (galleryElement) {
                galleryElement.closest('figure').remove(); // Supprime l'élément de la galerie
                console.log(`Élément work-${numericId} supprimé de la galerie`); // Log pour confirmation de suppression dans la galerie
            }
        } else {
            // Gérer les autres réponses
            console.error(`Erreur lors de la suppression: statut réponse ${response.status}`);
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de l'image:", error);
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

function closeModal2AndOpenModal1() {
    // Ferme modal2
    closeModal({preventDefault: () => {}}, document.getElementById('modal2'));

    // Réinitialise la variable globale 'modal' à modal1 et prépare son affichage
    modal = document.getElementById('modal1');
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");

    // Réattache les gestionnaires d'événements nécessaires à modal1
    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);

    // Met à jour les éléments focusables et met le focus sur le premier élément focusable
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    if (focusables.length > 0) {
        focusables[0].focus();
    }
}


document.querySelector(".js-modal-return").addEventListener("click", closeModal2AndOpenModal1);

function reopenModal1() {
    modal = document.getElementById('modal1'); // Réinitialiser la variable globale 'modal' à modal1
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
    
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

window.addEventListener("keydown", function(e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e);
    }
});

// Met à jour le conteneur d'upload d'image avec l'image sélectionnée.
function updateImageUploadContainer(fileInput) {
    const imageUploadContainer = document.getElementById('image-upload-container');
    
    // Efface l'aperçu existant
    while (imageUploadContainer.firstChild) {
        imageUploadContainer.removeChild(imageUploadContainer.firstChild);
    }

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const image = new Image();
            image.src = e.target.result;
            imageUploadContainer.appendChild(image);
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

// Initialisation après le chargement du DOM pour les champs de formulaire et boutons.
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
    validateButton.addEventListener('click', function(e) {
        e.preventDefault(); // Empêche le rechargement de la page pour un formulaire
        const file = fileInputModal2.files[0]; // Prend le premier fichier sélectionné
        if (file) { // Vérifie si un fichier est sélectionné
            addImageToPortfolio(file); // Appelle la fonction pour ajouter l'image
        }
    });
});

// Fonction pour réinitialiser et recréer les éléments dans le modal
function clearModal2Content() {
    // Réinitialise l'aperçu de l'image
    const imageUploadContainer = document.getElementById('image-upload-container');
    while (imageUploadContainer.firstChild) {
        imageUploadContainer.removeChild(imageUploadContainer.firstChild);
    }

    // Réinitialise les champs de formulaire
    document.getElementById('imageTitle').value = '';
    document.getElementById('categorylist').selectedIndex = 0;

    // Recrée le label pour fileInputModal2
    const labelForFileInput = document.createElement('label');
    labelForFileInput.setAttribute('for', 'fileInputModal2');
    labelForFileInput.className = 'image-upload-label';
    labelForFileInput.innerHTML = '<i class="fa-solid fa-image"></i>';
    imageUploadContainer.appendChild(labelForFileInput);

    // Recrée et ajoute le bouton 'addImageBtn'
    const addImageBtn = document.createElement('button');
    addImageBtn.textContent = '+ Ajouter photo';
    addImageBtn.classList.add('addpicgris'); 
    addImageBtn.id = 'addImageBtn';
    imageUploadContainer.appendChild(addImageBtn);

    // Ajoute de nouveau le fileInputModal2 pour éviter les problèmes de référence nulle
    const newFileInputModal2 = document.createElement('input');
    newFileInputModal2.type = 'file';
    newFileInputModal2.id = 'fileInputModal2';
    newFileInputModal2.style.display = 'none'; 
    document.body.appendChild(newFileInputModal2); 

    // Réinitialise le statut d'ouverture de fileInput pour permettre de nouvelles interactions
    fileInputOpened = false;

    // Réinitialise et attache les événements nécessaires
    initializeAddImageButton();
}

function addImageInDOM(travail) {
    const gallerydiv = document.getElementsByClassName("gallery")[0];
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = travail.imageUrl;
    img.alt = travail.title;
    img.setAttribute('data-id', travail.id); 
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = travail.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallerydiv.appendChild(figure);
}

function addImageInMiniGallery(imageDetails) {
    const miniGallery = document.getElementById('miniGallery');
    const miniatureContainer = document.createElement('div');
    miniatureContainer.classList.add('miniature-container');

    const img = document.createElement('img');
    img.src = imageDetails.imageUrl;
    img.alt = imageDetails.title;
    img.setAttribute('data-id', imageDetails.id); 
    miniatureContainer.appendChild(img);
}

// Ajoute une image au portfolio.
async function addImageToPortfolio(file) {
    const imageTitleValue = document.getElementById('imageTitle').value.trim();
    const categoryValue = document.getElementById('categorylist').value;
    
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", imageTitleValue);
    formData.append("category", categoryValue);

    try {
        const response = await fetch(`http://localhost:5678/api/works`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });

        if (response.ok) {
            const imageDetails = await response.json();
             addImageInDOM(imageDetails); 
             document.querySelectorAll('.gallery img').forEach(img => {
                img.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                
                    const travail = data.find(travail => travail.id == id);
                    if (travail) {
                        // Logique pour afficher les détails du travail dans la modale
                        console.log(travail); 
                    }
                });
            });
            updateMiniGallery(imageDetails);
            clearModal2Content(); 
        } else {
            console.error("Erreur lors de l'ajout de l'image: réponse non OK du serveur");
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'image:", error);
    }
}

function updateMiniGallery(imageDetails) {
    const miniGallery = document.getElementById('miniGallery');
    const miniatureContainer = document.createElement('div');
    miniatureContainer.classList.add('miniature-container');
    const img = document.createElement('img');
    img.src = imageDetails.imageUrl; 
    img.setAttribute('id', imageDetails.id); 

    miniatureContainer.appendChild(img);

    miniGallery.appendChild(miniatureContainer);
}


// Fonction pour initialiser le bouton d'ajout d'image et l'input de fichier
function initializeAddImageButton() {
    const fileInputModal2 = document.getElementById('fileInputModal2');
    const addImageBtn = document.getElementById('addImageBtn');

    if (addImageBtn) {
        addImageBtn.addEventListener('click', function () {
            if (!fileInputOpened) {
                fileInputOpened = true;
                setTimeout(() => {
                    fileInputModal2.click();
                }, 0);
            }
        });
    }
    if (fileInputModal2) {
        fileInputModal2.addEventListener('change', function() {
            updateImageUploadContainer(fileInputModal2);
            fileInputOpened = false;
        });
    }
}

window.addEventListener('DOMContentLoaded', initializeAddImageButton);