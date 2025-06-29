import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    // Check authentication on component mount and route changes
    checkAuth();
  }, [router.pathname]);
  
  const checkAuth = () => {
    // Check if user is authenticated by looking for token
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token) {
      setIsAuthenticated(true);
      // Parse user data if available
      if (user) {
        try {
          const userData = JSON.parse(user);
          setUsername(userData.username || userData.name || 'User');
        } catch (e) {
          setUsername('User');
        }
      }
    } else {
      setIsAuthenticated(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link href="/">
          <a className="navbar-brand">
            <span className="logo-icon">A</span> Font Match
          </a>
        </Link>
        
        <div className="navbar-nav mx-auto">
          <Link href="/about">
            <a className={`nav-link ${router.pathname === '/about' ? 'active' : ''}`}>About</a>
          </Link>
          <Link href="/fonts">
            <a className={`nav-link ${router.pathname === '/fonts' ? 'active' : ''}`}>Fonts</a>
          </Link>
          <Link href="/contact">
            <a className={`nav-link ${router.pathname === '/contact' ? 'active' : ''}`}>Contact</a>
          </Link>
        </div>
        
        <div className="navbar-nav ms-auto">
          {isAuthenticated ? (
            <div className="user-menu dropdown">
              <button className="btn dropdown-toggle user-button" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fa fa-user-circle"></i> {username}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <Link href="/dashboard">
                    <a className="dropdown-item">Dashboard</a>
                  </Link>
                </li>
                <li>
                  <Link href="/profile">
                    <a className="dropdown-item">Profile</a>
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          ) : (
            <Link href="/login">
              <a className="btn login-btn">Login / Register</a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;