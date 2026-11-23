/* =========================================
   1. SELECT HTML ELEMENTS
========================================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");


// Lightbox elements will be created dynamically
let lightbox = null;
let lightboxImage = null;
let lightboxTitle = null;
let lightboxCategory = null;

let currentIndex = 0;
let visibleImages = [];

// Remember which card opened the lightbox so focus can return to it
let lastFocusedItem = null;

// Touch swipe tracking
let touchStartX = 0;


/* =========================================
   2. CATEGORY FILTER FUNCTIONALITY
========================================= */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Reset all buttons
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
            btn.setAttribute("aria-pressed", "false");
        });

        // Activate clicked button
        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");

        // Get selected category
        const selectedCategory = button.dataset.filter;

        // Filter gallery images
        galleryItems.forEach(item => {

            const itemCategory = item.dataset.category;

            if (
                selectedCategory === "all" ||
                selectedCategory === itemCategory
            ) {
                item.classList.remove("hidden");
            } else {
                item.classList.add("hidden");
            }

        });

        updateVisibleImages();

    });

});


/* =========================================
   3. CREATE LIGHTBOX
========================================= */

function createLightbox() {

    lightbox = document.createElement("div");

    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Image viewer");

    lightbox.innerHTML = `

        <button class="lightbox-close" aria-label="Close image">
            &times;
        </button>

        <button class="lightbox-prev" aria-label="Previous image">
            &#10094;
        </button>

        <div class="lightbox-content">

            <img class="lightbox-image" src="" alt="">

            <div class="lightbox-info">
                <h3 class="lightbox-title"></h3>
                <p class="lightbox-category"></p>
            </div>

        </div>

        <button class="lightbox-next" aria-label="Next image">
            &#10095;
        </button>

    `;

    document.body.appendChild(lightbox);


    // Select lightbox elements
    lightboxImage = lightbox.querySelector(".lightbox-image");
    lightboxTitle = lightbox.querySelector(".lightbox-title");
    lightboxCategory = lightbox.querySelector(".lightbox-category");


    // Buttons
    lightbox.querySelector(".lightbox-close")
        .addEventListener("click", closeLightbox);

    lightbox.querySelector(".lightbox-prev")
        .addEventListener("click", showPreviousImage);

    lightbox.querySelector(".lightbox-next")
        .addEventListener("click", showNextImage);


    // Close when clicking outside the image
    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });


    // Swipe left / right on touch screens
    lightbox.addEventListener("touchstart", event => {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener("touchend", event => {

        const distance = event.changedTouches[0].clientX - touchStartX;

        if (Math.abs(distance) < 50) return;

        if (distance < 0) {
            showNextImage();
        } else {
            showPreviousImage();
        }

    }, { passive: true });

}


/* =========================================
   4. GET VISIBLE IMAGES
========================================= */

function updateVisibleImages() {

    visibleImages = Array.from(galleryItems).filter(item => {

        return (
            !item.classList.contains("hidden") &&
            !item.classList.contains("broken")
        );

    });

}


/* =========================================
   5. OPEN LIGHTBOX
========================================= */

function openLightbox(index) {

    updateVisibleImages();

    currentIndex = visibleImages.indexOf(galleryItems[index]);

    if (currentIndex === -1) return;

    lastFocusedItem = galleryItems[index];

    if (!lightbox) {
        createLightbox();
    }

    displayImage();

    lightbox.classList.add("active");

    document.body.style.overflow = "hidden";

    // Move focus into the dialog
    lightbox.querySelector(".lightbox-close").focus();

}


/* =========================================
   6. DISPLAY SELECTED IMAGE
========================================= */

function displayImage() {

    const selectedItem = visibleImages[currentIndex];

    const image = selectedItem.querySelector("img");
    const title = selectedItem.querySelector("h3");
    const category = selectedItem.querySelector("p");


    // Use the high-res version when one is provided
    lightboxImage.src = image.dataset.full || image.src;
    lightboxImage.alt = image.alt;


    // Update information
    lightboxTitle.textContent = title.textContent;
    lightboxCategory.textContent = category.textContent;


    // Update navigation buttons
    const previousButton = lightbox.querySelector(".lightbox-prev");
    const nextButton = lightbox.querySelector(".lightbox-next");

    previousButton.disabled = visibleImages.length <= 1;
    nextButton.disabled = visibleImages.length <= 1;

}


/* =========================================
   7. NEXT IMAGE
========================================= */

function showNextImage() {

    if (visibleImages.length <= 1) return;

    currentIndex++;

    if (currentIndex >= visibleImages.length) {
        currentIndex = 0;
    }

    displayImage();

}


/* =========================================
   8. PREVIOUS IMAGE
========================================= */

function showPreviousImage() {

    if (visibleImages.length <= 1) return;

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = visibleImages.length - 1;
    }

    displayImage();

}


/* =========================================
   9. CLOSE LIGHTBOX
========================================= */

function closeLightbox() {

    if (!lightbox) return;

    lightbox.classList.remove("active");

    document.body.style.overflow = "";

    // Return focus to the card that opened the lightbox
    if (lastFocusedItem) {
        lastFocusedItem.focus();
    }

}


/* =========================================
   10. IMAGE CLICK AND KEYBOARD EVENTS
========================================= */

galleryItems.forEach((item, index) => {

    // Make cards reachable and usable with the keyboard
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute(
        "aria-label",
        `View ${item.querySelector("h3").textContent}`
    );

    item.addEventListener("click", () => {
        openLightbox(index);
    });

    item.addEventListener("keydown", event => {

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openLightbox(index);
        }

    });

});


/* =========================================
   11. KEYBOARD NAVIGATION (LIGHTBOX)
========================================= */

document.addEventListener("keydown", event => {

    if (!lightbox || !lightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowRight") {
        showNextImage();
    }

    if (event.key === "ArrowLeft") {
        showPreviousImage();
    }

    // Keep Tab focus inside the lightbox
    if (event.key === "Tab") {

        const focusable = Array.from(
            lightbox.querySelectorAll("button:not(:disabled)")
        );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }

    }

});


/* =========================================
   12. HANDLE BROKEN IMAGES
========================================= */

// If an image fails to load (wrong path, dead URL), hide its card
// so the grid does not show an empty box, and keep it out of the lightbox.

function markBroken(item) {
    item.classList.add("broken");
    updateVisibleImages();
}

galleryItems.forEach(item => {

    const img = item.querySelector("img");

    img.addEventListener("error", () => markBroken(item));

    // Catch images that already failed before this script ran
    if (img.complete && img.naturalWidth === 0 && img.src) {
        markBroken(item);
    }

});


/* =========================================
   13. INITIALIZE GALLERY
========================================= */

updateVisibleImages();

console.log("Hay Gallery initialized successfully!");