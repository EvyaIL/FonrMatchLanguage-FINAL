// Font database and management system
class FontManager {
    constructor() {
        this.englishFonts = [
            { name: 'Inter', category: 'sans-serif', style: 'modern', weight: 'variable' },
            { name: 'Open Sans', category: 'sans-serif', style: 'friendly', weight: 'variable' },
            { name: 'Roboto', category: 'sans-serif', style: 'modern', weight: 'variable' },
            { name: 'Montserrat', category: 'sans-serif', style: 'geometric', weight: 'variable' },
            { name: 'Lato', category: 'sans-serif', style: 'balanced', weight: 'variable' },
            { name: 'Playfair Display', category: 'serif', style: 'elegant', weight: 'variable' },
            { name: 'Merriweather', category: 'serif', style: 'readable', weight: 'variable' },
            { name: 'Georgia', category: 'serif', style: 'classic', weight: 'regular' },
            { name: 'Times New Roman', category: 'serif', style: 'traditional', weight: 'regular' },
            { name: 'Arial', category: 'sans-serif', style: 'neutral', weight: 'regular' },
            { name: 'Verdana', category: 'sans-serif', style: 'screen', weight: 'regular' },
            { name: 'Tahoma', category: 'sans-serif', style: 'legible', weight: 'regular' },
            { name: 'Courier New', category: 'monospace', style: 'technical', weight: 'regular' },
            { name: 'Trebuchet MS', category: 'sans-serif', style: 'friendly', weight: 'regular' },
            { name: 'Garamond', category: 'serif', style: 'elegant', weight: 'regular' }
        ];
        
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
            similarityWeight: 1,
            threshold: 1.5 // minimum score to accept composite match
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
        
        // Generate a 5-dimensional vector
        return [
            weightFactor + Math.random() * 0.2 - 0.1,   // Weight dimension
            serifFactor + Math.random() * 0.2 - 0.1,    // Serif vs sans-serif dimension
            styleFactor + Math.random() * 0.2 - 0.1,    // Style dimension
            Math.random() * 0.5 + 0.3,                  // x-height dimension
            Math.random() * 0.5 + 0.3                   // width dimension
        ];
    }

    // Find matching font using simulated AI
    findMatchingFont(sourceFont, targetLang) {
        const cacheKey = `${sourceFont}-${targetLang}`;
        if (this.matchCache[cacheKey]) {
            return this.matchCache[cacheKey];
        }
        // If we have a direct pairing, use it
        if (this.fontPairings[sourceFont]) {
            const pairedFont = this.fontPairings[sourceFont];
            const targetFonts = targetLang === 'en' ? this.englishFonts : this.hebrewFonts;
            if (targetFonts.some(font => font.name === pairedFont)) {
                // cache direct pairing with full confidence
                this.matchCache[cacheKey] = pairedFont;
                this.matchScoreCache[cacheKey] = this.matchConfig.categoryWeight + this.matchConfig.styleWeight + this.matchConfig.weightWeight + this.matchConfig.similarityWeight;
                return pairedFont;
            }
        }
        // Composite attribute and vector similarity scoring (fallback)
        // Determine inverse source set
        const sourceLangFonts = targetLang === 'en' ? this.hebrewFonts : this.englishFonts;
        const sourceFontObj = sourceLangFonts.find(f => f.name === sourceFont);
        // Compute composite scores
        let bestMatch = null;
        let bestScore = -Infinity;
        targetFonts.forEach(f => {
            let score = 0;
            if (sourceFontObj) {
                if (f.category === sourceFontObj.category) score += this.matchConfig.categoryWeight;
                if (f.style === sourceFontObj.style) score += this.matchConfig.styleWeight;
                if (f.weight === sourceFontObj.weight) score += this.matchConfig.weightWeight;
            }
            const vec = this.fontVectors[f.name];
            if (vec) {
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
        // If composite score below threshold, fallback to direct pairing or pure vector
        if (bestScore < this.matchConfig.threshold) {
            if (this.fontPairings[sourceFont] && targetFonts.some(f => f.name === this.fontPairings[sourceFont])) {
                bestMatch = this.fontPairings[sourceFont];
                bestScore = this.matchConfig.categoryWeight + this.matchConfig.styleWeight + this.matchConfig.weightWeight + this.matchConfig.similarityWeight;
            } else {
                // pure vector fallback
                let pureBest = null;
                let maxSim = -1;
                targetFonts.forEach(f => {
                    const vec = this.fontVectors[f.name];
                    if (!vec) return;
                    const simRaw = this.calculateSimilarity(sourceVector, vec);
                    const sim = Math.max(0, simRaw);
                    if (sim > maxSim) { maxSim = sim; pureBest = f.name; }
                });
                bestMatch = pureBest;
                bestScore = maxSim * this.matchConfig.similarityWeight;
            }
        }
        // Cache and return
        this.matchCache[cacheKey] = bestMatch;
        this.matchScoreCache[cacheKey] = bestScore;
        return bestMatch;
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

// Initialize font manager as a global object
const fontManager = new FontManager();
