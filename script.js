function getStorageKey() {
  return 'quickNote' + window.location.pathname;
}

// Get the current pathname from the URL
const pathname = window.location.pathname;

// Remove the leading slash
const trimmedPath = pathname.replace(/^\//, '');

// Check if there is a subpath
if (trimmedPath) {
  // Split the subpath into its components
  const pathComponents = trimmedPath.split('/');

  // Join the components with " – "
  const titleSuffix = pathComponents.join(' – ');

  // Set the new title with the decoded string as the suffix
  document.title = `Quicknote: ${decodeURIComponent(titleSuffix)}`;
} else {
  // Set the default title if there is no subpath
  document.title = 'Quicknote';
}

// Load content from local storage or URL parameter
document.addEventListener("DOMContentLoaded", function () {
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
  editor.addEventListener('input', function () {
    localStorage.setItem(storageKey, editor.value);
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

// Function to copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(function () {
    showToast('Shareable link copied to clipboard!');
  }).catch(function (err) {
    showToast('Could not copy text: ', err);
  });
}



// MENU
const menuIcon = document.getElementById("hamburger-menu");
const menuOptions = document.getElementById("menu-options");
const shareItem = document.getElementById("share");
const downloadItem = document.getElementById("download");
const saveItem = document.getElementById("save");


// Toggle menu on clicking the circle
menuIcon.addEventListener('click', function () {
  menuOptions.classList.toggle('show');
});

// SHARE BUTTON
shareItem.addEventListener('click', function () {
  const editor = document.getElementById('editor');
  const shareableUrl = generateShareableUrl(editor.value);
  copyToClipboard(shareableUrl);
  event.stopPropagation();
  menuOptions.classList.remove('show');
});

// Add download functionality (no functionality yet)
downloadItem.addEventListener('click', function () {
  // Placeholder for download logic...
  menuOptions.classList.remove('show');
});

// Add save functionality (no functionality yet)
saveItem.addEventListener('click', function () {
  // Placeholder for save logic...
  menuOptions.classList.remove('show');
});
