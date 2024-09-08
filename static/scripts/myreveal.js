// Load Monaco Editor and initialize it
var editor;
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' }});
require(['vs/editor/editor.main'], function() {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: '',
        language: 'markdown',
        theme: 'vs-light',
        automaticLayout: true,
    });
});

// Function to update slides
function UpdateSlides() {
    const mdContent = editor.getValue();
    console.log(mdContent);
}

const csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Function to load file content
function loadFileContent(fileId) {
    document.getElementById("file_id").value = fileId;
    fetch(`/reveal/get-content/${fileId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch content');
            }
            return response.json();
        })
        .then(text => {
            let content = text['content'];
            try {
                content = atob(content); // Decode base64 content
            } catch (error) {
                console.error('Error decoding content:', error);
                alert('Error loading content. Content might be corrupted.');
                return;
            }
            editor.setValue(content);
            editor.updateOptions({ readOnly: false });
            document.getElementById('file-name').value = text['title'];
        })
        .catch(error => {
            console.error('Error fetching file content:', error);
            alert('Failed to load file content.');
        });
}

function saveFileContent() {
    const fileName = document.getElementById('file-name').value;
    const content = editor.getValue();
    const id = document.getElementById('file_id').value;

    // Properly handle encoding for Unicode characters
    let base64Content;
    try {
        base64Content = btoa(unescape(encodeURIComponent(content))); // Convert Unicode content to base64
    } catch (error) {
        console.error('Error encoding content:', error);
        alert('Error saving content. Encoding issue.');
        return;
    }

    fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf_token
        },
        body: JSON.stringify({
            'title': fileName,
            'content': base64Content,
            'id': id,
        })
    })
    .then(response => {
        if (response.ok) {
            alert('File saved successfully!');
        } else {
            alert('Error saving file.');
        }
    })
    .catch(error => {
        console.error('Error saving file content:', error);
        alert('Failed to save file.');
    });
}


// Function to create a new file
function createNewFile() {
    const fileName = prompt("Enter the new file name (without extension):");
    if (fileName) {
        fetch('create-file/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrf_token
            },
            body: new URLSearchParams({
                'file_name': fileName
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create file');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('File created successfully!');
                window.location.reload();
            } else {
                alert('File creation failed. A file with this name may already exist.');
            }
        })
        .catch(error => {
            console.error('Error creating file:', error);
            alert('Failed to create file.');
        });
    }
}

// Function to run the code and preview it using Reveal.js
function runCode() {
    const code = editor.getValue();
    console.log(code);

    // Hide the file list and show the preview
    document.querySelector(".file-list").style.display = "none";
    document.querySelector(".preview").style.display = "block";

    const iframe = document.querySelector(".preview iframe");

    // HTML structure with external Reveal.js and CSS loaded via CDN
    let startingPart = `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reveal.js Presentation</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.1.0/reveal.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.1.0/reveal.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.1.0/plugin/markdown/markdown.js"></script>
    </head>
    <body>
        <div class="reveal">
            <div class="slides">
                <section data-markdown data-separator="======" data-separator-vertical="===">
                    <textarea data-template>
    `;

    let lastPart = `
                    </textarea>
                </section>
            </div>
        </div>
        <script>
            Reveal.initialize({
                controls: true,
                progress: true,
                history: true,
                center: true,
                transition: 'slide',
                plugins: [RevealMarkdown]
            });
        </script>
    </body>
    </html>
    `;

    // Combine the parts and assign it to the iframe
    iframe.srcdoc = startingPart + code + lastPart;
}

function deleteFile(fileId, event) {
    event.stopPropagation(); // Prevent triggering the loadFileContent function

    if (confirm('Are you sure you want to delete this file?')) {
        fetch(`/reveal/delete-file/${fileId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('File deleted successfully!');
                // Reload the file list or update the UI as needed
                window.location.reload();
            } else {
                alert('Error deleting file.');
            }
        })
        .catch(error => {
            console.error('Error deleting file:', error);
            alert('Failed to delete file.');
        });
    }
}
