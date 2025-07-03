/**
 * Font Search Manager
 * Handles the font search and browse functionality
 */

class FontSearchManager {
    constructor(fontManager) {
        this.fontManager = fontManager;
        this.allFonts = [];
        this.filteredFonts = [];
        this.currentLanguage = 'he';
        this.hebrewSample = "שלום עולם! אבגד הוזח טיכל";
        this.englishSample = "Hello World! The quick brown fox";
        
        this.searchContainer = document.getElementById('font-search-container');
        this.searchInput = document.getElementById('font-search-input');
        this.categoryFilter = document.getElementById('category-filter');
        this.weightFilter = document.getElementById('weight-filter');
        this.clearFiltersBtn = document.getElementById('clear-filters');
        this.closeSearchBtn = document.getElementById('close-search');
        this.searchStats = document.getElementById('search-stats');
        this.fontList = document.getElementById('font-list');
        this.browseFontsBtn = document.getElementById('browse-fonts-btn');
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => this.performSearch());
        }
        
        if (this.categoryFilter) {
            this.categoryFilter.addEventListener('change', () => this.performSearch());
        }
        
        if (this.weightFilter) {
            this.weightFilter.addEventListener('change', () => this.performSearch());
        }
        
        if (this.clearFiltersBtn) {
            this.clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        }
        
        if (this.closeSearchBtn) {
            this.closeSearchBtn.addEventListener('click', () => this.hide());
        }
        
        if (this.browseFontsBtn) {
            this.browseFontsBtn.addEventListener('click', () => this.show());
        }
        
        if (this.searchContainer) {
            // Close on background click
            this.searchContainer.addEventListener('click', (e) => {
                if (e.target === this.searchContainer) {
                    this.hide();
                }
            });
        }
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.searchContainer && this.searchContainer.style.display !== 'none') {
                this.hide();
            }
        });
        
        // Listen for language changes from showcase tabs
        const showcaseEnTab = document.getElementById('showcase-en-tab');
        const showcaseHeTab = document.getElementById('showcase-he-tab');
        
        if (showcaseEnTab) {
            showcaseEnTab.addEventListener('click', () => {
                this.currentLanguage = 'en';
            });
        }
        
        if (showcaseHeTab) {
            showcaseHeTab.addEventListener('click', () => {
                this.currentLanguage = 'he';
            });
        }
    }
    
    show(language = null) {
        if (!this.searchContainer) {
            console.warn('Font search container not found');
            return;
        }
        
        // Use current language from showcase tabs if not specified
        if (language) {
            this.currentLanguage = language;
        } else {
            // Check which tab is active
            const activeTab = document.querySelector('.language-tabs .tab.active');
            if (activeTab) {
                this.currentLanguage = activeTab.dataset.lang || 'he';
            }
        }
        
        console.log(`Opening font search for language: ${this.currentLanguage}`);
        
        try {
            this.allFonts = this.fontManager.getFontsForLanguage(this.currentLanguage);
            console.log(`Loaded ${this.allFonts.length} fonts for ${this.currentLanguage}`);
        } catch (error) {
            console.error('Error loading fonts:', error);
            this.allFonts = [];
        }
        
        this.searchContainer.style.display = 'flex';
        
        if (this.searchInput) {
            this.searchInput.focus();
        }
        
        this.performSearch();
    }
    
    hide() {
        if (this.searchContainer) {
            this.searchContainer.style.display = 'none';
        }
    }
    
    clearFilters() {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        if (this.categoryFilter) {
            this.categoryFilter.value = '';
        }
        if (this.weightFilter) {
            this.weightFilter.value = '';
        }
        this.performSearch();
    }
    
    performSearch() {
        const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase().trim() : '';
        const categoryFilter = this.categoryFilter ? this.categoryFilter.value : '';
        const weightFilter = this.weightFilter ? this.weightFilter.value : '';
        
        this.filteredFonts = this.allFonts.filter(font => {
            const matchesSearch = !searchTerm || 
                font.name.toLowerCase().includes(searchTerm) ||
                (font.style && font.style.toLowerCase().includes(searchTerm)) ||
                (font.category && font.category.toLowerCase().includes(searchTerm));
            
            const matchesCategory = !categoryFilter || font.category === categoryFilter;
            const matchesWeight = !weightFilter || font.weight === weightFilter;
            
            return matchesSearch && matchesCategory && matchesWeight;
        });
        
        this.displayResults();
    }
    
    displayResults() {
        if (!this.searchStats || !this.fontList) return;
        
        const resultCount = this.filteredFonts.length;
        const totalCount = this.allFonts.length;
        
        this.searchStats.textContent = `Showing ${resultCount} of ${totalCount} ${this.currentLanguage === 'he' ? 'Hebrew' : 'English'} fonts`;
        
        this.fontList.innerHTML = '';
        
        // Limit results for performance
        const maxResults = 100;
        const fontsToShow = this.filteredFonts.slice(0, maxResults);
        
        if (resultCount > maxResults) {
            this.searchStats.textContent += ` (displaying first ${maxResults})`;
        }
        
        fontsToShow.forEach(font => {
            const fontItem = document.createElement('div');
            fontItem.className = 'font-item';
            fontItem.addEventListener('click', () => this.selectFont(font));
            
            const sampleText = this.currentLanguage === 'he' ? this.hebrewSample : this.englishSample;
            const directionClass = this.currentLanguage === 'he' ? 'hebrew' : 'english';
            
            // Format metadata
            const category = font.category || 'unknown';
            const style = font.style || 'unknown';
            const weight = font.weight || 'unknown';
            const source = font.file ? 'Local file' : 'System font';
            
            fontItem.innerHTML = `
                <div class="font-item-name">${font.name}</div>
                <div class="font-item-meta">
                    ${category} • ${style} • ${weight} • ${source}
                </div>
                <div class="font-item-preview ${directionClass}" style="font-family: '${font.name}', Arial, sans-serif;">
                    ${sampleText}
                </div>
            `;
            
            this.fontList.appendChild(fontItem);
        });
        
        if (resultCount === 0) {
            this.fontList.innerHTML = '<div style="text-align: center; color: var(--secondary-text); padding: 40px; font-family: var(--font-main);">No fonts found matching your criteria.</div>';
        }
    }
    
    selectFont(font) {
        console.log(`Selecting font: ${font.name}`);
        
        // Load the font if it's a local file
        if (font.file && this.fontManager.loadFontFile) {
            this.fontManager.loadFontFile(font).catch(error => {
                console.warn('Error loading font file:', error);
            });
        }
        
        // Set the font in the dropdown
        const sourceFont = document.getElementById('source-font');
        if (sourceFont) {
            // Check if the font exists in the dropdown
            const option = sourceFont.querySelector(`option[value="${font.name}"]`);
            if (option) {
                sourceFont.value = font.name;
                sourceFont.dispatchEvent(new Event('change'));
            } else {
                console.warn(`Font ${font.name} not found in dropdown options`);
            }
        }
        
        // Update the language selector if needed
        const sourceLanguage = document.getElementById('source-language');
        if (sourceLanguage && sourceLanguage.value !== this.currentLanguage) {
            sourceLanguage.value = this.currentLanguage;
            sourceLanguage.dispatchEvent(new Event('change'));
        }
        
        this.hide();
        
        // Show success message
        console.log(`Font ${font.name} selected successfully`);
    }
}

// Initialize font search manager when the font manager is ready
window.fontSearchManager = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for font manager to be ready
    const initFontSearch = () => {
        if (window.fontManager && typeof window.fontManager.getFontsForLanguage === 'function') {
            window.fontSearchManager = new FontSearchManager(window.fontManager);
            console.log('Font Search Manager initialized');
        } else {
            // Retry after a short delay
            setTimeout(initFontSearch, 100);
        }
    };
    
    initFontSearch();
});
