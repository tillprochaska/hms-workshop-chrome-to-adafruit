// Nicht abschließende Listen mit Domains, die von Google,
// Facebook etc. betrieben werden.
// Quelle: https://github.com/dyne/domain-list/tree/master/data

const GOOGLE_DOMAINS = [
    'google.com',
    'googleusercontent.com',
    'gstatic.com',
    'google-analytics.com',
    'googlevideo.com',
    'googleapis.com',
    'doubleclick.net',
    'googletagmanager.com',
];

const FACEBOOK_DOMAINS = [
    'facebook.com',
    'facebook.net',
    'fbcdn.net',
];

function isInDomainList(domainList, currentDomain) {
    for(const domain of domainList) {
        if(currentDomain.endsWith(domain)) {
            return true;
        }
    }
}

let counter = {
    google: 0,
    facebook: 0,
};

// Das hier ist eine spezielle Funktion, die von Google Chrome
// für Chrome Extensions bereitgestellt wird, und immer dann
// aufgerufen wird, wenn ein Request (z.B. eine Webseite oder
// aber auch eingebundene Bilder, Scripte) gesendet wird.
chrome.webRequest.onBeforeRequest.addListener(details => {

    // `details` enthält die vollständige URL, uns interessiert
    // aber nur der Domain-Teil.
    const url = new URL(details.url);
    const currentDomain = url.hostname;

    if(isInDomainList(GOOGLE_DOMAINS, currentDomain)) {
        console.log('Google Domain');
        counter.google += 1;
    }

    if(isInDomainList(FACEBOOK_DOMAINS, currentDomain)) {
        console.log('Facebook Domain');
        counter.facebook += 1;
    }

}, { urls: ['<all_urls>'] });

// Weil wir nur 30 Nachrichten pro Minute an adafruit.io senden
// dürfen, senden wir nicht bei jeder einzelnen Verbindung zu
// Google oder Facebook eine Nachricht, sondern nur alle 3 Sekunden.
setInterval(() => {
    if(counter.google === 0 && counter.facebook === 0) {
        return;
    }

    // https://io.adafruit.com/api/docs/#create-data
    const url = 'https://io.adafruit.com/api/v2/USER/feeds/FEED/data';

    fetch(url, {
        method: 'POST',
        headers: {
            'X-AIO-Key': 'ADAFRUIT_KEY',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            value: `${counter.google}|${counter.facebook}`,
        }),
    });

    counter = {
        google: 0,
        facebook: 0,
    };
}, 3000);