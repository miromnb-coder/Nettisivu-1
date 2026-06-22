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

const fullMenuItems = [
  ...menuItems,
  {
    name: "Lumi Americano",
    description: "Tummapaahtoinen kahvi ja pehmeä jälkimaku",
    price: "3,80 €"
  },
  {
    name: "Lohileipä",
    description: "Ruisleipä, lämminsavulohi, tilli ja sitruuna",
    price: "9,90 €"
  },
  {
    name: "Päivän keitto",
    description: "Vaihtuva keitto ja talon leipä",
    price: "10,50 €"
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
  },
  {
    text: "Rauhallinen paikka tehdä töitä ja nauttia hyvästä kahvista.",
    author: "Elias R."
  },
  {
    text: "Kaunis miljöö, ystävällinen palvelu ja täydellinen kanelipulla.",
    author: "Laura M."
  }
];

const menuGrid = document.querySelector("#menuGrid");
const reviewsGrid = document.querySelector("#reviewsGrid");
const reviewDots = document.querySelector("#reviewDots");
const navToggle = document.querySelector(".nav-toggle");
const siteHeader = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".main-nav a, .mobile-menu a, .header-cta");
let activeModal = null;

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

function updateReviewDots(activeIndex) {
  if (!reviewDots) return;

  [...reviewDots.querySelectorAll("button")].forEach((button, index) => {
    button.classList.toggle("active", index === activeIndex);
  });
}

function setupReviewCarousel() {
  if (!reviewDots || !reviewsGrid) return;

  reviewDots.addEventListener("click", (event) => {
    if (!event.target.matches("button")) return;

    const buttons = [...reviewDots.querySelectorAll("button")];
    const index = buttons.indexOf(event.target);
    const card = reviewsGrid.querySelectorAll(".review-card")[index];

    updateReviewDots(index);
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  });

  let scrollTimer;
  reviewsGrid.addEventListener("scroll", () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      const cards = [...reviewsGrid.querySelectorAll(".review-card")];
      const left = reviewsGrid.scrollLeft;
      const closestIndex = cards.reduce((bestIndex, card, index) => {
        const bestDistance = Math.abs(cards[bestIndex].offsetLeft - left);
        const currentDistance = Math.abs(card.offsetLeft - left);
        return currentDistance < bestDistance ? index : bestIndex;
      }, 0);
      updateReviewDots(closestIndex);
    }, 80);
  });
}

function createModal(id, title, contentHtml) {
  const modal = document.createElement("section");
  modal.className = "modal";
  modal.id = id;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", `${id}-title`);
  modal.innerHTML = `
    <div class="modal-backdrop" data-close-modal></div>
    <div class="modal-panel" tabindex="-1">
      <button class="modal-close" type="button" aria-label="Sulje" data-close-modal>×</button>
      <h2 id="${id}-title">${title}</h2>
      ${contentHtml}
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

function openModal(modal) {
  if (!modal) return;
  activeModal = modal;
  modal.classList.add("is-open");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-panel")?.focus();
}

function closeModal() {
  if (!activeModal) return;
  activeModal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  activeModal = null;
}

function setupModals() {
  const bookingModal = createModal(
    "bookingModal",
    "Varaa pöytä",
    `
      <p class="modal-intro">Tämä on demo-lomake. Oikealla asiakkaalla lomake voidaan yhdistää sähköpostiin tai varausjärjestelmään.</p>
      <form class="booking-form">
        <label>Nimi <input required name="name" autocomplete="name" placeholder="Etunimi Sukunimi" /></label>
        <label>Sähköposti <input required type="email" name="email" autocomplete="email" placeholder="nimi@email.fi" /></label>
        <div class="form-row">
          <label>Päivä <input required type="date" name="date" /></label>
          <label>Aika <input required type="time" name="time" /></label>
        </div>
        <label>Henkilömäärä <select name="people"><option>1 henkilö</option><option>2 henkilöä</option><option>3 henkilöä</option><option>4 henkilöä</option><option>5+ henkilöä</option></select></label>
        <label>Lisätiedot <textarea name="message" rows="3" placeholder="Esimerkiksi allergiat tai toive pöydästä"></textarea></label>
        <button class="btn btn-primary" type="submit">Lähetä varauspyyntö</button>
        <p class="form-status" aria-live="polite"></p>
      </form>
    `
  );

  const menuModal = createModal(
    "menuModal",
    "Koko menu",
    `
      <div class="modal-menu-list">
        ${fullMenuItems.map((item) => `
          <div class="modal-menu-item">
            <div><strong>${item.name}</strong><span>${item.description}</span></div>
            <b>${item.price}</b>
          </div>
        `).join("")}
      </div>
      <button class="btn btn-primary open-booking-from-menu" type="button">Varaa pöytä</button>
    `
  );

  const storyModal = createModal(
    "storyModal",
    "Tarinamme",
    `
      <p>Kahvila Lumi yhdistää pohjoisen rauhan, käsityönä tehdyt leivonnaiset ja laadukkaat raaka-aineet. Haluamme, että jokainen vierailu tuntuu pieneltä hengähdyshetkeltä kiireen keskellä.</p>
      <p>Kaikki tärkeimmät tiedot löytyvät sivulta: menu, aukioloajat, yhteystiedot ja varauspyyntö.</p>
    `
  );

  document.querySelectorAll(".header-cta, .hero-actions .btn-secondary").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      closeMobileNavigation();
      openModal(bookingModal);
    });
  });

  document.querySelector(".text-link")?.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(menuModal);
  });

  document.querySelector(".story-button")?.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(storyModal);
  });

  document.querySelector(".open-booking-from-menu")?.addEventListener("click", () => {
    closeModal();
    window.setTimeout(() => openModal(bookingModal), 150);
  });

  document.body.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-modal]")) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileNavigation();
      closeModal();
    }
  });

  bookingModal.querySelector(".booking-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = bookingModal.querySelector(".form-status");
    status.textContent = "Kiitos! Varauspyyntö on vastaanotettu demossa.";
    event.currentTarget.reset();
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
setupReviewCarousel();
setupModals();
setCurrentYear();
setupRevealAnimations();
