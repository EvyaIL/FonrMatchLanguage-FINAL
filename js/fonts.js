// Font database and management system
// Add Google Fonts API key (could be stored in .env and injected)
const GOOGLE_FONTS_API_KEY = 'AIzaSyCb_xsID8SNCyNdnkX5d5T5UBE6RuksuZw';

class FontManager {
    constructor() {
        // Fetch English font list dynamically from Google Fonts API
        this.englishFonts = [];
        this.fetchEnglishFonts();

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
        
        // Font feature vectors (for AI simulation)
        this.fontVectors = {};
        // Matching configuration: adjustable weights and threshold for composite scoring
        this.matchConfig = {
            categoryWeight: 2,
            styleWeight: 2,
            weightWeight: 1,
            similarityWeight: 0.4, // reduced vector influence
            thresholdFraction: 0.5, // only composite matches above 50% accepted
            directPairConfidence: 0.6 // realistic confidence for direct pairings
        };
        // Cache for computed matches to improve performance
        this.matchCache = {};
        this.matchScoreCache = {}; // store raw scores for confidence calculation
        
        // Generate vectors for all fonts
        [...this.englishFonts, ...this.hebrewFonts].forEach(font => {
            this.fontVectors[font.name] = this.generateFontVector(font);
        });
        
        this.preloadFonts();
    }
    
    // Fetch and populate englishFonts from Google Fonts API
    fetchEnglishFonts() {
        fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}&sort=popularity`)
            .then(res => res.json())
            .then(data => {
                this.englishFonts = data.items.map(item => ({ name: item.family, category: 'sans-serif', style: 'variable', weight: 'variable' }));

                // Load all fonts after fetching
                if (window.WebFont) {
                    const engFamilies = this.englishFonts.map(f => f.name);
                    const hebFamilies = this.hebrewFonts.map(f => f.name);
                    const allFamilies = [...engFamilies, ...hebFamilies];
                    WebFont.load({
                        google: { families: allFamilies },
                        active: () => {
                            // Notify application that fonts are loaded
                            document.dispatchEvent(new Event('fonts-loaded'));
                        }
                    });
                } else {
                    document.dispatchEvent(new Event('fonts-loaded'));   
                }

                // Generate vectors for new fonts
                this.englishFonts.forEach(font => {
                    this.fontVectors[font.name] = this.generateFontVector(font);
                });

                // Populate source-font initial select if still desired (Choices will handle later)
                const selectEl = document.getElementById('source-font');
                if (selectEl) {
                    selectEl.innerHTML = '';
                    this.englishFonts.forEach(font => {
                        const opt = document.createElement('option');
                        opt.value = font.name;
                        opt.textContent = font.name;
                        selectEl.appendChild(opt);
                    });
                }
            })
            .catch(err => console.error('Failed to fetch English fonts:', err));
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
        this.sampleTexts[lang] || '';
    }
    
    // Get extended sample text for a specific language
    getExtendedSampleText(lang) {
        this.extendedSampleTexts[lang] || '';
    }
    
    // Get fonts for specific language
    getFontsForLanguage(lang) {
        lang === 'en' ? this.englishFonts : this.hebrewFonts;
    }
    
    // Get all fonts for both languages
    getAllFonts() {
        return {
            en: this.englishFonts,
            he: this.hebrewFonts
        };
    }
    
    // Preload fonts to ensure they're available
    preloadFonts() {
        const allFonts = [...this.englishFonts, ...this.hebrewFonts];
        const uniqueFonts = new Set(allFonts.map(font => font.name));
        
        const preloadDiv = document.createElement('div');
        preloadDiv.style.visibility = 'hidden';
        preloadDiv.style.position = 'absolute';
        preloadDiv.style.top = '-9999px';
        preloadDiv.style.fontFamily = 'sans-serif';
        
        uniqueFonts.forEach(fontName => {
            const span = document.createElement('span');
            span.style.fontFamily = fontName;
            span.textContent = 'ABCDEFGabcdefg1234567890אבגדהוזחטיכלמנסעפצקרשת';
            preloadDiv.appendChild(span);
        });
        
        document.body.appendChild(preloadDiv);
        
        setTimeout(() => {
            document.body.removeChild(preloadDiv);
        }, 3000);
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
const fontManager = new FontManager();

// Override matchFonts function to include category-based filtering
function matchFonts(sourceFont, targetFont) {
    // Filter out obviously incompatible categories early
    if (!areCategoriesCompatible(sourceFont, targetFont)) {
        return { font: targetFont.name, confidence: 0 };
    }

    // ...existing normalization and similarity logic
    
    // Normalize vectors, compute similarity, threshold check, etc.
    
    // ...remaining matchFonts implementation
}
