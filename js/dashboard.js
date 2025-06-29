// --- DASHBOARD SCRIPT --- //

let currentUser = null;
let currentLanguage = 'en';

document.addEventListener('DOMContentLoaded', () => {
    // Listen for auth-change to get user data
    document.addEventListener('auth-change', (e) => {
        currentUser = e.detail.user;
        console.log('Dashboard received auth-change event with user:', currentUser);
        if (currentUser) {
            console.log('User properties:', {
                name: currentUser.name,
                displayName: currentUser.displayName,
                username: currentUser.username,
                email: currentUser.email,
                picture: currentUser.picture
            });
            populateUserData(currentUser);
            // Once user is available, we can fetch their data
            fetchAndDisplayFontMatches(); 
            // Initialize dashboard stats
            loadDashboardStats();
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

            // Load content for the tab
            loadTabContent(tabId);
        });
    });

    // Set default tab to be visible
    const defaultTab = document.querySelector('.dashboard-tab.active');
    if (!defaultTab) {
        document.getElementById('overview').classList.add('active');
    }

    // Handle URL parameters for direct tab navigation
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab');
    if (initialTab) {
        // Wait for DOM to be ready, then switch to the specified tab
        setTimeout(() => {
            const tabButton = document.querySelector(`[data-tab="${initialTab}"]`);
            if (tabButton) {
                tabButton.click();
            }
        }, 100);
    }
}

function loadTabContent(tabId) {
    console.log('Loading tab content for:', tabId);
    
    switch (tabId) {
        case 'overview':
            // Fetched when auth state is known
            const recentActivityEl = document.getElementById('recent-activity-list');
            console.log('Recent activity element:', recentActivityEl);
            if (recentActivityEl) {
                fetchAndDisplayFontMatches('/api/v1/fontmatches', recentActivityEl);
            }
            break;
        case 'font-matches':
            const favoritesEl = document.getElementById('favorite-pairs-list');
            console.log('Favorites element:', favoritesEl);
            if (favoritesEl) {
                fetchAndDisplayFontMatches('/api/v1/fontmatches/favorites', favoritesEl, "You have no favorite font matches.");
            }
            break;
        case 'history':
            const historyEl = document.getElementById('search-history-list');
            console.log('History element:', historyEl);
            if (historyEl) {
                fetchAndDisplayFontMatches('/api/v1/fontmatches', historyEl, "You have no font match history.");
            }
            break;
        case 'settings':
            renderSettingsTab();
            break;
    }
}

function populateUserData(user) {
    if (!user) {
        console.warn('No user data provided to populateUserData');
        return;
    }

    console.log('Populating user data:', user);

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

    // Determine the user's display name with fallback priority
    const displayName = user.name || user.displayName || user.username || user.email?.split('@')[0] || 'User';
    
    console.log('Using display name:', displayName);

    // --- Populate Sidebar ---
    if (profileNameEl) {
        profileNameEl.textContent = displayName;
        console.log('Set profile name to:', displayName);
    } else {
        console.warn('Profile name element not found');
    }
    
    if (profileEmailEl) {
        profileEmailEl.textContent = user.email || 'No email provided';
        console.log('Set profile email to:', user.email);
    } else {
        console.warn('Profile email element not found');
    }
    
    if (profileAvatarImgEl) {
        profileAvatarImgEl.src = user.picture || 'https://via.placeholder.com/80';
        profileAvatarImgEl.onerror = () => { 
            profileAvatarImgEl.src = 'https://via.placeholder.com/80'; 
            console.warn('Failed to load user profile image from:', user.picture);
        };
        console.log('Set profile avatar to:', user.picture || 'placeholder');
    } else {
        console.warn('Profile avatar element not found');
    }

    // --- Populate Overview Tab ---
    if (overviewWelcomeEn) {
        overviewWelcomeEn.textContent = `Welcome back, ${displayName}! Here's a summary of your activity.`;
    }
    if (overviewWelcomeHe) {
        overviewWelcomeHe.textContent = `ברוך שובך, ${displayName}! הנה סיכום הפעילות שלך.`;
    }
    if (memberSinceEl && user.createdAt) {
        const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
        memberSinceEl.textContent = memberSince;
        console.log('Set member since to:', memberSince);
    } else if (memberSinceEl) {
        memberSinceEl.textContent = 'June 2025'; // Fallback
    }

    // --- Populate Settings Tab ---
    if (settingsUsernameEl) {
        settingsUsernameEl.value = displayName;
    }
    if (settingsEmailEl) {
        settingsEmailEl.value = user.email || '';
    }
}

async function fetchAndDisplayFontMatches(apiUrl, containerElement, emptyMessage = "You have no recent font matches.") {
    if (!currentUser) {
        console.log('No current user, cannot fetch font matches');
        return;
    }

    console.log('Fetching font matches from:', apiUrl);
    console.log('Container element:', containerElement);
    
    if (!containerElement) {
        console.error('Container element not found');
        return;
    }

    containerElement.innerHTML = '<div class="loader">Loading...</div>'; // Show loader

    try {
        const response = await fetch(apiUrl, {
             headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Fetched data:', result);
        
        displayFontMatches(result, containerElement, emptyMessage);
    } catch (error) {
        console.error(`Could not fetch font matches from ${apiUrl}:`, error);
        containerElement.innerHTML = `<p>Could not load your font matches. Please try again later.</p>`;
    }
}

function displayFontMatches(response, containerElement, emptyMessage) {
    console.log('Displaying font matches:', response);
    
    const matches = response.data || [];
    
    console.log('Matches array:', matches);
    console.log('Matches count:', matches.length);
    
    if (!matches || matches.length === 0) {
        console.log('No matches found, showing empty message');
        containerElement.innerHTML = `<p>${emptyMessage}</p>`;
        return;
    }

    const list = document.createElement('ul');
    list.className = 'font-match-list';

    matches.forEach(match => {
        console.log('Processing match:', match);
        
        const item = document.createElement('li');
        const date = new Date(match.createdAt).toLocaleDateString(currentLanguage === 'he' ? 'he-IL' : 'en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        item.innerHTML = `
            <div class="match-info">
                <span class="match-date">${date}</span>
                <span class="match-fonts">${match.sourceFont} → ${match.targetFont}</span>
                <span class="match-languages">${match.sourceLanguage.toUpperCase()} → ${match.targetLanguage.toUpperCase()}</span>
                <span class="match-score">Match: ${match.matchScore || 85}%</span>
            </div>
            <div class="match-preview">
                <div class="source-preview" style="font-family: '${match.sourceFont}'">${match.sourceText || 'Sample text'}</div>
                <div class="target-preview" style="font-family: '${match.targetFont}'">${match.targetText || 'Sample text'}</div>
            </div>
            <div class="match-actions">
                <button class="btn-favorite ${match.isFavorite ? 'active' : ''}" data-match-id="${match._id}">
                    <i class="fas fa-heart"></i>
                    ${match.isFavorite ? 'Favorited' : 'Favorite'}
                </button>
                <button class="btn-delete" data-match-id="${match._id}">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
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
    
    // Add event listeners for delete buttons
    containerElement.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', handleDeleteClick);
    });
    
    console.log('Font matches displayed successfully');
}

async function handleFavoriteClick(event) {
    const button = event.target.closest('.btn-favorite');
    const matchId = button.dataset.matchId;
    const isFavorited = button.classList.contains('active');

    try {
        const response = await fetch(`/api/v1/fontmatches/${matchId}/favorite`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });

        if (!response.ok) {
            throw new Error('Failed to update favorite status');
        }

        const result = await response.json();
        const updatedMatch = result.data;

        // Update button state
        button.classList.toggle('active');
        button.innerHTML = `
            <i class="fas fa-heart"></i>
            ${updatedMatch.isFavorite ? 'Favorited' : 'Favorite'}
        `;

        // Update favorites count in overview if visible
        updateFavoritesCount();

    } catch (error) {
        console.error('Error updating favorite status:', error);
        alert('Could not update favorite status. Please try again.');
    }
}

async function handleDeleteClick(event) {
    const button = event.target.closest('.btn-delete');
    const matchId = button.dataset.matchId;
    
    if (!confirm('Are you sure you want to delete this font match?')) {
        return;
    }

    try {
        const response = await fetch(`/api/v1/fontmatches/${matchId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete font match');
        }

        // Remove the item from the list
        const listItem = button.closest('li');
        listItem.remove();
        
        // Update counts
        updateFavoritesCount();

    } catch (error) {
        console.error('Error deleting font match:', error);
        alert('Could not delete font match. Please try again.');
    }
}

async function updateFavoritesCount() {
    try {
        const response = await fetch('/api/v1/fontmatches/favorites', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            const count = result.count || 0;
            const favoritesCountEl = document.getElementById('stats-favorites');
            if (favoritesCountEl) {
                favoritesCountEl.textContent = count;
            }
        }
    } catch (error) {
        console.error('Error updating favorites count:', error);
    }
}

function renderSettingsTab() {
    if (!currentUser) {
        console.warn('No current user data available for settings tab');
        return;
    }

    // Use the same display name logic as populateUserData
    const displayName = currentUser.name || currentUser.displayName || currentUser.username || currentUser.email?.split('@')[0] || 'User';
    const email = currentUser.email || 'No email provided';

    const settingsContent = document.getElementById('settings');
    settingsContent.innerHTML = `
        <h2>Settings</h2>
        <div class="settings-section">
            <h3>Profile</h3>
            <p><strong>Name:</strong> ${displayName}</p>
            <p><strong>Email:</strong> ${email}</p>
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

// --- DASHBOARD STATS --- //

async function loadDashboardStats() {
    try {
        // Load favorites count
        const favoritesResponse = await fetch('/api/v1/fontmatches/favorites', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        
        if (favoritesResponse.ok) {
            const favoritesResult = await favoritesResponse.json();
            const favoritesCount = favoritesResult.count || 0;
            const favoritesEl = document.getElementById('stats-favorites');
            if (favoritesEl) {
                favoritesEl.textContent = favoritesCount;
            }
        }
        
        // Load total searches count
        const allMatchesResponse = await fetch('/api/v1/fontmatches', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        
        if (allMatchesResponse.ok) {
            const allMatchesResult = await allMatchesResponse.json();
            const totalCount = allMatchesResult.count || 0;
            const searchesEl = document.getElementById('stats-searches');
            if (searchesEl) {
                searchesEl.textContent = totalCount;
            }
        }
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}
