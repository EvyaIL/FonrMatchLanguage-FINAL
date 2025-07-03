const fs = require('fs');
const path = require('path');

/**
 * Comprehensive Font Manifest Generator
 * Scans local font directories and generates a complete manifest
 * with language detection, categorization, and metadata
 */

class FontScanner {
    constructor() {
        this.fontExtensions = ['.ttf', '.otf', '.woff', '.woff2', '.eot'];
        this.hebrewFontIndicators = [
            'hebrew', 'david', 'frank', 'keren', 'miriam', 'narkis', 'rashi', 
            'stam', 'vilna', 'aharoni', 'hadassah', 'soncino', 'toledo',
            'guttman', 'ktav', 'yad', 'levenim', 'taamey', 'sfaradi',
            'ashkenazi', 'etz', 'chaim', 'aleph', 'bet', 'gimel'
        ];
        this.fontCategories = {
            serif: ['times', 'georgia', 'garamond', 'palatino', 'baskerville', 'frank', 'david', 'narkis'],
            'sans-serif': ['arial', 'helvetica', 'calibri', 'verdana', 'tahoma', 'segoe', 'roboto', 'open sans'],
            monospace: ['courier', 'consolas', 'monaco', 'menlo', 'fira code', 'jetbrains'],
            handwriting: ['comic', 'brush', 'script', 'casual', 'ktav', 'yad'],
            display: ['impact', 'bebas', 'oswald', 'anton', 'black'],
            decorative: ['papyrus', 'curlz', 'chiller', 'jokerman']
        };
    }

    /**
     * Determines if a font is likely Hebrew-compatible
     */
    isHebrewFont(fontName) {
        const name = fontName.toLowerCase();
        return this.hebrewFontIndicators.some(indicator => name.includes(indicator)) ||
               /[\u0590-\u05FF]/.test(fontName); // Contains Hebrew characters
    }

    /**
     * Categorizes font based on name analysis
     */
    categorizeFont(fontName) {
        const name = fontName.toLowerCase();
        
        for (const [category, keywords] of Object.entries(this.fontCategories)) {
            if (keywords.some(keyword => name.includes(keyword))) {
                return category;
            }
        }
        
        // Default categorization based on common patterns
        if (name.includes('serif') && !name.includes('sans')) return 'serif';
        if (name.includes('mono') || name.includes('code')) return 'monospace';
        if (name.includes('script') || name.includes('hand')) return 'handwriting';
        if (name.includes('bold') || name.includes('black') || name.includes('heavy')) return 'display';
        
        return 'sans-serif'; // Default
    }

    /**
     * Analyzes font style based on name
     */
    analyzeStyle(fontName) {
        const name = fontName.toLowerCase();
        
        if (name.includes('modern') || name.includes('neue') || name.includes('ui')) return 'modern';
        if (name.includes('classic') || name.includes('old') || name.includes('traditional')) return 'traditional';
        if (name.includes('elegant') || name.includes('refined')) return 'elegant';
        if (name.includes('bold') || name.includes('strong') || name.includes('heavy')) return 'bold';
        if (name.includes('light') || name.includes('thin') || name.includes('ultra')) return 'light';
        if (name.includes('friendly') || name.includes('casual')) return 'friendly';
        if (name.includes('technical') || name.includes('mono')) return 'technical';
        if (name.includes('decorative') || name.includes('fancy')) return 'decorative';
        if (name.includes('readable') || name.includes('clear')) return 'readable';
        
        return 'regular';
    }

    /**
     * Determines font weight from name
     */
    determineWeight(fontName) {
        const name = fontName.toLowerCase();
        
        if (name.includes('thin') || name.includes('ultralight')) return 'thin';
        if (name.includes('light')) return 'light';
        if (name.includes('medium') || name.includes('demi')) return 'medium';
        if (name.includes('bold')) return 'bold';
        if (name.includes('heavy') || name.includes('black') || name.includes('ultra')) return 'heavy';
        
        return 'regular';
    }

    /**
     * Clean font name for display
     */
    cleanFontName(fileName) {
        return fileName
            .replace(/\.(ttf|otf|woff|woff2|eot)$/i, '')
            .replace(/[-_]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    /**
     * Scan a directory for font files
     */
    scanDirectory(dirPath, language = 'auto') {
        const fonts = [];
        
        try {
            const files = fs.readdirSync(dirPath);
            
            for (const file of files) {
                const filePath = path.join(dirPath, file);
                const stat = fs.statSync(filePath);
                
                if (stat.isDirectory()) {
                    // Recursively scan subdirectories
                    fonts.push(...this.scanDirectory(filePath, language));
                } else if (this.fontExtensions.includes(path.extname(file).toLowerCase())) {
                    const cleanName = this.cleanFontName(file);
                    const isHebrew = language === 'he' || (language === 'auto' && this.isHebrewFont(cleanName));
                    const detectedLang = isHebrew ? 'he' : 'en';
                    
                    const fontInfo = {
                        name: cleanName,
                        file: path.relative(path.join(__dirname, '..', 'public', 'fonts'), filePath),
                        lang: detectedLang,
                        category: this.categorizeFont(cleanName),
                        style: this.analyzeStyle(cleanName),
                        weight: this.determineWeight(cleanName),
                        extension: path.extname(file).toLowerCase(),
                        size: stat.size,
                        lastModified: stat.mtime.toISOString()
                    };
                    
                    fonts.push(fontInfo);
                }
            }
        } catch (error) {
            console.error(`Error scanning directory ${dirPath}:`, error.message);
        }
        
        return fonts;
    }

    /**
     * Generate complete font manifest
     */
    generateManifest() {
        console.log('🔍 Scanning font directories...');
        
        const fontsDir = path.join(__dirname, '..', 'public', 'fonts');
        const englishDir = path.join(fontsDir, 'english');
        const hebrewDir = path.join(fontsDir, 'hebrew');
        
        let allFonts = [];
        
        // Scan English fonts
        if (fs.existsSync(englishDir)) {
            console.log('📁 Scanning English fonts...');
            const englishFonts = this.scanDirectory(englishDir, 'en');
            allFonts.push(...englishFonts);
            console.log(`✅ Found ${englishFonts.length} English fonts`);
        }
        
        // Scan Hebrew fonts
        if (fs.existsSync(hebrewDir)) {
            console.log('📁 Scanning Hebrew fonts...');
            const hebrewFonts = this.scanDirectory(hebrewDir, 'he');
            allFonts.push(...hebrewFonts);
            console.log(`✅ Found ${hebrewFonts.length} Hebrew fonts`);
        }
        
        // Sort fonts by language and name
        allFonts.sort((a, b) => {
            if (a.lang !== b.lang) return a.lang.localeCompare(b.lang);
            return a.name.localeCompare(b.name);
        });
        
        // Generate statistics
        const stats = {
            total: allFonts.length,
            english: allFonts.filter(f => f.lang === 'en').length,
            hebrew: allFonts.filter(f => f.lang === 'he').length,
            categories: {},
            extensions: {},
            generatedAt: new Date().toISOString()
        };
        
        // Calculate category distribution
        allFonts.forEach(font => {
            stats.categories[font.category] = (stats.categories[font.category] || 0) + 1;
            stats.extensions[font.extension] = (stats.extensions[font.extension] || 0) + 1;
        });
        
        const manifest = {
            stats,
            fonts: allFonts
        };
        
        // Write manifest file
        const manifestPath = path.join(fontsDir, 'fonts.json');
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        
        // Write compact version for faster loading
        const compactManifest = { fonts: allFonts };
        const compactPath = path.join(fontsDir, 'fonts-compact.json');
        fs.writeFileSync(compactPath, JSON.stringify(compactManifest));
        
        console.log('\n📊 Font Manifest Generated:');
        console.log(`   Total fonts: ${stats.total}`);
        console.log(`   English: ${stats.english}`);
        console.log(`   Hebrew: ${stats.hebrew}`);
        console.log('\n📂 Categories:');
        Object.entries(stats.categories).forEach(([cat, count]) => {
            console.log(`   ${cat}: ${count}`);
        });
        console.log('\n💾 Files created:');
        console.log(`   ${manifestPath} (${(fs.statSync(manifestPath).size / 1024 / 1024).toFixed(2)} MB)`);
        console.log(`   ${compactPath} (${(fs.statSync(compactPath).size / 1024 / 1024).toFixed(2)} MB)`);
        
        return manifest;
    }
}

// CLI execution
if (require.main === module) {
    const scanner = new FontScanner();
    try {
        scanner.generateManifest();
        console.log('\n✅ Font manifest generation completed successfully!');
    } catch (error) {
        console.error('\n❌ Error generating font manifest:', error);
        process.exit(1);
    }
}

module.exports = FontScanner;