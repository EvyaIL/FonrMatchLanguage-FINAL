class TranslationService {
    constructor() {
        // For demo purposes, we'll use a simple mapping
        // In a real app, you'd use a translation API
        this.translations = {
            'en': {
                'hello': 'Hello',
                'welcome': 'Welcome to Font Match',
                'enter_text': 'Enter or paste your text here',
                'results': 'Results'
            },
            'he': {
                'hello': 'שלום',
                'welcome': 'ברוך הבא להתאמת פונטים',
                'enter_text': 'הזן או הדבק את הטקסט שלך כאן',
                'results': 'תוצאות'
            }
        };
    }

    translate(text, sourceLang, targetLang) {
        return new Promise((resolve, reject) => {
            // Simulate API delay
            setTimeout(() => {
                // For demo, just return the same text
                // In a real app, call a translation API
                resolve(text);
            }, 1000);
        });
    }

    // Get UI string in current language
    getUIString(key, lang) {
        if (this.translations[lang] && this.translations[lang][key]) {
            return this.translations[lang][key];
        }
        return key;
    }
}

// Initialize translation service as a global object
const translationService = new TranslationService();
