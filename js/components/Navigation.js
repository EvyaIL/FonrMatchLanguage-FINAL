const navigationHTML = `
<div class="container">
    <a href="index.html" class="logo">
        <div class="logo-icon"><i class="fas fa-font"></i></div>
        <span class="en">Font Match</span>
        <span class="he">התאמת גופנים</span>
    </a>
    <nav>
        <div class="nav-links">
            <a href="about-us.html" class="nav-link"><span class="en">About</span><span class="he">אודות</span></a>
            <a href="index.html#font-showcase" class="nav-link"><span class="en">Fonts</span><span class="he">גופנים</span></a>
            <a href="contact-us.html" class="nav-link"><span class="en">Contact</span><span class="he">צור קשר</span></a>
        </div>
        
        <!-- Auth Buttons (shown when logged out) -->
        <div id="auth-buttons" class="auth-nav-buttons">
            <a href="login.html" class="btn btn-primary btn-sm">
                <span class="en">Login / Register</span>
                <span class="he">כניסה / הרשמה</span>
            </a>
        </div>
        
        <!-- User Menu (shown when logged in) -->
        <div id="user-menu" class="user-menu" style="display: none;">
            <div class="user-avatar">
                <i class="fas fa-user"></i>
            </div>
            <span id="username" class="username">User</span>
            <i class="fas fa-chevron-down"></i>
            
            <div class="dropdown-menu">
                <a href="dashboard.html" class="dropdown-item">
                    <i class="fas fa-tachometer-alt"></i>
                    <span class="en">Dashboard</span>
                    <span class="he">לוח בקרה</span>
                </a>
                <a href="dashboard.html?tab=favorites" class="dropdown-item">
                    <i class="fas fa-heart"></i>
                    <span class="en">My Favorites</span>
                    <span class="he">המועדפים שלי</span>
                </a>
                <a href="dashboard.html?tab=history" class="dropdown-item">
                    <i class="fas fa-history"></i>
                    <span class="en">Search History</span>
                    <span class="he">היסטורית חיפוש</span>
                </a>
                <a href="#" id="logout-btn" class="dropdown-item">
                    <i class="fas fa-sign-out-alt"></i>
                    <span class="en">Logout</span>
                    <span class="he">התנתק</span>
                </a>
            </div>
        </div>
        
        <div class="language-toggle">
            <button id="en-btn">EN</button>
            <button id="he-btn">עב</button>
        </div>
        <div class="theme-toggle">
            <input type="checkbox" id="theme-switch">
            <label for="theme-switch">
                <i class="fas fa-sun"></i>
                <i class="fas fa-moon"></i>
            </label>
        </div>
    </nav>
</div>
`;

const footerHTML = `
<div class="container">
    <div class="footer-content">
        <div class="footer-links">
            <a href="privacy-policy.html" class="en">Privacy Policy</a>
            <a href="privacy-policy.html" class="he">מדיניות פרטיות</a>
            <a href="terms-of-service.html" class="en">Terms of Service</a>
            <a href="terms-of-service.html" class="he">תנאי שירות</a>
        </div>
        <p class="en">© 2024 Font Match Language. All rights reserved.</p>
        <p class="he">© 2024 התאמת גופנים. כל הזכויות שמורות.</p>
    </div>
</div>
`;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('header').innerHTML = navigationHTML;
    const footer = document.querySelector('footer');
    if (footer) {
        footer.innerHTML = footerHTML;
    }

    // --- AUTH UI LOGIC --- //
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const usernameEl = document.getElementById('username');
    const userAvatar = userMenu.querySelector('.user-avatar');

    function updateAuthUI(event) {
        const user = event && event.detail ? event.detail.user : (window.authManager ? authManager.getUser() : null);

        if (user) {
            authButtons.style.display = 'none';
            userMenu.style.display = 'flex';
            
            // Use displayName or username, not email
            usernameEl.textContent = user.name || user.displayName || user.username || user.email.split('@')[0];
            
            // Use user.picture for profile image
            if (user.picture) {
                userAvatar.innerHTML = `<img src="${user.picture}" alt="User Avatar" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">`;
            } else {
                userAvatar.innerHTML = `<i class="fas fa-user"></i>`;
            }
        } else {
            authButtons.style.display = 'flex';
            userMenu.style.display = 'none';
        }
    }

    // Handle user menu dropdown toggle
    const dropdownMenu = userMenu.querySelector('.dropdown-menu');
    
    // Add click handler to user menu to toggle dropdown
    userMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });

    // Handle dropdown menu clicks
    const dropdownItems = userMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        if (item.id !== 'logout-btn') {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const href = item.getAttribute('href');
                if (href && href !== '#') {
                    window.location.href = href;
                }
            });
        }
    });

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.authManager) {
                authManager.logout();
            }
        });
    }

    // Listen for auth changes from auth.js
    document.addEventListener('auth-change', updateAuthUI);

    // Initial UI update
    if (window.authManager) {
        updateAuthUI({ detail: { user: window.authManager.getUser() } });
    }

    // --- THEME & LANGUAGE LOGIC --- //
    const body = document.body;
    const themeSwitch = document.getElementById('theme-switch');
    const enBtn = document.getElementById('en-btn');
    const heBtn = document.getElementById('he-btn');

    // Set initial theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        body.classList.add('dark-mode');
        if(themeSwitch) themeSwitch.checked = true;
    }

    // Theme toggle
    if(themeSwitch) {
        themeSwitch.addEventListener('change', function() {
            body.classList.toggle('dark-mode');
            localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
        });
    }

    // Set initial language
    const currentLang = localStorage.getItem('language') || 'en';
    setLanguage(currentLang);

    function setLanguage(lang) {
        body.classList.remove('active-lang-en', 'active-lang-he', 'rtl');
        body.classList.add(`active-lang-${lang}`);
        if (lang === 'he') {
            body.classList.add('rtl');
            if(heBtn) heBtn.classList.add('active');
            if(enBtn) enBtn.classList.remove('active');
        } else {
            if(enBtn) enBtn.classList.add('active');
            if(heBtn) heBtn.classList.remove('active');
        }
        localStorage.setItem('language', lang);
        document.dispatchEvent(new CustomEvent('language-change', { detail: { lang: lang } }));
    }

    if(enBtn) enBtn.addEventListener('click', () => setLanguage('en'));
    if(heBtn) heBtn.addEventListener('click', () => setLanguage('he'));
});
