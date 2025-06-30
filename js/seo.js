// js/seo.js

// Function to add Google Analytics and Tag Manager scripts
function addTrackingScripts() {
    // Replace with your Google Analytics Measurement ID
    const gaMeasurementId = 'G-D40XNKR360'; 
    
    // Replace with your Google Tag Manager ID
    const gtmId = 'GTM-XXXXXXX';

    // Google Analytics Script
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
    document.head.appendChild(gaScript);

    const gaConfigScript = document.createElement('script');
    gaConfigScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaMeasurementId}');
    `;
    document.head.appendChild(gaConfigScript);

    // Google Tag Manager Script
    const gtmScript = document.createElement('script');
    gtmScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
    `;
    document.head.appendChild(gtmScript);

    // Google Tag Manager No-Script
    const gtmNoScript = document.createElement('noscript');
    gtmNoScript.innerHTML = `
        <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `;
    document.body.prepend(gtmNoScript);
}

// Function to add Google Search Console verification
function addSearchConsoleVerification() {
    // Replace with your Google Search Console verification code
    const verificationCode = 'YOUR_VERIFICATION_CODE'; 
    
    const metaTag = document.createElement('meta');
    metaTag.name = 'google-site-verification';
    metaTag.content = verificationCode;
    document.head.appendChild(metaTag);
}


// Initialize all tracking and verification
document.addEventListener('DOMContentLoaded', () => {
    addTrackingScripts();
    addSearchConsoleVerification();
});
