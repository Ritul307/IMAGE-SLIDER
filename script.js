const imageList = document.querySelector(".image-list");
const prevBtn = document.getElementById("prev-slide");
const nextBtn = document.getElementById("next-slide");
const scrollbar = document.querySelector(".slider-scrollbar");
const scrollbarThumb = document.querySelector(".scrollbar-thumb");

// Calculate max scroll width
let maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;

// Scroll by one image width (including gap)
const getStep = () => {
  const img = document.querySelector(".image-item");
  const gap = parseInt(getComputedStyle(imageList).gap || "0", 10);
  return img ? img.clientWidth + gap : 300;
};

// Scroll functions
nextBtn.addEventListener("click", () => {
  imageList.scrollBy({ left: getStep(), behavior: "smooth" });
});
prevBtn.addEventListener("click", () => {
  imageList.scrollBy({ left: -getStep(), behavior: "smooth" });
});

// Show/hide prev/next buttons
const handleSlideButtons = () => {
  prevBtn.style.display = imageList.scrollLeft <= 0 ? "none" : "block";
  nextBtn.style.display = imageList.scrollLeft >= maxScrollLeft ? "none" : "block";
};

// Update scrollbar thumb position
const updateScrollThumbPosition = () => {
  const scrollRatio = imageList.scrollLeft / maxScrollLeft;
  const thumbMax = scrollbar.clientWidth - scrollbarThumb.offsetWidth;
  scrollbarThumb.style.left = `${scrollRatio * thumbMax}px`;
};

// Dragging scrollbar thumb
scrollbarThumb.addEventListener("mousedown", (e) => {
  const startX = e.clientX;
  const startLeft = scrollbarThumb.offsetLeft;

  const onMouseMove = (e) => {
    const deltaX = e.clientX - startX;
    const newLeft = Math.min(
      Math.max(0, startLeft + deltaX),
      scrollbar.clientWidth - scrollbarThumb.offsetWidth
    );
    scrollbarThumb.style.left = `${newLeft}px`;

    const scrollRatio = newLeft / (scrollbar.clientWidth - scrollbarThumb.offsetWidth);
    imageList.scrollLeft = scrollRatio * maxScrollLeft;
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
});

// Update thumb size on resize
const updateThumbSize = () => {
  const visibleRatio = imageList.clientWidth / imageList.scrollWidth;
  scrollbarThumb.style.width = `${visibleRatio * scrollbar.clientWidth}px`;
  maxScrollLeft = imageList.scrollWidth - imageList.clientWidth; // recalc
};

// Attach scroll listener
imageList.addEventListener("scroll", () => {
  handleSlideButtons();
  updateScrollThumbPosition();
});

// Init
updateThumbSize();
handleSlideButtons();
window.addEventListener("resize", updateThumbSize);
