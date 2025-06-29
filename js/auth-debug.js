// Auth debugging utilities
(function() {
    // Function to display debug info on the page
    window.showAuthDebug = function() {
        // Create or get the debug container
        let debugContainer = document.getElementById('auth-debug');
        if (!debugContainer) {
            debugContainer = document.createElement('div');
            debugContainer.id = 'auth-debug';
            debugContainer.style.cssText = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                max-width: 400px;
                max-height: 300px;
                overflow: auto;
                z-index: 9999;
            `;
            document.body.appendChild(debugContainer);
        }
        
        // Get auth state
        const token = localStorage.getItem('token') ? 'Present' : 'Missing';
        const localUser = localStorage.getItem('user');
        let userObj = null;
        try {
            userObj = localUser ? JSON.parse(localUser) : null;
        } catch (e) {
            console.error('Error parsing user data', e);
        }
        
        // Get authManager state
        const authManager = window.authManager;
        const authUserObj = authManager ? authManager.getUser() : null;
        
        // Check UI state
        const loginBtn = document.querySelector('a[href="login.html"]') || 
                        document.querySelector('.btn-primary:contains("Login")');
        const userMenu = document.getElementById('user-menu');
        const authButtons = document.getElementById('auth-buttons');
        
        // Build debug HTML
        let html = `
            <h3>Auth Debug Info</h3>
            <p><strong>Token:</strong> ${token}</p>
            <p><strong>Local User:</strong> ${userObj ? 'Present' : 'Missing'}</p>
            <p><strong>AuthManager User:</strong> ${authUserObj ? 'Present' : 'Missing'}</p>
            
            <details>
                <summary>UI State</summary>
                <p>Login button: ${loginBtn ? (loginBtn.style.display === 'none' ? 'Hidden' : 'Visible') : 'Not found'}</p>
                <p>User menu: ${userMenu ? (userMenu.style.display === 'none' ? 'Hidden' : 'Visible') : 'Not found'}</p>
                <p>Auth buttons: ${authButtons ? (authButtons.style.display === 'none' ? 'Hidden' : 'Visible') : 'Not found'}</p>
            </details>
            
            <details>
                <summary>Local User Data</summary>
                <pre>${userObj ? JSON.stringify(userObj, null, 2) : 'None'}</pre>
            </details>
            
            <details>
                <summary>AuthManager User Data</summary>
                <pre>${authUserObj ? JSON.stringify(authUserObj, null, 2) : 'None'}</pre>
            </details>
            
            <p><strong>Page:</strong> ${window.location.pathname}</p>
            
            <div style="margin-top: 10px;">
                <button id="refresh-debug" style="margin-right: 5px;">Refresh</button>
                <button id="force-update-ui" style="margin-right: 5px;">Force UI Update</button>
                <button id="close-debug">Close</button>
            </div>
            
            <div style="margin-top: 10px;">
                <button id="create-user-menu" style="margin-right: 5px;">Create User Menu</button>
                <button id="clear-auth" style="background: #ff6b6b;">Clear Auth Data</button>
            </div>
            <p><small>Press Alt+Shift+D to toggle this panel</small></p>
        `;
        
        debugContainer.innerHTML = html;
        
        // Add event listeners
        document.getElementById('refresh-debug').addEventListener('click', window.showAuthDebug);
        
        document.getElementById('force-update-ui').addEventListener('click', function() {
            if (window.authManager) {
                window.authManager.updateAuthUI();
                setTimeout(window.showAuthDebug, 500);
            }
        });
        
        document.getElementById('create-user-menu').addEventListener('click', function() {
            if (window.authManager) {
                window.authManager.createUserMenu();
                setTimeout(window.showAuthDebug, 500);
            }
        });
        
        document.getElementById('clear-auth').addEventListener('click', function() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.authManager) {
                window.authManager.user = null;
                window.authManager.updateAuthUI();
            }
            setTimeout(window.showAuthDebug, 500);
        });
        
        document.getElementById('close-debug').addEventListener('click', function() {
            document.body.removeChild(debugContainer);
        });
    };
    
    // Function to toggle user menu visibility
    window.toggleUserMenu = function() {
        const userMenu = document.getElementById('user-menu');
        if (userMenu) {
            userMenu.style.display = userMenu.style.display === 'none' ? 'flex' : 'none';
        }
    };
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Alt+Shift+D to show debug info
        if (e.altKey && e.shiftKey && e.key === 'D') {
            if (document.getElementById('auth-debug')) {
                document.getElementById('auth-debug').remove();
            } else {
                window.showAuthDebug();
            }
        }
        
        // Alt+Shift+U to toggle user menu
        if (e.altKey && e.shiftKey && e.key === 'U') {
            window.toggleUserMenu();
        }
    });
    
    // Auto-show debug on page load if query param is present
    if (window.location.search.includes('debug=auth')) {
        setTimeout(window.showAuthDebug, 1000);
    }
})();

// Add a console message to show this is loaded
console.log('Auth debug utilities loaded. Press Alt+Shift+D to show debug panel, Alt+Shift+U to toggle user menu');
