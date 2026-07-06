const DISHES_KEY = "mamXanhMocDishesV2";
const BOOKINGS_KEY = "mamXanhMocBookings";

const defaultDishes = [
  ["pho-bo", "Phở bò truyền thống", "main", "Món chính", "45.000đ", "Nước dùng ninh chậm, bánh phở mềm, thịt bò thái mỏng và hương quế hồi ấm áp.", "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=900&q=80"],
  ["banh-mi", "Bánh mì đặc biệt", "street", "Đường phố", "25.000đ", "Vỏ bánh giòn, pate béo nhẹ, đồ chua tươi và nước sốt nhà làm đậm vị.", "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80"],
  ["com-tam", "Cơm tấm sườn nướng", "main", "Món chính", "40.000đ", "Sườn ướp mật ong, cơm tấm dẻo, bì chả trứng và chén nước mắm pha cân bằng.", "https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=900&q=80"],
  ["che-trai-cay", "Chè trái cây mát lành", "dessert", "Tráng miệng", "20.000đ", "Vị ngọt dịu, nước cốt dừa thơm và các loại topping giòn mềm vui miệng.", "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80"],
  ["bun-bo-hue", "Bún bò Huế", "main", "Món chính", "45.000đ", "Nước dùng đậm đà, thoảng mùi sả, ăn cùng thịt bò mềm và rau sống giòn tươi.", "https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=900&q=80"],
  ["goi-cuon", "Gỏi cuốn tôm thịt", "street", "Đường phố", "30.000đ", "Bánh tráng mỏng, rau thơm, bún tươi, tôm thịt và nước chấm đậu phộng béo nhẹ.", "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=900&q=80"],
  ["bun-cha", "Bún chả Hà Nội", "main", "Món chính", "40.000đ", "Thịt nướng than hoa, chả viên thơm, bún trắng và chén nước mắm chua ngọt hài hòa.", "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=900&q=80"],
  ["banh-flan", "Bánh flan caramel", "dessert", "Tráng miệng", "18.000đ", "Mềm mịn, thơm trứng sữa, phủ caramel hơi đắng nhẹ để vị ngọt không bị gắt.", "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80"],
  ["mi-quang", "Mì Quảng tôm thịt", "main", "Món chính", "42.000đ", "Sợi mì vàng mềm, nước dùng sánh nhẹ, ăn cùng bánh tráng mè và rau thơm miền Trung.", "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=900&q=80"],
  ["banh-xeo", "Bánh xèo giòn rụm", "street", "Đường phố", "35.000đ", "Vỏ bánh vàng thơm, nhân tôm thịt giá đỗ, cuốn rau sống và chấm nước mắm chua ngọt.", "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80"],
  ["chao-ga", "Cháo gà xé phay", "main", "Món chính", "30.000đ", "Cháo nấu nhừ, thịt gà mềm, thêm hành tiêu và rau răm cho vị ấm bụng, dễ ăn.", "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=900&q=80"],
  ["kem-dua", "Kem dừa non", "dessert", "Tráng miệng", "22.000đ", "Kem mát, thơm vị dừa, thêm đậu phộng rang và dừa sợi để kết thúc bữa ăn nhẹ nhàng.", "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80"]
].map(([id, name, category, tag, price, description, image]) => ({
  id,
  name,
  category,
  tag,
  price,
  description,
  image,
  alt: name
}));

const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav-toggle");
const dishGrid = document.querySelector(".dish-grid");
const searchInput = document.querySelector(".menu-search");
const searchResult = document.querySelector(".search-result");
const filters = document.querySelectorAll(".filter");
const bookingForm = document.querySelector(".booking-form");
const bookingMessage = document.querySelector(".booking-message");
const toast = document.querySelector(".toast");

let currentFilter = "all";
let currentSearch = "";

function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function getDishes() {
  try {
    const saved = JSON.parse(localStorage.getItem(DISHES_KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch {}

  localStorage.setItem(DISHES_KEY, JSON.stringify(defaultDishes));
  return defaultDishes;
}

function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || [];
  } catch {
    return [];
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function renderDishes() {
  const query = normalizeText(currentSearch.trim());
  const dishes = getDishes().filter((dish) => {
    const matchesCategory = currentFilter === "all" || dish.category === currentFilter;
    const text = normalizeText(`${dish.name} ${dish.tag} ${dish.description}`);
    return matchesCategory && text.includes(query);
  });

  if (!dishes.length) {
    dishGrid.innerHTML = '<p class="empty">Không tìm thấy món phù hợp. Bạn thử nhập từ khóa khác nhé.</p>';
    searchResult.textContent = "Không tìm thấy món phù hợp.";
    return;
  }

  searchResult.textContent = currentSearch.trim()
    ? `Tìm thấy ${dishes.length} món phù hợp.`
    : `Đang hiển thị ${dishes.length} món.`;

  dishGrid.innerHTML = dishes.map((dish) => `
    <article class="dish-card">
      <img src="${dish.image}" alt="${dish.alt}">
      <div class="dish-body">
        <span class="tag">${dish.tag}</span>
        <h3>${dish.name}</h3>
        <p>${dish.description}</p>
        <div class="dish-meta">
          <strong>${dish.price}</strong>
          <button class="favorite" type="button" aria-label="Yêu thích ${dish.name}">♡</button>
        </div>
      </div>
    </article>
  `).join("");
}

navToggle.addEventListener("click", () => nav.classList.toggle("open"));

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) nav.classList.remove("open");
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderDishes();
  });
});

searchInput.addEventListener("input", () => {
  currentSearch = searchInput.value;
  renderDishes();
});

dishGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".favorite");
  if (!button) return;

  const active = button.classList.toggle("active");
  button.textContent = active ? "♥" : "♡";
  showToast(active ? "Đã thêm vào món yêu thích." : "Đã bỏ khỏi món yêu thích.");
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const name = data.get("name") || "Bạn";
  const guests = data.get("guests");
  const session = data.get("session");
  const time = data.get("time");

  if (time < "09:00" || time > "22:00") {
    const warning = "Vui lòng chọn thời gian từ 09:00 sáng đến 22:00 tối.";
    bookingMessage.textContent = warning;
    showToast(warning);
    return;
  }

  const bookings = getBookings();
  bookings.unshift({
    id: Date.now().toString(),
    name,
    guests,
    session,
    time,
    createdAt: new Date().toLocaleString("vi-VN")
  });
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));

  const success = `${name}, yêu cầu đặt bàn ${guests} buổi ${session.toLowerCase()} lúc ${time} đã được ghi nhận.`;
  bookingMessage.textContent = success;
  showToast(success);
  bookingForm.reset();
});

renderDishes();
