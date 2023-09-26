if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js')
    .then((registration) => {
      console.log('Service Worker registered.');
    })
    .catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
  }
  