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

  // Restore zoom level from localStorage
  const savedZoom = localStorage.getItem('quicknote-zoom');
  if (savedZoom) {
    const zoomValue = parseInt(savedZoom);
    // Validate the zoom value is within acceptable bounds
    if (!isNaN(zoomValue) && zoomValue >= 8 && zoomValue <= 48) {
      editor.style.fontSize = zoomValue + 'px';
    }
  }
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
const zoomInItem = document.getElementById("zoom-in");
const zoomOutItem = document.getElementById("zoom-out");


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

// ZOOM CONTROLS
const DEFAULT_FONT_SIZE = 16;
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 48;
const ZOOM_STEP = 2;

// Cache editor reference for zoom operations
const editorElement = document.getElementById('editor');

function getCurrentFontSize() {
  const currentSize = window.getComputedStyle(editorElement).fontSize;
  return parseInt(currentSize);
}

function setFontSize(size) {
  editorElement.style.fontSize = size + 'px';
  localStorage.setItem('quicknote-zoom', size);
}

// Zoom in button
zoomInItem.addEventListener('click', function (event) {
  event.preventDefault();
  event.stopPropagation();
  const currentSize = getCurrentFontSize();
  const newSize = Math.min(currentSize + ZOOM_STEP, MAX_FONT_SIZE);
  setFontSize(newSize);
  // Do not close the menu
});

// Zoom out button
zoomOutItem.addEventListener('click', function (event) {
  event.preventDefault();
  event.stopPropagation();
  const currentSize = getCurrentFontSize();
  const newSize = Math.max(currentSize - ZOOM_STEP, MIN_FONT_SIZE);
  setFontSize(newSize);
  // Do not close the menu
});


// NOTES SIDE MENU
const notesMenuToggle = document.getElementById('notes-menu-toggle');
const notesMenu = document.getElementById('notes-menu');
const notesList = document.getElementById('notes-list');

// Toggle notes menu
notesMenuToggle.addEventListener('click', function () {
  notesMenu.classList.toggle('open');
  if (notesMenu.classList.contains('open')) {
    refreshNotesList();
  }
});

// Close menu when clicking outside
document.addEventListener('click', function (event) {
  if (!notesMenu.contains(event.target) && !notesMenuToggle.contains(event.target)) {
    notesMenu.classList.remove('open');
  }
});

// Function to get all notes from localStorage
function getAllNotes() {
  const notes = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('quickNote')) {
      // Extract the path from the key (remove 'quickNote' prefix)
      const path = key.substring(9) || '/';
      notes.push(path);
    }
  }
  // Sort notes alphabetically
  notes.sort();
  return notes;
}

// Function to refresh the notes list
function refreshNotesList() {
  const notes = getAllNotes();
  const currentPath = window.location.pathname;

  if (notes.length === 0) {
    notesList.innerHTML = '<div class="notes-list-empty">No notes yet. Start typing to create one!</div>';
    return;
  }

  notesList.innerHTML = '';
  notes.forEach(path => {
    const noteItem = document.createElement('div');
    noteItem.className = 'note-item';
    noteItem.textContent = path;

    // Highlight current note
    if (path === currentPath) {
      noteItem.classList.add('active');
    }

    // Navigate to note on click
    noteItem.addEventListener('click', function () {
      window.location.pathname = path;
    });

    notesList.appendChild(noteItem);
  });
}

// Refresh notes list when editor changes (with debounce)
let refreshTimeout;
editorElement.addEventListener('input', function () {
  clearTimeout(refreshTimeout);
  refreshTimeout = setTimeout(function () {
    if (notesMenu.classList.contains('open')) {
      refreshNotesList();
    }
  }, 1000);
});

// Initial refresh when page loads
document.addEventListener('DOMContentLoaded', function () {
  // Use microtask to ensure other DOMContentLoaded handlers run first
  Promise.resolve().then(refreshNotesList);
});
