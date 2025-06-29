document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    
    // Form visibility state
    let activeForm = 'login';
    
    // Switch between login and register forms
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Store active form state
            activeForm = tab.getAttribute('data-tab');
            
            // Show/hide appropriate form
            const isLogin = activeForm === 'login';
            loginForm.style.display = isLogin ? 'block' : 'none';
            registerForm.style.display = isLogin ? 'none' : 'block';
            
            // Clear errors and form fields
            loginError.textContent = '';
            registerError.textContent = '';
        });
    });

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            const input = button.parentElement.querySelector('input');
            const icon = button.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            loginError.textContent = '';
            
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            
            // Basic validation
            if (!email || !password) {
                const lang = document.documentElement.lang;
                loginError.textContent = lang === 'he' ? 'נא למלא את כל השדות' : 'Please fill in all fields';
                return;
            }
            
            // Disable button and show loading state
            const buttonText = loginButton.innerHTML;
            loginButton.disabled = true;
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            try {
                const result = await window.authManager.login(email, password);
                
                if (result.success) {
                    // Successful login
                    window.location.href = 'index.html';
                } else {
                    // Failed login
                    const lang = document.documentElement.lang;
                    loginError.textContent = lang === 'he' ? 
                        'שם משתמש או סיסמה לא נכונים' : 
                        result.error || 'Invalid username or password';
                    loginButton.disabled = false;
                    loginButton.innerHTML = buttonText;
                }
            } catch (error) {
                console.error('Login error:', error);
                const lang = document.documentElement.lang;
                loginError.textContent = lang === 'he' ? 
                    'אירעה שגיאה בלתי צפויה' : 
                    'An unexpected error occurred';
                loginButton.disabled = false;
                loginButton.innerHTML = buttonText;
            }
        });
    }

    // Handle register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            registerError.textContent = '';
            
            const username = document.getElementById('register-username').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            
            const lang = document.documentElement.lang;
            
            // Basic validation
            if (!username || !email || !password) {
                registerError.textContent = lang === 'he' ? 
                    'נא למלא את כל השדות' : 
                    'Please fill in all fields';
                return;
            }
            
            if (password.length < 6) {
                registerError.textContent = lang === 'he' ?
                    'הסיסמה חייבת להכיל לפחות 6 תווים' :
                    'Password must be at least 6 characters long';
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                registerError.textContent = lang === 'he' ?
                    'נא להזין כתובת דוא"ל תקינה' :
                    'Please enter a valid email address';
                return;
            }
            
            // Disable button and show loading state
            const buttonText = registerButton.innerHTML;
            registerButton.disabled = true;
            registerButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            try {
                const result = await window.authManager.register({ username, email, password });
                
                if (result.success) {
                    // Successful registration
                    window.location.href = 'index.html';
                } else {
                    // Failed registration
                    registerError.textContent = lang === 'he' ?
                        'ההרשמה נכשלה. ייתכן שהמשתמש כבר קיים.' :
                        result.error || 'Registration failed. User may already exist.';
                    registerButton.disabled = false;
                    registerButton.innerHTML = buttonText;
                }
            } catch (error) {
                console.error('Registration error:', error);
                registerError.textContent = lang === 'he' ?
                    'אירעה שגיאה בלתי צפויה' :
                    'An unexpected error occurred';
                registerButton.disabled = false;
                registerButton.innerHTML = buttonText;
            }
        });
    }

    // Check URL parameters for tab selection
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'register') {
        document.querySelector('.auth-tab[data-tab="register"]').click();
    }
});
