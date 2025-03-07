document.addEventListener("DOMContentLoaded", async () => {
  const BASE_URL = "https://pixabay.com/api/";
  const API_KEY = "40601528-eb3806a59487c1013e43987dd";
  const query = "Україна";
  const page = 1;
  const perPage = 10;
  const autoSlideInterval = 3000;

  const slider = document.querySelector(".slider");
  const prevBtn = document.querySelector(".prev_slide");
  const nextBtn = document.querySelector(".next_slide");
  const dotsContainer = document.querySelector(".dots");

  let images = [];
  let currentIndex = 0;
  let slideTimer;

  async function fetchImages(query, page, perPage) {
    const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
      query
    )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data.hits;
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  }

  function renderSlider() {
    slider.innerHTML = "";
    dotsContainer.innerHTML = "";

    images.forEach((img, index) => {
      const slide = document.createElement("div");
      slide.classList.add("slide");
      if (index === currentIndex) slide.classList.add("active");

      const imgElement = document.createElement("img");
      imgElement.src = img.webformatURL;
      imgElement.alt = img.tags;
      imgElement.loading = "lazy";

      slide.appendChild(imgElement);
      slider.appendChild(slide);

      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (index === currentIndex) dot.classList.add("active");
      dot.addEventListener("click", () => {
        stopAutoSlide();
        showSlide(index);
      });

      dotsContainer.appendChild(dot);
    });
  }

  function showSlide(index) {
    currentIndex = index;
    renderSlider();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    renderSlider();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    renderSlider();
  }

  function startAutoSlide() {
    slideTimer = setInterval(() => {
      nextSlide();
    }, autoSlideInterval);
  }

  function stopAutoSlide() {
    clearInterval(slideTimer);
  }

  prevBtn.addEventListener("click", () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });

  nextBtn.addEventListener("click", () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });

  images = await fetchImages(query, page, perPage);
  if (images.length > 0) {
    renderSlider();
    startAutoSlide();
  }
});
