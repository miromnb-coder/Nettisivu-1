function loadPixelSpecStyles() {
  const existing = document.querySelector('link[href="pixel-spec.css"]');
  if (existing) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "pixel-spec.css";
  document.head.appendChild(link);
}

loadPixelSpecStyles();

const menuItems = [
  {
    name: "Lumi Latte",
    description: "Pehmeä latte, kauramaidolla",
    price: "4,80 €",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=86"
  },
  {
    name: "Lumi Brunch",
    description: "Avokado, kananmuna, leipä & salaatti",
    price: "14,50 €",
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=600&q=86"
  },
  {
    name: "Kanelipulla",
    description: "Perinteinen voipulla kardemummalla",
    price: "3,60 €",
    image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=600&q=86"
  },
  {
    name: "Sienipasta",
    description: "Kermaista pastaa ja paahdettuja sieniä",
    price: "13,90 €",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=86"
  },
  {
    name: "Mustikkajuustokakku",
    description: "Vaniljainen juustokakku marjoilla",
    price: "6,50 €",
    image: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=600&q=86"
  }
];

const reviews = [
  {
    text: "Upea tunnelma ja herkullinen ruoka. Täällä viihtyy aina!",
    author: "Annika L."
  },
  {
    text: "Parasta brunssia Helsingissä. Kaikki on aina tuoretta ja kauniisti esille laitettua.",
    author: "Mikael T."
  },
  {
    text: "Ihana henkilökunta ja lämmin, rauhallinen paikka. Vahva suositus!",
    author: "Sanna K."
  }
];

const menuGrid = document.querySelector("#menuGrid");
const reviewsGrid = document.querySelector("#reviewsGrid");
const reviewDots = document.querySelector("#reviewDots");
const navToggle = document.querySelector(".nav-toggle");
const siteHeader = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".main-nav a, .mobile-menu a, .header-cta");

function renderMenu() {
  if (!menuGrid) return;

  menuGrid.innerHTML = menuItems
    .map((item) => `
      <article class="menu-card reveal">
        <div class="menu-image" style="background-image: url('${item.image}')" aria-hidden="true"></div>
        <div class="menu-card-body">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
        </div>
        <span class="price">${item.price}</span>
      </article>
    `)
    .join("");
}

function renderReviews(activeIndex = 0) {
  if (!reviewsGrid || !reviewDots) return;

  reviewsGrid.innerHTML = reviews
    .map((review) => `
      <article class="review-card">
        <div>
          <span class="quote" aria-hidden="true">“</span>
          <p>${review.text}</p>
        </div>
        <div>
          <div class="stars" aria-label="Viisi tähteä">★★★★★</div>
          <strong>– ${review.author}</strong>
        </div>
      </article>
    `)
    .join("");

  reviewDots.innerHTML = reviews
    .map((_, index) => `
      <button class="${index === activeIndex ? "active" : ""}" type="button" aria-label="Näytä arvio ${index + 1}"></button>
    `)
    .join("");
}

function closeMobileNavigation() {
  siteHeader?.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
}

function setupMobileNavigation() {
  if (!navToggle || !siteHeader) return;

  navToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileNavigation);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileNavigation();
  });
}

function setupActiveNavigation() {
  const sections = ["top", "menu", "tarina", "galleria", "yhteys"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        document.querySelectorAll(".main-nav a").forEach((link) => {
          const href = link.getAttribute("href")?.replace("#", "");
          link.classList.toggle("active", href === entry.target.id);
        });
      });
    },
    { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupReviewDots() {
  if (!reviewDots || !reviewsGrid) return;

  reviewDots.addEventListener("click", (event) => {
    if (!event.target.matches("button")) return;

    const buttons = [...reviewDots.querySelectorAll("button")];
    const index = buttons.indexOf(event.target);

    buttons.forEach((button) => button.classList.remove("active"));
    event.target.classList.add("active");

    const cards = reviewsGrid.querySelectorAll(".review-card");
    cards[index]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  });
}

function setCurrentYear() {
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
}

renderMenu();
renderReviews();
setupMobileNavigation();
setupActiveNavigation();
setupReviewDots();
setCurrentYear();
setupRevealAnimations();
