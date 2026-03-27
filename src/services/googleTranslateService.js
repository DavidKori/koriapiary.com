// src/services/googleTranslateService.js

class GoogleTranslateService {
  constructor() {
    this.initialized = false;
    this.currentLanguage = 'en';
    this.translateElement = null;
    this.observer = null;
  }

  // Initialize the translate service
  init() {
    return new Promise((resolve) => {
      // Check if Google Translate is already loaded
      if (window.google && window.google.translate) {
        this.setupTranslateElement();
        resolve(true);
        return;
      }

      // Wait for Google Translate to load
      const checkInterval = setInterval(() => {
        if (window.google && window.google.translate) {
          clearInterval(checkInterval);
          this.setupTranslateElement();
          resolve(true);
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        console.warn('Google Translate failed to load');
        resolve(false);
      }, 10000);
    });
  }

  setupTranslateElement() {
    if (this.initialized) return;

    // Create hidden element if it doesn't exist
    if (!document.getElementById('google_translate_element')) {
      const element = document.createElement('div');
      element.id = 'google_translate_element';
      element.style.display = 'none';
      document.body.appendChild(element);
    }

    // Initialize Google Translate
    if (window.google && window.google.translate) {
      window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,sw,fr,es,de,it,pt,zh,ja',
          layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
          autoDisplay: false
        },
        'google_translate_element'
      );

      this.initialized = true;
      
      // Wait for the translate element to be ready
      setTimeout(() => {
        this.setupLanguageObserver();
      }, 500);
    }
  }

  // Setup observer to detect when translation occurs
  setupLanguageObserver() {
    // Observe changes to the HTML tag
    const targetNode = document.querySelector('html');
    if (!targetNode) return;

    const config = { attributes: true, attributeFilter: ['lang', 'class'] };
    
    const callback = (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          const newLang = targetNode.getAttribute('lang');
          if (newLang && newLang !== this.currentLanguage) {
            this.currentLanguage = newLang;
            // Dispatch custom event when language changes
            window.dispatchEvent(new CustomEvent('languageChanged', { 
              detail: { language: newLang } 
            }));
          }
        }
      }
    };

    this.observer = new MutationObserver(callback);
    this.observer.observe(targetNode, config);
  }

  // Change language programmatically
  changeLanguage(languageCode) {
    if (!this.initialized) {
      console.warn('Google Translate not initialized');
      return false;
    }

    try {
      // Map our language codes to Google Translate codes
      const languageMap = {
        'en': 'en',
        'sw': 'sw',
        'fr': 'fr',
        'es': 'es',
        'de': 'de',
        'it': 'it',
        'pt': 'pt',
        'zh': 'zh-CN',
        'ja': 'ja'
      };

      const googleLangCode = languageMap[languageCode] || languageCode;
      
      // Find and click the Google Translate select element
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement) {
        selectElement.value = googleLangCode;
        selectElement.dispatchEvent(new Event('change'));
        this.currentLanguage = languageCode;
        return true;
      }
      
      // Alternative method: use the Google Translate API if available
      if (window.google && window.google.translate) {
        // Trigger translation by setting cookie
        document.cookie = `googtrans=/en/${googleLangCode}; path=/`;
        window.location.reload();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error changing language:', error);
      return false;
    }
  }

  // Get current language
  getCurrentLanguage() {
    const htmlLang = document.querySelector('html')?.getAttribute('lang');
    if (htmlLang) {
      // Map back to our language codes
      const reverseMap = {
        'en': 'en',
        'sw': 'sw',
        'fr': 'fr',
        'es': 'es',
        'de': 'de',
        'it': 'it',
        'pt': 'pt',
        'zh-CN': 'zh',
        'ja': 'ja'
      };
      return reverseMap[htmlLang] || 'en';
    }
    return this.currentLanguage;
  }

  // Show/hide the Google Translate bar
  showTranslateBar(show = true) {
    const translateBar = document.querySelector('.goog-te-banner-frame');
    if (translateBar) {
      translateBar.style.display = show ? '' : 'none';
    }
    
    // Also hide the notification bar
    const notificationBar = document.querySelector('.goog-te-banner');
    if (notificationBar) {
      notificationBar.style.display = show ? '' : 'none';
    }
    
    // Adjust body margin when translate bar is hidden
    if (!show) {
      document.body.style.top = '0px';
      document.body.style.position = '';
    }
  }

  // Clean up
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Create singleton instance
const googleTranslateService = new GoogleTranslateService();
export default googleTranslateService;