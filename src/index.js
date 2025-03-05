require("./styles.scss");

var Flickity = require("flickity");
require("flickity-imagesloaded");

var $carousels = new Array();

// Modals

var rootEl = document.documentElement;
var $modals = getAll(".modal");
var $modalTriggers = getAll(".modal-trigger");
var $modalCloses = getAll(".modal-card-head .delete, .modal-card-foot .button");

if ($modalTriggers.length > 0) {
  $modalTriggers.forEach(function ($el) {
    $el.addEventListener("click", function () {
      var target = $el.dataset.target;
      openModal(target);
    });
  });
}

if ($modalCloses.length > 0) {
  $modalCloses.forEach(function ($el) {
    $el.addEventListener("click", function () {
      closeModals();
    });
  });
}

function openModal(target) {
  var $target = document.getElementById(target);
  if (!$target) return; // Ensure target exists

  rootEl.classList.add("is-clipped");
  $target.classList.add("is-active");

  // Push a new history state only if it's not already in the history stack
  if (!history.state || history.state.modal !== target) {
    history.pushState({ modal: target }, "", "#" + target);
  }

  var carouselId = target + "-carousel";
  if (document.querySelector("#" + carouselId)) {
    if ($carousels.findIndex((c) => c.element.id == carouselId) === -1) {
      $carousels.push(initCarousel(carouselId));
    }
  }
}

function closeModals() {
  rootEl.classList.remove("is-clipped");
  $modals.forEach(($el) => {
    $el.classList.remove("is-active");
  });

  // Remove the modal state from history when closed
  if (history.state && history.state.modal) {
    history.replaceState(null, "", window.location.pathname);
  }
}

// Functions

function initCarousel(id) {
  return new Flickity("#" + id, {
    imagesLoaded: true,
    cellAlign: "right",
    adaptiveHeight: true, // https://github.com/metafizzy/flickity/issues/11
    lazyLoad: 2,
  });
}

function getAll(selector) {
  return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
}

document.addEventListener("DOMContentLoaded", function () {
  var popup = document.createElement("div");
  popup.id = "image-popup";
  popup.classList.add("image-popup");
  popup.innerHTML = `
    <span class="close-popup">&times;</span>
    <img class="popup-content" id="popup-img">
  `;
  document.body.appendChild(popup);

  var popupImg = document.getElementById("popup-img");
  var closePopup = document.querySelector(".close-popup");

  if (popup && (!popupImg || !popupImg.src)) {
    popup.style.display = "none"; // Hide if no image is loaded
  }

  // Select all images inside any modal
  document.querySelectorAll(".modal img").forEach((img) => {
    img.addEventListener("click", function () {
      popup.style.display = "flex";
      popupImg.src = this.src;
    });
  });

  // Close when clicking the 'X' button
  closePopup.addEventListener("click", function () {
    popup.style.display = "none";
  });

  // Close when clicking outside the image
  popup.addEventListener("click", function (e) {
    if (e.target !== popupImg) {
      popup.style.display = "none";
    }
  });

  // Close on Escape key press
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && popup.style.display === "flex") {
      popup.style.display = "none";
    }
  });

  window.addEventListener("popstate", function (event) {
    closeModals();
  });
});
