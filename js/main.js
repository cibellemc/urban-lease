document.addEventListener("DOMContentLoaded", function () {
  initHeroCarousel();
  initCarouselScrollBy("destaques-carousel");
  initCarouselScrollBy("depoimentos-carousel");
  initMobileMenu();
  initTabs();
  addWhatsAppFloat();
});

// Hero Carousel (mantém com translateX e indicadores)
function initHeroCarousel() {
  const carousel = document.getElementById("hero-carousel");
  if (!carousel) return;

  const container = carousel.querySelector(".carousel-container");
  const slides = carousel.querySelectorAll(".carousel-slide");
  const prevBtn = carousel.querySelector(".carousel-prev");
  const nextBtn = carousel.querySelector(".carousel-next");
  const indicators = carousel.querySelectorAll(".carousel-indicators button");

  let currentIndex = 0;
  const slideCount = slides.length;

  function showSlide(index) {
    if (index < 0) index = slideCount - 1;
    if (index >= slideCount) index = 0;

    currentIndex = index;
    const offset = -currentIndex * 100;
    container.style.transform = `translateX(${offset}%)`;

    indicators.forEach((indicator, i) => {
      indicator.classList.toggle("active", i === currentIndex);
      indicator.style.opacity = i === currentIndex ? "1" : "0.5";
    });
  }

  prevBtn.addEventListener("click", () => showSlide(currentIndex - 1));
  nextBtn.addEventListener("click", () => showSlide(currentIndex + 1));
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => showSlide(index));
  });

  let interval = setInterval(() => showSlide(currentIndex + 1), 5000);
  carousel.addEventListener("mouseenter", () => clearInterval(interval));
  carousel.addEventListener("mouseleave", () => {
    interval = setInterval(() => showSlide(currentIndex + 1), 5000);
  });

  showSlide(0);
}

// Generic Carousel using scrollBy
function initCarouselScrollBy(carouselId) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const container = carousel.querySelector(".carousel-container");
  const prevBtn = carousel.querySelector(".carousel-prev");
  const nextBtn = carousel.querySelector(".carousel-next");

  if (!container || !prevBtn || !nextBtn) return;

  const slide = container.querySelector(".carousel-slide");
  const gap = parseInt(getComputedStyle(container).gap) || 0;

  prevBtn.addEventListener("click", () => {
    container.scrollBy({
      left: -(slide.offsetWidth + gap),
      behavior: "smooth",
    });
  });

  nextBtn.addEventListener("click", () => {
    container.scrollBy({
      left: slide.offsetWidth + gap,
      behavior: "smooth",
    });
  });
}

// Mobile Menu
function initMobileMenu() {
  const menuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.createElement("div");
  mobileMenu.className =
    "mobile-menu fixed inset-0 bg-white z-50 transform translate-x-full transition-transform duration-300 ease-in-out";
  mobileMenu.innerHTML = `
        <div class="flex justify-between items-center p-4 border-b">
            <div class="logo">
                <img src="images/logo.png" alt="Urban Lease" class="h-8">
            </div>
            <button id="close-menu-button" class="text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <nav class="p-4">
            <ul class="space-y-4">
                <li><a href="#" class="block py-2 text-lg text-gray-700 hover:text-brown">Comprar</a></li>
                <li><a href="#" class="block py-2 text-lg text-gray-700 hover:text-brown">Alugar</a></li>
                <li><a href="#" class="block py-2 text-lg text-gray-700 hover:text-brown">Destaques</a></li>
                <li><a href="#" class="block py-2 text-lg text-gray-700 hover:text-brown">Saiba mais</a></li>
            </ul>
        </nav>
    `;

  document.body.appendChild(mobileMenu);

  const closeButton = mobileMenu.querySelector("#close-menu-button");

  menuButton.addEventListener("click", () => {
    mobileMenu.classList.remove("translate-x-full");
    document.body.style.overflow = "hidden";
  });

  closeButton.addEventListener("click", () => {
    mobileMenu.classList.add("translate-x-full");
    document.body.style.overflow = "";
  });
}

// Tabs
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => {
        btn.classList.remove("bg-brown", "text-white");
        btn.classList.add("bg-white", "text-gray-700");
      });

      button.classList.add("bg-brown", "text-white");

      tabContents.forEach((content) => content.classList.add("hidden"));
      tabContents[index].classList.remove("hidden");
    });
  });
}

// WhatsApp Floating Button
function addWhatsAppFloat() {
  const whatsappFloat = document.createElement("a");
  whatsappFloat.href = "https://wa.me/5511999999999";
  whatsappFloat.className = "whatsapp-float";
  whatsappFloat.innerHTML = `
        <div class="bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
        </div>
    `;

  document.body.appendChild(whatsappFloat);
}
