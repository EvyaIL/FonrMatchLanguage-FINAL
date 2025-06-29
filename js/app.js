document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const body = document.body;
    const themeSwitch = document.getElementById('theme-switch');
    const enBtn = document.getElementById('en-btn');
    const heBtn = document.getElementById('he-btn');
    const sourceLanguage = document.getElementById('source-language');
    const targetLanguage = document.getElementById('target-language');
    const sourceFont = document.getElementById('source-font');
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
    
    // Initialize the page
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
        
        // Populate font dropdown
        updateFontOptions();
        
        // Set event listeners
        setupEventListeners();
        
        // Set sample text
        sourceText.placeholder = translationService.getUIString('enter_text', 
            localStorage.getItem('language') || 'en');
        
        // Set placeholder text for both languages
        updatePlaceholders();
    }

    function setupEventListeners() {
        // Theme toggle
        themeSwitch.addEventListener('change', function() {
            body.classList.toggle('dark-mode');
            localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
        });
        
        // Language toggle
        enBtn.addEventListener('click', () => setLanguage('en'));
        heBtn.addEventListener('click', () => setLanguage('he'));
        
        // Source language change
        sourceLanguage.addEventListener('change', function() {
            targetLanguage.value = this.value === 'en' ? 'he' : 'en';
            updateFontOptions();
            
            // Update placeholders to match languages
            updatePlaceholders();
        });
        
        // Swap languages
        swapButton.addEventListener('click', swapLanguages);
        
        // Match button
        matchButton.addEventListener('click', findMatchingFont);
        
        // About modal
        aboutButton.addEventListener('click', () => {
            aboutModal.classList.add('active');
        });
        
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
        sourceFont.addEventListener('change', function() {
            previewFont(this.value, sourceText);
        });
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
            el.textContent = translationService.getUIString(key, lang);
        });
        
        // Update placeholders
        sourceText.placeholder = translationService.getUIString('enter_text', lang);
    }

    function updateFontOptions() {
        const lang = sourceLanguage.value;
        
        // Clear existing options
        sourceFont.innerHTML = '';
        
        // Add font options for selected language
        const fonts = fontManager.getFontsForLanguage(lang);
        fonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font.name;
            option.textContent = font.name;
            option.style.fontFamily = font.name;
            sourceFont.appendChild(option);
        });
        
        // Set initial preview
        if (fonts.length > 0) {
            previewFont(fonts[0].name, sourceText);
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
        const selectedFont = sourceFont.value;
        const inputText = sourceText.value || fontManager.getSampleText(sourceLang);
        const targetInputText = targetText.value || fontManager.getSampleText(targetLang);
        
        if (!inputText.trim()) {
            alert('Please enter some text to match fonts');
            return;
        }
        
        // Show loading
        loadingOverlay.classList.add('active');
        
        // Simulate AI processing time
        setTimeout(() => {
            // Find matching font using our "AI"
            const matchedFont = fontManager.findMatchingFont(selectedFont, targetLang);
            
            // Update display
            fontName.textContent = matchedFont || 'No match found';
            outputText.style.fontFamily = matchedFont;
            
            // Display visual comparison
            if (uiManager && matchedFont) {
                uiManager.displayMatchResult(
                    selectedFont, 
                    matchedFont, 
                    inputText, 
                    targetInputText,
                    sourceLang,
                    targetLang
                );
                
                // Save match if user is logged in
                if (authManager.isLoggedIn()) {
                    const matchData = {
                        sourceLanguage: sourceLang,
                        targetLanguage: targetLang,
                        sourceFont: selectedFont,
                        targetFont: matchedFont,
                        sourceText: inputText,
                        targetText: targetInputText,
                        matchScore: uiManager.calculateMatchScore(selectedFont, matchedFont)
                    };
                    
                    authManager.saveFontMatch(matchData).catch(error => {
                        console.error('Error saving font match:', error);
                    });
                }
            }
            
            // Hide loading
            loadingOverlay.classList.remove('active');
            
            // Apply source font to input
            sourceText.style.fontFamily = selectedFont;
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
        `;
        
        // Add to container and show
        fontComparisonDisplay.innerHTML = comparisonHTML;
        fontComparisonDisplay.classList.add('active');
        
        // Scroll to comparison
        fontComparisonDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function calculateMatchScore(font1, font2) {
        const vec1 = fontManager.fontVectors[font1];
        const vec2 = fontManager.fontVectors[font2];
        
        if (!vec1 || !vec2) return 85; // Default fallback
        
        // Calculate similarity and convert to percentage
        const similarity = fontManager.calculateSimilarity(vec1, vec2);
        return Math.round(similarity * 100);
    }
});
