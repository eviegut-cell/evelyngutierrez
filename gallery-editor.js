const photoGrid = document.querySelector("#photoGrid");
const reorderToggle = document.querySelector("#reorderToggle");
const orderLayoutControls = document.querySelector("#orderLayoutControls");
const copyPhotoOrder = document.querySelector("#copyPhotoOrder");
const reorderStatus = document.querySelector("#reorderStatus");
const photoOrderOutput = document.querySelector("#photoOrderOutput");
const photoOrders = window.galleryPhotoOrders;
const orderLayoutButtons = [...document.querySelectorAll(".order-layout-button")];

let draggedPhoto = null;
let reorderEnabled = false;
let pointerStart = null;
let movedPhoto = false;
let activeLayout = window.matchMedia("(max-width: 600px)").matches ? "mobile" : "desktop";

function getPhotoPaths() {
  return [...photoGrid.querySelectorAll(".photo-card")].map((image) => image.getAttribute("src"));
}

function getPhotoListCode(layout) {
  const paths = photoOrders[layout].map((path) => `          "${path}"`);
  return `        const ${layout}Photos = [\n${paths.join(",\n")}\n        ];`;
}

function updateLayoutButtons() {
  orderLayoutButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.layout === activeLayout));
  });
}

function setActiveLayout(layout) {
  activeLayout = layout;
  window.renderGalleryPhotos(photoOrders[layout]);
  photoGrid.classList.toggle("is-reordering", reorderEnabled);
  photoGrid.querySelectorAll(".photo-card").forEach((image) => {
    image.draggable = false;
  });
  updateLayoutButtons();
}

reorderToggle.addEventListener("click", () => {
  reorderEnabled = !reorderEnabled;
  photoGrid.classList.toggle("is-reordering", reorderEnabled);
  reorderToggle.setAttribute("aria-pressed", String(reorderEnabled));
  reorderToggle.textContent = reorderEnabled ? "Done reordering" : "Reorder photos";
  copyPhotoOrder.hidden = !reorderEnabled;
  orderLayoutControls.hidden = !reorderEnabled;
  photoOrderOutput.hidden = true;
  photoGrid.querySelectorAll(".photo-card").forEach((image) => {
    image.draggable = false;
  });
  reorderStatus.textContent = reorderEnabled
    ? `Drag to arrange the ${activeLayout} order. Select the other layout to arrange it too.`
    : "";

  if (!reorderEnabled) {
    const layout = window.matchMedia("(max-width: 600px)").matches ? "mobile" : "desktop";
    setActiveLayout(layout);
  }
});

orderLayoutButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveLayout(button.dataset.layout);
    reorderStatus.textContent = `Drag to arrange the ${activeLayout} order.`;
  });
});

photoGrid.addEventListener("pointerdown", (event) => {
  const photo = event.target.closest(".photo-card");
  if (!reorderEnabled || !photo || event.button !== 0) return;

  draggedPhoto = photo;
  pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
  movedPhoto = false;
  photo.setPointerCapture(event.pointerId);
});

photoGrid.addEventListener("pointermove", (event) => {
  if (!draggedPhoto || !pointerStart || event.pointerId !== pointerStart.id) return;

  if (!movedPhoto) {
    const distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
    if (distance < 5) return;
    movedPhoto = true;
    draggedPhoto.classList.add("is-dragging");
  }

  event.preventDefault();
  const targetPhoto = document.elementFromPoint(event.clientX, event.clientY)?.closest(".photo-card");
  if (!targetPhoto || targetPhoto === draggedPhoto) return;

  const bounds = targetPhoto.getBoundingClientRect();
  const isLandscape = bounds.width > bounds.height;
  const pointerIsAfter = isLandscape
    ? event.clientX > bounds.left + bounds.width / 2
    : event.clientY > bounds.top + bounds.height / 2;

  photoGrid.insertBefore(draggedPhoto, pointerIsAfter ? targetPhoto.nextSibling : targetPhoto);
});

function finishPhotoDrag(event) {
  if (!draggedPhoto || !pointerStart || event.pointerId !== pointerStart.id) return;

  if (movedPhoto) {
    photoOrders[activeLayout] = getPhotoPaths();
    const photos = photoOrders[activeLayout];
    const position = photos.indexOf(draggedPhoto.getAttribute("src")) + 1;
    reorderStatus.textContent = `Moved ${draggedPhoto.getAttribute("src").split("/").pop()} to position ${position} of ${photos.length} in the ${activeLayout} order.`;
  }
  draggedPhoto.classList.remove("is-dragging");
  draggedPhoto = null;
  pointerStart = null;
  movedPhoto = false;
}

photoGrid.addEventListener("pointerup", finishPhotoDrag);
photoGrid.addEventListener("pointercancel", finishPhotoDrag);

copyPhotoOrder.addEventListener("click", async () => {
  const code = `${getPhotoListCode("mobile")}\n\n${getPhotoListCode("desktop")}\n\n        const photos = window.matchMedia("(max-width: 600px)").matches ? mobilePhotos : desktopPhotos;`;

  try {
    await navigator.clipboard.writeText(code);
    photoOrderOutput.hidden = true;
    reorderStatus.textContent = "Both photo orders copied. Replace the mobilePhotos and desktopPhotos arrays in gallery.html with the copied lists.";
  } catch (error) {
    photoOrderOutput.value = code;
    photoOrderOutput.hidden = false;
    photoOrderOutput.focus();
    photoOrderOutput.select();
    reorderStatus.textContent = "Clipboard access isn't available here. Both updated lists are selected below; press Ctrl+C to copy them.";
  }
});
