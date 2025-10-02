// === Hoşgeldin mesajı ===
setTimeout(() => {
  const msg = document.getElementById("welcome-msg");
  if (msg) msg.style.display = "none";
}, 2000);

// Ana container doğru seçilmeli
const mainContent = document.getElementById("mainContent"); // HTML ile birebir eşleşmeli

// === Hamburger menü ===
const menuToggle = document.getElementById("menu-toggle");
const sideMenu = document.getElementById("sideMenu");

menuToggle.addEventListener("click", () => {
  sideMenu.classList.toggle("open");
});

// Yan menü linkleri
document.querySelectorAll("#sideMenu a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // sayfa reload engelle
    sideMenu.classList.remove("open");
    const target = link.getAttribute("data-target");
    if (!target) return;
    if (target === "logout") window.location.href = "index.html";
    else showPage(target);
  });
});

// === Sayfa geçiş fonksiyonu ===
function hideAllPages() {
  mainContent.innerHTML = "";
}

function showPage(pageId) {
  hideAllPages();
  switch(pageId){
    case "page1": // Haberler
      mainContent.innerHTML = `<h2>Haberler</h2><div id="new-container"></div>`;
      settingsIcon.style.display = "none";
      loadNews();
      break;
    case "page2": // Güncel Bilimler / Bilgiler
      mainContent.innerHTML = `<h2>Güncel Bilimler / Bilgiler</h2><div id="explore-container"></div>`;
      settingsIcon.style.display = "none";
      initPostForm();
      break;
    case "page3": // Kategoriler
      mainContent.innerHTML = `<h2>Kategoriler</h2><p>Kategoriler listesi buraya gelecek.</p>`;
      settingsIcon.style.display = "none";
      break;
    case "notdefteri": // Not Defteri
  window.location.href = "notdefteri.html"; // ayrı sayfaya yönlendir
  break;
  }
}

// === Alt menü butonları ===
document.getElementById('page1-btn').addEventListener('click', () => showPage('page1'));
document.getElementById('home-btn').addEventListener('click', () => showPage('page2'));
document.getElementById('add-btn').addEventListener('click', () => showPage('page2'));
document.getElementById('user-btn').addEventListener('click', () => showPage('page4'));
document.getElementById('btn-page4').addEventListener('click', ()=>{
    // Yeni pencere/siyah ekran aç
    const win = window.open("", "_blank");
    win.document.body.style.backgroundColor = "#111";
    win.document.body.style.margin = "0";
    
    // Sağ üst ayarlar simgesi
    const settingsBtn = win.document.createElement("button");
    settingsBtn.textContent = "⚙️";
    settingsBtn.style.position = "fixed";
    settingsBtn.style.top = "10px";
    settingsBtn.style.right = "10px";
    settingsBtn.style.fontSize = "1.5rem";
    settingsBtn.style.background = "none";
    settingsBtn.style.border = "none";
    settingsBtn.style.color = "white";
    settingsBtn.style.cursor = "pointer";
    settingsBtn.addEventListener("click", ()=> {
        win.location.href = "sayfa5.html";
    });
    win.document.body.appendChild(settingsBtn);

    // Orta yazı
    const h1 = win.document.createElement("h1");
    h1.textContent = "Siyah Ekran";
    h1.style.color = "white";
    h1.style.textAlign = "center";
    h1.style.marginTop = "20%";
    win.document.body.appendChild(h1);
});


// Post formu oluşturup event listener ekleme
function initPostForm() {
  const exploreContainer = document.getElementById("explore-container");
  if (!exploreContainer) return;

  // Eğer form zaten varsa tekrar ekleme
  if (!document.getElementById("postForm")) {
    const postForm = document.createElement("form");
    postForm.id = "postForm";
    postForm.innerHTML = `
      <input type="text" placeholder="Başlık" required><br>
      <textarea placeholder="İçerik" rows="5" required></textarea><br>
      <select required>
        <option value="">Kategori Seçiniz</option>
        <option value="bilim">Bilim</option>
        <option value="teknoloji">Teknoloji</option>
        <option value="sanat">Sanat</option>
        <option value="diğer">Diğer</option>
      </select>
      <br>
      <button type="submit">Paylaş</button>
    `;
    exploreContainer.appendChild(postForm);

    postForm.addEventListener("submit", function(e){
      e.preventDefault();
      const title = postForm.querySelector("input").value;
      const content = postForm.querySelector("textarea").value;
      const category = postForm.querySelector("select").value;

      const postHTML = `
        <div class="user-post">
          <h3>${title}</h3>
          <p>${content}</p>
          <small>Kategori: ${category}</small>
        </div>
      `;
      exploreContainer.innerHTML += postHTML;

      // LocalStorage
      let userPosts = JSON.parse(localStorage.getItem("userPosts") || "[]");
      userPosts.unshift({title, content, category});
      localStorage.setItem("userPosts", JSON.stringify(userPosts));

      postForm.reset();
    });
  }
}


    // LocalStorage
    let userPosts = JSON.parse(localStorage.getItem("userPosts") || "[]");
    userPosts.unshift({title, content, category});
    localStorage.setItem("userPosts", JSON.stringify(userPosts));

    postForm.reset();


// === Haberleri API’den çekme ===
let newsData = {};
async function loadNews() {
  const newsContainer = document.getElementById("new-container");
  if(!newsContainer) return;
  newsContainer.innerHTML = "Yükleniyor...";

  try {
    const response = await fetch("https://api.spaceflightnewsapi.net/v3/articles?_limit=10");
    const data = await response.json();
    newsContainer.innerHTML = "";

    data.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "news-card";
      card.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.summary.slice(0, 100)}...</p>
        <button onclick="showModal(${index})">Habere Git</button>
      `;
      newsContainer.appendChild(card);

      newsData[index] = {
        title: item.title,
        content: item.summary,
        url: item.url
      };
    });
  } catch(err) {
    newsContainer.innerHTML = "Haberler yüklenemedi.";
    console.error(err);
  }
}

// === Modal açma/kapatma ===
function showModal(id) {
  const modal = document.getElementById("news-modal");
  document.getElementById("modal-title").textContent = newsData[id].title;
  document.getElementById("modal-content").textContent = newsData[id].content;
  document.getElementById("modal-link").href = newsData[id].url;
  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("news-modal").style.display = "none";
}

window.onclick = function(event) {
  const modal = document.getElementById("news-modal");
  if(event.target === modal) modal.style.display = "none";
}

// === Not Defteri ===
function openNotebook() {
  hideAllPages();
  mainContent.innerHTML = `
    <h2>Not Defteri</h2>
    <textarea id="notepad" rows="10" placeholder="Notlarını buraya yaz..."></textarea><br>
    <button id="saveNote">Kaydet</button>
    <button id="clearNote">Temizle</button>
    <p>Notlar cihazında saklanır (localStorage).</p>
  `;

  const notepad = document.getElementById("notepad");
  const savedNote = localStorage.getItem("userNote");
  if(savedNote) notepad.value = savedNote;

  document.getElementById("saveNote").addEventListener("click", () => {
    localStorage.setItem("userNote", notepad.value);
    alert("Not kaydedildi!");
  });

  document.getElementById("clearNote").addEventListener("click", () => {
    notepad.value = "";
    localStorage.removeItem("userNote");
  });

}

const kategoriBtn = document.getElementById('kategori-btn');
const kategoriSubmenu = document.getElementById('kategori-submenu');

kategoriBtn.addEventListener('click', () => {
  if(kategoriSubmenu.style.maxHeight){
    kategoriSubmenu.style.maxHeight = null;
  } else {
    kategoriSubmenu.style.maxHeight = kategoriSubmenu.scrollHeight + "px";
  }
});
