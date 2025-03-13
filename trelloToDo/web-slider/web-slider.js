document.addEventListener("DOMContentLoaded", async () => {
  const BASE_URL = "https://pixabay.com/api/";
  const API_KEY = "40601528-eb3806a59487c1013e43987dd";
  let query = "Dog";
  const page = 1;
  const perPage = 10;
  const autoSlideInterval = 3000;

  const slider = document.querySelector(".slider");
  const prevBtn = document.querySelector(".prev_slide");
  const nextBtn = document.querySelector(".next_slide");
  const dotsContainer = document.querySelector(".dots");
  const searchInput = document.querySelector(".search_input");
  const searchButton = document.querySelector(".search_button");

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

  function showToast(message) {
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 2500);
  }

  function renderSlider() {
    if (!slider || !dotsContainer) return;
    document.querySelectorAll(".slide").forEach((slide, index) => {
      slide.classList.toggle("active", index === currentIndex);
    });
    document.querySelectorAll(".dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  function createSlider() {
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
    slider.style.display = "flex";
    nextBtn.style.display = "flex";
    prevBtn.style.display = "flex";
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

  searchButton.addEventListener("click", async () => {
    query = searchInput.value.trim();
    if (query) {
      images = await fetchImages(query, page, perPage);
      stopAutoSlide();
      if (images.length > 0) {
        currentIndex = 0;
        createSlider();
        startAutoSlide();
        searchInput.value = "";
        showToast("Насолоджуйтесь зображеннями:)");
      } else {
        dotsContainer.innerHTML = "";
        slider.style.display = "none";
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
        showToast("Зображень не знайдено. Спробуйте інший запит.");
      }
    }
  });

  images = await fetchImages(query, page, perPage);
  if (images.length > 0) {
    createSlider();
    startAutoSlide();
  }
});
