// Font database and management system
// Add Google Fonts API key (could be stored in .env and injected)
const GOOGLE_FONTS_API_KEY = 'AIzaSyCb_xsID8SNCyNdnkX5d5T5UBE6RuksuZw';

class FontManager {
    constructor() {
        this.englishFonts = [];
        this.hebrewFonts = [
            { name: 'Heebo', category: 'sans-serif', style: 'modern', weight: 'variable' },
            { name: 'Assistant', category: 'sans-serif', style: 'friendly', weight: 'variable' },
            { name: 'Rubik', category: 'sans-serif', style: 'geometric', weight: 'variable' },
            { name: 'Frank Ruhl Libre', category: 'serif', style: 'elegant', weight: 'variable' },
            { name: 'David Libre', category: 'serif', style: 'classic', weight: 'regular' },
            { name: 'Noto Sans Hebrew', category: 'sans-serif', style: 'balanced', weight: 'variable' },
            { name: 'Noto Serif Hebrew', category: 'serif', style: 'readable', weight: 'variable' },
            { name: 'Arial Hebrew', category: 'sans-serif', style: 'neutral', weight: 'regular' },
            { name: 'Miriam', category: 'sans-serif', style: 'legible', weight: 'regular' },
            { name: 'Gisha', category: 'sans-serif', style: 'screen', weight: 'regular' },
            { name: 'Aharoni', category: 'sans-serif', style: 'strong', weight: 'bold' },
            { name: 'Secular One', category: 'sans-serif', style: 'modern', weight: 'regular' },
            { name: 'Suez One', category: 'serif', style: 'strong', weight: 'regular' },
            { name: 'Arimo', category: 'sans-serif', style: 'technical', weight: 'variable' }
        ];
        
        this.fontPairings = {};
        this.sampleTexts = {};
        this.extendedSampleTexts = {};
        this.fontVectors = {};
        this.matchConfig = {};
        this.matchCache = {};
        this.matchScoreCache = {};
    }

    async initialize() {
        console.log('FontManager: Fast initialization started.');
        // Fetch English font list first
        await this.fetchEnglishFontsList();
        console.log('FontManager: Font list fetched.');
        
        // Set up all font data, pairings, vectors, etc.
        this.setupFontData();
        console.log('FontManager: Font data setup complete.');

        // DON'T load fonts here - we'll load them lazily when needed
        console.log('FontManager: Initialization complete (fonts will load on-demand).');
    }

    // New method to set up all data structures
    setupFontData() {
        // Improved font pairings for more accurate matching
        this.fontPairings = {
            'Inter': 'Heebo',
            'Open Sans': 'Assistant',
            'Roboto': 'Noto Sans Hebrew',
            'Montserrat': 'Rubik',
            'Lato': 'Assistant',
            'Playfair Display': 'Frank Ruhl Libre',
            'Merriweather': 'Noto Serif Hebrew',
            'Georgia': 'David Libre',
            'Times New Roman': 'Frank Ruhl Libre',
            'Arial': 'Arial Hebrew',
            'Verdana': 'Gisha',
            'Tahoma': 'Miriam',
            'Courier New': 'Miriam',
            'Trebuchet MS': 'Assistant',
            'Garamond': 'David Libre',
            
            'Heebo': 'Inter',
            'Assistant': 'Open Sans',
            'Rubik': 'Montserrat',
            'Frank Ruhl Libre': 'Playfair Display',
            'David Libre': 'Georgia',
            'Noto Sans Hebrew': 'Roboto',
            'Noto Serif Hebrew': 'Merriweather',
            'Arial Hebrew': 'Arial',
            'Miriam': 'Tahoma',
            'Gisha': 'Verdana',
            'Aharoni': 'Arial Black',
            'Secular One': 'Montserrat',
            'Suez One': 'Georgia',
            'Arimo': 'Arial'
        };
        
        // Sample text for demonstrating fonts (improved for readability)
        this.sampleTexts = {
            'en': "The quick brown fox jumps over the lazy dog. 0123456789",
            'he': "אבגד הוזח טיכל מנסע פצקר שתץ. 0123456789"
        };
        
        // Extended sample texts for showcase
        this.extendedSampleTexts = {
            'en': "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. 0123456789",
            'he': "אבגד הוזח טיכל מנסע פצקר שתץ. דג סקרן שט בים מאוכזב ולפתע מצא לו חברה. 0123456789"
        };
        
        // Generate vectors for all fonts
        this.fontVectors = {};
        this.matchConfig = {
            categoryWeight: 2,
            styleWeight: 2,
            weightWeight: 1,
            similarityWeight: 0.4, // reduced vector influence
            thresholdFraction: 0.5, // only composite matches above 50% accepted
            directPairConfidence: 0.6 // realistic confidence for direct pairings
        };
        this.matchCache = {};
        this.matchScoreCache = {}; // store raw scores for confidence calculation
        
        [...this.englishFonts, ...this.hebrewFonts].forEach(font => {
            this.fontVectors[font.name] = this.generateFontVector(font);
        });
    }
    
    // Renamed from fetchEnglishFonts to clarify it only fetches the list
    async fetchEnglishFontsList() {
        try {
            console.log('Fetching English fonts from Google Fonts API...');
            const response = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}&sort=popularity`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`Successfully fetched ${data.items.length} fonts from Google Fonts API`);
            
            // Use a much larger subset of Google Fonts (500 instead of 50)
            this.englishFonts = data.items.slice(0, 500).map(item => ({ 
                name: item.family, 
                category: item.category || 'sans-serif', 
                style: 'variable', 
                weight: 'variable' 
            }));
            
            console.log(`Using ${this.englishFonts.length} English fonts`);
        } catch (err) {
            console.error('Failed to fetch English fonts list:', err);
            console.log('Using fallback font list');
            // Enhanced fallback to a larger list if API fails
            this.englishFonts = [
                { name: 'Roboto', category: 'sans-serif', style: 'modern', weight: 'variable' },
                { name: 'Open Sans', category: 'sans-serif', style: 'friendly', weight: 'variable' },
                { name: 'Lato', category: 'sans-serif', style: 'modern', weight: 'variable' },
                { name: 'Montserrat', category: 'sans-serif', style: 'geometric', weight: 'variable' },
                { name: 'Poppins', category: 'sans-serif', style: 'modern', weight: 'variable' },
                { name: 'Inter', category: 'sans-serif', style: 'technical', weight: 'variable' },
                { name: 'Playfair Display', category: 'serif', style: 'elegant', weight: 'variable' },
                { name: 'Merriweather', category: 'serif', style: 'readable', weight: 'variable' },
                { name: 'Georgia', category: 'serif', style: 'classic', weight: 'regular' },
                { name: 'Arial', category: 'sans-serif', style: 'neutral', weight: 'regular' }
            ];
        }
    }

    // Lazy loading method - loads fonts only when needed
    async loadFontsLazily(fontNames) {
        const fontsToLoad = fontNames.filter(name => !this.loadedFonts || !this.loadedFonts.has(name));
        
        if (fontsToLoad.length === 0) {
            console.log('All requested fonts already loaded');
            return;
        }

        console.log(`Lazy loading ${fontsToLoad.length} fonts...`);

        if (typeof WebFont === 'undefined') {
            console.error('WebFontLoader is not available.');
            return;
        }

        // Initialize loadedFonts set if it doesn't exist
        if (!this.loadedFonts) {
            this.loadedFonts = new Set();
        }

        return new Promise((resolve) => {
            WebFont.load({
                google: {
                    families: fontsToLoad
                },
                active: () => {
                    console.log(`Successfully loaded ${fontsToLoad.length} fonts`);
                    fontsToLoad.forEach(font => this.loadedFonts.add(font));
                    resolve();
                },
                inactive: () => {
                    console.warn(`Some fonts failed to load, but continuing`);
                    fontsToLoad.forEach(font => this.loadedFonts.add(font)); // Mark as attempted
                    resolve();
                },
                timeout: 8000  // 8 second timeout
            });
        });
    }

    // Load the most popular fonts upfront (for immediate availability)
    async loadPopularFonts() {
        const popularFonts = this.englishFonts.slice(0, 20).map(f => f.name);
        const hebrewFonts = this.hebrewFonts.map(f => f.name);
        const allPopular = [...popularFonts, ...hebrewFonts];
        
        console.log('Loading most popular fonts for immediate use...');
        await this.loadFontsLazily(allPopular);
    }

    // Generate a simulated feature vector for a font based on its characteristics
    generateFontVector(font) {
        // This is a simplified approach - in a real ML system this would be based on actual font analysis
        const weightFactor = font.weight === 'bold' ? 0.8 : font.weight === 'regular' ? 0.5 : 0.6;
        const serifFactor = font.category === 'serif' ? 0.8 : font.category === 'sans-serif' ? 0.2 : 0.5;
        
        let styleFactor = 0.5;
        switch(font.style) {
            case 'modern': styleFactor = 0.8; break;
            case 'traditional': styleFactor = 0.2; break;
            case 'elegant': styleFactor = 0.7; break;
            case 'technical': styleFactor = 0.3; break;
            case 'friendly': styleFactor = 0.6; break;
            case 'geometric': styleFactor = 0.7; break;
            case 'readable': styleFactor = 0.5; break;
        }
        
        // Generate and normalize a 5-dimensional vector for consistent magnitude
        const rawVec = [
            weightFactor + Math.random() * 0.2 - 0.1,
            serifFactor + Math.random() * 0.2 - 0.1,
            styleFactor + Math.random() * 0.2 - 0.1,
            Math.random() * 0.5 + 0.3,
            Math.random() * 0.5 + 0.3
        ];
        const norm = Math.sqrt(rawVec.reduce((sum, val) => sum + val * val, 0));
        return rawVec.map(val => val / norm);
    }

    // Find matching font using simulated AI
    findMatchingFont(sourceFont, targetLang) {
        // Prepare target font set
        const targetFonts = targetLang === 'en' ? this.englishFonts : this.hebrewFonts;
        const cacheKey = `${sourceFont}-${targetLang}`;
        if (this.matchCache[cacheKey]) {
            return this.matchCache[cacheKey];
        }
        // If we have a direct pairing, use it
        if (this.fontPairings[sourceFont]) {
            const pairedFont = this.fontPairings[sourceFont];
            if (targetFonts.some(font => font.name === pairedFont)) {
                // cache direct pairing with full confidence
                this.matchCache[cacheKey] = pairedFont;
                // assign fixed confidence fraction for direct pairing
                this.matchScoreCache[cacheKey] = this.matchConfig.directPairConfidence;
                return pairedFont;
            }
        }
        // Composite attribute and vector similarity scoring (fallback)
        // Determine inverse source set
        const sourceLangFonts = targetLang === 'en' ? this.hebrewFonts : this.englishFonts;
        const sourceFontObj = sourceLangFonts.find(f => f.name === sourceFont);
        // Get source font vector for similarity calculations
        let sourceVector = this.fontVectors[sourceFont] || null;
        // If no precomputed vector, generate one based on font attributes
        if (!sourceVector && sourceFontObj) {
            sourceVector = this.generateFontVector(sourceFontObj);
        }
        // Compute composite scores
        let bestMatch = null;
        let bestScore = -Infinity;
        // Maximum possible composite score for normalization
        const maxComposite = this.matchConfig.categoryWeight + this.matchConfig.styleWeight + this.matchConfig.weightWeight + this.matchConfig.similarityWeight;
        targetFonts.forEach(f => {
            let score = 0;
            if (sourceFontObj) {
                if (f.category === sourceFontObj.category) score += this.matchConfig.categoryWeight;
                if (f.style === sourceFontObj.style) score += this.matchConfig.styleWeight;
                if (f.weight === sourceFontObj.weight) score += this.matchConfig.weightWeight;
            }
            const vec = this.fontVectors[f.name];
            if (vec && sourceVector) {
                // clamp similarity to zero for negative values
                const simRaw = this.calculateSimilarity(sourceVector, vec);
                const sim = Math.max(0, simRaw) * this.matchConfig.similarityWeight;
                score += sim;
            }
            if (score > bestScore) {
                bestScore = score;
                bestMatch = f.name;
            }
        });
        // Normalize score to fraction [0,1]
        let fraction = Math.max(0, Math.min(bestScore / maxComposite, 1));
        // If composite confidence below thresholdFraction, fallback to direct pairing or no match
        if (fraction < this.matchConfig.thresholdFraction) {
            if (this.fontPairings[sourceFont] && targetFonts.some(f => f.name === this.fontPairings[sourceFont])) {
                bestMatch = this.fontPairings[sourceFont];
                fraction = this.matchConfig.directPairConfidence;
            } else {
                // no reliable match
                bestMatch = null;
                fraction = 0;
            }
        }
        // Cache and return with fractional confidence
        this.matchCache[cacheKey] = bestMatch;
        this.matchScoreCache[cacheKey] = fraction;
        return bestMatch;
    }

    // New method to find multiple font alternatives with scores
    findMatchingFontAlternatives(sourceFont, targetLang, maxResults = 3) {
        const targetFonts = this.getFontsForLanguage(targetLang);
        if (!targetFonts || targetFonts.length === 0) {
            console.error(`No fonts available for target language: ${targetLang}`);
            return [];
        }

        const sourceVector = this.getFontVector(sourceFont);
        if (!sourceVector) {
            console.error(`Source font vector not found: ${sourceFont}`);
            return [];
        }

        // Calculate scores for all target fonts
        const alternatives = targetFonts.map(targetFont => {
            const targetVector = this.getFontVector(targetFont.name);
            if (!targetVector) return null;

            // Calculate similarity score
            const similarity = this.calculateSimilarity(sourceVector, targetVector);
            
            // Check for curated pairing bonus
            const curatedPair = this.fontPairings[sourceFont] === targetFont.name;
            const curatedBonus = curatedPair ? 0.15 : 0;
            
            // Calculate final score (0-1 range)
            const finalScore = Math.min(1, similarity + curatedBonus);
            
            return {
                name: targetFont.name,
                category: targetFont.category,
                style: targetFont.style,
                weight: targetFont.weight,
                score: finalScore,
                confidence: Math.round(finalScore * 100),
                isCuratedPair: curatedPair,
                metadata: {
                    similarity: similarity,
                    curatedBonus: curatedBonus
                }
            };
        }).filter(Boolean); // Remove null entries

        // Sort by score (highest first) and return top results
        alternatives.sort((a, b) => b.score - a.score);
        
        // Mark the best match
        if (alternatives.length > 0) {
            alternatives[0].isBestMatch = true;
        }

        return alternatives.slice(0, maxResults);
    }

    // Calculate match confidence percentage based on normalized fraction in cache
    getMatchPercentage(sourceFont, targetLang) {
        const cacheKey = `${sourceFont}-${targetLang}`;
        const fraction = this.matchScoreCache[cacheKey] || 0;
        return Math.round(fraction * 100);
    }

    // Calculate cosine similarity between two vectors
    calculateSimilarity(vec1, vec2) {
        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;
        
        for (let i = 0; i < vec1.length; i++) {
            dotProduct += vec1[i] * vec2[i];
            norm1 += vec1[i] * vec1[i];
            norm2 += vec2[i] * vec2[i];
        }
        
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }
    
    // Get a sample text for a specific language
    getSampleText(lang) {
        return this.sampleTexts[lang] || '';
    }
    
    // Get extended sample text for a specific language
    getExtendedSampleText(lang) {
        return this.extendedSampleTexts[lang] || '';
    }
    
    // Get fonts for specific language
    getFontsForLanguage(lang) {
        return lang === 'en' ? this.englishFonts : this.hebrewFonts;
    }
    
    // Get all fonts for both languages
    getAllFonts() {
        return {
            en: this.englishFonts,
            he: this.hebrewFonts
        };
    }
    
    // Get detailed match result: font name and confidence percentage
    matchFontDetail(sourceFont, targetLang) {
        const font = this.findMatchingFont(sourceFont, targetLang);
        const confidence = this.getMatchPercentage(sourceFont, targetLang);
        return { font, confidence };
    }
}

// Define compatible categories for font pairing
const categoryPairs = {
    'sans-serif': ['sans-serif','serif'],
    'serif': ['serif','sans-serif'],
    'display': ['display','serif'],
    'script': ['script','handwriting'],
    'handwriting': ['handwriting','script'],
    // add other category pairs or adjust as needed
};

// Utility to check if two fonts can be paired based on their category
function areCategoriesCompatible(source, target) {
    const allowed = categoryPairs[source.category] || [source.category];
    return allowed.includes(target.category);
}

// Initialize font manager as a global object
window.fontManager = new FontManager();

// Override matchFonts function to include category-based filtering
function matchFonts(sourceFont, targetFont) {
    // Find source font manager instance
    const fm = window.fontManager;
    
    // Check if both fonts exist in their respective collections
    const sourceExists = fm.englishFonts.concat(fm.hebrewFonts).some(f => f.name === sourceFont);
    const targetExists = fm.englishFonts.concat(fm.hebrewFonts).some(f => f.name === targetFont);
    
    if (!sourceExists || !targetExists) {
        console.warn('One or both fonts not found in font manager:', sourceFont, targetFont);
        return false;
    }
    
    // Get source and target font objects
    const sourceFontObj = fm.englishFonts.find(f => f.name === sourceFont) || fm.hebrewFonts.find(f => f.name === sourceFont);
    const targetFontObj = fm.englishFonts.find(f => f.name === targetFont) || fm.hebrewFonts.find(f => f.name === targetFont);
    
    // Check category compatibility
    return areCategoriesCompatible(sourceFontObj, targetFontObj);
}
