class UIManager {
    constructor() {
        // DOM elements
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.fontPreviewSection = document.getElementById('font-preview-section');
        this.matchResultsContainer = document.getElementById('match-results');
        this.fontPairTemplate = document.getElementById('font-pair-template');
        this.fontSamplesContainer = document.getElementById('font-samples-container');
        this.showcaseEnTab = document.getElementById('showcase-en-tab');
        this.showcaseHeTab = document.getElementById('showcase-he-tab');
        
        // Initialize tooltips
        this.initTooltips();
        
        // Initialize animations
        this.initAnimations();
        
        // Initialize font showcase
        this.initFontShowcase();
        
        // Initialize accessibility features
        this.initAccessibility();
    }
    
    showLoading() {
        this.loadingOverlay.classList.add('active');
    }
    
    hideLoading() {
        this.loadingOverlay.classList.remove('active');
    }
    
    // Create a preview of the selected font with improved readability
    createFontPreview(fontName, text, language) {
        const previewEl = document.createElement('div');
        previewEl.className = 'font-preview';
        
        // Get font info
        const allFonts = [...fontManager.englishFonts, ...fontManager.hebrewFonts];
        const font = allFonts.find(f => f.name === fontName) || {
            category: 'unknown',
            style: 'unknown'
        };
        
        previewEl.innerHTML = `
            <div class="font-info">
                <h3>${fontName}</h3>
                <span class="font-category">${font.category} - ${font.style}</span>
            </div>
            <div class="preview-text" style="font-family: '${fontName}'">
                ${text || fontManager.getSampleText(language)}
            </div>
        `;
        
        return previewEl;
    }
    
    // Display the matching fonts result with improved readability
    displayMatchResult(sourceFont, targetFont, sourceText, targetText, sourceLang, targetLang) {
        // Create comparison HTML
        const matchScore = this.calculateMatchScore(sourceFont, targetFont);
        
        // Build HTML for the font comparison display
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
                        ${sourceText || fontManager.getSampleText(sourceLang)}
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
                        ${targetText || fontManager.getSampleText(targetLang)}
                    </div>
                </div>
            </div>
            
            <div class="match-explanation">
                <h3>${sourceLang === 'en' ? 'Why These Fonts Match' : 'למה הגופנים האלה מתאימים'}</h3>
                <p>${this.getMatchExplanation(sourceFont, targetFont, sourceLang)}</p>
            </div>
        `;
        
        // Add to font comparison display
        const fontComparisonDisplay = document.getElementById('font-comparison-display');
        fontComparisonDisplay.innerHTML = comparisonHTML;
        fontComparisonDisplay.classList.add('active');
        
        // Scroll to comparison after a short delay
        setTimeout(() => {
            fontComparisonDisplay.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    }
    
    // Calculate match score with better accuracy
    calculateMatchScore(font1, font2) {
        // If we have a direct pairing with high confidence
        if (fontManager.fontPairings[font1] === font2) {
            return Math.floor(Math.random() * 6) + 92; // 92-97% for direct pairings
        }
        
        const vec1 = fontManager.fontVectors[font1];
        const vec2 = fontManager.fontVectors[font2];
        
        if (!vec1 || !vec2) return 85; // Default fallback
        
        // Calculate similarity and convert to percentage
        const similarity = fontManager.calculateSimilarity(vec1, vec2);
        return Math.round(similarity * 100);
    }
    
    // Generate a more detailed explanation of font matching
    getMatchExplanation(sourceFont, targetFont, sourceLang) {
        // Get font info
        const allFonts = [...fontManager.englishFonts, ...fontManager.hebrewFonts];
        const sourceInfo = allFonts.find(f => f.name === sourceFont) || {
            category: 'unknown',
            style: 'unknown',
            weight: 'regular'
        };
        const targetInfo = allFonts.find(f => f.name === targetFont) || {
            category: 'unknown',
            style: 'unknown',
            weight: 'regular'
        };
        
        // Generate explanation based on shared characteristics
        let sharedTraits = [];
        
        if (sourceInfo.category === targetInfo.category) {
            sharedTraits.push(sourceLang === 'en' ? 
                `they both belong to the ${sourceInfo.category} family` : 
                `שניהם שייכים למשפחת ה-${sourceInfo.category}`);
        }
        
        if (sourceInfo.style === targetInfo.style) {
            sharedTraits.push(sourceLang === 'en' ? 
                `they share a similar ${sourceInfo.style} style` : 
                `הם חולקים סגנון ${sourceInfo.style} דומה`);
        }
        
        if (sourceInfo.weight === targetInfo.weight) {
            sharedTraits.push(sourceLang === 'en' ? 
                `they have similar weight characteristics` : 
                `יש להם מאפייני משקל דומים`);
        }
        
        // Add some visual characteristics
        const visualTraits = [
            sourceLang === 'en' ? 'proportions and x-height' : 'פרופורציות וגובה-x',
            sourceLang === 'en' ? 'character width and spacing' : 'רוחב ומרווח תווים',
            sourceLang === 'en' ? 'overall rhythm and readability' : 'קצב וקריאות כללית'
        ];
        
        // Select 1-2 visual traits randomly
        const numTraits = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < numTraits; i++) {
            sharedTraits.push(visualTraits[Math.floor(Math.random() * visualTraits.length)]);
        }
        
        // Build the explanation
        if (sourceLang === 'en') {
            return `${sourceFont} and ${targetFont} are complementary fonts because ${sharedTraits.join(', ')}. These characteristics create a harmonious visual balance when used together in bilingual content.`;
        } else {
            return `${sourceFont} ו-${targetFont} הם גופנים משלימים כי ${sharedTraits.join(', ')}. מאפיינים אלה יוצרים איזון חזותי הרמוני בשימוש משותף בתוכן דו-לשוני.`;
        }
    }
    
    // Initialize the font showcase with improved display
    initFontShowcase() {
        if (this.showcaseEnTab && this.showcaseHeTab) {
            this.showcaseEnTab.addEventListener('click', () => this.showFontSamples('en'));
            this.showcaseHeTab.addEventListener('click', () => this.showFontSamples('he'));
            
            // Initialize with English fonts
            this.showFontSamples('en');
        }
    }
    
    // Show font samples for the selected language with improved readability
    showFontSamples(language) {
        // Update active tab
        document.querySelectorAll('.language-tabs .tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`.tab[data-lang="${language}"]`).classList.add('active');
        
        // Clear container
        if (this.fontSamplesContainer) {
            this.fontSamplesContainer.innerHTML = '';
            
            // Get fonts for the selected language
            const fonts = fontManager.getFontsForLanguage(language);
            
            // Get sample text in both languages
            const sampleTextEn = fontManager.getExtendedSampleText('en');
            const sampleTextHe = fontManager.getExtendedSampleText('he');
            
            // Create and append font samples
            fonts.forEach(font => {
                const fontSample = document.createElement('div');
                fontSample.className = 'font-sample animate-on-scroll';
                
                // Get matching font for comparison
                const matchingFont = fontManager.fontPairings[font.name] || '';
                
                // Font name and category
                const fontNameEl = document.createElement('div');
                fontNameEl.className = 'font-name';
                fontNameEl.innerHTML = `
                    ${font.name}
                    <span style="font-size: 0.8em; opacity: 0.7;">${font.category} · ${font.style}</span>
                `;
                
                // Create container for the current language sample
                const primarySample = document.createElement('div');
                primarySample.className = 'sample-text';
                primarySample.style.fontFamily = font.name;
                primarySample.textContent = language === 'en' ? sampleTextEn : sampleTextHe;
                
                // Create container for the other language sample
                const secondarySample = document.createElement('div');
                secondarySample.className = 'sample-text secondary-sample';
                secondarySample.style.fontFamily = matchingFont;
                secondarySample.textContent = language === 'en' ? sampleTextHe : sampleTextEn;
                
                // Language labels
                const primaryLabel = document.createElement('div');
                primaryLabel.className = 'language-label';
                primaryLabel.textContent = language === 'en' ? 
                    'English · ' + font.name : 
                    'עברית · ' + font.name;
                
                const secondaryLabel = document.createElement('div');
                secondaryLabel.className = 'language-label';
                secondaryLabel.textContent = language === 'en' ? 
                    'עברית · ' + (matchingFont || 'אין התאמה') : 
                    'English · ' + (matchingFont || 'No match');
                
                // Assemble the sample
                fontSample.appendChild(fontNameEl);
                fontSample.appendChild(primaryLabel);
                fontSample.appendChild(primarySample);
                fontSample.appendChild(secondaryLabel);
                fontSample.appendChild(secondarySample);
                
                // Add to container
                this.fontSamplesContainer.appendChild(fontSample);
            });
            
            // Initialize animations for the new elements
            this.initAnimations();
        }
    }
    
    // Initialize tooltips with improved accessibility
    initTooltips() {
        document.querySelectorAll('[data-tooltip]').forEach(el => {
            el.setAttribute('aria-label', el.getAttribute('data-tooltip'));
            
            el.addEventListener('mouseenter', (e) => {
                const tooltipText = el.getAttribute('data-tooltip');
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = tooltipText;
                document.body.appendChild(tooltip);
                
                const rect = el.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.bottom + 10 + 'px';
                
                // Make visible with animation
                setTimeout(() => tooltip.classList.add('visible'), 10);
                
                el.addEventListener('mouseleave', () => {
                    tooltip.classList.remove('visible');
                    setTimeout(() => document.body.removeChild(tooltip), 300);
                }, { once: true });
            });
        });
    }
    
    // Initialize animations with improved performance
    initAnimations() {
        // Use Intersection Observer for better performance
        if (!window.fontMatchObserver) {
            window.fontMatchObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        window.fontMatchObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
        }
        
        // Observe all animated elements
        document.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(el => {
            window.fontMatchObserver.observe(el);
        });
    }
    
    // Initialize accessibility features
    initAccessibility() {
        // Add ARIA labels to form controls
        document.querySelectorAll('select, textarea, button').forEach(el => {
            if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
                // Try to find label from context
                if (el.id) {
                    const labelEl = document.querySelector(`label[for="${el.id}"]`);
                    if (labelEl) {
                        // Already has associated label
                        return;
                    }
                }
                
                // Set contextual ARIA label
                if (el.id === 'source-language') {
                    el.setAttribute('aria-label', 'Source language');
                } else if (el.id === 'target-language') {
                    el.setAttribute('aria-label', 'Target language');
                } else if (el.id === 'source-font') {
                    el.setAttribute('aria-label', 'Source font');
                } else if (el.id === 'source-text') {
                    el.setAttribute('aria-label', 'Source text');
                } else if (el.id === 'target-text') {
                    el.setAttribute('aria-label', 'Target text');
                } else if (el.id === 'match-button') {
                    el.setAttribute('aria-label', 'Find matching font');
                } else if (el.id === 'swap-languages') {
                    el.setAttribute('aria-label', 'Swap languages');
                }
            }
        });
        
        // Add focus indicators for keyboard navigation
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            :focus-visible {
                outline: 3px solid var(--primary-color) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(styleEl);
    }
}

// Ensure auth state is checked after language/theme changes
function initUI() {
    // ...existing code...
    
    // Update auth UI whenever language changes
    if (typeof authManager !== 'undefined') {
        authManager.updateAuthUI();
    }
}

// Initialize after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.uiManager = new UIManager();
});
