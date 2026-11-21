/* ============================================
   Divine Ragec Shop - JavaScript
   Gestion du panier, filtres, navigation mobile
   ============================================ */

// ========== DONNÉES PRODUITS ==========
// image : chemin vers l'image réelle (ex: "images/robe-wax.jpg")
// emoji : fallback affiché si pas d'image ou pendant le chargement
const products = [
  {
    id: 1,
    name: "Robe Wax Élégance",
    category: "robes",
    price: 28500,
    desc: "Robe longue en tissu wax authentique, motifs floraux. Confection artisanale.",
    emoji: "👗",
    image: null, // ex: "images/robe-wax.webp"
    badge: "Nouveau"
  },
  {
    id: 2,
    name: "Ensemble Pagne Traditionnel",
    category: "ensembles",
    price: 32000,
    desc: "Ensemble haut + jupe en pagne de qualité supérieure. Tailles S à XL.",
    emoji: "👘",
    image: null,
    badge: null
  },
  {
    id: 3,
    name: "Sac à Main Cuir Véritable",
    category: "accessoires",
    price: 45000,
    desc: "Sac en cuir véritable, design moderne et pratique. Fabriqué localement.",
    emoji: "👜",
    image: null,
    badge: "Populaire"
  },
  {
    id: 4,
    name: "Collier Perles Africaines",
    category: "bijoux",
    price: 12500,
    desc: "Collier artisanal en perles colorées. Pièce unique faite main.",
    emoji: "📿",
    image: null,
    badge: null
  },
  {
    id: 5,
    name: "Robe Cocktail Soirée",
    category: "robes",
    price: 52000,
    desc: "Robe de soirée élégante, coupe ajustée. Parfaite pour les grandes occasions.",
    emoji: "✨",
    image: null,
    badge: "Premium"
  },
  {
    id: 6,
    name: "Boucles d'oreilles Or",
    category: "bijoux",
    price: 18000,
    desc: "Boucles d'oreilles plaqué or, design contemporain africain.",
    emoji: "💎",
    image: null,
    badge: null
  },
  {
    id: 7,
    name: "Tunique Imprimée",
    category: "hauts",
    price: 19500,
    desc: "Tunique légère en coton imprimé, idéale pour le quotidien.",
    emoji: "👚",
    image: null,
    badge: null
  },
  {
    id: 8,
    name: "Pagne 6 Yards Premium",
    category: "pagnes",
    price: 22000,
    desc: "Pagne de 6 yards, motifs exclusifs. Qualité supérieure garantie.",
    emoji: "🧵",
    image: null,
    badge: "Best-seller"
  },
  {
    id: 9,
    name: "Sandales Cuir Femme",
    category: "chaussures",
    price: 27500,
    desc: "Sandales en cuir véritable, confortables et élégantes pour tous les jours.",
    emoji: "👡",
    image: null,
    badge: null
  },
  {
    id: 10,
    name: "Crème Visage Naturelle",
    category: "beaute",
    price: 8500,
    desc: "Crème hydratante à base de beurre de karité et huiles naturelles.",
    emoji: "🧴",
    image: null,
    badge: "Naturel"
  },
  {
    id: 11,
    name: "Jupe Midi Plissée",
    category: "jupes",
    price: 24000,
    desc: "Jupe midi plissée, tissu fluide. Disponible en plusieurs coloris.",
    emoji: "🧥",
    image: null,
    badge: null
  },
  {
    id: 12,
    name: "Foulard Soie Imprimé",
    category: "accessoires",
    price: 9500,
    desc: "Foulard en soie aux motifs africains. Accessoire polyvalent.",
    emoji: "🧣",
    image: null,
    badge: null
  }
];

// ========== PANIER ==========
let cart = JSON.parse(localStorage.getItem('divineRagecCart')) || [];

function saveCart() {
  localStorage.setItem('divineRagecCart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  showToast(`${product.name} ajouté au panier`);
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function formatPrice(price) {
  return new Intl.NumberFormat('fr-CG', {
    style: 'decimal',
    minimumFractionDigits: 0
  }).format(price) + ' FCFA';
}

// ========== UI PANIER ==========
function updateCartUI() {
  const countEl = document.querySelectorAll('.cart-count');
  countEl.forEach(el => {
    el.textContent = getCartCount();
    el.style.display = getCartCount() > 0 ? 'flex' : 'none';
  });

  const itemsContainer = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total-price');
  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty">
        <p style="font-size:2.5rem;margin-bottom:10px;">🛒</p>
        <p>Votre panier est vide</p>
        <p style="font-size:0.9rem;margin-top:8px;">Découvrez nos produits féminins</p>
      </div>`;
  } else {
    itemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img">
          ${item.image
            ? `<img src="${item.image}" alt="${item.name}" width="70" height="70" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`
            : item.emoji}
        </div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="price">${formatPrice(item.price)}</div>
          <div class="qty-controls">
            <button onclick="updateQty(${item.id}, -1)" aria-label="Diminuer">−</button>
            <span>${item.qty}</span>
            <button onclick="updateQty(${item.id}, 1)" aria-label="Augmenter">+</button>
            <button onclick="removeFromCart(${item.id})" style="margin-left:auto;color:#c62828;background:none;border:none;font-size:1.1rem;" aria-label="Supprimer">🗑</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  if (totalEl) {
    totalEl.textContent = formatPrice(getCartTotal());
  }
}

function openCart() {
  document.getElementById('cart-overlay')?.classList.add('open');
  document.getElementById('cart-sidebar')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-overlay')?.classList.remove('open');
  document.getElementById('cart-sidebar')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ========== TOAST ==========
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ========== RENDU PRODUITS (images optimisées) ==========
function renderProductImage(p) {
  // Si une vraie image est fournie → lazy loading + decoding async
  if (p.image) {
    return `
      <img
        src="${p.image}"
        alt="${p.name} – Divine Ragec Shop"
        width="400"
        height="400"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
        class="product-img"
        onload="this.classList.add('loaded')"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
      >
      <span class="emoji-fallback" style="display:none" aria-hidden="true">${p.emoji}</span>
    `;
  }
  // Sinon → emoji léger (aucun chargement réseau)
  return `<span class="emoji-fallback" aria-hidden="true">${p.emoji}</span>`;
}

function renderProducts(list, containerId = 'products-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#666;padding:40px;">Aucun produit trouvé dans cette catégorie.</p>';
    return;
  }

  container.innerHTML = list.map(p => `
    <article class="product-card" data-category="${p.category}" itemscope itemtype="https://schema.org/Product">
      <div class="product-image">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        ${renderProductImage(p)}
        <meta itemprop="image" content="${p.image || p.emoji}">
      </div>
      <div class="product-info">
        <span class="product-category">${getCategoryLabel(p.category)}</span>
        <h3 class="product-title" itemprop="name">${p.name}</h3>
        <p class="product-desc" itemprop="description">${p.desc}</p>
        <div class="product-footer">
          <div class="product-price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
            <meta itemprop="priceCurrency" content="XAF">
            <span itemprop="price" content="${p.price}">${formatPrice(p.price)}</span>
          </div>
          <button class="btn-add" onclick="addToCart(${p.id})" aria-label="Ajouter ${p.name} au panier">
            + Panier
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

function getCategoryLabel(cat) {
  const labels = {
    robes: 'Robes',
    ensembles: 'Ensembles',
    accessoires: 'Accessoires',
    bijoux: 'Bijoux',
    hauts: 'Hauts',
    pagnes: 'Pagnes',
    chaussures: 'Chaussures',
    beaute: 'Beauté',
    jupes: 'Jupes'
  };
  return labels[cat] || cat;
}

// ========== FILTRES ==========
function filterProducts(category) {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`[data-filter="${category}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  if (category === 'all') {
    renderProducts(products);
  } else {
    renderProducts(products.filter(p => p.category === category));
  }
}

// ========== NAVIGATION MOBILE ==========
function toggleMenu() {
  const menu = document.getElementById('nav-menu');
  const overlay = document.getElementById('nav-overlay');
  menu?.classList.toggle('open');
  overlay?.classList.toggle('open');
  document.body.style.overflow = menu?.classList.contains('open') ? 'hidden' : '';
}

function closeMenu() {
  document.getElementById('nav-menu')?.classList.remove('open');
  document.getElementById('nav-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ========== FORMULAIRE CONTACT ==========
function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('[name="name"]').value;
  showToast(`Merci ${name} ! Votre message a été envoyé. Nous vous répondrons bientôt.`);
  form.reset();
}

// ========== NEWSLETTER ==========
function handleNewsletter(e) {
  e.preventDefault();
  showToast('Merci ! Vous êtes inscrite à notre newsletter.');
  e.target.reset();
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  // Produits en vedette (home)
  const featured = document.getElementById('featured-products');
  if (featured) {
    renderProducts(products.slice(0, 8), 'featured-products');
  }

  // Page boutique
  const shopGrid = document.getElementById('products-grid');
  if (shopGrid) {
    renderProducts(products);
  }

  // Événements
  document.getElementById('cart-btn')?.addEventListener('click', openCart);
  document.getElementById('cart-close')?.addEventListener('click', closeCart);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
  document.getElementById('menu-toggle')?.addEventListener('click', toggleMenu);
  document.getElementById('nav-overlay')?.addEventListener('click', closeMenu);

  // Fermer menu au clic sur lien
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Formulaire contact
  document.getElementById('contact-form')?.addEventListener('submit', handleContactSubmit);

  // Newsletter
  document.getElementById('newsletter-form')?.addEventListener('submit', handleNewsletter);

  // Checkout simulation
  document.getElementById('btn-checkout')?.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Votre panier est vide');
      return;
    }
    showToast('Commande enregistrée ! Nous vous contacterons pour la livraison.');
    cart = [];
    saveCart();
    closeCart();
  });
});

// Exposer fonctions globales pour onclick
window.addToCart = addToCart;
window.updateQty = updateQty;
window.removeFromCart = removeFromCart;
window.filterProducts = filterProducts;
window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;
window.openCart = openCart;
window.closeCart = closeCart;