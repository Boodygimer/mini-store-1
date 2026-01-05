// ==========================================
// windo stile app.js

window.onblur = () => {
  document.title = "ارجع هنا 😢";
}
window.onfocus = () => {
  document.title = "هتشتري إيه النهاردة؟ 🛒";
}
// ==========================================


// ==========================================
// 1. داتا المنتجات (بصور حقيقية)
// ==========================================
const products = [ 
  {
    id: 1,
    name: "لابتوب جيمينج Dell G15",
    price: 35000,
    category: "electronics",
    img: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&q=80",
  },
  {
    id: 2,
    name: "ساعة Apple Watch Ultra",
    price: 25000,
    category: "electronics",
    img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80",
  },
  {
    id: 3,
    name: "تيشيرت قطن بيزك - أسود",
    price: 250,
    category: "fashion",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  },
  {
    id: 4,
    name: "سماعة Sony Headphone",
    price: 4500,
    category: "electronics",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  },
  {
    id: 5,
    name: "تيشيرت صيفي - أبيض",
    price: 300,
    category: "fashion",
    img: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80",
  },
];

// ==========================================
// 2. دالة عرض وتصفية المنتجات (Filtering Logic)
// ==========================================
function filterProducts(category) {
  const container = document.getElementById("productsContainer");
  container.innerHTML = ""; // مسح المنتجات الحالية

  // 1. تصفية الداتا
  const filtered =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  // 2. لو مفيش منتجات في القسم ده
  if (filtered.length === 0) {
    container.innerHTML =
      '<div class="alert alert-warning w-100">عفواً، لا توجد منتجات في هذا القسم حالياً.</div>';
    return;
  }

  // 3. رسم المنتجات
  filtered.forEach((product) => {
    container.innerHTML += `
            <div class="col-md-4 mb-4 animate-fade"> <div class="card product-card h-100">
                    <div class="img-container">
                        <img src="${product.img}" class="card-img-top" alt="${
      product.name
    }">
                    </div>
                    <div class="card-body text-center">
                        <h5 class="card-title">${product.name}</h5>
                        <span class="price-tag">${product.price.toLocaleString()} ج.م</span>
                        <button class="btn btn-dark w-100 mt-2" onclick="addToCart(${
                          product.id
                        })">
                            <i class="bi bi-cart-plus"></i> أضف للسلة
                        </button>
                    </div>
                </div>
            </div>
        `;
  });

  // 4. تحديث شكل الأزرار (عشان يعرف هو واقف فين)
  updateActiveButton(category);
}

// دالة مساعدة لتلوين الزرار المختار
function updateActiveButton(category) {
  // شيل اللون من كل الزراير
  document.querySelectorAll(".btn-filter").forEach((btn) => {
    btn.classList.remove("active", "btn-primary");
    btn.classList.add("btn-outline-secondary");
  });

  // حط اللون للزرار المختار
  const activeBtn = document.querySelector(
    `.btn-filter[data-filter="${category}"]`
  );
  if (activeBtn) {
    activeBtn.classList.remove("btn-outline-secondary");
    activeBtn.classList.add("active", "btn-primary");
  }
}

// تشغيل الدالة أول مرة عشان يعرض الكل
filterProducts("all");

let cart = [];
let isLoggedIn = false;

// 2. عرض المنتجات
function displayProducts(filter = "all") {
  const container = document.getElementById("productsContainer");
  container.innerHTML = "";

  const filtered =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  filtered.forEach((product) => {
    container.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card product-card h-100">
                    <img src="${product.img}" class="card-img-top" alt="${product.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text fw-bold text-primary">${product.price} ج.م</p>
                        <button class="btn btn-dark" onclick="addToCart(${product.id})">أضف للسلة</button>
                    </div>
                </div>
            </div>
        `;
  });
}

// 3. منطق السلة
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  document.getElementById("cartCount").innerText = cart.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  const tbody = document.getElementById("cartItems");
  tbody.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    tbody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.qty}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">حذف</button></td>
            </tr>
        `;
  });
  document.getElementById("totalPrice").innerText = total;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// 4. محاكاة تسجيل الدخول (Authentication)
function fakeLogin() {
  isLoggedIn = true;
  document.getElementById("authSection").innerHTML =
    '<span class="text-light">أهلاً، يا بطل</span>';
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("loginModal")
  );
  modal.hide();
}

// 5. إتمام الطلب (Checkout)
function processCheckout(e) {
  e.preventDefault();
  if (cart.length === 0) {
    alert("السلة فارغة!");
    return;
  }
  if (!isLoggedIn) {
    alert("يجب تسجيل الدخول لإتمام الطلب");
    // فتح مودال الدخول
    return;
  }

  // هنا ممكن تبعت البيانات لسيرفر أو واتساب
  alert("تم استلام طلبك بنجاح! سيتم التواصل معك خلال 24 ساعة.");
  cart = [];
  updateCartUI();
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("cartModal")
  );
  modal.hide();
}


// تشغيل عند التحميل
displayProducts();
updateCartUI();

// إضافة مستمع للنموذج
document
  .getElementById("checkoutForm")
  .addEventListener("submit", processCheckout);

// ==========================================
// 6. تأثيرات جمالية (Animations)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.innerHTML = `
        .animate-fade {
            opacity: 0;     
            animation: fadeIn 0.5s forwards;
        }

        @keyframes fadeIn {
            to {
                opacity: 1;
            }
        }
    `;
  document.head.appendChild(style);
});   

// ==========================================
// نهاية الملف
// ==========================================
