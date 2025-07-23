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
                // Get multiple font alternatives instead of just one match
                const alternatives = fontManager.findMatchingFontAlternatives(selectedFont, targetLang, 3);
                
                if (alternatives && alternatives.length > 0) {
                    const bestMatch = alternatives[0];
                    
                    // Update the main display with the best match
                    if (fontName) {
                        fontName.textContent = bestMatch.name;
                    }
                    
                    if (targetText) {
                        targetText.style.fontFamily = bestMatch.name;
                    }
                    
                    // Display font comparison with alternatives
                    displayFontComparison(
                        selectedFont, 
                        bestMatch.name, 
                        getRichTextContent('source-text') || inputText, 
                        getRichTextContent('target-text') || targetInputText,
                        sourceLang,
                        targetLang
                    );
                    
                    // Display alternatives section
                    displayFontAlternatives(alternatives, targetInputText, targetLang);
                    
                    if (window.authManager && window.authManager.isAuthenticated()) {
                        const matchData = {
                            sourceLanguage: sourceLang,
                            targetLanguage: targetLang,
                            sourceFont: selectedFont,
                            targetFont: bestMatch.name,
                            sourceText: inputText,
                            targetText: targetInputText,
                            matchScore: bestMatch.confidence
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
        
        // Store the last active editor
        let lastActiveEditor = null;
        
        // Add event listeners to formatting buttons
        formatButtons.forEach(button => {
            button.addEventListener('mousedown', function(e) {
                e.preventDefault(); // Prevent button from taking focus
            });
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const command = this.getAttribute('data-command');
                executeFormatCommand(command, this);
            });
        });
        
        // Add keyboard shortcuts and event handlers
        richTextEditors.forEach(editor => {
            // Track the active editor
            editor.addEventListener('focus', function() {
                lastActiveEditor = this;
                updateToolbarState(this);
            });
            
            editor.addEventListener('keydown', function(e) {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key.toLowerCase()) {
                        case 'b':
                            e.preventDefault();
                            executeFormatCommand('bold', null, this);
                            break;
                        case 'i':
                            e.preventDefault();
                            executeFormatCommand('italic', null, this);
                            break;
                        case 'u':
                            e.preventDefault();
                            executeFormatCommand('underline', null, this);
                            break;
                        case 'z':
                            if (e.shiftKey) {
                                e.preventDefault();
                                document.execCommand('redo', false, null);
                            } else {
                                // Let default undo work
                            }
                            break;
                    }
                }
            });
            
            // Update toolbar state when selection changes
            editor.addEventListener('input', () => updateToolbarState(editor));
            editor.addEventListener('keyup', () => updateToolbarState(editor));
            editor.addEventListener('mouseup', () => updateToolbarState(editor));
            editor.addEventListener('selectionchange', () => updateToolbarState(editor));
            
            // Handle paste events to maintain formatting
            editor.addEventListener('paste', function(e) {
                e.preventDefault();
                const text = (e.originalEvent || e).clipboardData.getData('text/plain');
                document.execCommand('insertText', false, text);
            });
        });
        
        // Global selection change listener
        document.addEventListener('selectionchange', function() {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.classList.contains('rich-text-editor')) {
                updateToolbarState(activeElement);
            }
        });
        
        // Store last active editor reference
        window.getLastActiveEditor = () => lastActiveEditor;
    }
    
    function executeFormatCommand(command, button = null, targetEditor = null) {
        // Find the active editor
        let activeEditor = targetEditor;
        
        if (!activeEditor && button) {
            // Find the editor in the same container as the button
            const toolbar = button.closest('.formatting-toolbar');
            if (toolbar) {
                const textEditor = toolbar.parentElement.querySelector('.rich-text-editor');
                if (textEditor) {
                    activeEditor = textEditor;
                }
            }
        }
        
        // Fallback: try to get the currently focused editor
        if (!activeEditor) {
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.classList.contains('rich-text-editor')) {
                activeEditor = focusedElement;
            }
        }
        
        // Fallback: use last active editor
        if (!activeEditor && window.getLastActiveEditor) {
            activeEditor = window.getLastActiveEditor();
        }
        
        // Final fallback: find any editor with content or use first
        if (!activeEditor) {
            const editors = document.querySelectorAll('.rich-text-editor');
            for (let editor of editors) {
                if (editor.textContent.trim()) {
                    activeEditor = editor;
                    break;
                }
            }
            if (!activeEditor && editors.length > 0) {
                activeEditor = editors[0];
            }
        }
        
        if (!activeEditor) {
            console.warn('No rich text editor found to apply formatting');
            return;
        }
        
        // Ensure editor is focused
        activeEditor.focus();
        
        // Store current selection
        const selection = window.getSelection();
        
        // Handle special case for removeFormat
        if (command === 'removeFormat') {
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (!range.collapsed) {
                    // Text is selected, remove formatting from selection
                    document.execCommand('removeFormat', false, null);
                } else {
                    // No selection, remove all formatting from editor
                    const content = activeEditor.textContent || activeEditor.innerText;
                    activeEditor.innerHTML = '';
                    activeEditor.textContent = content;
                }
            }
        } else {
            // For bold, italic, underline
            const selectedText = selection.toString();
            
            if (!selectedText && activeEditor.textContent.trim()) {
                // No text selected but editor has content - ask user if they want to format all
                const shouldFormatAll = confirm(`No text selected. Apply ${command} to all text?`);
                if (shouldFormatAll) {
                    const range = document.createRange();
                    range.selectNodeContents(activeEditor);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
            
            // Execute the formatting command
            const success = document.execCommand(command, false, null);
            
            if (!success) {
                // Fallback: manual formatting
                applyManualFormatting(activeEditor, command, selection);
            }
        }
        
        // Update toolbar state and maintain focus
        setTimeout(() => {
            updateToolbarState(activeEditor);
            activeEditor.focus();
        }, 10);
        
        // Trigger input event for any listeners
        activeEditor.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    function applyManualFormatting(editor, command, selection) {
        if (selection.rangeCount === 0) return;
        
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        
        if (!selectedText) return;
        
        const span = document.createElement('span');
        
        switch (command) {
            case 'bold':
                span.style.fontWeight = 'bold';
                break;
            case 'italic':
                span.style.fontStyle = 'italic';
                break;
            case 'underline':
                span.style.textDecoration = 'underline';
                break;
        }
        
        try {
            range.surroundContents(span);
        } catch (e) {
            // If surroundContents fails, extract and wrap content
            const contents = range.extractContents();
            span.appendChild(contents);
            range.insertNode(span);
        }
        
        // Clear selection
        selection.removeAllRanges();
    }
    
    function updateToolbarState(targetEditor = null) {
        // Find which toolbar to update
        let toolbars = [];
        
        if (targetEditor) {
            // Find the specific toolbar for this editor
            const textEditor = targetEditor.closest('.text-editor');
            if (textEditor) {
                const toolbar = textEditor.querySelector('.formatting-toolbar');
                if (toolbar) {
                    toolbars = [toolbar];
                }
            }
        }
        
        // Fallback: update all toolbars
        if (toolbars.length === 0) {
            toolbars = document.querySelectorAll('.formatting-toolbar');
        }
        
        toolbars.forEach(toolbar => {
            const formatButtons = toolbar.querySelectorAll('.format-btn');
            
            formatButtons.forEach(button => {
                const command = button.getAttribute('data-command');
                
                if (command !== 'removeFormat') {
                    let isActive = false;
                    
                    try {
                        // Check if the command is currently active
                        isActive = document.queryCommandState(command);
                        
                        // Additional check for manual formatting
                        if (!isActive && targetEditor) {
                            const selection = window.getSelection();
                            if (selection.rangeCount > 0) {
                                const range = selection.getRangeAt(0);
                                const container = range.commonAncestorContainer;
                                const element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
                                
                                // Check for inline styles or semantic elements
                                isActive = checkManualFormatting(element, command);
                            }
                        }
                    } catch (e) {
                        // queryCommandState might fail in some browsers
                        console.warn('queryCommandState failed for command:', command, e);
                    }
                    
                    button.classList.toggle('active', isActive);
                    button.setAttribute('aria-pressed', isActive);
                }
            });
        });
    }
    
    function checkManualFormatting(element, command) {
        if (!element || element === document.body) return false;
        
        const computedStyle = window.getComputedStyle(element);
        
        switch (command) {
            case 'bold':
                return computedStyle.fontWeight === 'bold' || 
                       computedStyle.fontWeight === '700' || 
                       parseInt(computedStyle.fontWeight) >= 700 ||
                       element.tagName === 'B' || element.tagName === 'STRONG';
            case 'italic':
                return computedStyle.fontStyle === 'italic' ||
                       element.tagName === 'I' || element.tagName === 'EM';
            case 'underline':
                return computedStyle.textDecoration.includes('underline') ||
                       element.tagName === 'U';
            default:
                return false;
        }
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

    // Add visual feedback for formatting actions
    function showFormatFeedback(button, command) {
        if (button) {
            button.classList.add('applying');
            setTimeout(() => {
                button.classList.remove('applying');
            }, 200);
        }
        
        // Show temporary toast for keyboard shortcuts
        if (!button) {
            showTemporaryToast(`Applied ${command} formatting`);
        }
    }
    
    function showTemporaryToast(message) {
        // Remove existing toast
        const existingToast = document.querySelector('.format-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = 'format-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 8px 16px;
            border-radius: var(--radius);
            font-size: 14px;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out forwards;
            box-shadow: var(--shadow);
        `;
        
        document.body.appendChild(toast);
        
        // Remove after 2 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
    
    // Add CSS for toast animations
    function addToastStyles() {
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Enhanced format command execution with better error handling
    function executeFormatCommandEnhanced(command, button = null, targetEditor = null) {
        // ...existing executeFormatCommand code...
        executeFormatCommand(command, button, targetEditor);
        
        // Add visual feedback
        showFormatFeedback(button, command);
    }
    
    // Improve keyboard shortcuts with better handling
    function setupAdvancedKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Only process if we're in a rich text editor
            const activeElement = document.activeElement;
            if (!activeElement || !activeElement.classList.contains('rich-text-editor')) {
                return;
            }
            
            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 'b':
                        e.preventDefault();
                        executeFormatCommandEnhanced('bold', null, activeElement);
                        break;
                    case 'i':
                        e.preventDefault();
                        executeFormatCommandEnhanced('italic', null, activeElement);
                        break;
                    case 'u':
                        e.preventDefault();
                        executeFormatCommandEnhanced('underline', null, activeElement);
                        break;
                    case '\\':
                        e.preventDefault();
                        executeFormatCommandEnhanced('removeFormat', null, activeElement);
                        break;
                }
            }
        });
    }
    
    // Initialize enhanced formatting
    addToastStyles();
    setupAdvancedKeyboardShortcuts();
});
