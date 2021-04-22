// Hier erfassen wir die Domain der aktuell geladenen Seite
const domain = window.location.hostname;

// Hier senden wir die Domain an unseren Adafruit-Feed
fetch('https://io.adafruit.com/api/v2/HIER_USER_EINTRAGEN/feeds/HIER_FEED_EINTRAGEN/data', {
    method: 'POST',
    headers: {
        'X-AIO-Key': 'HIER_KEY_EINTRAGEN',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value: domain }),
});