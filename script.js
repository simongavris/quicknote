document.addEventListener("DOMContentLoaded", function() {
    const editor = document.getElementById("editor");
    const domain = window.location.host;  // Get the current domain
    const path = window.location.pathname.slice(1);  // Remove the leading '/'

    // Set the dynamic placeholder
    editor.placeholder = `Welcome to QuickNote!
- Type here to take notes.
- Your notes are automatically saved to your local browser storage.
- Access ${domain}/<custom_path> to create individual notes with custom paths. Each path is its own separate note.
- It even works with multiple levels of paths!`;

    // Load saved content from localStorage
    const savedContent = localStorage.getItem(`quicknoteContent_${path}`);
    if (savedContent !== null) {
        editor.value = savedContent;
    }

    // Save content to localStorage on input
    editor.addEventListener("input", function() {
        localStorage.setItem(`quicknoteContent_${path}`, editor.value);
    });
});