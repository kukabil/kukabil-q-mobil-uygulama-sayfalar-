// --------------------
// 1️⃣ Supabase Bağlantısı
// --------------------
const supabaseUrl = 'https://wcnkjhmlrwevbfxrxlqh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjbmtqaG1scndldmJmeHJ4bHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5Mzg3NzgsImV4cCI6MjA3MzUxNDc3OH0.JBP5VPxZomuL0r12Yx4rLzmvpMTfZr8bMj9dc1iWuhY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// --------------------
// 2️⃣ Local Başlangıç Yazıları
// --------------------
let localPosts = [
  {
    id: 1,
    title: "Evrim Nedir?",
    category: "Evrim",
    date: "2025-09-15",
    content: "Evrim, canlıların zaman içinde değişim sürecidir...",
    author: "Admin",
    featured: true
  },
  {
    id: 2,
    title: "CRISPR ve Gen Düzenleme",
    category: "Genetik",
    date: "2025-09-16",
    content: "CRISPR teknolojisi, genetik değişiklikleri kolaylaştırıyor...",
    author: "Admin",
    featured: false
  }
];

// --------------------
// 3️⃣ Küfür / Hakaret Filtresi
// --------------------
const bannedWords = ["küfür1", "hakaret1"];
function containsBannedWords(text) {
    const lowerText = text.toLowerCase();
    return bannedWords.some(word => lowerText.includes(word));
}

// --------------------
// 4️⃣ Yazıları Render Etme Fonksiyonu
// --------------------
function renderPosts(postsArray) {
    const container = document.getElementById('posts-container');
    if(!container) return; // container yoksa dur
    container.innerHTML = '';
    postsArray.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p><em>${post.date}</em> | <strong>${post.category}</strong> | Yazar: ${post.author}</p>
            <p>${post.content.substring(0,150)}...</p>
        `;
        container.appendChild(postElement);
    });
}

// --------------------
// 5️⃣ Supabase’den Yazıları Çekme
// --------------------
async function loadPosts() {
    const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('date', { ascending: false });

    if(error){
        console.error("Supabase Hatası:", error);
        renderPosts(localPosts);
        return;
    }

    // 2 ay filtresi
    const today = new Date();
    const filteredPosts = posts.filter(post => {
        const postDate = new Date(post.date);
        const diffDays = (today - postDate) / (1000*60*60*24);
        return diffDays <= 60;
    });

    renderPosts(filteredPosts.length ? filteredPosts : localPosts);
}

// --------------------
// 6️⃣ Menü Filtreleme
// --------------------
document.querySelectorAll('#menu a').forEach(link => {
    link.addEventListener('click', function(e){
        e.preventDefault();
        const category = this.dataset.category;
        if(category === 'all') loadPosts();
        else loadPostsFiltered(category);
    });
});

async function loadPostsFiltered(category){
    const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .eq('category', category)
        .order('date', { ascending: false });

    if(error){
        console.error("Supabase Hatası:", error);
        renderPosts(localPosts.filter(p => p.category === category));
        return;
    }

    const today = new Date();
    const filteredPosts = posts.filter(post => {
        const postDate = new Date(post.date);
        const diffDays = (today - postDate) / (1000*60*60*24);
        return diffDays <= 60;
    });

    renderPosts(filteredPosts.length ? filteredPosts : localPosts.filter(p => p.category === category));
}

// --------------------
// 7️⃣ Kullanıcı Yazısı Ekleme
// --------------------
document.addEventListener('DOMContentLoaded', () => {
  const postForm = document.getElementById('postForm');
  if(postForm){
    postForm.addEventListener('submit', async function(e){
      e.preventDefault();

      const title = document.getElementById('title').value;
      const category = document.getElementById('category').value;
      const content = document.getElementById('content').value;
      const author = document.getElementById('author').value;

      if(containsBannedWords(title) || containsBannedWords(content)) {
          document.getElementById('form-msg').textContent = "Küfür veya hakaret içeren yazılar eklenemez!";
          return;
      }

      const newPostLocal = {
          id: Date.now(),
          title,
          category,
          content,
          author,
          date: new Date().toISOString().split('T')[0],
          featured: false
      };
      localPosts.push(newPostLocal);

      const { data, error } = await supabase
          .from('posts')
          .insert([{ title, category, content, author, featured: false }]);

      if(error){
          console.error("Supabase Hatası:", error);
          document.getElementById('form-msg').textContent = "Yazı local olarak eklendi, Supabase hata verdi.";
      } else {
          document.getElementById('form-msg').textContent = "Yazınız başarıyla eklendi!";
      }

      this.reset();
      loadPosts();
    });
  }
});

// --------------------
// 8️⃣ Ekranlar ve geçişler
// --------------------
const welcomeScreen = document.getElementById("welcome-screen");
const loginScreen = document.getElementById("login-screen");
const signupScreen = document.getElementById("signup-screen");
const homeScreen = document.getElementById("home-screen");

function showLogin(){ welcomeScreen.classList.remove("active"); loginScreen.classList.add("active"); }
function showSignup(){ welcomeScreen.classList.remove("active"); signupScreen.classList.add("active"); }
function backToWelcome(){ loginScreen.classList.remove("active"); signupScreen.classList.remove("active"); welcomeScreen.classList.add("active"); }
function enterWithoutLogin(){ welcomeScreen.classList.remove("active"); homeScreen.classList.add("active"); }
function loginUser(){ loginScreen.classList.remove("active"); homeScreen.classList.add("active"); }
function signupUser(){ signupScreen.classList.remove("active"); homeScreen.classList.add("active"); }
showWelcomeMessage();
loadNews(); // ^ sayfasına haberleri getir
