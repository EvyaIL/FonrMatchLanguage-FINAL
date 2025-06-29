document.addEventListener('DOMContentLoaded', async function() {
    // Initialize managers - check if they exist globally first
    const fontManager = window.fontManager || new FontManager();
    const uiManager = window.uiManager || new UIManager();
    const translationService = window.translationService || new TranslationService();
    
    // Make them globally available
    window.fontManager = fontManager;
    window.uiManager = uiManager;
    window.translationService = translationService;
    
    // DOM elements with error checking
    const body = document.body;
    const themeSwitch = document.getElementById('theme-switch');
    const enBtn = document.getElementById('en-btn');
    const heBtn = document.getElementById('he-btn');
    const sourceLanguage = document.getElementById('source-language');
    const targetLanguage = document.getElementById('target-language');
    const sourceFontInput = document.getElementById('source-font-input');
    const sourceFontList = document.getElementById('source-font-list');
    const sourceText = document.getElementById('source-text');
    const outputText = document.getElementById('output-text');
    const matchButton = document.getElementById('match-button');
    const swapButton = document.getElementById('swap-languages');
    const fontName = document.getElementById('font-name');
    const loadingOverlay = document.getElementById('loading-overlay');
    const aboutButton = document.getElementById('about-button');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const aboutModal = document.getElementById('about-modal');
    const targetText = document.getElementById('target-text');
    const fontComparisonDisplay = document.getElementById('font-comparison-display');
    
    // Check for missing critical elements
    if (!sourceLanguage || !targetLanguage || !sourceFontInput || !sourceFontList || !sourceText || !matchButton) {
        console.error('Critical DOM elements missing for font matching');
        return;
    }
    
    // Initialize the page
    // Load custom fonts first, then initialize
    if (fontManager.loadCustomFonts) {
        await fontManager.loadCustomFonts();
    }
    init();

    function init() {
        // Set initial language
        setLanguage(localStorage.getItem('language') || 'en');
        
        // Set initial theme
        if (localStorage.getItem('theme') === 'dark' || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))) {
            body.classList.add('dark-mode');
            themeSwitch.checked = true;
        }
        
        // Populate font dropdown with all loaded fonts
        updateFontOptions();
        
        // Set event listeners
        setupEventListeners();
        
        // Set sample text
        if (translationService && translationService.getUIString) {
            sourceText.placeholder = translationService.getUIString('enter_text', 
                localStorage.getItem('language') || 'en');
        } else {
            sourceText.placeholder = 'Enter text here';
        }
        
        // Set placeholder text for both languages
        updatePlaceholders();
    }

    function setupEventListeners() {
        // Theme toggle
        if (themeSwitch) {
            themeSwitch.addEventListener('change', function() {
                body.classList.toggle('dark-mode');
                localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
            });
        }
        
        // Language toggle
        if (enBtn) enBtn.addEventListener('click', () => setLanguage('en'));
        if (heBtn) heBtn.addEventListener('click', () => setLanguage('he'));
        
        // Source language change
        if (sourceLanguage) {
            sourceLanguage.addEventListener('change', function() {
                if (targetLanguage) {
                    targetLanguage.value = this.value === 'en' ? 'he' : 'en';
                }
                updateFontOptions();
                
                // Update placeholders to match languages
                updatePlaceholders();
            });
        }
        
        // Swap languages
        if (swapButton) {
            swapButton.addEventListener('click', swapLanguages);
        }
        
        // Match button
        if (matchButton) {
            matchButton.addEventListener('click', findMatchingFont);
        }
        
        // About modal
        if (aboutButton && aboutModal) {
            aboutButton.addEventListener('click', () => {
                aboutModal.classList.add('active');
            });
        }
        
        // Close modals
        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.remove('active');
                });
            });
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            document.querySelectorAll('.modal').forEach(modal => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // Font selection preview
        if (sourceFontInput) {
            sourceFontInput.addEventListener('input', function() {
                previewFont(this.value, sourceText);
            });
        }
    }

    function setLanguage(lang) {
        // Update active language class
        body.classList.remove('active-lang-en', 'active-lang-he', 'rtl');
        body.classList.add(`active-lang-${lang}`);
        
        if (lang === 'he') {
            body.classList.add('rtl');
            heBtn.classList.add('active');
            enBtn.classList.remove('active');
        } else {
            enBtn.classList.add('active');
            heBtn.classList.remove('active');
        }
        
        // Store preference
        localStorage.setItem('language', lang);
        
        // Update language in selectors if needed
        if (sourceLanguage.value !== lang) {
            sourceLanguage.value = lang;
            targetLanguage.value = lang === 'en' ? 'he' : 'en';
            updateFontOptions();
        }
        
        // Update UI text based on language
        updateUIText(lang);
    }
    
    function updateUIText(lang) {
        // Update all data-i18n elements with their translations
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translationService && translationService.getUIString) {
                el.textContent = translationService.getUIString(key, lang);
            }
        });
        
        // Update placeholders
        if (translationService && translationService.getUIString) {
            sourceText.placeholder = translationService.getUIString('enter_text', lang);
        } else {
            sourceText.placeholder = 'Enter text here';
        }
    }

    function updateFontOptions() {
        // Load all fonts into the datalist
        const allFonts = [...fontManager.englishFonts, ...fontManager.hebrewFonts];
        // Clear existing datalist options
        sourceFontList.innerHTML = '';
        const seen = new Set();
        allFonts.forEach(font => {
            if (seen.has(font.name)) return;
            seen.add(font.name);
            const option = document.createElement('option');
            option.value = font.name;
            sourceFontList.appendChild(option);
        });
        // Set initial input value and preview
        const first = seen.values().next().value;
        if (first) {
            sourceFontInput.value = first;
            previewFont(first, sourceText);
        }
    }

    function swapLanguages() {
        const tempLang = sourceLanguage.value;
        sourceLanguage.value = targetLanguage.value;
        targetLanguage.value = tempLang;
        
        // Swap text content
        const tempText = sourceText.value;
        sourceText.value = outputText.textContent || '';
        outputText.textContent = tempText;
        
        updateFontOptions();
    }
    
    function previewFont(fontName, element) {
        element.style.fontFamily = fontName;
    }

    function updatePlaceholders() {
        const sourceLang = sourceLanguage.value;
        const targetLang = targetLanguage.value;
        
        sourceText.placeholder = `Enter text in ${sourceLang === 'en' ? 'English' : 'Hebrew'}`;
        targetText.placeholder = `Enter text in ${targetLang === 'en' ? 'English' : 'Hebrew'}`;
    }

    function findMatchingFont() {
        const sourceLang = sourceLanguage.value;
        const targetLang = targetLanguage.value;
        const selectedFont = sourceFontInput.value;
        const inputText = sourceText.value || getDefaultText(sourceLang);
        const targetInputText = targetText.value || getDefaultText(targetLang);
        
        if (!inputText.trim()) {
            alert('Please enter some text to match fonts');
            return;
        }
        
        if (!selectedFont) {
            alert('Please select a source font');
            return;
        }
        
        console.log('Finding match for:', selectedFont, 'from', sourceLang, 'to', targetLang);
        
        // Show loading
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
        
        // Simulate AI processing time
        setTimeout(() => {
            try {
                // Find matching font using our "AI"
                const matchedFont = fontManager.findMatchingFont(selectedFont, targetLang);
                
                console.log('Matched font:', matchedFont);
                
                // Update display
                if (fontName) {
                    fontName.textContent = matchedFont || 'No match found';
                }
                
                if (outputText && matchedFont) {
                    outputText.style.fontFamily = matchedFont;
                }
                
                // Display visual comparison
                if (matchedFont) {
                    displayFontComparison(
                        selectedFont, 
                        matchedFont, 
                        inputText, 
                        targetInputText,
                        sourceLang,
                        targetLang
                    );
                    
                    // Save match if user is logged in
                    if (window.authManager && window.authManager.isAuthenticated()) {
                        const matchData = {
                            sourceLanguage: sourceLang,
                            targetLanguage: targetLang,
                            sourceFont: selectedFont,
                            targetFont: matchedFont,
                            sourceText: inputText,
                            targetText: targetInputText,
                            matchScore: calculateMatchScore(selectedFont, matchedFont)
                        };
                        
                        saveFontMatch(matchData);
                    }
                } else {
                    alert('No matching font found for the selected criteria');
                }
                
                // Apply source font to input
                if (sourceText) {
                    sourceText.style.fontFamily = selectedFont;
                }
                
            } catch (error) {
                console.error('Error in font matching:', error);
                alert('An error occurred while matching fonts. Please try again.');
            } finally {
                // Hide loading
                if (loadingOverlay) {
                    loadingOverlay.classList.remove('active');
                }
            }
        }, 1500);
    }
    
    function displayFontComparison(sourceFont, targetFont, sourceText, targetText, sourceLang, targetLang) {
        // Create comparison display
        fontComparisonDisplay.innerHTML = '';
        
        // Calculate match percentage (simplified for demo)
        const matchScore = calculateMatchScore(sourceFont, targetFont);
        
        // Build comparison HTML
        const comparisonHTML = `
            <h2 class="comparison-title">
                <span class="en">Font Comparison</span>
                <span class="he">השוואת גופנים</span>
            </h2>
            <div class="comparison-container">
                <div class="font-card">
                    <div class="font-card-header">
                        <div class="font-card-name">${sourceFont}</div>
                        <div class="font-card-language">${sourceLang === 'en' ? 'English' : 'עברית'}</div>
                    </div>
                    <div class="font-card-text" style="font-family: '${sourceFont}'">
                        ${sourceText}
                    </div>
                </div>
                
                <div class="match-arrow">
                    <div class="match-percentage">${matchScore}%</div>
                    <div class="match-icon">
                        <i class="fas fa-arrows-alt-h"></i>
                    </div>
                </div>
                
                <div class="font-card">
                    <div class="font-card-header">
                        <div class="font-card-name">${targetFont}</div>
                        <div class="font-card-language">${targetLang === 'en' ? 'English' : 'עברית'}</div>
                    </div>
                    <div class="font-card-text" style="font-family: '${targetFont}'">
                        ${targetText}
                    </div>
                </div>
            </div>
            <div class="comparison-actions">
                <button id="save-favorite-btn" class="btn btn-primary" ${!window.authManager || !window.authManager.isAuthenticated() ? 'disabled' : ''}>
                    <i class="fas fa-heart"></i>
                    <span class="en">Save as Favorite</span>
                    <span class="he">שמור כמועדף</span>
                </button>
                ${!window.authManager || !window.authManager.isAuthenticated() ? '<p class="auth-note"><span class="en">Login to save favorites</span><span class="he">התחבר כדי לשמור מועדפים</span></p>' : ''}
            </div>
        `;
        
        // Add to container and show
        fontComparisonDisplay.innerHTML = comparisonHTML;
        fontComparisonDisplay.classList.add('active');
        
        // Add event listener for favorite button
        const saveFavoriteBtn = document.getElementById('save-favorite-btn');
        if (saveFavoriteBtn && !saveFavoriteBtn.disabled) {
            saveFavoriteBtn.addEventListener('click', () => {
                const matchData = {
                    sourceLanguage: sourceLang,
                    targetLanguage: targetLang,
                    sourceFont: sourceFont,
                    targetFont: targetFont,
                    sourceText: sourceText,
                    targetText: targetText,
                    matchScore: matchScore,
                    isFavorite: true
                };
                saveFontMatch(matchData, true);
            });
        }
        
        // Scroll to comparison
        fontComparisonDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function calculateMatchScore(font1, font2) {
        // Simplified match score calculation
        if (fontManager && fontManager.fontVectors) {
            const vec1 = fontManager.fontVectors[font1];
            const vec2 = fontManager.fontVectors[font2];
            
            if (vec1 && vec2 && fontManager.calculateSimilarity) {
                // Calculate similarity and convert to percentage
                const similarity = fontManager.calculateSimilarity(vec1, vec2);
                return Math.round(similarity * 100);
            }
        }
        
        // Fallback calculation based on font characteristics
        const fonts = [...(fontManager.englishFonts || []), ...(fontManager.hebrewFonts || [])];
        const fontInfo1 = fonts.find(f => f.name === font1);
        const fontInfo2 = fonts.find(f => f.name === font2);
        
        if (fontInfo1 && fontInfo2) {
            let score = 50; // Base score
            
            // Same category bonus
            if (fontInfo1.category === fontInfo2.category) score += 20;
            
            // Same style bonus
            if (fontInfo1.style === fontInfo2.style) score += 15;
            
            // Weight similarity bonus
            if (fontInfo1.weight === fontInfo2.weight) score += 10;
            
            return Math.min(score + Math.floor(Math.random() * 10), 98);
        }
        
        return 85; // Default fallback
    }

    // Function to save font match to database
    async function saveFontMatch(matchData, markAsFavorite = false) {
        if (!window.authManager || !window.authManager.isAuthenticated()) {
            console.log('User not authenticated, cannot save font match');
            return;
        }

        try {
            const token = window.authManager.getToken();
            const response = await fetch('/api/v1/fontmatches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...matchData,
                    isFavorite: markAsFavorite
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Font match saved successfully:', result);
            
            if (markAsFavorite) {
                // Update button to show it's been saved
                const saveFavoriteBtn = document.getElementById('save-favorite-btn');
                if (saveFavoriteBtn) {
                    saveFavoriteBtn.innerHTML = `
                        <i class="fas fa-heart" style="color: red;"></i>
                        <span class="en">Saved to Favorites!</span>
                        <span class="he">נשמר למועדפים!</span>
                    `;
                    saveFavoriteBtn.disabled = true;
                    saveFavoriteBtn.classList.add('saved');
                }
            }
            
        } catch (error) {
            console.error('Error saving font match:', error);
            if (markAsFavorite) {
                alert('Failed to save to favorites. Please try again.');
            }
        }
    }
    
    // Helper function to get default text
    function getDefaultText(lang) {
        if (lang === 'he') {
            return 'טקסט לדוגמה בעברית';
        } else {
            return 'Sample text in English';
        }
    }
    
    // Helper function to check if element exists
    function getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id '${id}' not found`);
        }
        return element;
    }
});
