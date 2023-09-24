function getStorageKey() {
    return 'quickNote' + window.location.pathname;
  }

// Load content from local storage or URL parameter
document.addEventListener("DOMContentLoaded", function() {
    const editor = document.getElementById('editor');
    const compressedNote = new URL(window.location.href).searchParams.get('note');
    const storageKey = getStorageKey();
  
    // Prioritize the URL parameter content over local storage
    if (compressedNote) {
      const decompressedNote = LZString.decompressFromEncodedURIComponent(compressedNote);
      editor.value = decompressedNote;
      localStorage.setItem(storageKey, decompressedNote);
      const url = new URL(window.location.href);
      const newPath = url.origin + url.pathname; // This will include the path but not the query parameters
      history.replaceState(null, null, newPath);
    } else {
      editor.value = localStorage.getItem(storageKey) || '';
    }

    const domain = window.location.hostname;
    editor.placeholder = `Welcome to QuickNote!
    - Type here to take notes.
    - Your notes are automatically saved to your local browser storage.
    - Share notes between clients by clicking the "Share" button.
    - Access ${domain}/<custom_path> to create individual notes with custom paths. Each path is its own separate note.
    - It even works with multiple levels of paths!`;
    editor.addEventListener('input', function() {
      localStorage.setItem(storageKey, editor.value);
    });
  
    const shareButton = document.getElementById('shareButton');
    shareButton.addEventListener('click', function() {
      const shareableUrl = generateShareableUrl(editor.value);
      copyToClipboard(shareableUrl);
    });
  });


// Function to generate shareable URL
function generateShareableUrl(note) {
    const compressed = LZString.compressToEncodedURIComponent(note);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('note', compressed);
    return newUrl.toString();
  }
  
// Function to show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.visibility = 'visible';
    setTimeout(() => toast.style.visibility = 'hidden', 3000);
  }
  
  // Add event listener to "Share" button
  document.addEventListener("DOMContentLoaded", function() {
    const shareButton = document.getElementById('shareButton');
    shareButton.addEventListener('click', function() {
      const editor = document.getElementById('editor');
      const shareableUrl = generateShareableUrl(editor.value);
      copyToClipboard(shareableUrl);
    });
  });
  
  // Function to copy text to clipboard
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
      showToast('Shareable link copied to clipboard!');
    }).catch(function(err) {
      showToast('Could not copy text: ', err);
    });
  }
  