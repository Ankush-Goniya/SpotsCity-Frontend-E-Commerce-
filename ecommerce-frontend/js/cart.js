// Load Cart
function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cartContainer");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartContainer) return;

  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="text-gray-500">Your cart is empty.</p>`;
    cartTotal.textContent = "Total: ₹0";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "flex items-center bg-white dark:bg-gray-800 p-4 rounded shadow";

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded mr-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold">${item.name}</h3>
        <p class="text-gray-600 dark:text-gray-400">₹${item.price}</p>
        <div class="flex items-center gap-2 mt-2">
          <button class="decrease bg-gray-300 px-2 rounded">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="increase bg-gray-300 px-2 rounded">+</button>
        </div>
      </div>
      <button class="remove ml-4 text-red-500 font-semibold">✕</button>
    `;

    // Decrease
    div.querySelector(".decrease").addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        cart.splice(index, 1); // remove if quantity goes below 1
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
    });

    // Increase
    div.querySelector(".increase").addEventListener("click", () => {
      item.quantity++;
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
    });

    // Remove
    div.querySelector(".remove").addEventListener("click", () => {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
    });

    cartContainer.appendChild(div);
  });

  cartTotal.textContent = `Total: ₹${total}`;
}

// Checkout Button
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      alert("✅ Order placed successfully!");
      localStorage.removeItem("cart");
      loadCart();
    });
  }
});
