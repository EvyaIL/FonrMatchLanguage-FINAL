/**
 * Social Authentication Helper
 * This script provides specialized functions for handling social authentication
 * in a more direct way than the regular auth flow.
 */

(function() {
  const SocialAuthHelper = {
    apiUrl: 'http://localhost:3000/api/v1',
    
    init() {
      console.log('Social Auth Helper initialized');
      // Determine API URL - try different possibilites
      this.determineApiUrl();
    },
    
    async determineApiUrl() {
      const possibleUrls = [
        'http://localhost:3000/api/v1',
        'http://127.0.0.1:3000/api/v1'
      ];
      
      for (const url of possibleUrls) {
        try {
          const response = await fetch(`${url}/health`, { 
            method: 'GET',
            credentials: 'include',
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(2000)
          });
          
          if (response.ok) {
            console.log('API server found at:', url);
            this.apiUrl = url;
            return;
          }
        } catch (e) {
          console.log(`API not available at ${url}`);
        }
      }
    },
    
    // Get token from various sources (URL params, hash, cookies)
    getToken() {
      // Check URL parameters
      const params = new URLSearchParams(window.location.search);
      let token = params.get('token');
      
      // Check hash fragment
      if (!token && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        token = hashParams.get('token');
      }
      
      // Check cookies
      if (!token) {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split('=');
          if (name === 'auth_token') {
            token = decodeURIComponent(value);
            break;
          }
        }
      }
      
      return token;
    },
    
    // Get user ID from URL or cookies
    getUserId() {
      const params = new URLSearchParams(window.location.search);
      let userId = params.get('userId');
      
      if (!userId) {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split('=');
          if (name === 'user_id') {
            userId = decodeURIComponent(value);
            break;
          }
        }
      }
      
      return userId;
    },
    
    // Check authentication status directly from server
    async checkAuthStatus() {
      try {
        const response = await fetch(`${this.apiUrl}/auth/auth-status`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        
        return await response.json();
      } catch (error) {
        console.error('Error checking auth status:', error);
        return { error: error.message };
      }
    },
    
    // Get latest user (most recently logged in)
    async getLatestUser() {
      try {
        const response = await fetch(`${this.apiUrl}/auth/latest-user`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error getting latest user:', error);
        return { error: error.message };
      }
    },
    
    // Get user by ID
    async getUserById(userId) {
      if (!userId) return { error: 'No user ID provided' };
      
      try {
        const response = await fetch(`${this.apiUrl}/auth/user/${userId}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error getting user by ID:', error);
        return { error: error.message };
      }
    },
    
    // Complete login with a user object
    completeLogin(userData) {
      if (!userData) return false;
      
      // grab token from URL/hash/cookie
      const token = this.getToken();
      if (token) {
        localStorage.setItem('token', token);
      }

      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('auth_success', 'true');
      localStorage.setItem('auth_time', new Date().toISOString());
      localStorage.setItem('auth_method', 'social_direct');
      
      // Update auth manager if available
      if (window.authManager) {
        window.authManager.user = userData;
        window.authManager.updateAuthUI();
        console.log('Auth manager updated with user data');
      }
      
      // Update parent window if this is a popup
      try {
        if (window.opener && !window.opener.closed) {
          console.log('Updating parent window');
          if (window.opener.authManager) {
            window.opener.authManager.user = userData;
            window.opener.authManager.updateAuthUI();
            window.opener.localStorage.setItem('user', JSON.stringify(userData));
            window.opener.localStorage.setItem('auth_success', 'true');
            window.opener.localStorage.setItem('auth_time', new Date().toISOString());
          }
        }
      } catch (e) {
        console.error('Error updating parent window:', e);
      }
      
      return true;
    },
    
    // Redirect to the appropriate page after successful login
    redirectAfterLogin() {
      // Get the return URL if available
      const returnToPage = localStorage.getItem('auth_source_page');
      
      if (returnToPage && returnToPage !== '/login.html') {
        console.log('Redirecting to:', returnToPage);
        window.location.href = returnToPage;
      } else {
        console.log('Redirecting to dashboard');
        window.location.href = 'dashboard.html?auth=social';
      }
    }
  };
  
  // Initialize the helper
  SocialAuthHelper.init();
  
  // Make it globally available
  window.SocialAuthHelper = SocialAuthHelper;
})();
