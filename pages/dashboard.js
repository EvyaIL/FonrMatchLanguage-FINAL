import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentMatches, setRecentMatches] = useState([]);
  const [savedFonts, setSavedFonts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Fetch user data
    fetchUserData();
    
    // Fetch recent matches
    const demoMatches = [
      { id: 1, dateMatched: '2023-06-28', englishFont: 'Inter', hebrewFont: 'Heebo', similarity: 92 },
      { id: 2, dateMatched: '2023-06-25', englishFont: 'Roboto', hebrewFont: 'Assistant', similarity: 87 },
      { id: 3, dateMatched: '2023-06-20', englishFont: 'Open Sans', hebrewFont: 'Rubik', similarity: 85 },
    ];
    setRecentMatches(demoMatches);
    
    // Fetch saved fonts
    const demoSavedFonts = [
      { id: 1, name: 'Inter', type: 'Sans Serif', language: 'English', dateAdded: '2023-06-15' },
      { id: 2, name: 'Heebo', type: 'Sans Serif', language: 'Hebrew', dateAdded: '2023-06-15' },
      { id: 3, name: 'Roboto', type: 'Sans Serif', language: 'English', dateAdded: '2023-06-10' },
      { id: 4, name: 'Assistant', type: 'Sans Serif', language: 'Hebrew', dateAdded: '2023-06-10' },
    ];
    setSavedFonts(demoSavedFonts);
    
    setLoading(false);
  }, []);
  
  const fetchUserData = async () => {
    // In a real app, fetch from your API
    // For demo purposes, we'll use mock data
    const userData = {
      name: localStorage.getItem('username') || 'User',
      email: 'user@example.com',
      matches: 12,
      savedFonts: 24,
      lastLogin: '2023-06-29'
    };
    
    setUser(userData);
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard | Font Match Language</title>
      </Head>
      
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1>Dashboard</h1>
          <p>Welcome back! Manage your font matching experience.</p>
        </div>
        
        <div className={styles.dashboardGrid}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>
                {user?.name.charAt(0) || 'U'}
              </div>
              <div>
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
              </div>
            </div>
            
            <nav className={styles.dashboardNav}>
              <ul>
                <li className={activeTab === 'overview' ? styles.active : ''}>
                  <button onClick={() => setActiveTab('overview')}>
                    <i className="fas fa-home"></i> Overview
                  </button>
                </li>
                <li className={activeTab === 'matches' ? styles.active : ''}>
                  <button onClick={() => setActiveTab('matches')}>
                    <i className="fas fa-font"></i> Font Matches
                  </button>
                </li>
                <li className={activeTab === 'saved' ? styles.active : ''}>
                  <button onClick={() => setActiveTab('saved')}>
                    <i className="fas fa-bookmark"></i> Saved Fonts
                  </button>
                </li>
                <li className={activeTab === 'settings' ? styles.active : ''}>
                  <button onClick={() => setActiveTab('settings')}>
                    <i className="fas fa-cog"></i> Settings
                  </button>
                </li>
              </ul>
            </nav>
            
            <div className={styles.findFonts}>
              <h4>Ready to find more fonts?</h4>
              <Link href="/">
                <a className={styles.matchButton}>
                  Start Matching
                </a>
              </Link>
            </div>
          </div>
          
          {/* Main Content */}
          <div className={styles.mainContent}>
            {activeTab === 'overview' && (
              <div className={styles.overviewTab}>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>{user?.matches}</div>
                    <div className={styles.statLabel}>Font Matches</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>{user?.savedFonts}</div>
                    <div className={styles.statLabel}>Saved Fonts</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>14</div>
                    <div className={styles.statLabel}>Days Active</div>
                  </div>
                </div>
                
                <div className={styles.recentActivity}>
                  <div className={styles.sectionHeader}>
                    <h3>Recent Font Matches</h3>
                    <Link href="#"><a>View All</a></Link>
                  </div>
                  
                  <div className={styles.activityList}>
                    {recentMatches.map(match => (
                      <div className={styles.activityItem} key={match.id}>
                        <div className={styles.matchInfo}>
                          <div className={styles.matchFonts}>
                            <span className={styles.primaryFont}>{match.englishFont}</span>
                            <i className={`fas fa-exchange-alt ${styles.matchIcon}`}></i>
                            <span className={styles.secondaryFont}>{match.hebrewFont}</span>
                          </div>
                          <div className={styles.matchMeta}>
                            <span>{match.dateMatched}</span>
                            <span className={styles.similarityBadge}>
                              {match.similarity}% match
                            </span>
                          </div>
                        </div>
                        <div>
                          <button className={styles.viewButton}>View</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={styles.savedFontSection}>
                  <div className={styles.sectionHeader}>
                    <h3>Recently Saved Fonts</h3>
                    <Link href="#"><a onClick={() => setActiveTab('saved')}>View All</a></Link>
                  </div>
                  
                  <div className={styles.fontGrid}>
                    {savedFonts.slice(0, 4).map(font => (
                      <div className={styles.fontCard} key={font.id}>
                        <div className={styles.fontPreview} style={{ fontFamily: font.name }}>
                          Aa
                        </div>
                        <div className={styles.fontMeta}>
                          <h4>{font.name}</h4>
                          <div className={styles.fontTags}>
                            <span className={styles.fontTag}>{font.type}</span>
                            <span className={styles.fontTag}>{font.language}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'matches' && (
              <div className={styles.matchesTab}>
                <h2>Your Font Matches</h2>
                <p>History of all your font pairings between languages.</p>
                
                <div className={styles.filterControls}>
                  <input 
                    type="text" 
                    placeholder="Search matches..." 
                    className={styles.searchInput} 
                  />
                  <div className={styles.filterGroup}>
                    <select className={styles.filterSelect}>
                      <option>All Languages</option>
                      <option>English - Hebrew</option>
                      <option>English - Arabic</option>
                    </select>
                    <select className={styles.filterSelect}>
                      <option>All Time</option>
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>Last Year</option>
                    </select>
                  </div>
                </div>
                
                <table className={styles.matchesTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Primary Font</th>
                      <th>Secondary Font</th>
                      <th>Languages</th>
                      <th>Match %</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentMatches.concat(recentMatches).map((match, index) => (
                      <tr key={`match-${index}`}>
                        <td>{match.dateMatched}</td>
                        <td>{match.englishFont}</td>
                        <td>{match.hebrewFont}</td>
                        <td>English - Hebrew</td>
                        <td>
                          <div className={styles.progressContainer}>
                            <div 
                              className={styles.progressBar} 
                              style={{ width: `${match.similarity}%` }}
                            ></div>
                            <span>{match.similarity}%</span>
                          </div>
                        </td>
                        <td>
                          <button className={styles.actionButton}>
                            <i className="fas fa-external-link-alt"></i>
                          </button>
                          <button className={styles.actionButton}>
                            <i className="fas fa-bookmark"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'saved' && (
              <div className={styles.savedTab}>
                <h2>Your Saved Fonts</h2>
                <p>Browse and manage your font collection.</p>
                
                <div className={styles.filterControls}>
                  <input 
                    type="text" 
                    placeholder="Search fonts..." 
                    className={styles.searchInput} 
                  />
                  <div className={styles.filterGroup}>
                    <select className={styles.filterSelect}>
                      <option>All Languages</option>
                      <option>English</option>
                      <option>Hebrew</option>
                    </select>
                    <select className={styles.filterSelect}>
                      <option>All Types</option>
                      <option>Sans Serif</option>
                      <option>Serif</option>
                      <option>Display</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.fontGridLarge}>
                  {savedFonts.concat(savedFonts).map((font, index) => (
                    <div className={styles.fontCardLarge} key={`font-${index}`}>
                      <div 
                        className={styles.fontPreviewLarge} 
                        style={{ fontFamily: font.name }}
                      >
                        Aa
                      </div>
                      <div className={styles.fontMetaLarge}>
                        <h3>{font.name}</h3>
                        <div className={styles.fontTagsLarge}>
                          <span className={styles.fontTag}>{font.type}</span>
                          <span className={styles.fontTag}>{font.language}</span>
                        </div>
                        <p className={styles.fontDate}>Added on {font.dateAdded}</p>
                      </div>
                      <div className={styles.fontActions}>
                        <button className={styles.fontActionButton}>
                          <i className="fas fa-trash-alt"></i>
                        </button>
                        <button className={styles.fontActionButton}>
                          <i className="fas fa-external-link-alt"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className={styles.settingsTab}>
                <h2>Account Settings</h2>
                <p>Manage your preferences and personal information.</p>
                
                <div className={styles.settingsForm}>
                  <div className={styles.formSection}>
                    <h3>Profile Information</h3>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="name">Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        className={styles.formInput} 
                        defaultValue={user?.name} 
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        className={styles.formInput} 
                        defaultValue={user?.email} 
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formSection}>
                    <h3>Change Password</h3>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="current-password">Current Password</label>
                      <input 
                        type="password" 
                        id="current-password" 
                        className={styles.formInput} 
                        placeholder="Enter current password" 
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="new-password">New Password</label>
                      <input 
                        type="password" 
                        id="new-password" 
                        className={styles.formInput} 
                        placeholder="Enter new password" 
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="confirm-password">Confirm New Password</label>
                      <input 
                        type="password" 
                        id="confirm-password" 
                        className={styles.formInput} 
                        placeholder="Confirm new password" 
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formSection}>
                    <h3>Preferences</h3>
                    
                    <div className={styles.checkboxGroup}>
                      <input type="checkbox" id="email-notifications" />
                      <label htmlFor="email-notifications">
                        Receive email notifications about new font matches
                      </label>
                    </div>
                    
                    <div className={styles.checkboxGroup}>
                      <input type="checkbox" id="dark-mode" defaultChecked />
                      <label htmlFor="dark-mode">
                        Use dark mode by default
                      </label>
                    </div>
                  </div>
                  
                  <div className={styles.formActions}>
                    <button className={styles.primaryButton}>Save Changes</button>
                    <button className={styles.secondaryButton}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
