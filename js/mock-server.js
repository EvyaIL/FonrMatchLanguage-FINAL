/**
 * Mock Server for Development
 * 
 * This file simulates basic server functionality for development without
 * requiring a running backend server. In production, this would be replaced
 * by real server endpoints.
 */

class MockServer {
    constructor() {
        // Mock user data
        this.users = [
            {
                id: "user123",
                username: "demo_user",
                email: "demo@example.com",
                preferences: {
                    defaultLanguage: "en",
                    darkMode: false
                },
                createdAt: new Date().toISOString()
            }
        ];
        
        // Mock font matches
        this.fontMatches = [
            {
                _id: "match1",
                sourceLanguage: "en",
                targetLanguage: "he",
                sourceFont: "Inter",
                targetFont: "Heebo",
                sourceText: "Hello World",
                targetText: "שלום עולם",
                isFavorite: true,
                createdAt: new Date().toISOString()
            },
            {
                _id: "match2",
                sourceLanguage: "he",
                targetLanguage: "en",
                sourceFont: "David Libre",
                targetFont: "Georgia",
                sourceText: "טקסט לדוגמה",
                targetText: "Sample Text",
                isFavorite: false,
                createdAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];
    }
    
    // Mock login function
    login(email, password) {
        // For development, allow any credentials
        if (email && password) {
            const user = this.users[0];
            const token = "mock-jwt-token-" + Math.random().toString(36).substr(2);
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            return { 
                success: true, 
                token: token,
                user: user 
            };
        }
        
        return { 
            success: false, 
            error: 'Invalid credentials' 
        };
    }
    
    // Mock register function
    register(userData) {
        if (userData.email && userData.password && userData.username) {
            const newUser = {
                id: "user" + Math.floor(Math.random() * 1000),
                username: userData.username,
                email: userData.email,
                preferences: userData.preferences || {
                    defaultLanguage: "en",
                    darkMode: false
                },
                createdAt: new Date().toISOString()
            };
            
            this.users.push(newUser);
            
            const token = "mock-jwt-token-" + Math.random().toString(36).substr(2);
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(newUser));
            
            return { 
                success: true, 
                token: token,
                user: newUser 
            };
        }
        
        return {
            success: false,
            error: 'Invalid user data'
        };
    }
    
    // Get font matches
    getFontMatches() {
        return {
            success: true,
            data: this.fontMatches
        };
    }
    
    // Toggle favorite
    toggleFavorite(matchId) {
        const match = this.fontMatches.find(m => m._id === matchId);
        
        if (match) {
            match.isFavorite = !match.isFavorite;
            return {
                success: true,
                data: match
            };
        }
        
        return {
            success: false,
            error: 'Match not found'
        };
    }
}

// Create global instance
const mockServer = new MockServer();
