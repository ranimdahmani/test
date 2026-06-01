
// ================= STORAGE KEYS =================
const USERS_KEY = "users";
const CURRENT_USER = "currentUser";
const ITEMS_KEY = "items";

// ================= HELPERS =================
function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getItems() {
  return JSON.parse(localStorage.getItem(ITEMS_KEY)) || [];
}

function saveItems(items) {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

function getUser() {
  return localStorage.getItem(CURRENT_USER);
}

// ================= AUTH =================
function signup() {
  const user = document.getElementById("authUser").value.trim();
  const pass = document.getElementById("authPass").value.trim();

  if (!user || !pass) return alert("Fill all fields");

  let users = getUsers();

  if (users[user]) return alert("User already exists");

  users[user] = { password: pass };
  saveUsers(users);

  alert("Account created successfully");
}

function login() {
  const user = document.getElementById("authUser").value.trim();
  const pass = document.getElementById("authPass").value.trim();

  let users = getUsers();

  if (!users[user] || users[user].password !== pass)
    return alert("Invalid credentials");

  localStorage.setItem(CURRENT_USER, user);

  alert("Login successful");

  showDashboard(); // 🔥 THIS WAS MISSING
}

function logout() {
  localStorage.removeItem(CURRENT_USER);
  location.reload();
}
function showDashboard() {
  const user = getUser();

  const auth = document.getElementById("authSection");
  const profile = document.getElementById("profileSection");

  if (!user) {
    auth.style.display = "block";
    profile.style.display = "none";
    return;
  }

  auth.style.display = "none";
  profile.style.display = "block";

  document.getElementById("profileName").innerText = "Welcome " + user;

  loadMyItems();
  loadMyPurchases();
}

// ================= SELL ITEM =================
function postItem() {
  const user = getUser();

  const type = document.getElementById("type").value;
  const price = document.getElementById("price").value;
  const imageInput = document.getElementById("image");

  if (!type || !price) return alert("Fill all fields");

  const save = (img) => {
    let items = getItems();

    items.push({
      id: Date.now(),
      type,
      price,
      image: img,
      owner: user,
      buyer: null
    });

    saveItems(items);

    alert("Item posted successfully!");
    window.location.href = "buy.html";
  };

  if (imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = () => save(reader.result);
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    save("");
  }
}

// ================= BUY PAGE =================
function loadItems() {
  const container = document.getElementById("myItems");
  if (!container) return;

  container.innerHTML = "";

  let items = getItems();

  items.forEach(item => {
    container.innerHTML += `
      <div class="card">
        ${item.image ? `<img src="${item.image}" width="80">` : ""}
        <p><b>${item.type}</b></p>
        <p>${item.price} DT</p>
        <p>Seller: ${item.owner}</p>

        ${item.buyer
          ? `<p style="color:red;">Sold</p>`
          : `<button onclick="buyItem(${item.id})">Buy</button>`
        }
      </div>
    `;
  });
}

// ================= BUY =================
function buyItem(id) {
  const user = getUser();
  let items = getItems();

  let item = items.find(i => i.id === id);

  if (!item || item.buyer) return alert("Already sold");

  item.buyer = user;

  saveItems(items);

  alert("Purchase successful!");
  loadItems();
}

// ================= PROFILE =================
function loadMyItems() {
  const user = getUser();
  const container = document.getElementById("mySellItems");
  if (!container) return;

  container.innerHTML = "";

  let items = getItems();

  items.forEach(item => {
    if (item.owner === user) {
      container.innerHTML += `
        <div class="card">
          <p>${item.type}</p>
          <p>${item.price} DT</p>

          ${item.buyer
            ? `<p style="color:red;">Sold</p>`
            : `<button onclick="deleteItem(${item.id})">Delete</button>`
          }
        </div>
      `;
    }
  });
}

function loadMyPurchases() {
  const user = getUser();
  const container = document.getElementById("myPurchases");
  if (!container) return;

  container.innerHTML = "";

  let items = getItems();

  items.forEach(item => {
    if (item.buyer === user) {
      container.innerHTML += `
        <div class="card">
          <p>${item.type}</p>
          <p>${item.price} DT</p>
        </div>
      `;
    }
  });
}

function deleteItem(id) {
  let items = getItems();
  items = items.filter(i => i.id !== id);
  saveItems(items);

  loadMyItems();
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("myItems")) loadItems();

  if (document.getElementById("mySellItems")) {
    loadMyItems();
    loadMyPurchases();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  showDashboard();
});



document.getElementById("reserveForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const classroom = document.getElementById("classroom").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  const reservation = {
    classroom,
    date,
    time,
    user: localStorage.getItem("currentUser") || "guest"
  };

  let reservations = JSON.parse(localStorage.getItem("reservations")) || [];
  reservations.push(reservation);

  localStorage.setItem("reservations", JSON.stringify(reservations));

  document.getElementById("message").innerText =
    "Reservation successful for " + classroom + " at " + time;

  this.reset();
});


document.getElementById("resForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const room = document.getElementById("room").value;
  const time = document.getElementById("time").value;

  let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

  // check if already booked
  let exists = reservations.find(r => r.room === room);

  if (exists) {
    document.getElementById("msg").innerText = "❌ Room not available!";
    return;
  }

  reservations.push({ room, time });
  localStorage.setItem("reservations", JSON.stringify(reservations));

  document.getElementById("msg").innerText = "✅ Reserved successfully!";
  this.reset();
});
document.getElementById("resForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const room = document.getElementById("room").value;
  const time = document.getElementById("time").value;

  let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

  // check if already booked
  let exists = reservations.find(r => r.room === room);

  if (exists) {
    alert("Room already reserved!");
    return;
  }

  reservations.push({ room, time });

  localStorage.setItem("reservations", JSON.stringify(reservations));

  alert("Reservation successful!");

  window.location.href = "study.html"; // go back to study page
});