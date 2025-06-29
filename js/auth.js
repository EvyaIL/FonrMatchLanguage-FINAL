class AuthManager {
    constructor() {
        this.user = JSON.parse(localStorage.getItem('user')) || null;
        this.token = localStorage.getItem('token');
        // Dispatch an initial event with data from localStorage right away
        this.dispatchAuthChange(); 
        // Then, verify with the server
        this.checkAuth();
    }

    async checkAuth() {
        try {
            console.log('Checking authentication status...');
            
            // If token exists, try to fetch user data
            if (this.token) {
                console.log('Token found, fetching user data...');
                const response = await fetch('/api/v1/auth/me', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('User data retrieved:', data);
                    this.user = data.data;
                    localStorage.setItem('user', JSON.stringify(this.user)); // Save/update user in localStorage
                } else {
                    console.log('Failed to fetch user data, status:', response.status);
                    this.user = null;
                    this.token = null;
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } else {
                console.log('No token found, user is not authenticated');
                this.user = null;
            }
        } catch (error) {
            console.error('Authentication check failed:', error);
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            // Dispatch again to ensure UI has the latest state from the server
            this.dispatchAuthChange();
        }
    }

    dispatchAuthChange() {
        const event = new CustomEvent('auth-change', { detail: { user: this.user } });
        document.dispatchEvent(event);
    }

    login(token, user) {
        console.log('Logging in user...');
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.dispatchAuthChange();
    }

    logout() {
        console.log('Logging out user...');
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.dispatchAuthChange();
        // Redirect after a short delay to allow listeners to process the auth change
        setTimeout(() => { window.location.href = '/login.html'; }, 100);
    }

    getUser() {
        return this.user;
    }

    getToken() {
        return this.token;
    }

    isAuthenticated() {
        return !!this.token && !!this.user;
    }
}

window.authManager = new AuthManager();
