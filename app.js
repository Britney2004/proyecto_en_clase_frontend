/* ===== Datos (en un proyecto real vendrían de una API) ===== */
const categories = [
  { id: "mujer", name: "Mujer", icon: "👗" },
  { id: "hombre", name: "Hombre", icon: "👕" },
  { id: "ninos", name: "Niños", icon: "🧸" },
  { id: "accesorios", name: "Accesorios", icon: "👜" },
  { id: "todo", name: "Ver todo", icon: "🛍️" },
];

const products = [
  { id: 1, name: "Vestido floral manga corta", cat: "mujer", price: 59900, old: 99900, icon: "👗", flash: true },
  { id: 2, name: "Jean tiro alto", cat: "mujer", price: 79900, old: 129900, icon: "👖", flash: true },
  { id: 3, name: "Camiseta básica oversize", cat: "hombre", price: 34900, old: 54900, icon: "👕", flash: true },
  { id: 4, name: "Chaqueta bomber", cat: "hombre", price: 119900, old: 189900, icon: "🧥", flash: true },
  { id: 5, name: "Conjunto deportivo infantil", cat: "ninos", price: 44900, icon: "🎽" },
  { id: 6, name: "Tenis blancos urbanos", cat: "accesorios", price: 99900, old: 149900, icon: "👟" },
  { id: 7, name: "Bolso de mano beige", cat: "accesorios", price: 49900, icon: "👜" },
  { id: 8, name: "Blusa de lino", cat: "mujer", price: 42900, icon: "👚" },
  { id: 9, name: "Gorra clásica", cat: "accesorios", price: 24900, old: 34900, icon: "🧢" },
  { id: 10, name: "Pijama infantil estampada", cat: "ninos", price: 38900, icon: "🌙" },
];

/* ===== Estado ===== */
let cart = 0;
let activeCategory = "todo";
let searchTerm = "";

/* ===== Referencias al DOM ===== */
const $ = (id) => document.getElementById(id);
const grid = $("productGrid");
const flashGrid = $("flashProducts");

/* ===== Utilidades ===== */
const money = (n) => "$" + n.toLocaleString("es-CO");

function showToast(text) {
  const t = $("toast");
  t.textContent = text;
  t.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => t.classList.remove("is-visible"), 1800);
}

/* ===== Renderizado ===== */
function productCard(p) {
  const discount = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
  return `
    <article class="product">
      <div class="product__img">${p.icon}</div>
      ${discount ? `<span class="product__badge">-${discount}%</span>` : ""}
      <h3 class="product__name">${p.name}</h3>
      <div class="product__prices">
        <span class="product__price">${money(p.price)}</span>
        ${p.old ? `<span class="product__old">${money(p.old)}</span>` : ""}
      </div>
      <button class="product__add" data-id="${p.id}">Agregar al carrito</button>
    </article>`;
}

function renderCategories() {
  $("categories").innerHTML = categories.map((c) => `
    <button class="category" data-cat="${c.id}">
      <div class="category__circle">${c.icon}</div>${c.name}
    </button>`).join("");
}

function renderProducts() {
  const list = products.filter((p) =>
    (activeCategory === "todo" || p.cat === activeCategory) &&
    p.name.toLowerCase().includes(searchTerm)
  );
  grid.innerHTML = list.map(productCard).join("");
  $("emptyMsg").hidden = list.length > 0;
}

function renderFlash() {
  flashGrid.innerHTML = products.filter((p) => p.flash).map(productCard).join("");
}

function setCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll(".nav__link").forEach((b) =>
    b.classList.toggle("is-active", b.dataset.cat === cat && !b.classList.contains("nav__link--sale")));
  renderProducts();
  $("productos").scrollIntoView({ behavior: "smooth" });
}

/* ===== Contador de oferta flash (reinicia a 3 h al terminar) ===== */
function startCountdown(seconds) {
  let left = seconds;
  const el = $("countdown");
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    el.textContent = `${pad(Math.floor(left / 3600))}:${pad(Math.floor(left % 3600 / 60))}:${pad(left % 60)}`;
    left = left > 0 ? left - 1 : seconds;
  };
  tick();
  setInterval(tick, 1000);
}

/* ===== Eventos ===== */
document.addEventListener("click", (e) => {
  const add = e.target.closest(".product__add");
  if (add) {
    cart++;
    $("cartCount").textContent = cart;
    showToast("Producto agregado al carrito");
    return;
  }
  const catBtn = e.target.closest("[data-cat]");
  if (catBtn) setCategory(catBtn.dataset.cat);
});

$("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  searchTerm = $("searchInput").value.trim().toLowerCase();
  renderProducts();
  $("productos").scrollIntoView({ behavior: "smooth" });
});

$("cartBtn").addEventListener("click", () =>
  showToast(cart ? `Tienes ${cart} producto(s) en el carrito` : "Tu carrito está vacío"));

$("newsletter").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  showToast("¡Gracias por suscribirte!");
});

/* ===== Inicio ===== */
renderCategories();
renderFlash();
renderProducts();
startCountdown(3 * 60 * 60);
