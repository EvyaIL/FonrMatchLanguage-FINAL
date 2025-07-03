document.addEventListener('DOMContentLoaded', async function() {
    console.log('=== APP INITIALIZATION START ===');
    
    // Initialize managers
    const fontManager = window.fontManager || new FontManager();
    const uiManager = window.uiManager || new UIManager();
    const translationService = window.translationService || new TranslationService();
    
    // Make them globally available
    window.fontManager = fontManager;
    window.uiManager = uiManager;
    window.translationService = translationService;
    
    console.log('Managers initialized:', {
        fontManager: !!fontManager,
        uiManager: !!uiManager,
        translationService: !!translationService
    });
    
    // DOM elements with error checking
    const body = document.body;
    const themeSwitch = document.getElementById('theme-switch');
    const enBtn = document.getElementById('en-btn');
    const heBtn = document.getElementById('he-btn');
    const sourceLanguage = document.getElementById('source-language');
    const targetLanguage = document.getElementById('target-language');
    const sourceFont = document.getElementById('source-font');
    const targetFontSelect = null; // No target font dropdown in current design
    const sourceText = document.getElementById('source-text');
    const aboutButton = document.getElementById('about-button');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const aboutModal = document.getElementById('about-modal');
    const targetText = document.getElementById('target-text');
    const fontComparisonDisplay = document.getElementById('font-comparison-display');
    const matchButton = document.getElementById('match-button');
    const swapButton = document.getElementById('swap-languages');
    const loadingOverlay = document.getElementById('loading-overlay');
    const fontName = document.getElementById('font-name');
    console.log('DOM elements found:', {
        body: !!body,
        themeSwitch: !!themeSwitch,
        sourceLanguage: !!sourceLanguage,
        targetLanguage: !!targetLanguage,
        sourceFont: !!sourceFont,
        sourceText: !!sourceText,
        matchButton: !!matchButton,
        swapButton: !!swapButton
    });

    // Check for missing critical elements
    if (!sourceLanguage || !targetLanguage || !sourceFont || !sourceText || !matchButton) {
        console.error('Critical DOM elements missing for font matching:', {
            sourceLanguage: !!sourceLanguage,
            targetLanguage: !!targetLanguage,
            sourceFont: !!sourceFont,
            sourceText: !!sourceText,
            matchButton: !!matchButton
        });
        return;
    }
    
    console.log('All critical DOM elements found successfully');

    // Main initialization function
    async function init() {
        console.log('Starting app initialization...');
        
        // Set initial language and theme first
        setLanguage(localStorage.getItem('language') || 'en');
        if (localStorage.getItem('theme') === 'dark' || (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))) {
            body.classList.add('dark-mode');
            if (themeSwitch) themeSwitch.checked = true;
        }

        // CRITICAL FIX: Set up event listeners for all interactive elements.
        setupEventListeners();

        // Initialize Font Manager: fetch list & setup data first, then load fonts in background
        if (window.fontManager && typeof window.fontManager.initialize === 'function') {
            console.log('Initializing FontManager...');
            try {
                await window.fontManager.initialize();
                console.log('FontManager initialized successfully. Initializing font picker.');
                initializeFontPicker();
            } catch (error) {
                console.error('Error initializing FontManager:', error);
                // Fallback to initialize picker even if font loading fails
                initializeFontPicker();
            }
        } else {
            console.error('FontManager or its initialize method is missing.');
        }
    }

    // Run initialization
    init();
    
    // Initialize rich text editor after DOM is ready
    initializeRichTextEditor();

    function initializeFontPicker() {
        console.log("=== INITIALIZING FONT PICKER ===");
        
        // Check if source font element exists
        if (!sourceFont) {
            console.error('Source font element not found');
            return;
        }
        
        // Note: We're now using a simple HTML select, so no need to destroy anything

        const lang = sourceLanguage.value;
        console.log(`Current language: ${lang}`);
        
        // Check if FontManager exists and has the required method
        if (!window.fontManager || typeof window.fontManager.getFontsForLanguage !== 'function') {
            console.error('FontManager not properly initialized');
            return;
        }
        
        const fonts = window.fontManager.getFontsForLanguage(lang);
        if (!fonts || fonts.length === 0) {
            console.error(`No fonts found for language: ${lang}. Cannot initialize font picker.`);
            return;
        }
        console.log(`Found ${fonts.length} fonts for ${lang}:`, fonts.map(f => f.name));

        // SMART APPROACH: Use basic HTML select with lazy font loading
        console.log("Using basic HTML select dropdown with lazy loading...");
        sourceFont.innerHTML = ''; // Clear existing options
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a font...';
        sourceFont.appendChild(defaultOption);
        
        fonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font.name;
            option.textContent = font.name;
            option.style.fontFamily = `'${font.name}', sans-serif`;
            sourceFont.appendChild(option);
        });
        
        // Lazy load fonts when dropdown is opened
        let fontsLoaded = false;
        sourceFont.addEventListener('focus', async function() {
            if (!fontsLoaded && window.fontManager.loadFontsLazily) {
                console.log('Loading fonts lazily on first dropdown interaction...');
                const currentFonts = window.fontManager.getFontsForLanguage(lang);
                const fontNames = currentFonts.map(f => f.name);
                await window.fontManager.loadFontsLazily(fontNames);
                fontsLoaded = true;
                console.log('Fonts loaded successfully!');
            }
        });
        
        // Set up event listener
        sourceFont.addEventListener('change', function() {
            console.log(`Font selected: ${this.value}`);
            if (this.value) {
                previewFont(this.value, sourceText);
                updatePlaceholders();
            }
        });
        
        // Load popular fonts immediately for better initial experience
        if (window.fontManager.loadPopularFonts) {
            window.fontManager.loadPopularFonts().then(() => {
                console.log('Popular fonts loaded for immediate use');
            }).catch(err => {
                console.warn('Failed to load popular fonts:', err);
            });
        }
        
        // Set initial font
        if (fonts.length > 0) {
            sourceFont.value = fonts[0].name;
            previewFont(fonts[0].name, sourceText);
        }
        
        console.log(`Font picker initialized with ${fonts.length} fonts`);
    }

    function setupEventListeners() {
        if (themeSwitch) {
            themeSwitch.addEventListener('change', function() {
                body.classList.toggle('dark-mode');
                localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
            });
        }
        
        if (enBtn) enBtn.addEventListener('click', () => setLanguage('en'));
        if (heBtn) heBtn.addEventListener('click', () => setLanguage('he'));
        
        if (sourceLanguage) {
            console.log('Setting up source language event listener');
            sourceLanguage.addEventListener('change', function() {
                console.log(`Language changed from ${targetLanguage.value} to ${this.value}`);
                targetLanguage.value = this.value === 'en' ? 'he' : 'en';
                updateFontOptions();
                updatePlaceholders();
            });
        }
        
        if (swapButton) {
            swapButton.addEventListener('click', swapLanguages);
        }
        
        if (matchButton) {
            matchButton.addEventListener('click', findMatchingFont);
        }
        
        if (aboutButton && aboutModal) {
            aboutButton.addEventListener('click', () => aboutModal.classList.add('active'));
        }
        
        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.modal.active').forEach(modal => modal.classList.remove('active'));
            });
        });
        
        window.addEventListener('click', (e) => {
            document.querySelectorAll('.modal.active').forEach(modal => {
                if (e.target === modal) modal.classList.remove('active');
            });
        });
        
        if (targetFontSelect) {
            targetFontSelect.addEventListener('change', function() {
                previewFont(this.value, targetText);
                this.style.setProperty('--dropdown-font', this.value);
                updatePlaceholders();
            });
        }
    }

    function setLanguage(lang) {
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
        
        localStorage.setItem('language', lang);
        
        if (sourceLanguage.value !== lang) {
            sourceLanguage.value = lang;
            targetLanguage.value = lang === 'en' ? 'he' : 'en';
            updateFontOptions();
        }
        
        updateUIText(lang);
    }
    
    function updateUIText(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translationService && translationService.getUIString) {
                el.textContent = translationService.getUIString(key, lang);
            }
        });
        
        if (translationService && translationService.getUIString) {
            sourceText.placeholder = translationService.getUIString('enter_text', lang);
        } else {
            sourceText.placeholder = 'Enter text here';
        }
    }

    function updateFontOptions() {
        if (!fontManager || typeof fontManager.getFontsForLanguage !== 'function') {
            console.error('FontManager not available in updateFontOptions');
            return;
        }

        const lang = sourceLanguage.value;
        console.log(`Updating font options for language: ${lang}`);
        
        const fonts = fontManager.getFontsForLanguage(lang);
        if (!fonts || fonts.length === 0) {
            console.error(`No fonts available for language: ${lang}`);
            return;
        }
        
        // Reinitialize the font picker with new language fonts
        initializeFontPicker();
        
        console.log(`Font options updated successfully. ${fonts.length} fonts available.`);
    }

    function swapLanguages() {
        const tempLang = sourceLanguage.value;
        sourceLanguage.value = targetLanguage.value;
        targetLanguage.value = tempLang;
        
        const tempText = getRichTextContent('source-text');
        setRichTextContent('source-text', getRichTextContent('target-text'));
        setRichTextContent('target-text', tempText);

        updateFontOptions();
        updatePlaceholders();
    }

    function previewFont(fontName, element) {
        if (fontName && element) {
            element.style.fontFamily = `'${fontName}', sans-serif`;
        }
    }

    function updatePlaceholders() {
        const sourceLang = sourceLanguage.value;
        const targetLang = targetLanguage.value;
        
        sourceText.setAttribute('data-placeholder', sourceLang === 'en' ? 'Enter text in English' : 'הזן טקסט בעברית');
        targetText.setAttribute('data-placeholder', targetLang === 'en' ? 'Enter text in English' : 'הזן טקסט בעברית');

        // Apply the currently selected font to the text editor
        if (sourceFont && sourceFont.value) {
            previewFont(sourceFont.value, sourceText);
        }
        if (targetFontSelect && targetFontSelect.value) {
            previewFont(targetFontSelect.value, targetText);
        }
    }

    function findMatchingFont() {
        const sourceLang = sourceLanguage.value;
        const targetLang = targetLanguage.value;
        const selectedFont = sourceFont.value; // Use HTML select value instead of Choices.js
        const inputText = getPlainTextContent('source-text') || getDefaultText(sourceLang);
        const targetInputText = getPlainTextContent('target-text') || getDefaultText(targetLang);
        
        if (!inputText.trim()) {
            alert('Please enter some text to match fonts');
            return;
        }
        
        if (!selectedFont) {
            alert('Please select a source font');
            return;
        }
        
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
        
        setTimeout(() => {
            try {
                const matchedFont = fontManager.findMatchingFont(selectedFont, targetLang);
                
                if (fontName) {
                    fontName.textContent = matchedFont || 'No match found';
                }
                
                if (targetText && matchedFont) {
                    targetText.style.fontFamily = matchedFont;
                }
                
                if (matchedFont) {
                    displayFontComparison(
                        selectedFont, 
                        matchedFont, 
                        getRichTextContent('source-text') || inputText, 
                        getRichTextContent('target-text') || targetInputText,
                        sourceLang,
                        targetLang
                    );
                    
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
                
            } catch (error) {
                console.error('Error in font matching:', error);
                alert('An error occurred while matching fonts. Please try again.');
            } finally {
                if (loadingOverlay) {
                    loadingOverlay.classList.remove('active');
                }
            }
        }, 500);
    }
    
    function displayFontComparison(sourceFont, targetFont, sourceText, targetText, sourceLang, targetLang) {
        fontComparisonDisplay.innerHTML = '';
        const matchScore = calculateMatchScore(sourceFont, targetFont);
        
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
        
        fontComparisonDisplay.innerHTML = comparisonHTML;
        fontComparisonDisplay.classList.add('active');
        
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
        
        fontComparisonDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function calculateMatchScore(font1, font2) {
        if (fontManager && fontManager.fontVectors) {
            const vec1 = fontManager.fontVectors[font1];
            const vec2 = fontManager.fontVectors[font2];
            
            if (vec1 && vec2 && fontManager.calculateSimilarity) {
                const similarity = fontManager.calculateSimilarity(vec1, vec2);
                return Math.round(similarity * 100);
            }
        }
        
        const fonts = [...(fontManager.englishFonts || []), ...(fontManager.hebrewFonts || [])];
        const fontInfo1 = fonts.find(f => f.name === font1);
        const fontInfo2 = fonts.find(f => f.name === font2);
        
        if (fontInfo1 && fontInfo2) {
            let score = 50;
            if (fontInfo1.category === fontInfo2.category) score += 20;
            if (fontInfo1.style === fontInfo2.style) score += 15;
            if (fontInfo1.weight === fontInfo2.weight) score += 10;
            return Math.min(score + Math.floor(Math.random() * 10), 98);
        }
        
        return 85;
    }

    async function saveFontMatch(matchData, markAsFavorite = false) {
        if (!window.authManager || !window.authManager.isAuthenticated()) {
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
                body: JSON.stringify({ ...matchData, isFavorite: markAsFavorite })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Font match saved successfully:', result);
            
            if (markAsFavorite) {
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
    
    function getDefaultText(lang) {
        return lang === 'he' ? 'טקסט לדוגמה בעברית' : 'Sample text in English';
    }

    // Rich Text Editor Functionality
    function initializeRichTextEditor() {
        const formatButtons = document.querySelectorAll('.format-btn');
        const richTextEditors = document.querySelectorAll('.rich-text-editor');
        
        // Add event listeners to formatting buttons
        formatButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const command = this.getAttribute('data-command');
                executeFormatCommand(command, this);
            });
        });
        
        // Add keyboard shortcuts
        richTextEditors.forEach(editor => {
            editor.addEventListener('keydown', function(e) {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key.toLowerCase()) {
                        case 'b':
                            e.preventDefault();
                            executeFormatCommand('bold');
                            break;
                        case 'i':
                            e.preventDefault();
                            executeFormatCommand('italic');
                            break;
                        case 'u':
                            e.preventDefault();
                            executeFormatCommand('underline');
                            break;
                    }
                }
            });
            
            // Update toolbar state when selection changes
            editor.addEventListener('input', updateToolbarState);
            editor.addEventListener('keyup', updateToolbarState);
            editor.addEventListener('mouseup', updateToolbarState);
            editor.addEventListener('focus', updateToolbarState);
        });
    }
    
    function executeFormatCommand(command, button = null) {
        document.execCommand(command, false, null);
        updateToolbarState();
        
        // Keep focus in editor
        const activeEditor = document.activeElement;
        if (activeEditor && activeEditor.classList.contains('rich-text-editor')) {
            activeEditor.focus();
        }
    }
    
    function updateToolbarState() {
        const formatButtons = document.querySelectorAll('.format-btn');
        
        formatButtons.forEach(button => {
            const command = button.getAttribute('data-command');
            if (command !== 'removeFormat') {
                const isActive = document.queryCommandState(command);
                button.classList.toggle('active', isActive);
            }
        });
    }
    
    // Get text content from rich text editor (preserving formatting)
    function getRichTextContent(editorId) {
        const editor = document.getElementById(editorId);
        return editor ? editor.innerHTML : '';
    }
    
    // Set text content in rich text editor
    function setRichTextContent(editorId, content) {
        const editor = document.getElementById(editorId);
        if (editor) {
            editor.innerHTML = content;
        }
    }
    
    // Get plain text from rich text editor
    function getPlainTextContent(editorId) {
        const editor = document.getElementById(editorId);
        return editor ? editor.textContent || editor.innerText || '' : '';
    }
    
    // Set plain text in rich text editor
    function setPlainTextContent(editorId, content) {
        const editor = document.getElementById(editorId);
        if (editor) {
            editor.textContent = content;
        }
    }
});
