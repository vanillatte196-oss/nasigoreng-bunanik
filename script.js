// Nomor WhatsApp Bu Nanik (menggunakan format 62)
const PHONE_NUMBER = "6285875559317";

let cart = [];

// Fungsi Menambahkan Menu ke Keranjang
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

// Fungsi Menghapus Item dari Keranjang
function removeItem(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// Memperbarui Tampilan Keranjang & Total
function updateCartUI() {
  const navCartCount = document.getElementById("nav-cart-count");
  const floatCartCount = document.getElementById("float-cart-count");
  const cartList = document.getElementById("cart-items-list");
  const cartTotal = document.getElementById("cart-total-price");

  let totalQty = 0;
  let totalPrice = 0;
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML =
      '<p class="empty-msg">Keranjang belanja Anda masih kosong.</p>';
  } else {
    cart.forEach((item, index) => {
      totalQty += item.qty;
      const subtotal = item.price * item.qty;
      totalPrice += subtotal;

      cartList.innerHTML += `
        <div class="cart-item-row">
          <span><strong>${item.name}</strong> (${item.qty}x)</span>
          <span>Rp ${subtotal.toLocaleString("id-ID")} 
            <button type="button" class="btn-remove" onclick="removeItem(${index})">❌</button>
          </span>
        </div>
      `;
    });
  }

  navCartCount.innerText = totalQty;
  floatCartCount.innerText = totalQty;
  cartTotal.innerText = `Rp ${totalPrice.toLocaleString("id-ID")}`;
}

// Mengubah Teks Info Pembayaran Sesuai Pilihan
function updatePaymentInfo() {
  const method = document.getElementById("payment-method").value;
  const infoBox = document.getElementById("payment-info");

  if (method === "Transfer Bank BCA") {
    infoBox.innerHTML =
      "📌 <em>Transfer ke Rekening BCA: <strong>123-456-7890</strong> a.n. Bu Nanik.</em>";
  } else if (method === "Tunai / COD") {
    infoBox.innerHTML =
      "📌 <em>Pembayaran dilakukan secara tunai kepada kurir saat makanan sampai.</em>";
  } else {
    infoBox.innerHTML =
      "📌 <em>Info Pembayaran: QRIS akan dikirimkan melalui pesan WhatsApp setelah pesanan dikonfirmasi.</em>";
  }
}

// Buka Modal Keranjang
function openCartModal() {
  document.getElementById("cartModal").style.display = "block";
}

// Tutup Modal Keranjang
function closeCartModal() {
  document.getElementById("cartModal").style.display = "none";
}

// Kirim Format Pesanan ke WhatsApp Bu Nanik
function sendOrderToWA(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert(
      "Keranjang belanja Anda masih kosong! Silakan pilih menu terlebih dahulu.",
    );
    return;
  }

  const name = document.getElementById("cust-name").value.trim();
  const address = document.getElementById("cust-address").value.trim();
  const payment = document.getElementById("payment-method").value;
  const notes = document.getElementById("cust-notes").value.trim() || "-";

  let total = 0;
  let orderDetails = "";

  cart.forEach((item) => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    orderDetails += `• ${item.qty}x ${item.name} (Rp ${subtotal.toLocaleString("id-ID")})\n`;
  });

  // Format Pesan WhatsApp
  const message = `🛒 *PESANAN BARU - NASI GORENG BU NANIK*

👤 *Nama Pemesan:* ${name}
📍 *Alamat Kirim:* ${address}

📋 *Rincian Pesanan:*
${orderDetails}
💵 *Total Bayar:* *Rp ${total.toLocaleString("id-ID")}*
💳 *Metode Pembayaran:* ${payment}
📝 *Catatan:* ${notes}

---
_Dimohon untuk konfirmasi total & estimasi waktu pengiriman. Terima kasih!_`;

  // Buka WhatsApp
  const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
}
