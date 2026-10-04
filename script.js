// Ganti dengan nomor WhatsApp Bu Nanik (Gunakan format 62, tanpa angka 0 di depan)
const PHONE_NUMBER = "6281234567890";

let cart = [];

// Fungsi Menambah Item ke Keranjang
function addToCart(itemName, itemPrice) {
  const existingItem = cart.find((item) => item.name === itemName);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name: itemName, price: itemPrice, qty: 1 });
  }
  updateCartUI();
  openCartModal();
}

// Update Tampilan Keranjang
function updateCartUI() {
  const cartCount = document.getElementById("cart-count");
  const cartList = document.getElementById("cart-items-list");
  const cartTotal = document.getElementById("cart-total-price");

  let totalQty = 0;
  let totalPrice = 0;
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML =
      '<p class="empty-msg">Keranjang belanja masih kosong.</p>';
  } else {
    cart.forEach((item, index) => {
      totalQty += item.qty;
      totalPrice += item.price * item.qty;

      cartList.innerHTML += `
        <div class="cart-item-row">
          <span><strong>${item.name}</strong> (${item.qty}x)</span>
          <span>Rp ${(item.price * item.qty).toLocaleString("id-ID")}</span>
          <button type="button" class="btn-remove" onclick="removeItem(${index})">❌</button>
        </div>
      `;
    });
  }

  cartCount.innerText = totalQty;
  cartTotal.innerText = `Rp ${totalPrice.toLocaleString("id-ID")}`;
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// Modal Control
function openCartModal() {
  document.getElementById("cartModal").style.display = "block";
}

function closeCartModal() {
  document.getElementById("cartModal").style.display = "none";
}

// Kirim Pesanan ke WhatsApp
function sendOrderToWA(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Keranjang belanja Anda masih kosong!");
    return;
  }

  const name = document.getElementById("cust-name").value;
  const address = document.getElementById("cust-address").value;
  const payment = document.getElementById("payment-method").value;
  const notes = document.getElementById("cust-notes").value || "-";

  let total = 0;
  let orderDetails = "";

  cart.forEach((item) => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    orderDetails += `• ${item.qty}x ${item.name} - Rp ${subtotal.toLocaleString("id-ID")}\n`;
  });

  // Format Pesan WhatsApp
  const message = `🛒 *PESANAN BARU - NASI GORENG BU NANIK*

👤 *Nama Pembeli:* ${name}
📍 *Alamat Kirim:* ${address}

📋 *Rincian Pesanan:*
${orderDetails}
💵 *Total Pembayaran:* *Rp ${total.toLocaleString("id-ID")}*
💳 *Metode Pembayaran:* ${payment}
📝 *Catatan:* ${notes}`;

  // Encode URL & Redirect
  const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
}
