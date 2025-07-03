// Font database and management system
// Add Google Fonts API key (could be stored in .env and injected)
const GOOGLE_FONTS_API_KEY = 'AIzaSyCb_xsID8SNCyNdnkX5d5T5UBE6RuksuZw';

class FontManager {
    constructor() {
        this.englishFonts = [];
        this.hebrewFonts = [];
        this.allLocalFonts = [];
        this.fontsLoaded = false;
        this.maxFontsPerLanguage = 1000; // Limit for performance
        
        // Fallback fonts if local manifest fails
        this.fallbackHebrewFonts = [
            // Popular Google Fonts with Hebrew support
            { name: 'Heebo', category: 'sans-serif', style: 'modern', weight: 'variable' },
            { name: 'Assistant', category: 'sans-serif', style: 'friendly', weight: 'variable' },
            { name: 'Rubik', category: 'sans-serif', style: 'geometric', weight: 'variable' },
            { name: 'Alef', category: 'sans-serif', style: 'modern', weight: 'regular' },
            { name: 'Amatic SC', category: 'handwriting', style: 'casual', weight: 'regular' },
            { name: 'Arimo', category: 'sans-serif', style: 'technical', weight: 'variable' },
            { name: 'Bellefair', category: 'serif', style: 'elegant', weight: 'regular' },
            { name: 'Cousine', category: 'monospace', style: 'technical', weight: 'regular' },
            { name: 'David Libre', category: 'serif', style: 'classic', weight: 'regular' },
            { name: 'Frank Ruhl Libre', category: 'serif', style: 'elegant', weight: 'variable' },
            { name: 'M PLUS 1p', category: 'sans-serif', style: 'modern', weight: 'variable' },
            { name: 'M PLUS Rounded 1c', category: 'sans-serif', style: 'friendly', weight: 'variable' },
            { name: 'Miriam Libre', category: 'sans-serif', style: 'legible', weight: 'regular' },
            { name: 'Noto Sans Hebrew', category: 'sans-serif', style: 'balanced', weight: 'variable' },
            { name: 'Noto Serif Hebrew', category: 'serif', style: 'readable', weight: 'variable' },
            { name: 'Open Sans Hebrew', category: 'sans-serif', style: 'friendly', weight: 'variable' },
            { name: 'Secular One', category: 'sans-serif', style: 'modern', weight: 'regular' },
            { name: 'Suez One', category: 'serif', style: 'strong', weight: 'regular' },
            { name: 'Tinos', category: 'serif', style: 'classic', weight: 'regular' },
            { name: 'Varela Round', category: 'sans-serif', style: 'friendly', weight: 'regular' },
            { name: 'Work Sans', category: 'sans-serif', style: 'modern', weight: 'variable' },
            
            // Additional Hebrew fonts (some may be system fonts)
            { name: 'Arial Hebrew', category: 'sans-serif', style: 'neutral', weight: 'regular' },
            { name: 'Times New Roman Hebrew', category: 'serif', style: 'classic', weight: 'regular' },
            { name: 'Lucida Grande Hebrew', category: 'sans-serif', style: 'clean', weight: 'regular' },
            { name: 'Helvetica Hebrew', category: 'sans-serif', style: 'modern', weight: 'regular' },
            { name: 'Gill Sans Hebrew', category: 'sans-serif', style: 'humanist', weight: 'regular' },
            { name: 'Optima Hebrew', category: 'sans-serif', style: 'elegant', weight: 'regular' },
            { name: 'Palatino Hebrew', category: 'serif', style: 'elegant', weight: 'regular' },
            { name: 'Georgia Hebrew', category: 'serif', style: 'readable', weight: 'regular' },
            { name: 'Verdana Hebrew', category: 'sans-serif', style: 'screen', weight: 'regular' },
            { name: 'Trebuchet MS Hebrew', category: 'sans-serif', style: 'modern', weight: 'regular' },
            { name: 'Comic Sans MS Hebrew', category: 'handwriting', style: 'casual', weight: 'regular' },
            { name: 'Impact Hebrew', category: 'sans-serif', style: 'bold', weight: 'bold' },
            
            // Traditional Hebrew fonts
            { name: 'Miriam', category: 'sans-serif', style: 'legible', weight: 'regular' },
            { name: 'Gisha', category: 'sans-serif', style: 'screen', weight: 'regular' },
            { name: 'Aharoni', category: 'sans-serif', style: 'strong', weight: 'bold' },
            { name: 'Rod', category: 'sans-serif', style: 'bold', weight: 'bold' },
            { name: 'Narkisim', category: 'serif', style: 'traditional', weight: 'regular' },
            { name: 'Jerusalem', category: 'serif', style: 'decorative', weight: 'regular' },
            { name: 'Fixed Miriam Transparent', category: 'monospace', style: 'technical', weight: 'regular' },
            { name: 'Courier New Hebrew', category: 'monospace', style: 'technical', weight: 'regular' },
            
            // Modern Hebrew fonts
            { name: 'Karantina', category: 'display', style: 'decorative', weight: 'variable' },
            { name: 'Bellota Text', category: 'sans-serif', style: 'friendly', weight: 'regular' },
            { name: 'Rubik Mono One', category: 'monospace', style: 'modern', weight: 'regular' },
            { name: 'Rubik Microbe', category: 'display', style: 'decorative', weight: 'regular' },
            { name: 'Bellota', category: 'display', style: 'playful', weight: 'regular' },
            
            // Additional Traditional & Classic Hebrew fonts from local collection
            { name: 'David', category: 'serif', style: 'classic', weight: 'regular' },
            { name: 'David Bold', category: 'serif', style: 'classic', weight: 'bold' },
            { name: 'Hadassah', category: 'serif', style: 'elegant', weight: 'regular' },
            { name: 'Hadassah Bold', category: 'serif', style: 'elegant', weight: 'bold' },
            { name: 'Frank Ruhl', category: 'serif', style: 'traditional', weight: 'regular' },
            { name: 'Frank Bold', category: 'serif', style: 'traditional', weight: 'bold' },
            { name: 'Koren', category: 'serif', style: 'scholarly', weight: 'regular' },
            { name: 'Koren Bold', category: 'serif', style: 'scholarly', weight: 'bold' },
            { name: 'Vilna', category: 'serif', style: 'traditional', weight: 'regular' },
            { name: 'Vilna Bold', category: 'serif', style: 'traditional', weight: 'bold' },
            { name: 'Rashi', category: 'serif', style: 'commentary', weight: 'regular' },
            { name: 'Rashi Bold', category: 'serif', style: 'commentary', weight: 'bold' },
            { name: 'Stam', category: 'serif', style: 'ceremonial', weight: 'regular' },
            { name: 'Stamfont', category: 'serif', style: 'ceremonial', weight: 'regular' },
            
            // Modern Sans-Serif Hebrew fonts
            { name: 'Guttman David', category: 'sans-serif', style: 'modern', weight: 'regular' },
            { name: 'Guttman David Bold', category: 'sans-serif', style: 'modern', weight: 'bold' },
            { name: 'Guttman Aharoni', category: 'sans-serif', style: 'strong', weight: 'bold' },
            { name: 'Guttman Hatzvi', category: 'sans-serif', style: 'modern', weight: 'regular' },
            { name: 'Guttman Kav', category: 'sans-serif', style: 'technical', weight: 'regular' },
            { name: 'Guttman Kav Bold', category: 'sans-serif', style: 'technical', weight: 'bold' },
            { name: 'Guttman Myamfix', category: 'monospace', style: 'technical', weight: 'regular' },
            { name: 'Levenim MT', category: 'sans-serif', style: 'clean', weight: 'regular' },
            { name: 'Levenim MT Bold', category: 'sans-serif', style: 'clean', weight: 'bold' },
            
            // Decorative & Display Hebrew fonts
            { name: 'Peigneli', category: 'display', style: 'decorative', weight: 'regular' },
            { name: 'Peigneli Bold', category: 'display', style: 'decorative', weight: 'bold' },
            { name: 'Aharoni Bold', category: 'display', style: 'strong', weight: 'bold' },
            { name: 'Ktav Hebrew', category: 'handwriting', style: 'handwritten', weight: 'regular' },
            { name: 'Ktav Yad', category: 'handwriting', style: 'handwritten', weight: 'regular' },
            { name: 'Krembo', category: 'display', style: 'playful', weight: 'regular' },
            { name: 'Gulim', category: 'sans-serif', style: 'screen', weight: 'regular' },
            { name: 'Batang', category: 'serif', style: 'formal', weight: 'regular' },
            
            // Contemporary Hebrew fonts
            { name: 'Tahoma Hebrew', category: 'sans-serif', style: 'screen', weight: 'regular' },
            { name: 'Segoe UI Hebrew', category: 'sans-serif', style: 'modern', weight: 'regular' },
            { name: 'Calibri Hebrew', category: 'sans-serif', style: 'clean', weight: 'regular' },
            { name: 'Arial Unicode MS', category: 'sans-serif', style: 'universal', weight: 'regular' },
            { name: 'Microsoft Sans Serif', category: 'sans-serif', style: 'neutral', weight: 'regular' },
            
            // Specialized Hebrew fonts
            { name: 'Hebrew Rap', category: 'display', style: 'modern', weight: 'bold' },
            { name: 'Agudat Israel', category: 'serif', style: 'traditional', weight: 'regular' },
            { name: 'Oron', category: 'sans-serif', style: 'geometric', weight: 'variable' },
            { name: 'Oron Bold', category: 'sans-serif', style: 'geometric', weight: 'bold' },
            { name: 'Secular', category: 'sans-serif', style: 'modern', weight: 'regular' },
            { name: 'Gveret', category: 'serif', style: 'elegant', weight: 'regular' },
            { name: 'Narkis Tam', category: 'serif', style: 'traditional', weight: 'regular' },
            
            // Vintage & Classic Hebrew fonts
            { name: 'Narkis Classic', category: 'serif', style: 'classic', weight: 'regular' },
            { name: 'Narkis Block', category: 'display', style: 'bold', weight: 'bold' },
            { name: 'Toledo', category: 'serif', style: 'traditional', weight: 'regular' },
            { name: 'Toledo Bold', category: 'serif', style: 'traditional', weight: 'bold' },
            { name: 'Soncino', category: 'serif', style: 'traditional', weight: 'regular' },
            { name: 'Soncino Bold', category: 'serif', style: 'traditional', weight: 'bold' },
            { name: 'Mantova', category: 'serif', style: 'decorative', weight: 'regular' },
            { name: 'Mantova Bold', category: 'serif', style: 'decorative', weight: 'bold' },
            
            // Modern Display & Fun Hebrew fonts
            { name: 'BN Modern', category: 'display', style: 'modern', weight: 'regular' },
            { name: 'BN Modern Bold', category: 'display', style: 'modern', weight: 'bold' },
            { name: 'BN Concept', category: 'display', style: 'futuristic', weight: 'regular' },
            { name: 'BN Digital', category: 'display', style: 'digital', weight: 'regular' },
            { name: 'Almog', category: 'handwriting', style: 'casual', weight: 'regular' },
            { name: 'Amnon', category: 'handwriting', style: 'playful', weight: 'regular' },
            { name: 'Comic Hebrew', category: 'handwriting', style: 'comic', weight: 'regular' },
            { name: 'Graffiti Hebrew', category: 'display', style: 'urban', weight: 'bold' }
        ];
        
        // Store fallback fonts for when local fonts fail to load
        this.fallbackHebrewFonts = [...this.hebrewFonts];
        this.allLocalFonts = [];
        this.fontsLoaded = false;
        this.maxFontsPerLanguage = 1000; // Limit for performance
        
        this.fontPairings = {};
        this.sampleTexts = {};
        this.extendedSampleTexts = {};
        this.fontVectors = {};
        this.matchConfig = {};
        this.matchCache = {};
        this.matchScoreCache = {};
    }

    async initialize() {
        console.log('FontManager: Initializing with local font collection...');
        
        try {
            // Try to load from local manifest first
            await this.loadLocalFonts();
            console.log(`FontManager: Loaded ${this.englishFonts.length} English and ${this.hebrewFonts.length} Hebrew fonts from local collection.`);
        } catch (error) {
            console.warn('FontManager: Failed to load local fonts, falling back to Google Fonts:', error);
            // Fallback to Google Fonts
            await this.fetchEnglishFontsList();
            this.hebrewFonts = this.fallbackHebrewFonts;
        }
        
        // Set up all font data, pairings, vectors, etc.
        this.setupFontData();
        console.log('FontManager: Font data setup complete.');

        // Mark fonts as loaded
        this.fontsLoaded = true;
        console.log('FontManager: Initialization complete (fonts will load on-demand).');
    }

    /**
     * Load fonts from local manifest files
     */
    async loadLocalFonts() {
        try {
            const response = await fetch('/public/fonts/fonts-compact.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.allLocalFonts = data.fonts || [];
            
            // Separate fonts by language and limit for performance
            const englishFonts = this.allLocalFonts
                .filter(font => font.lang === 'en')
                .sort((a, b) => a.name.localeCompare(b.name))
                .slice(0, this.maxFontsPerLanguage);
                
            const hebrewFonts = this.allLocalFonts
                .filter(font => font.lang === 'he')
                .sort((a, b) => a.name.localeCompare(b.name))
                .slice(0, this.maxFontsPerLanguage);
            
            this.englishFonts = englishFonts;
            this.hebrewFonts = hebrewFonts;
            
            console.log(`FontManager: Loaded ${englishFonts.length} English fonts and ${hebrewFonts.length} Hebrew fonts from local collection`);
            
        } catch (error) {
            console.error('FontManager: Error loading local fonts:', error);
            throw error;
        }
    }

    /**
     * Load a specific font file and add CSS
     */
    loadFontFile(font) {
        if (!font.file) {
            console.warn('FontManager: Font file path missing for:', font.name);
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            // Check if font is already loaded
            const existingStyle = document.querySelector(`style[data-font="${font.name}"]`);
            if (existingStyle) {
                resolve();
                return;
            }

            // Create CSS for font-face
            const fontPath = `/public/fonts/${font.file}`;
            const fontFamily = font.name;
            
            // Determine font-weight and font-style from font data
            let fontWeight = 'normal';
            let fontStyle = 'normal';
            
            if (font.weight === 'bold' || font.weight === 'heavy') fontWeight = 'bold';
            else if (font.weight === 'light' || font.weight === 'thin') fontWeight = '300';
            else if (font.weight === 'medium') fontWeight = '500';
            
            if (font.name.toLowerCase().includes('italic')) fontStyle = 'italic';

            const css = `
                @font-face {
                    font-family: "${fontFamily}";
                    src: url("${fontPath}") format("${this.getFormat(font.extension)}");
                    font-weight: ${fontWeight};
                    font-style: ${fontStyle};
                    font-display: swap;
                }
            `;

            // Add CSS to document
            const style = document.createElement('style');
            style.setAttribute('data-font', font.name);
            style.textContent = css;
            document.head.appendChild(style);

            // Test if font loaded successfully
            setTimeout(() => {
                const testElement = document.createElement('div');
                testElement.style.fontFamily = `"${fontFamily}", Arial, sans-serif`;
                testElement.style.position = 'absolute';
                testElement.style.left = '-9999px';
                testElement.textContent = 'Test';
                document.body.appendChild(testElement);
                
                // Clean up test element
                setTimeout(() => {
                    document.body.removeChild(testElement);
                }, 100);
                
                resolve();
            }, 100);
        });
    }

    /**
     * Get CSS format string for font extension
     */
    getFormat(extension) {
        switch (extension.toLowerCase()) {
            case '.woff2': return 'woff2';
            case '.woff': return 'woff';
            case '.ttf': return 'truetype';
            case '.otf': return 'opentype';
            case '.eot': return 'embedded-opentype';
            default: return 'truetype';
        }
    }

    // New method to set up all data structures
    setupFontData() {
        // Improved font pairings for more accurate matching
        this.fontPairings = {
            // English to Hebrew mappings
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
            'Courier New': 'Courier New Hebrew',
            'Trebuchet MS': 'Assistant',
            'Garamond': 'David Libre',
            'Helvetica': 'Helvetica Hebrew',
            'Comic Sans MS': 'Comic Sans MS Hebrew',
            'Impact': 'Impact Hebrew',
            'Palatino': 'Palatino Hebrew',
            'Optima': 'Optima Hebrew',
            'Gill Sans': 'Gill Sans Hebrew',
            'Lucida Grande': 'Lucida Grande Hebrew',
            'Work Sans': 'Work Sans',
            'Varela Round': 'Varela Round',
            'Amatic SC': 'Amatic SC',
            'Bellefair': 'Bellefair',
            'Cousine': 'Cousine',
            'Tinos': 'Tinos',
            'M PLUS 1p': 'M PLUS 1p',
            'M PLUS Rounded 1c': 'M PLUS Rounded 1c',
            
            // Additional English to Hebrew mappings for better variety
            'Source Sans Pro': 'Guttman David',
            'PT Sans': 'Levenim MT',
            'Raleway': 'Secular',
            'Nunito': 'Assistant',
            'Poppins': 'Heebo',
            'Lora': 'David',
            'Source Serif Pro': 'Koren',
            'PT Serif': 'Hadassah',
            'Crimson Text': 'Frank Ruhl',
            'EB Garamond': 'Vilna',
            'Libre Baskerville': 'Toledo',
            'Cormorant Garamond': 'Soncino',
            'Abril Fatface': 'Peigneli Bold',
            'Oswald': 'Oron Bold',
            'Fjalla One': 'Hebrew Rap',
            'Anton': 'Narkis Block',
            'Staatliches': 'BN Modern Bold',
            'Space Mono': 'Guttman Myamfix',
            'JetBrains Mono': 'Fixed Miriam Transparent',
            'Fira Code': 'Courier New Hebrew',
            'Dancing Script': 'Ktav Yad',
            'Pacifico': 'Krembo',
            'Kalam': 'Almog',
            'Caveat': 'Amnon',
            'Satisfy': 'Comic Hebrew',
            'Bangers': 'Graffiti Hebrew',
            
            // Hebrew to English mappings
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
            'Arimo': 'Arial',
            'Alef': 'Open Sans',
            'Miriam Libre': 'Open Sans',
            'Open Sans Hebrew': 'Open Sans',
            'Times New Roman Hebrew': 'Times New Roman',
            'Helvetica Hebrew': 'Helvetica',
            'Comic Sans MS Hebrew': 'Comic Sans MS',
            'Impact Hebrew': 'Impact',
            'Palatino Hebrew': 'Palatino',
            'Optima Hebrew': 'Optima',
            'Gill Sans Hebrew': 'Gill Sans',
            'Lucida Grande Hebrew': 'Lucida Grande',
            'Georgia Hebrew': 'Georgia',
            'Verdana Hebrew': 'Verdana',
            'Trebuchet MS Hebrew': 'Trebuchet MS',
            'Courier New Hebrew': 'Courier New',
            'Work Sans': 'Work Sans',
            'Varela Round': 'Varela Round',
            'Amatic SC': 'Amatic SC',
            'Bellefair': 'Bellefair',
            'Cousine': 'Cousine',
            'Tinos': 'Tinos',
            'M PLUS 1p': 'M PLUS 1p',
            'M PLUS Rounded 1c': 'M PLUS Rounded 1c',
            'Rod': 'Impact',
            'Narkisim': 'Times New Roman',
            'Jerusalem': 'Palatino',
            'Fixed Miriam Transparent': 'Courier New',
            'Karantina': 'Amatic SC',
            'Bellota Text': 'Open Sans',
            'Bellota': 'Comic Sans MS',
            'Rubik Mono One': 'Courier New',
            'Rubik Microbe': 'Impact',
            
            // New Hebrew fonts mappings
            'David': 'Georgia',
            'David Bold': 'Georgia',
            'Hadassah': 'Playfair Display',
            'Hadassah Bold': 'Playfair Display',
            'Frank Ruhl': 'Times New Roman',
            'Frank Bold': 'Times New Roman',
            'Koren': 'Times New Roman',
            'Koren Bold': 'Times New Roman',
            'Vilna': 'Times New Roman',
            'Vilna Bold': 'Times New Roman',
            'Rashi': 'Times New Roman',
            'Rashi Bold': 'Times New Roman',
            'Stam': 'Times New Roman',
            'Stamfont': 'Times New Roman',
            'Guttman David': 'Open Sans',
            'Guttman David Bold': 'Open Sans',
            'Guttman Aharoni': 'Arial Black',
            'Guttman Hatzvi': 'Roboto',
            'Guttman Kav': 'Arial',
            'Guttman Kav Bold': 'Arial',
            'Guttman Myamfix': 'Courier New',
            'Levenim MT': 'Calibri',
            'Levenim MT Bold': 'Calibri',
            'Peigneli': 'Playfair Display',
            'Peigneli Bold': 'Playfair Display',
            'Aharoni Bold': 'Arial Black',
            'Ktav Hebrew': 'Comic Sans MS',
            'Ktav Yad': 'Comic Sans MS',
            'Krembo': 'Comic Sans MS',
            'Gulim': 'Verdana',
            'Batang': 'Times New Roman',
            'Tahoma Hebrew': 'Tahoma',
            'Segoe UI Hebrew': 'Segoe UI',
            'Calibri Hebrew': 'Calibri',
            'Arial Unicode MS': 'Arial',
            'Microsoft Sans Serif': 'Microsoft Sans Serif',
            'Hebrew Rap': 'Impact',
            'Agudat Israel': 'Times New Roman',
            'Oron': 'Montserrat',
            'Oron Bold': 'Montserrat',
            'Secular': 'Open Sans',
            'Gveret': 'Georgia',
            'Narkis Tam': 'Times New Roman',
            'Narkis Classic': 'Times New Roman',
            'Narkis Block': 'Impact',
            'Toledo': 'Times New Roman',
            'Toledo Bold': 'Times New Roman',
            'Soncino': 'Times New Roman',
            'Soncino Bold': 'Times New Roman',
            'Mantova': 'Palatino',
            'Mantova Bold': 'Palatino',
            'BN Modern': 'Roboto',
            'BN Modern Bold': 'Roboto',
            'BN Concept': 'Futura',
            'BN Digital': 'Courier New',
            'Almog': 'Comic Sans MS',
            'Amnon': 'Comic Sans MS',
            'Comic Hebrew': 'Comic Sans MS',
            'Graffiti Hebrew': 'Impact',
            
            // Reverse mappings for additional variety
            'Guttman David': 'Source Sans Pro',
            'Levenim MT': 'PT Sans',
            'Secular': 'Raleway',
            'David': 'Lora',
            'Koren': 'Source Serif Pro',
            'Hadassah': 'PT Serif',
            'Frank Ruhl': 'Crimson Text',
            'Vilna': 'EB Garamond',
            'Toledo': 'Libre Baskerville',
            'Soncino': 'Cormorant Garamond',
            'Peigneli Bold': 'Abril Fatface',
            'Oron Bold': 'Oswald',
            'Hebrew Rap': 'Fjalla One',
            'Narkis Block': 'Anton',
            'BN Modern Bold': 'Staatliches',
            'Guttman Myamfix': 'Space Mono',
            'Ktav Yad': 'Dancing Script',
            'Krembo': 'Pacifico',
            'Almog': 'Kalam',
            'Amnon': 'Caveat',
            'Comic Hebrew': 'Satisfy',
            'Graffiti Hebrew': 'Bangers'
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

    // Lazy loading method - loads fonts only when needed (updated for local fonts)
    async loadFontsLazily(fontNames) {
        if (!this.loadedFonts) {
            this.loadedFonts = new Set();
        }

        const fontsToLoad = fontNames.filter(name => !this.loadedFonts.has(name));
        
        if (fontsToLoad.length === 0) {
            console.log('All requested fonts already loaded');
            return;
        }

        console.log(`Lazy loading ${fontsToLoad.length} local fonts...`);

        const loadPromises = [];

        for (const fontName of fontsToLoad) {
            // Find font in our local collection
            const font = this.allLocalFonts.find(f => f.name === fontName) ||
                        this.englishFonts.find(f => f.name === fontName) ||
                        this.hebrewFonts.find(f => f.name === fontName);

            if (font && font.file) {
                // Load local font file
                const loadPromise = this.loadFontFile(font).then(() => {
                    this.loadedFonts.add(fontName);
                    console.log(`✅ Loaded local font: ${fontName}`);
                }).catch(error => {
                    console.warn(`⚠️  Failed to load local font ${fontName}:`, error);
                    // Still mark as attempted to avoid retry loops
                    this.loadedFonts.add(fontName);
                });
                loadPromises.push(loadPromise);
            } else {
                // Fallback to Google Fonts for missing local fonts
                if (typeof WebFont !== 'undefined') {
                    const fallbackPromise = new Promise((resolve) => {
                        WebFont.load({
                            google: { families: [fontName] },
                            active: () => {
                                this.loadedFonts.add(fontName);
                                console.log(`✅ Loaded fallback Google font: ${fontName}`);
                                resolve();
                            },
                            inactive: () => {
                                this.loadedFonts.add(fontName);
                                console.warn(`⚠️  Failed to load Google font: ${fontName}`);
                                resolve();
                            },
                            timeout: 5000
                        });
                    });
                    loadPromises.push(fallbackPromise);
                } else {
                    console.warn(`⚠️  Font not found locally and WebFont not available: ${fontName}`);
                    this.loadedFonts.add(fontName);
                }
            }
        }

        // Wait for all fonts to load
        await Promise.all(loadPromises);
        console.log(`✅ Completed loading ${fontsToLoad.length} fonts`);
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
