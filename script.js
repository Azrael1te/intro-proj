// Product Catalog Database with complete pricing for 12oz, 16oz, 20Oz
const productsData = [
  // Espresso Based (Iced)
  { id: 'p1', name: 'Americano', category: 'Espresso', img: 'pictures/amerika.jpg', prices: { '12oz': 65, '16oz': 85, '20Oz': 105 }, inStock: true },
  { id: 'p2', name: 'Kape Latte', category: 'Espresso', img: 'pictures/latte.jpg', prices: { '12oz': 75, '16oz': 95, '20Oz': 115 }, inStock: true },
  { id: 'p3', name: 'Spanish Latte', category: 'Espresso', img: 'pictures/slatte.jpg', prices: { '12oz': 85, '16oz': 105, '20Oz': 125 }, inStock: true },
  { id: 'p4', name: 'Mocha', category: 'Espresso', img: 'pictures/mocha.jpg', prices: { '12oz': 85, '16oz': 105, '20Oz': 125 }, inStock: true },
  { id: 'p5', name: 'Dark Chocolate Espresso', category: 'Espresso', img: 'pictures/dark-choc.jpg', prices: { '12oz': 90, '16oz': 110, '20Oz': 130 }, inStock: true },
  { id: 'p6', name: 'Matcha Espresso', category: 'Espresso', img: 'pictures/mespress.jpg', prices: { '12oz': 95, '16oz': 115, '20Oz': 135 }, inStock: true },
  { id: 'p7', name: 'Caramel Macchiato', category: 'Espresso', img: 'pictures/cmach.jpg', prices: { '12oz': 85, '16oz': 105, '20Oz': 125 }, inStock: true },
  { id: 'p8', name: 'Sea Salt Latte', category: 'Espresso', img: '', prices: { '12oz': 90, '16oz': 110, '20Oz': 130 }, inStock: true },
  { id: 'p9', name: 'Barista\'s Choice', category: 'Espresso', img: '', prices: { '12oz': 100, '16oz': 120, '20Oz': 140 }, inStock: true },
 
  // Milk Based (Non-Coffee)
  { id: 'p10', name: 'Premium Chocolate', category: 'Milk', img: 'pictures/pchoc.jpg', prices: { '12oz': 65, '16oz': 85, '20Oz': 105 }, inStock: true },
  { id: 'p11', name: 'Strawberry Milk', category: 'Milk', img: 'pictures/strawmilk.jpg', prices: { '12oz': 70, '16oz': 90, '20Oz': 110 }, inStock: true },
  { id: 'p12', name: 'Blueberry Milk', category: 'Milk', img: 'pictures/bmilk.jpg', prices: { '12oz': 70, '16oz': 90, '20Oz': 110 }, inStock: true },
 
  // Juice, Soda & Tea
  { id: 'p13', name: 'Strawberry / Blueberry Juice', category: 'Juice', img: '', prices: { '12oz': 60, '16oz': 80, '20Oz': 100 }, inStock: true },
  { id: 'p14', name: 'Besh Fruit Tea & Soda', category: 'Juice', img: 'pictures/psoda.jpg', prices: { '12oz': 65, '16oz': 85, '20Oz': 105 }, inStock: true },
 
  // Matcha Series
  { id: 'p15', name: 'Matcha Latte', category: 'Matcha', img: 'pictures/mlatte.jpg', prices: { '12oz': 85, '16oz': 105, '20Oz': 125 }, inStock: true },
  { id: 'p16', name: 'Dark / Pink Matcha', category: 'Matcha', img: 'pictures/pmatcha.jpg', prices: { '12oz': 90, '16oz': 110, '20Oz': 130 }, inStock: true }
];
 
// Available Add-ons
const addOnsData = [
  { id: 'add1', name: 'Espresso Shot', price: 25 },
  { id: 'add2', name: 'Milk Syrup', price: 20 },
  { id: 'add3', name: 'Extra Milk', price: 20 },
  { id: 'add4', name: 'Caramel Syrup', price: 15 },
  { id: 'add5', name: 'Chocolate Syrup', price: 15 },
  { id: 'add6', name: 'Pearls / Crystal', price: 15 },
  { id: 'add7', name: 'Extra Sugar', price: 10 }
];
 
const DELIVERY_FEE = 49;
// Shown for drinks that have no photo yet (or whose photo fails to load)
const PLACEHOLDER_IMG = 'pictures/placeholder.jpg';
 
// App State Management
let cart = [];
let activeFilter = 'All';
let currentSelectedProduct = null;
let selectedSize = '16oz';
let selectedAddons = [];
let modalQuantity = 1;
let activeHighlight = 0;
let highlightsTimer = null;
 
// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
  startHighlightsAutoplay();
});
 
function formatCupSize(size) {
  return `${size.slice(0, -2)}<span class="text-[0.7em]">oz</span>`;
}
 
// Render Product Catalog Cards
function renderProducts() {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
 
  const filtered = activeFilter === 'All' 
    ? productsData 
    : productsData.filter(p => p.category === activeFilter);
 
  filtered.forEach(product => {
    const minPrice = product.prices['12oz'];
    const card = document.createElement('div');
    card.className = "group relative bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-300 transition-all duration-300 flex flex-col justify-between hover:shadow-xl cursor-pointer";
    card.onclick = () => openProductModal(product);
 
    card.innerHTML = `
      <div>
        <div class="relative h-60 w-full overflow-hidden bg-gray-200">
          <img src="${product.img || PLACEHOLDER_IMG}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
            ${product.category}
          </span>
          ${product.inStock ? '' : '<span class="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Out of Stock</span>'}
        </div>
        <div class="p-5">
          <h3 class="font-extrabold text-lg uppercase tracking-tight text-gray-900 group-hover:text-gray-600 transition-colors">${product.name}</h3>
          <p class="text-xs text-gray-500 mt-1">Sizes: 12<span class="text-[0.7em]">oz</span> • 16<span class="text-[0.7em]">oz</span> • 20<span class="text-[0.7em]">oz</span></p>
        </div>
      </div>
      <div class="p-5 pt-0 flex justify-between items-center">
        <div>
          <span class="text-[10px] uppercase text-gray-400 font-bold block">Starts at</span>
          <span class="text-lg font-black text-black">₱${minPrice}</span>
        </div>
        <button class="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-md">
          <i class="fa-solid fa-plus text-xs"></i>
        </button>
      </div>
    `;
    const img = card.querySelector('img');
    img.onerror = () => { img.onerror = null; img.src = PLACEHOLDER_IMG; };
    grid.appendChild(card);
  });
}
 
function showHighlight(index) {
  const slides = document.querySelectorAll('.highlight-slide');
  const dots = document.querySelectorAll('.highlight-dot');
  if (!slides.length) return;
 
  activeHighlight = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    const isActive = i === activeHighlight;
    slide.classList.toggle('opacity-100', isActive);
    slide.classList.toggle('opacity-0', !isActive);
    slide.classList.toggle('pointer-events-none', !isActive);
    slide.setAttribute('aria-hidden', String(!isActive));
  });
  dots.forEach((dot, i) => {
    const isActive = i === activeHighlight;
    dot.classList.toggle('bg-white', isActive);
    dot.classList.toggle('bg-white/50', !isActive);
    dot.setAttribute('aria-current', String(isActive));
  });
}
 
function changeHighlight(direction) {
  showHighlight(activeHighlight + direction);
  startHighlightsAutoplay();
}
 
function startHighlightsAutoplay() {
  clearInterval(highlightsTimer);
  highlightsTimer = setInterval(() => showHighlight(activeHighlight + 1), 5000);
}
 
// Category Filter Handler
function filterCategory(cat) {
  activeFilter = cat;
  document.querySelectorAll('.cat-btn').forEach(btn => {
    if (btn.innerText.toUpperCase().includes(cat.toUpperCase()) || (cat==='All' && btn.innerText.includes('ALL'))) {
      btn.className = "cat-btn active px-6 py-2.5 rounded-full text-xs font-extrabold tracking-wide uppercase transition-all bg-black text-white shadow-md";
    } else {
      btn.className = "cat-btn px-6 py-2.5 rounded-full text-xs font-extrabold tracking-wide uppercase transition-all bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  });
  renderProducts();
}
 
function scrollToMenu(cat = null) {
  if (cat) filterCategory(cat);
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}
 
// Open Product Details Customization Modal
function openProductModal(product) {
  currentSelectedProduct = product;
  selectedSize = '16oz';
  selectedAddons = [];
  modalQuantity = 1;
 
  document.getElementById('modalImg').src = product.img || PLACEHOLDER_IMG;
  document.getElementById('modalTitle').innerText = product.name;
  document.getElementById('modalCategory').innerText = product.category;
  document.getElementById('modalQty').innerText = modalQuantity;
 
  // Size Options Render
  const sizeContainer = document.getElementById('sizeSelectorContainer');
  sizeContainer.innerHTML = '';
  Object.keys(product.prices).forEach(size => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick = () => selectModalSize(size);
    btn.id = `size-btn-${size}`;
    btn.className = `p-3 rounded-xl border text-center transition-all ${size === selectedSize ? 'border-black bg-black text-white font-black' : 'border-gray-200 bg-gray-50 text-gray-700 font-bold hover:bg-gray-100'}`;
    btn.innerHTML = `
      <div class="text-xs uppercase">${formatCupSize(size)}</div>
      <div class="text-xs opacity-80 mt-0.5">₱${product.prices[size]}</div>
    `;
    sizeContainer.appendChild(btn);
  });
 
  // Add-ons Render
  const addonsContainer = document.getElementById('addonsContainer');
  addonsContainer.innerHTML = '';
  addOnsData.forEach(addon => {
    const label = document.createElement('label');
    label.className = "flex items-center justify-between p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer text-xs font-semibold";
    label.innerHTML = `
      <div class="flex items-center gap-2">
        <input type="checkbox" onchange="toggleAddon('${addon.id}')" class="accent-black rounded">
        <span>${addon.name}</span>
      </div>
      <span class="text-gray-500">+₱${addon.price}</span>
    `;
    addonsContainer.appendChild(label);
  });
 
  calculateModalTotal();
 
  const modal = document.getElementById('productModal');
  modal.classList.remove('opacity-0', 'pointer-events-none');
  modal.querySelector('div').classList.remove('scale-95');
}
 
function openProductById(id) {
  const p = productsData.find(item => item.id === id);
  if (p) openProductModal(p);
}
 
function closeProductModal() {
  const modal = document.getElementById('productModal');
  modal.classList.add('opacity-0', 'pointer-events-none');
  modal.querySelector('div').classList.add('scale-95');
}
 
function selectModalSize(size) {
  selectedSize = size;
  Object.keys(currentSelectedProduct.prices).forEach(s => {
    const btn = document.getElementById(`size-btn-${s}`);
    if (btn) {
      btn.className = `p-3 rounded-xl border text-center transition-all ${s === selectedSize ? 'border-black bg-black text-white font-black' : 'border-gray-200 bg-gray-50 text-gray-700 font-bold hover:bg-gray-100'}`;
    }
  });
  calculateModalTotal();
}
 
function toggleAddon(addonId) {
  const idx = selectedAddons.indexOf(addonId);
  if (idx > -1) {
    selectedAddons.splice(idx, 1);
  } else {
    selectedAddons.push(addonId);
  }
  calculateModalTotal();
}
 
function updateModalQty(delta) {
  if (modalQuantity + delta >= 1) {
    modalQuantity += delta;
    document.getElementById('modalQty').innerText = modalQuantity;
    calculateModalTotal();
  }
}
 
function calculateModalTotal() {
  if (!currentSelectedProduct) return;
  const base = currentSelectedProduct.prices[selectedSize];
  const addonsCost = selectedAddons.reduce((sum, id) => {
    const item = addOnsData.find(a => a.id === id);
    return sum + (item ? item.price : 0);
  }, 0);
 
  const singleTotal = base + addonsCost;
  const grandTotal = singleTotal * modalQuantity;
 
  document.getElementById('modalBasePrice').innerText = `₱${singleTotal}`;
  document.getElementById('modalTotalBtnPrice').innerText = `₱${grandTotal}`;
}
 
// Add Customized Item to Cart
function submitModalAddToCart(isBuyNow = false) {
  const basePrice = currentSelectedProduct.prices[selectedSize];
  const selectedAddonsList = selectedAddons.map(id => addOnsData.find(a => a.id === id));
  const addonsCost = selectedAddonsList.reduce((acc, a) => acc + a.price, 0);
  const unitPrice = basePrice + addonsCost;
 
  const cartItem = {
    cartId: Date.now() + Math.random().toString(),
    productId: currentSelectedProduct.id,
    name: currentSelectedProduct.name,
    category: currentSelectedProduct.category,
    img: currentSelectedProduct.img,
    size: selectedSize,
    addons: selectedAddonsList,
    unitPrice: unitPrice,
    quantity: modalQuantity
  };
 
  cart.push(cartItem);
  updateCartUI();
  closeProductModal();
 
  toggleCartDrawer(true);
  if (isBuyNow) openCheckoutModal();
}
 
// Toggle Cart Drawer
function toggleCartDrawer(forceOpen = false) {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartDrawerBackdrop');
 
  const isOpen = !drawer.classList.contains('translate-x-full');
  if (isOpen && !forceOpen) {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
  } else {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
  }
}
 
// Update Cart UI & Calculation
function updateCartUI() {
  const container = document.getElementById('cartItemsContainer');
  const cartBadge = document.getElementById('cartBadge');
  const checkoutBtn = document.getElementById('checkoutBtn');
 
  container.innerHTML = '';
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
 
  if (totalCount > 0) {
    cartBadge.innerText = totalCount;
    cartBadge.classList.remove('hidden');
    checkoutBtn.disabled = false;
  } else {
    cartBadge.classList.add('hidden');
    checkoutBtn.disabled = true;
    container.innerHTML = `
      <div class="text-center py-12 text-gray-400">
        <i class="fa-solid fa-bag-shopping text-5xl mb-3"></i>
        <p class="text-sm font-bold uppercase">Your cart is empty</p>
        <p class="text-xs text-gray-400 mt-1">Pick your favourite brew to get started!</p>
      </div>
    `;
  }
 
  let subtotal = 0;
  cart.forEach(item => {
    const itemTotal = item.unitPrice * item.quantity;
    subtotal += itemTotal;
 
    const addonsText = item.addons.length > 0 
      ? item.addons.map(a => a.name).join(', ') 
      : 'No extra add-ons';
 
    const elem = document.createElement('div');
    elem.className = "flex gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100 relative";
    elem.innerHTML = `
      <img src="${item.img || PLACEHOLDER_IMG}" class="w-16 h-16 rounded-xl object-cover" />
      <div class="flex-1">
        <div class="flex justify-between items-start">
          <h4 class="font-extrabold text-xs uppercase">${item.name}</h4>
          <button onclick="removeCartItem('${item.cartId}')" class="text-gray-400 hover:text-red-500 text-xs">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
        <div class="text-[10px] text-gray-500 font-medium">Size: ${formatCupSize(item.size)}</div>
        <div class="text-[10px] text-gray-400 truncate max-w-[180px]">${addonsText}</div>
        
        <div class="flex justify-between items-center mt-2">
          <div class="flex items-center border rounded-full bg-white text-xs">
            <button onclick="changeCartQty('${item.cartId}', -1)" class="px-2 py-0.5 hover:bg-gray-100 font-bold">-</button>
            <span class="px-2 font-black">${item.quantity}</span>
            <button onclick="changeCartQty('${item.cartId}', 1)" class="px-2 py-0.5 hover:bg-gray-100 font-bold">+</button>
          </div>
          <span class="font-black text-xs">₱${itemTotal}</span>
        </div>
      </div>
    `;
    container.appendChild(elem);
  });
 
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  document.getElementById('cartSubtotal').innerText = `₱${subtotal}`;
  document.getElementById('cartTotal').innerText = `₱${subtotal + deliveryFee}`;
}
 
function removeCartItem(cartId) {
  cart = cart.filter(i => i.cartId !== cartId);
  updateCartUI();
}
 
function changeCartQty(cartId, delta) {
  const item = cart.find(i => i.cartId === cartId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeCartItem(cartId);
    } else {
      updateCartUI();
    }
  }
}
 
// Checkout Modal Handling
function openCheckoutModal() {
  if (cart.length === 0) return;
  
  const summaryContainer = document.getElementById('checkoutSummaryItems');
  summaryContainer.innerHTML = '';
 
  let subtotal = 0;
  cart.forEach(item => {
    const itemTotal = item.unitPrice * item.quantity;
    subtotal += itemTotal;
    const row = document.createElement('div');
    row.className = "flex justify-between py-1.5";
    row.innerHTML = `
      <span>${item.quantity}x ${item.name} (${formatCupSize(item.size)})</span>
      <span class="font-bold">₱${itemTotal}</span>
    `;
    summaryContainer.appendChild(row);
  });
 
  const total = subtotal + DELIVERY_FEE;
  document.getElementById('checkoutTotalPay').innerText = `₱${total}`;
 
  toggleCartDrawer(false);
  const modal = document.getElementById('checkoutModal');
  modal.classList.remove('opacity-0', 'pointer-events-none');
}
 
function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  modal.classList.add('opacity-0', 'pointer-events-none');
}
 
// Handle Form Submit -> Launch Receipt & Live GPS Tracker
function handleCheckoutSubmit(e) {
  e.preventDefault();
 
  const name = document.getElementById('buyerName').value;
  const phone = document.getElementById('buyerPhone').value;
  const address = document.getElementById('buyerAddress').value;
 
  let subtotal = cart.reduce((acc, i) => acc + (i.unitPrice * i.quantity), 0);
  let grandTotal = subtotal + DELIVERY_FEE;
 
  document.getElementById('rcptCustomer').innerText = name || 'Besh Customer';
  document.getElementById('rcptPhone').innerText = phone || '0917-000-0000';
  document.getElementById('rcptAddress').innerText = address || 'Metro Manila Address';
  document.getElementById('rcptTotalPay').innerText = `₱${grandTotal}`;
  document.getElementById('receiptOrderNo').innerText = `Order ID: #BK-${Math.floor(1000 + Math.random() * 9000)}`;
 
  closeCheckoutModal();
  cart = [];
  updateCartUI();
 
  toggleTrackingModal(true);
}
 
// Toggle Tracking & Receipt Modal
function toggleTrackingModal(forceOpen = false) {
  const modal = document.getElementById('trackingModal');
  const isOpen = !modal.classList.contains('opacity-0');
 
  if (isOpen && !forceOpen) {
    modal.classList.add('opacity-0', 'pointer-events-none');
  } else {
    modal.classList.remove('opacity-0', 'pointer-events-none');
  }
}