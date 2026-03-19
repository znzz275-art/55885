// Firebase Configuration (Replace with YOUR details)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// UI Elements
const newsGrid = document.getElementById('newsGrid');
const loader = document.getElementById('loader');

// Hide Loader when page ready
window.addEventListener('load', () => {
    if(loader) loader.style.display = 'none';
});

// Fetch Articles for Homepage
if (newsGrid) {
    db.collection("articles").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
        newsGrid.innerHTML = '';
        snapshot.forEach((doc) => {
            const post = doc.data();
            newsGrid.innerHTML += `
                <div class="news-card">
                    <img src="${post.imageUrl || 'https://via.placeholder.com/400x200'}" alt="News">
                    <div class="card-content">
                        <h3>${post.title}</h3>
                        <div class="card-meta">
                            <span><i class="far fa-user"></i> ${post.author}</span>
                            <span><i class="far fa-calendar"></i> ${new Date(post.timestamp?.toDate()).toLocaleDateString('ar-EG')}</span>
                        </div>
                        <br>
                        <a href="article.html?id=${doc.id}" class="btn-read">اقرأ المزيد</a>
                    </div>
                </div>
            `;
        });
    });
}

// Search Logic
const searchInput = document.getElementById('searchInput');
if(searchInput) {
    searchInput.addEventListener('keyup', (e) => {
        let term = e.target.value.toLowerCase();
        let cards = document.querySelectorAll('.news-card');
        cards.forEach(card => {
            let title = card.querySelector('h3').innerText.toLowerCase();
            card.style.display = title.includes(term) ? 'block' : 'none';
        });
    });
}

// Authentication Check
auth.onAuthStateChanged(user => {
    const authBtn = document.getElementById('authBtn');
    const dashLink = document.getElementById('dashLink');
    if (user) {
        if(authBtn) authBtn.innerText = 'تسجيل خروج';
        if(authBtn) authBtn.onclick = () => auth.signOut();
    } else {
        if(dashLink) dashLink.style.display = 'none';
    }
});