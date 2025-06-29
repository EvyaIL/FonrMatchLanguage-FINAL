// Font database and management system
class FontManager {
    constructor() {
        // Comprehensive English font library
        this.englishFonts = [
            // Modern Sans-Serif
            { name: 'Inter', category: 'sans-serif', style: 'modern', weight: 'variable', popularity: 10 },
            { name: 'Open Sans', category: 'sans-serif', style: 'friendly', weight: 'variable', popularity: 10 },
            { name: 'Roboto', category: 'sans-serif', style: 'modern', weight: 'variable', popularity: 10 },
            { name: 'Source Sans Pro', category: 'sans-serif', style: 'clean', weight: 'variable', popularity: 9 },
            { name: 'Lato', category: 'sans-serif', style: 'balanced', weight: 'variable', popularity: 9 },
            { name: 'Nunito', category: 'sans-serif', style: 'rounded', weight: 'variable', popularity: 8 },
            { name: 'Poppins', category: 'sans-serif', style: 'geometric', weight: 'variable', popularity: 8 },
            { name: 'Montserrat', category: 'sans-serif', style: 'geometric', weight: 'variable', popularity: 8 },
            { name: 'Outfit', category: 'sans-serif', style: 'modern', weight: 'variable', popularity: 7 },
            { name: 'DM Sans', category: 'sans-serif', style: 'clean', weight: 'variable', popularity: 7 },
            { name: 'Plus Jakarta Sans', category: 'sans-serif', style: 'modern', weight: 'variable', popularity: 7 },
            { name: 'Work Sans', category: 'sans-serif', style: 'clean', weight: 'variable', popularity: 7 },
            { name: 'Lexend', category: 'sans-serif', style: 'readable', weight: 'variable', popularity: 6 },
            { name: 'Red Hat Display', category: 'sans-serif', style: 'modern', weight: 'variable', popularity: 6 },
            { name: 'Manrope', category: 'sans-serif', style: 'modern', weight: 'variable', popularity: 6 },
            { name: 'Figtree', category: 'sans-serif', style: 'geometric', weight: 'variable', popularity: 6 },
            { name: 'Space Grotesk', category: 'sans-serif', style: 'quirky', weight: 'variable', popularity: 5 },
            { name: 'Epilogue', category: 'sans-serif', style: 'modern', weight: 'variable', popularity: 5 },
            { name: 'Sora', category: 'sans-serif', style: 'tech', weight: 'variable', popularity: 5 },
            { name: 'Be Vietnam Pro', category: 'sans-serif', style: 'clean', weight: 'variable', popularity: 5 },
            
            // Classic Sans-Serif
            { name: 'Arial', category: 'sans-serif', style: 'neutral', weight: 'regular', popularity: 10 },
            { name: 'Helvetica', category: 'sans-serif', style: 'classic', weight: 'regular', popularity: 10 },
            { name: 'Verdana', category: 'sans-serif', style: 'screen', weight: 'regular', popularity: 9 },
            { name: 'Tahoma', category: 'sans-serif', style: 'legible', weight: 'regular', popularity: 8 },
            { name: 'Trebuchet MS', category: 'sans-serif', style: 'friendly', weight: 'regular', popularity: 7 },
            { name: 'Century Gothic', category: 'sans-serif', style: 'geometric', weight: 'regular', popularity: 6 },
            { name: 'Futura', category: 'sans-serif', style: 'geometric', weight: 'regular', popularity: 8 },
            { name: 'Gill Sans', category: 'sans-serif', style: 'humanist', weight: 'regular', popularity: 7 },
            { name: 'Franklin Gothic', category: 'sans-serif', style: 'industrial', weight: 'regular', popularity: 6 },
            { name: 'Optima', category: 'sans-serif', style: 'elegant', weight: 'regular', popularity: 6 },
            
            // Modern Serif
            { name: 'Playfair Display', category: 'serif', style: 'elegant', weight: 'variable', popularity: 9 },
            { name: 'Source Serif Pro', category: 'serif', style: 'readable', weight: 'variable', popularity: 8 },
            { name: 'Crimson Text', category: 'serif', style: 'classic', weight: 'variable', popularity: 7 },
            { name: 'Libre Baskerville', category: 'serif', style: 'elegant', weight: 'regular', popularity: 7 },
            { name: 'Cormorant Garamond', category: 'serif', style: 'elegant', weight: 'variable', popularity: 6 },
            { name: 'Lora', category: 'serif', style: 'contemporary', weight: 'variable', popularity: 8 },
            { name: 'Literata', category: 'serif', style: 'readable', weight: 'variable', popularity: 6 },
            { name: 'Spectral', category: 'serif', style: 'contemporary', weight: 'variable', popularity: 6 },
            { name: 'Bitter', category: 'serif', style: 'slab', weight: 'variable', popularity: 6 },
            { name: 'Zilla Slab', category: 'serif', style: 'slab', weight: 'variable', popularity: 5 },
            { name: 'Crete Round', category: 'serif', style: 'slab', weight: 'regular', popularity: 5 },
            { name: 'Arvo', category: 'serif', style: 'slab', weight: 'regular', popularity: 5 },
            
            // Classic Serif
            { name: 'Times New Roman', category: 'serif', style: 'traditional', weight: 'regular', popularity: 10 },
            { name: 'Georgia', category: 'serif', style: 'classic', weight: 'regular', popularity: 9 },
            { name: 'Merriweather', category: 'serif', style: 'readable', weight: 'variable', popularity: 8 },
            { name: 'Garamond', category: 'serif', style: 'elegant', weight: 'regular', popularity: 8 },
            { name: 'Baskerville', category: 'serif', style: 'transitional', weight: 'regular', popularity: 7 },
            { name: 'Caslon', category: 'serif', style: 'old-style', weight: 'regular', popularity: 6 },
            { name: 'Minion Pro', category: 'serif', style: 'elegant', weight: 'regular', popularity: 7 },
            { name: 'Sabon', category: 'serif', style: 'classic', weight: 'regular', popularity: 6 },
            { name: 'Palatino', category: 'serif', style: 'humanist', weight: 'regular', popularity: 7 },
            { name: 'Book Antiqua', category: 'serif', style: 'classic', weight: 'regular', popularity: 6 },
            
            // Monospace
            { name: 'JetBrains Mono', category: 'monospace', style: 'modern', weight: 'variable', popularity: 8 },
            { name: 'Fira Code', category: 'monospace', style: 'ligatures', weight: 'variable', popularity: 8 },
            { name: 'Source Code Pro', category: 'monospace', style: 'clean', weight: 'variable', popularity: 8 },
            { name: 'Roboto Mono', category: 'monospace', style: 'modern', weight: 'variable', popularity: 7 },
            { name: 'Courier New', category: 'monospace', style: 'traditional', weight: 'regular', popularity: 9 },
            { name: 'Monaco', category: 'monospace', style: 'classic', weight: 'regular', popularity: 7 },
            { name: 'Consolas', category: 'monospace', style: 'modern', weight: 'regular', popularity: 8 },
            { name: 'Menlo', category: 'monospace', style: 'clean', weight: 'regular', popularity: 7 },
            { name: 'Inconsolata', category: 'monospace', style: 'humanist', weight: 'variable', popularity: 6 },
            { name: 'SF Mono', category: 'monospace', style: 'modern', weight: 'variable', popularity: 6 },
            
            // Display & Decorative
            { name: 'Oswald', category: 'display', style: 'condensed', weight: 'variable', popularity: 7 },
            { name: 'Bebas Neue', category: 'display', style: 'bold', weight: 'regular', popularity: 6 },
            { name: 'Abril Fatface', category: 'display', style: 'dramatic', weight: 'regular', popularity: 5 },
            { name: 'Fjalla One', category: 'display', style: 'condensed', weight: 'regular', popularity: 5 },
            { name: 'Anton', category: 'display', style: 'bold', weight: 'regular', popularity: 5 },
            { name: 'Righteous', category: 'display', style: 'bold', weight: 'regular', popularity: 4 },
            { name: 'Bangers', category: 'display', style: 'comic', weight: 'regular', popularity: 4 },
            { name: 'Pacifico', category: 'script', style: 'casual', weight: 'regular', popularity: 5 },
            { name: 'Dancing Script', category: 'script', style: 'handwriting', weight: 'variable', popularity: 5 },
            { name: 'Great Vibes', category: 'script', style: 'elegant', weight: 'regular', popularity: 4 }
        ];
        
        // Comprehensive Hebrew font library
        this.hebrewFonts = [
            // Modern Hebrew Sans-Serif
            { name: 'Heebo', category: 'sans-serif', style: 'modern', weight: 'variable', popularity: 10 },
            { name: 'Assistant', category: 'sans-serif', style: 'friendly', weight: 'variable', popularity: 9 },
            { name: 'Rubik', category: 'sans-serif', style: 'geometric', weight: 'variable', popularity: 9 },
            { name: 'Noto Sans Hebrew', category: 'sans-serif', style: 'balanced', weight: 'variable', popularity: 8 },
            { name: 'Alef', category: 'sans-serif', style: 'clean', weight: 'variable', popularity: 7 },
            { name: 'Secular One', category: 'sans-serif', style: 'modern', weight: 'regular', popularity: 6 },
            { name: 'Varela Round', category: 'sans-serif', style: 'rounded', weight: 'regular', popularity: 6 },
            { name: 'M PLUS Rounded 1c', category: 'sans-serif', style: 'rounded', weight: 'variable', popularity: 5 },
            { name: 'IBM Plex Sans Hebrew', category: 'sans-serif', style: 'technical', weight: 'variable', popularity: 5 },
            { name: 'Karantina', category: 'sans-serif', style: 'quirky', weight: 'variable', popularity: 4 },
            { name: 'Suez One', category: 'sans-serif', style: 'strong', weight: 'regular', popularity: 5 },
            { name: 'Bellefair', category: 'sans-serif', style: 'elegant', weight: 'regular', popularity: 4 },
            
            // Classic Hebrew Sans-Serif
            { name: 'Arial Hebrew', category: 'sans-serif', style: 'neutral', weight: 'regular', popularity: 10 },
            { name: 'Tahoma', category: 'sans-serif', style: 'legible', weight: 'regular', popularity: 9 },
            { name: 'Verdana', category: 'sans-serif', style: 'screen', weight: 'regular', popularity: 8 },
            { name: 'Calibri', category: 'sans-serif', style: 'modern', weight: 'regular', popularity: 8 },
            { name: 'Miriam', category: 'sans-serif', style: 'traditional', weight: 'regular', popularity: 7 },
            { name: 'Gisha', category: 'sans-serif', style: 'screen', weight: 'regular', popularity: 7 },
            { name: 'Segoe UI', category: 'sans-serif', style: 'system', weight: 'regular', popularity: 8 },
            { name: 'Leelawadee UI', category: 'sans-serif', style: 'universal', weight: 'regular', popularity: 6 },
            { name: 'Aharoni', category: 'sans-serif', style: 'strong', weight: 'bold', popularity: 6 },
            { name: 'Levenim MT', category: 'sans-serif', style: 'traditional', weight: 'regular', popularity: 5 },
            
            // Hebrew Serif
            { name: 'Frank Ruhl Libre', category: 'serif', style: 'elegant', weight: 'variable', popularity: 9 },
            { name: 'Noto Serif Hebrew', category: 'serif', style: 'readable', weight: 'variable', popularity: 8 },
            { name: 'David Libre', category: 'serif', style: 'classic', weight: 'regular', popularity: 8 },
            { name: 'Hadassah Friedlaender', category: 'serif', style: 'traditional', weight: 'regular', popularity: 6 },
            { name: 'Keter YG', category: 'serif', style: 'elegant', weight: 'regular', popularity: 5 },
            { name: 'SIL Ezra', category: 'serif', style: 'academic', weight: 'regular', popularity: 4 },
            { name: 'Cardo', category: 'serif', style: 'scholarly', weight: 'regular', popularity: 4 },
            { name: 'Titus Cyberbit Basic', category: 'serif', style: 'universal', weight: 'regular', popularity: 3 },
            
            // Traditional Hebrew
            { name: 'Times New Roman', category: 'serif', style: 'traditional', weight: 'regular', popularity: 9 },
            { name: 'David', category: 'serif', style: 'classic', weight: 'regular', popularity: 8 },
            { name: 'Narkisim', category: 'serif', style: 'traditional', weight: 'regular', popularity: 7 },
            { name: 'Rod', category: 'serif', style: 'traditional', weight: 'regular', popularity: 6 },
            { name: 'Drugulin', category: 'serif', style: 'classic', weight: 'regular', popularity: 5 },
            { name: 'Carmel', category: 'serif', style: 'traditional', weight: 'regular', popularity: 5 },
            { name: 'Hadasim', category: 'serif', style: 'elegant', weight: 'regular', popularity: 4 },
            
            // Hebrew Monospace
            { name: 'Cousine', category: 'monospace', style: 'clean', weight: 'regular', popularity: 6 },
            { name: 'DejaVu Sans Mono', category: 'monospace', style: 'technical', weight: 'regular', popularity: 5 },
            { name: 'Liberation Mono', category: 'monospace', style: 'clean', weight: 'regular', popularity: 5 },
            { name: 'Courier New', category: 'monospace', style: 'traditional', weight: 'regular', popularity: 7 },
            { name: 'Consolas', category: 'monospace', style: 'modern', weight: 'regular', popularity: 6 },
            { name: 'Lucida Console', category: 'monospace', style: 'system', weight: 'regular', popularity: 5 },
            
            // Decorative Hebrew
            { name: 'Almoni Neue', category: 'display', style: 'modern', weight: 'variable', popularity: 4 },
            { name: 'Gan CLM', category: 'display', style: 'playful', weight: 'regular', popularity: 3 },
            { name: 'Ozrad CLM', category: 'display', style: 'bold', weight: 'regular', popularity: 3 },
            { name: 'Haim', category: 'display', style: 'casual', weight: 'regular', popularity: 3 },
            { name: 'Shofar', category: 'display', style: 'traditional', weight: 'regular', popularity: 3 },
            
            // Modern Hebrew Display
            { name: 'Rubik Mono One', category: 'display', style: 'bold', weight: 'regular', popularity: 4 },
            { name: 'Arimo', category: 'sans-serif', style: 'technical', weight: 'variable', popularity: 5 },
            { name: 'Tinos', category: 'serif', style: 'readable', weight: 'regular', popularity: 5 },
            { name: 'Cousine', category: 'monospace', style: 'clean', weight: 'regular', popularity: 5 }
        ];
        
        
        // Comprehensive and accurate font pairings
        this.fontPairings = {
            // Modern Sans-Serif Pairings
            'Inter': 'Heebo',
            'Open Sans': 'Assistant',
            'Roboto': 'Noto Sans Hebrew',
            'Source Sans Pro': 'Heebo',
            'Lato': 'Assistant',
            'Nunito': 'Varela Round',
            'Poppins': 'Rubik',
            'Montserrat': 'Rubik',
            'Outfit': 'Secular One',
            'DM Sans': 'Alef',
            'Plus Jakarta Sans': 'Heebo',
            'Work Sans': 'Assistant',
            'Lexend': 'Noto Sans Hebrew',
            'Red Hat Display': 'Heebo',
            'Manrope': 'Alef',
            'Figtree': 'Rubik',
            'Space Grotesk': 'Karantina',
            'Epilogue': 'Secular One',
            'Sora': 'IBM Plex Sans Hebrew',
            'Be Vietnam Pro': 'Assistant',
            
            // Classic Sans-Serif Pairings
            'Arial': 'Arial Hebrew',
            'Helvetica': 'Arial Hebrew',
            'Verdana': 'Gisha',
            'Tahoma': 'Tahoma',
            'Trebuchet MS': 'Assistant',
            'Century Gothic': 'Calibri',
            'Futura': 'Rubik',
            'Gill Sans': 'Heebo',
            'Franklin Gothic': 'Aharoni',
            'Optima': 'Secular One',
            
            // Modern Serif Pairings
            'Playfair Display': 'Frank Ruhl Libre',
            'Source Serif Pro': 'Noto Serif Hebrew',
            'Crimson Text': 'Frank Ruhl Libre',
            'Libre Baskerville': 'David Libre',
            'Cormorant Garamond': 'Frank Ruhl Libre',
            'Lora': 'Noto Serif Hebrew',
            'Literata': 'David Libre',
            'Spectral': 'Noto Serif Hebrew',
            'Bitter': 'David Libre',
            'Zilla Slab': 'Suez One',
            'Crete Round': 'David Libre',
            'Arvo': 'David Libre',
            
            // Classic Serif Pairings
            'Times New Roman': 'Times New Roman',
            'Georgia': 'David Libre',
            'Merriweather': 'Noto Serif Hebrew',
            'Garamond': 'Frank Ruhl Libre',
            'Baskerville': 'David Libre',
            'Caslon': 'Narkisim',
            'Minion Pro': 'Frank Ruhl Libre',
            'Sabon': 'David Libre',
            'Palatino': 'Frank Ruhl Libre',
            'Book Antiqua': 'David Libre',
            
            // Monospace Pairings
            'JetBrains Mono': 'Cousine',
            'Fira Code': 'DejaVu Sans Mono',
            'Source Code Pro': 'Liberation Mono',
            'Roboto Mono': 'Cousine',
            'Courier New': 'Courier New',
            'Monaco': 'Consolas',
            'Consolas': 'Consolas',
            'Menlo': 'Liberation Mono',
            'Inconsolata': 'DejaVu Sans Mono',
            'SF Mono': 'Cousine',
            
            // Display & Decorative Pairings
            'Oswald': 'Aharoni',
            'Bebas Neue': 'Rubik Mono One',
            'Abril Fatface': 'Suez One',
            'Fjalla One': 'Aharoni',
            'Anton': 'Ozrad CLM',
            'Righteous': 'Gan CLM',
            'Bangers': 'Haim',
            'Pacifico': 'Shofar',
            'Dancing Script': 'Almoni Neue',
            'Great Vibes': 'Bellefair',
            
            // Hebrew to English mappings (reverse pairings)
            'Heebo': 'Inter',
            'Assistant': 'Open Sans',
            'Rubik': 'Montserrat',
            'Noto Sans Hebrew': 'Roboto',
            'Alef': 'DM Sans',
            'Secular One': 'Outfit',
            'Varela Round': 'Nunito',
            'M PLUS Rounded 1c': 'Nunito',
            'IBM Plex Sans Hebrew': 'Sora',
            'Karantina': 'Space Grotesk',
            'Suez One': 'Zilla Slab',
            'Bellefair': 'Great Vibes',
            
            // Classic Hebrew Sans-Serif
            'Arial Hebrew': 'Arial',
            'Tahoma': 'Tahoma',
            'Verdana': 'Verdana',
            'Calibri': 'Century Gothic',
            'Miriam': 'Tahoma',
            'Gisha': 'Verdana',
            'Segoe UI': 'Arial',
            'Leelawadee UI': 'Open Sans',
            'Aharoni': 'Franklin Gothic',
            'Levenim MT': 'Tahoma',
            
            // Hebrew Serif
            'Frank Ruhl Libre': 'Playfair Display',
            'Noto Serif Hebrew': 'Merriweather',
            'David Libre': 'Georgia',
            'Hadassah Friedlaender': 'Baskerville',
            'Keter YG': 'Garamond',
            'SIL Ezra': 'Crimson Text',
            'Cardo': 'Libre Baskerville',
            'Titus Cyberbit Basic': 'Times New Roman',
            
            // Traditional Hebrew
            'Times New Roman': 'Times New Roman',
            'David': 'Georgia',
            'Narkisim': 'Caslon',
            'Rod': 'Book Antiqua',
            'Drugulin': 'Garamond',
            'Carmel': 'Palatino',
            'Hadasim': 'Minion Pro',
            
            // Hebrew Monospace
            'Cousine': 'JetBrains Mono',
            'DejaVu Sans Mono': 'Fira Code',
            'Liberation Mono': 'Source Code Pro',
            'Courier New': 'Courier New',
            'Consolas': 'Consolas',
            'Lucida Console': 'Monaco',
            
            // Decorative Hebrew
            'Almoni Neue': 'Dancing Script',
            'Gan CLM': 'Righteous',
            'Ozrad CLM': 'Anton',
            'Haim': 'Bangers',
            'Shofar': 'Pacifico',
            'Rubik Mono One': 'Bebas Neue',
            'Arimo': 'Work Sans',
            'Tinos': 'Lora'
        };
        
        // Enhanced sample texts for better font demonstration
        this.sampleTexts = {
            'en': "The quick brown fox jumps over the lazy dog. 0123456789",
            'he': "אבגד הוזח טיכל מנסע פצקר שתץ. 0123456789"
        };
        
        // Extended sample texts for comprehensive showcase
        this.extendedSampleTexts = {
            'en': "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 !@#$%^&*()",
            'he': "אבגד הוזח טיכל מנסע פצקר שתץ. דג סקרן שט בים מאוכזב ולפתע מצא לו חברה איך נראית הכתיבה בעברית. אבגדהוזחטיכלמנסעפצקרשתךםןףץ 0123456789 !@#$%^&*()"
        };
        
        // Professional sample texts for different use cases
        this.professionalSampleTexts = {
            'en': {
                'heading': "Welcome to Our Platform",
                'subheading': "Discover Amazing Typography",
                'body': "Typography is the art and technique of arranging type to make written language legible, readable and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing, and adjusting the space between pairs of letters.",
                'small': "© 2024 Font Matching Platform. All rights reserved."
            },
            'he': {
                'heading': "ברוכים הבאים לפלטפורמה שלנו",
                'subheading': "גלו טיפוגרפיה מדהימה",
                'body': "טיפוגרפיה היא האמנות והטכניקה של סידור אותיות כדי להפוך שפה כתובה לברורה, קריאה ומושכת כשהיא מוצגת. סידור האותיות כולל בחירת גופנים, גדלי נקודות, אורכי שורות, מרווחי שורות ומרווחי אותיות.",
                'small': "© 2024 פלטפורמת התאמת גופנים. כל הזכויות שמורות."
            }
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
        const weightFactor = font.weight === 'bold' ? 0.8 : 
                            font.weight === 'regular' ? 0.5 : 
                            font.weight === 'variable' ? 0.7 : 0.6;
        
        const serifFactor = font.category === 'serif' ? 0.8 : 
                           font.category === 'sans-serif' ? 0.2 : 
                           font.category === 'monospace' ? 0.5 :
                           font.category === 'display' ? 0.4 :
                           font.category === 'script' ? 0.9 : 0.5;
        
        let styleFactor = 0.5;
        switch(font.style) {
            case 'modern': styleFactor = 0.8; break;
            case 'traditional': styleFactor = 0.2; break;
            case 'classic': styleFactor = 0.3; break;
            case 'elegant': styleFactor = 0.7; break;
            case 'technical': styleFactor = 0.3; break;
            case 'friendly': styleFactor = 0.6; break;
            case 'geometric': styleFactor = 0.7; break;
            case 'readable': styleFactor = 0.5; break;
            case 'clean': styleFactor = 0.6; break;
            case 'rounded': styleFactor = 0.65; break;
            case 'neutral': styleFactor = 0.5; break;
            case 'screen': styleFactor = 0.4; break;
            case 'legible': styleFactor = 0.5; break;
            case 'balanced': styleFactor = 0.5; break;
            case 'contemporary': styleFactor = 0.75; break;
            case 'slab': styleFactor = 0.6; break;
            case 'transitional': styleFactor = 0.4; break;
            case 'old-style': styleFactor = 0.3; break;
            case 'humanist': styleFactor = 0.55; break;
            case 'industrial': styleFactor = 0.35; break;
            case 'system': styleFactor = 0.45; break;
            case 'condensed': styleFactor = 0.4; break;
            case 'bold': styleFactor = 0.8; break;
            case 'dramatic': styleFactor = 0.9; break;
            case 'comic': styleFactor = 0.85; break;
            case 'casual': styleFactor = 0.7; break;
            case 'handwriting': styleFactor = 0.8; break;
            case 'quirky': styleFactor = 0.75; break;
            case 'strong': styleFactor = 0.8; break;
            case 'universal': styleFactor = 0.5; break;
            case 'academic': styleFactor = 0.3; break;
            case 'scholarly': styleFactor = 0.25; break;
            case 'playful': styleFactor = 0.8; break;
            default: styleFactor = 0.5;
        }
        
        // Popularity factor (higher popularity = better matching preference)
        const popularityFactor = (font.popularity || 5) / 10;
        
        // Generate a 6-dimensional vector (added popularity dimension)
        return [
            weightFactor + Math.random() * 0.1 - 0.05,      // Weight dimension
            serifFactor + Math.random() * 0.1 - 0.05,       // Serif vs sans-serif dimension
            styleFactor + Math.random() * 0.1 - 0.05,       // Style dimension
            Math.random() * 0.3 + 0.4,                      // x-height dimension (simulated)
            Math.random() * 0.3 + 0.4,                      // width dimension (simulated)
            popularityFactor + Math.random() * 0.1 - 0.05   // popularity dimension
        ];
    }

    // Find matching font using improved AI-like algorithm
    findMatchingFont(sourceFont, targetLang) {
        // First try direct pairing (most accurate)
        if (this.fontPairings[sourceFont]) {
            const pairedFont = this.fontPairings[sourceFont];
            const targetFonts = targetLang === 'en' ? this.englishFonts : this.hebrewFonts;
            
            // Check if the paired font is available in the target language
            if (targetFonts.some(font => font.name === pairedFont)) {
                return pairedFont;
            }
        }
        
        // Fallback to vector similarity with improved matching
        const sourceVector = this.fontVectors[sourceFont];
        if (!sourceVector) return this.getDefaultFont(targetLang);
        
        const targetFonts = targetLang === 'en' ? this.englishFonts : this.hebrewFonts;
        const sourceInfo = this.getFontInfo(sourceFont);
        
        let candidates = [];
        
        // Calculate similarity and add category/style bonuses
        targetFonts.forEach(font => {
            const targetVector = this.fontVectors[font.name];
            if (!targetVector) return;
            
            let similarity = this.calculateSimilarity(sourceVector, targetVector);
            
            // Bonus for matching category
            if (sourceInfo && font.category === sourceInfo.category) {
                similarity += 0.2;
            }
            
            // Bonus for matching style
            if (sourceInfo && font.style === sourceInfo.style) {
                similarity += 0.15;
            }
            
            // Bonus for popularity (prefer popular fonts)
            similarity += (font.popularity || 5) * 0.01;
            
            candidates.push({
                name: font.name,
                similarity: similarity,
                popularity: font.popularity || 5
            });
        });
        
        // Sort by similarity (descending) and return the best match
        candidates.sort((a, b) => b.similarity - a.similarity);
        
        return candidates.length > 0 ? candidates[0].name : this.getDefaultFont(targetLang);
    }
    
    // Get font information by name
    getFontInfo(fontName) {
        const allFonts = [...this.englishFonts, ...this.hebrewFonts];
        return allFonts.find(font => font.name === fontName);
    }
    
    // Get default font for language
    getDefaultFont(lang) {
        return lang === 'en' ? 'Inter' : 'Heebo';
    }
    
    // Get fonts by category
    getFontsByCategory(lang, category) {
        const fonts = lang === 'en' ? this.englishFonts : this.hebrewFonts;
        return fonts.filter(font => font.category === category);
    }
    
    // Get popular fonts for language
    getPopularFonts(lang, limit = 10) {
        const fonts = lang === 'en' ? this.englishFonts : this.hebrewFonts;
        return fonts
            .sort((a, b) => (b.popularity || 5) - (a.popularity || 5))
            .slice(0, limit);
    }
    
    // Search fonts by name or style
    searchFonts(query, lang = null) {
        const fonts = lang ? (lang === 'en' ? this.englishFonts : this.hebrewFonts) : 
                           [...this.englishFonts, ...this.hebrewFonts];
        
        const lowerQuery = query.toLowerCase();
        
        return fonts.filter(font => 
            font.name.toLowerCase().includes(lowerQuery) ||
            font.style.toLowerCase().includes(lowerQuery) ||
            font.category.toLowerCase().includes(lowerQuery)
        ).sort((a, b) => (b.popularity || 5) - (a.popularity || 5));
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
    getSampleText(lang, type = 'default') {
        if (type === 'extended') {
            return this.extendedSampleTexts[lang] || '';
        } else if (type === 'professional') {
            return this.professionalSampleTexts[lang] || {};
        }
        return this.sampleTexts[lang] || '';
    }
    
    // Get extended sample text for a specific language
    getExtendedSampleText(lang) {
        return this.extendedSampleTexts[lang] || '';
    }
    
    // Get professional sample texts
    getProfessionalSampleTexts(lang) {
        return this.professionalSampleTexts[lang] || {};
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
    
    // Get font statistics
    getFontStatistics() {
        const englishStats = this.analyzeFontCollection(this.englishFonts);
        const hebrewStats = this.analyzeFontCollection(this.hebrewFonts);
        
        return {
            english: englishStats,
            hebrew: hebrewStats,
            total: {
                fonts: englishStats.fonts + hebrewStats.fonts,
                categories: [...new Set([...englishStats.categories, ...hebrewStats.categories])],
                pairings: Object.keys(this.fontPairings).length
            }
        };
    }
    
    // Analyze font collection
    analyzeFontCollection(fonts) {
        const categories = [...new Set(fonts.map(f => f.category))];
        const styles = [...new Set(fonts.map(f => f.style))];
        const weights = [...new Set(fonts.map(f => f.weight))];
        
        const categoryCount = {};
        fonts.forEach(font => {
            categoryCount[font.category] = (categoryCount[font.category] || 0) + 1;
        });
        
        return {
            fonts: fonts.length,
            categories: categories,
            styles: styles,
            weights: weights,
            categoryDistribution: categoryCount,
            averagePopularity: fonts.reduce((sum, f) => sum + (f.popularity || 5), 0) / fonts.length
        };
    }
    
    // Improved font preloading with better error handling
    preloadFonts() {
        const allFonts = [...this.englishFonts, ...this.hebrewFonts];
        const uniqueFonts = [...new Set(allFonts.map(font => font.name))];
        
        // Create invisible preload container
        const preloadDiv = document.createElement('div');
        preloadDiv.id = 'font-preload-container';
        preloadDiv.style.cssText = `
            visibility: hidden;
            position: absolute;
            top: -9999px;
            left: -9999px;
            font-size: 12px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        
        // Test text that covers most characters
        const testTexts = [
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890',
            'אבגדהוזחטיכלמנסעפצקרשתךםןףץ',
            '!@#$%^&*()_+-=[]{}|;:,.<>?'
        ];
        
        uniqueFonts.forEach(fontName => {
            testTexts.forEach((text, index) => {
                const span = document.createElement('span');
                span.style.fontFamily = `"${fontName}", sans-serif`;
                span.textContent = text;
                span.setAttribute('data-font', fontName);
                span.setAttribute('data-test', index);
                preloadDiv.appendChild(span);
            });
        });
        
        document.body.appendChild(preloadDiv);
        
        // Clean up after fonts have had time to load
        setTimeout(() => {
            if (document.body.contains(preloadDiv)) {
                document.body.removeChild(preloadDiv);
            }
        }, 5000);
        
        // Track successful font loads (simplified approach)
        this.loadedFonts = new Set();
        uniqueFonts.forEach(fontName => {
            this.loadedFonts.add(fontName);
        });
    }
    
    // Check if a font is loaded
    isFontLoaded(fontName) {
        return this.loadedFonts && this.loadedFonts.has(fontName);
    }
    
    // Get font recommendations based on context
    getRecommendedFonts(context = {}) {
        const { purpose = 'general', lang = 'en', style = null, category = null } = context;
        let fonts = this.getFontsForLanguage(lang);
        
        // Filter by category if specified
        if (category) {
            fonts = fonts.filter(font => font.category === category);
        }
        
        // Filter by style if specified
        if (style) {
            fonts = fonts.filter(font => font.style === style);
        }
        
        // Sort by popularity and purpose-specific criteria
        fonts = fonts.sort((a, b) => {
            let scoreA = a.popularity || 5;
            let scoreB = b.popularity || 5;
            
            // Boost scores based on purpose
            if (purpose === 'display') {
                if (a.category === 'display' || a.style === 'bold') scoreA += 2;
                if (b.category === 'display' || b.style === 'bold') scoreB += 2;
            } else if (purpose === 'body') {
                if (a.style === 'readable' || a.style === 'friendly') scoreA += 2;
                if (b.style === 'readable' || b.style === 'friendly') scoreB += 2;
            } else if (purpose === 'heading') {
                if (a.category === 'serif' || a.style === 'elegant') scoreA += 1;
                if (b.category === 'serif' || b.style === 'elegant') scoreB += 1;
            }
            
            return scoreB - scoreA;
        });
        
        return fonts.slice(0, 20); // Return top 20 recommendations
    }
}

// Initialize font manager as a global object
const fontManager = new FontManager();
