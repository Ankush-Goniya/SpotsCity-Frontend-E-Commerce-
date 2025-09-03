// ==================== PRODUCTS DATA ====================
const products = [
  { id: 1, name: "Laptop", price: 55000, image: "images/mac.jpg" },
  { id: 2, name: "Shoes", price: 2500, image: "images/shoes.jpg" },
  { id: 3, name: "Football", price: 1500, image: "images/fan.jpg" },
  { id: 4, name: "Cricket Bat", price: 3500, image: "images/Earbuds.jpg" }
];

// ==================== ADD TO CART ====================
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.name} added to cart!`);
}

// ==================== RENDER PRODUCTS ====================
function renderProducts(products) {
  const container = document.getElementById("productsContainer");
  if (!container) return; // Prevent error on cart.html
  container.innerHTML = "";

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "bg-white dark:bg-gray-800 p-4 rounded shadow";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" class="w-full h-40 object-cover rounded mb-4">
      <h3 class="font-bold text-lg">${p.name}</h3>
      <p class="text-gray-600 dark:text-gray-300">₹${p.price}</p>
      <button class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Add to Cart
      </button>
    `;

    div.querySelector("button").addEventListener("click", () => addToCart(p));
    container.appendChild(div);
  });
}

// ==================== SEARCH & SORT ====================
function setupSearchAndSort() {
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  if (!searchInput || !sortSelect) return;

  function filterProducts() {
    let filtered = [...products];
    const searchValue = searchInput.value.toLowerCase();
    const sortValue = sortSelect.value;

    if (searchValue) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchValue));
    }

    if (sortValue === "low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === "high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortValue === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderProducts(filtered);
  }

  searchInput.addEventListener("input", filterProducts);
  sortSelect.addEventListener("change", filterProducts);

  filterProducts(); // initial render
}

// ==================== LOAD CART ====================
function loadCart() {
  const cartContainer = document.getElementById("cartContainer");
  const totalPriceEl = document.getElementById("totalPrice");
  const proceedBtn = document.getElementById("proceedBtn");
  if (!cartContainer || !totalPriceEl) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="text-gray-600 dark:text-gray-300">Your cart is empty</p>`;
    totalPriceEl.textContent = "₹0";
    if (proceedBtn) proceedBtn.classList.add("hidden");
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className =
      "flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded mb-4 shadow";
    div.innerHTML = `
      <div class="flex items-center space-x-4">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
        <div>
          <h3 class="font-bold">${item.name}</h3>
          <p>₹${item.price} × ${item.quantity}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button class="decrease bg-gray-300 px-2 rounded">-</button>
        <span>${item.quantity}</span>
        <button class="increase bg-gray-300 px-2 rounded">+</button>
        <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Remove</button>
      </div>
    `;

    // Decrease quantity
    div.querySelector(".decrease").addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart = cart.filter(p => p.id !== item.id);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
    });

    // Increase quantity
    div.querySelector(".increase").addEventListener("click", () => {
      item.quantity += 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
    });

    // Remove item
    div.querySelector(".bg-red-500").addEventListener("click", () => {
      cart = cart.filter(p => p.id !== item.id);
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
    });

    cartContainer.appendChild(div);
  });

  totalPriceEl.textContent = `₹${total}`;
  if (proceedBtn) proceedBtn.classList.remove("hidden");
}

// ==================== CHECKOUT ====================
function setupCheckout() {
  const checkoutForm = document.getElementById("checkoutForm");
  if (!checkoutForm) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    document.body.innerHTML = `<div class="text-center p-8">
      <h2 class="text-2xl font-bold">Your cart is empty</h2>
      <a href="products.html" class="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded">Shop Now</a>
    </div>`;
    return;
  }

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("✅ Order placed successfully!");
    localStorage.removeItem("cart");
    window.location.href = "products.html";
  });
}

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("productsContainer")) setupSearchAndSort();
  if (document.getElementById("cartContainer")) loadCart();
  if (document.getElementById("checkoutForm")) setupCheckout();
});
