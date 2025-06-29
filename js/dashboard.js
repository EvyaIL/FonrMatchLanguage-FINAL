// --- DASHBOARD SCRIPT --- //

let currentUser = null;
let currentLanguage = 'en';

document.addEventListener('DOMContentLoaded', () => {
    // Listen for auth-change to get user data
    document.addEventListener('auth-change', (e) => {
        currentUser = e.detail.user;
        if (currentUser) {
            populateUserData(currentUser);
            // Once user is available, we can fetch their data
            fetchAndDisplayFontMatches(); 
        } else {
            // Handle logged out state, maybe show a message or redirect
            console.log("User is not logged in. Dashboard cannot be displayed.");
            // You might want to redirect to login page here
            // window.location.href = '/login.html';
        }
    });

    // Listen for language changes
    document.addEventListener('language-change', (e) => {
        currentLanguage = e.detail.language;
        // Re-fetch or re-format data that depends on language
        if(currentUser) {
            fetchAndDisplayFontMatches(); 
        }
    });

    // Initialize dashboard UI elements
    setupDashboardUI();
});

function setupDashboardUI() {
    const navItems = document.querySelectorAll('.dashboard-nav .nav-item');
    const tabs = document.querySelectorAll('.dashboard-tab');

    navItems.forEach(navItem => {
        navItem.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = navItem.getAttribute('data-tab');

            // Update active nav item
            navItems.forEach(item => item.classList.remove('active'));
            navItem.classList.add('active');

            // Show the selected tab and hide others
            tabs.forEach(tab => {
                if (tab.id === tabId) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });

            // Load content for the tab if needed (optional)
            // loadTabContent(tabId);
        });
    });

    // Set default tab to be visible
    const defaultTab = document.querySelector('.dashboard-tab.active');
    if (!defaultTab) {
        document.getElementById('overview').classList.add('active');
    }
}

function loadTabContent(tabId) {
    switch (tabId) {
        case 'overview':
            // Fetched when auth state is known
            fetchAndDisplayFontMatches('/api/font-matches', document.getElementById('overview'));
            break;
        case 'favorites':
            fetchAndDisplayFontMatches('/api/font-matches/favorites', document.getElementById('favorites'), "You have no favorite font matches.");
            break;
        case 'history':
            fetchAndDisplayFontMatches('/api/font-matches/history', document.getElementById('history'), "You have no font match history.");
            break;
        case 'settings':
            renderSettingsTab();
            break;
    }
}

function populateUserData(user) {
    if (!user) return;

    // --- Sidebar Profile Elements ---
    const profileNameEl = document.getElementById('profile-name');
    const profileEmailEl = document.getElementById('profile-email');
    const profileAvatarImgEl = document.getElementById('profile-avatar-img');

    // --- Overview Tab Elements ---
    const overviewWelcomeEn = document.querySelector('#overview .tab-header p.en');
    const overviewWelcomeHe = document.querySelector('#overview .tab-header p.he');
    const memberSinceEl = document.getElementById('stats-member-since');

    // --- Settings Tab Elements ---
    const settingsUsernameEl = document.getElementById('username-setting');
    const settingsEmailEl = document.getElementById('email-setting');

    // --- Populate Sidebar ---
    if (profileNameEl) {
        profileNameEl.textContent = user.name || 'User';
    }
    if (profileEmailEl) {
        profileEmailEl.textContent = user.email || 'No email provided';
    }
    if (profileAvatarImgEl) {
        profileAvatarImgEl.src = user.picture || 'https://via.placeholder.com/80';
        profileAvatarImgEl.onerror = () => { 
            profileAvatarImgEl.src = 'https://via.placeholder.com/80'; 
            console.warn('Failed to load user profile image from:', user.picture);
        };
    }

    // --- Populate Overview Tab ---
    if (overviewWelcomeEn) {
        overviewWelcomeEn.textContent = `Welcome back, ${user.name || 'User'}! Here's a summary of your activity.`;
    }
    if (overviewWelcomeHe) {
        overviewWelcomeHe.textContent = `ברוך שובך, ${user.name || 'משתמש'}! הנה סיכום הפעילות שלך.`;
    }
    if (memberSinceEl && user.createdAt) {
        memberSinceEl.textContent = new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
    }

    // --- Populate Settings Tab ---
    if (settingsUsernameEl) {
        settingsUsernameEl.value = user.name || '';
    }
    if (settingsEmailEl) {
        settingsEmailEl.value = user.email || '';
    }
}

async function fetchAndDisplayFontMatches(apiUrl, containerElement, emptyMessage = "You have no recent font matches.") {
    if (!currentUser) return;

    containerElement.innerHTML = '<div class="loader"></div>'; // Show loader

    try {
        const response = await fetch(apiUrl, {
             headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const matches = await response.json();
        displayFontMatches(matches, containerElement, emptyMessage);
    } catch (error) {
        console.error(`Could not fetch font matches from ${apiUrl}:`, error);
        containerElement.innerHTML = `<p>Could not load your font matches. Please try again later.</p>`;
    }
}

function displayFontMatches(matches, containerElement, emptyMessage) {
    if (!matches || matches.length === 0) {
        containerElement.innerHTML = `<p>${emptyMessage}</p>`;
        return;
    }

    const list = document.createElement('ul');
    list.className = 'font-match-list';

    matches.forEach(match => {
        const item = document.createElement('li');
        const date = new Date(match.createdAt).toLocaleDateString(currentLanguage, {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        item.innerHTML = `
            <div class="match-info">
                <span class="match-date">${date}</span>
                <span class="match-font">${match.font1} & ${match.font2}</span>
            </div>
            <div class="match-actions">
                 <button class="btn-favorite ${match.isFavorite ? 'active' : ''}" data-match-id="${match.id}">${match.isFavorite ? 'Favorited' : 'Favorite'}</button>
            </div>
        `;
        list.appendChild(item);
    });

    containerElement.innerHTML = ''; // Clear previous content
    containerElement.appendChild(list);

    // Add event listeners for favorite buttons
    containerElement.querySelectorAll('.btn-favorite').forEach(button => {
        button.addEventListener('click', handleFavoriteClick);
    });
}

async function handleFavoriteClick(event) {
    const button = event.target;
    const matchId = button.dataset.matchId;
    const isFavorited = button.classList.contains('active');

    try {
        const response = await fetch(`/api/font-matches/${matchId}/favorite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ favorite: !isFavorited })
        });

        if (!response.ok) {
            throw new Error('Failed to update favorite status');
        }

        const updatedMatch = await response.json();

        // Update button state
        button.classList.toggle('active');
        button.textContent = updatedMatch.isFavorite ? 'Favorited' : 'Favorite';

    } catch (error) {
        console.error('Error updating favorite status:', error);
        alert('Could not update favorite status. Please try again.');
    }
}

function renderSettingsTab() {
    const settingsContent = document.getElementById('settings');
    settingsContent.innerHTML = `
        <h2>Settings</h2>
        <div class="settings-section">
            <h3>Profile</h3>
            <p><strong>Name:</strong> ${currentUser.name}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
        </div>
        <div class="settings-section">
            <h3>Theme</h3>
            <p>Toggle between light and dark mode in the navigation bar.</p>
        </div>
        <div class="settings-section">
            <h3>Language</h3>
            <p>Switch between supported languages in the navigation bar.</p>
        </div>
         <div class="settings-section">
            <h3>Account</h3>
            <button id="delete-account-btn" class="btn-danger">Delete Account</button>
        </div>
    `;

    document.getElementById('delete-account-btn').addEventListener('click', handleDeleteAccount);
}

async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch('/api/v1/auth/delete-account', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });

        if (response.ok) {
            alert('Account deleted successfully.');
            // Log the user out and redirect to homepage
            authManager.logout();
            window.location.href = '/';
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete account');
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        alert(`Error: ${error.message}`);
    }
}
