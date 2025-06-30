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
        // If we have a direct pairing, use it
        if (this.fontPairings[sourceFont]) {
            const pairedFont = this.fontPairings[sourceFont];
            const targetFonts = targetLang === 'en' ? this.englishFonts : this.hebrewFonts;
            
            // Check if the paired font is available in the target language
            if (targetFonts.some(font => font.name === pairedFont)) {
                return pairedFont;
            }
        }
        
        // Otherwise use vector similarity (fallback)
        const sourceVector = this.fontVectors[sourceFont];
        if (!sourceVector) return null;
        
        const targetFonts = targetLang === 'en' ? this.englishFonts : this.hebrewFonts;
        
        let bestMatch = null;
        let highestSimilarity = -1;
        
        targetFonts.forEach(font => {
            const targetVector = this.fontVectors[font.name];
            if (!targetVector) return;
            
            const similarity = this.calculateSimilarity(sourceVector, targetVector);
            
            if (similarity > highestSimilarity) {
                highestSimilarity = similarity;
                bestMatch = font.name;
            }
        });
        
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
}

// Initialize font manager as a global object
const fontManager = new FontManager();
