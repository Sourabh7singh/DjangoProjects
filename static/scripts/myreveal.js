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

 const resizer = document.getElementById('resizer');
 const fileList = document.getElementById('file-list');
 const contentArea = document.getElementById('content-area');

 resizer.addEventListener('mousedown', function(e) {
     e.preventDefault();
     document.addEventListener('mousemove', resize);
     document.addEventListener('mouseup', stopResize);
 });

 function resize(e) {
     const offsetRight = document.body.offsetWidth - (e.clientX);
     fileList.style.width = e.clientX + 'px';
     contentArea.style.width = offsetRight + 'px';
     resizer.style.left = e.clientX + 'px';
 }

 function stopResize() {
     document.removeEventListener('mousemove', resize);
     document.removeEventListener('mouseup', stopResize);
 }


 // Function to update slides
 function UpdateSlides() {
     const mdContent = editor.getValue();
     console.log(mdContent);
 }

 const csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');


 function loadFileContent(fileId) {
     document.getElementById("file_id").value = fileId;
     fetch(`/reveal/get-content/${fileId}`)
         .then(response => response.json())
         .then(text => {
             let content = text['content'];
             content = atob(content);
             editor.setValue(content);
             editor.updateOptions({ readOnly: false });
             document.getElementById('file-name').value = text['title'];
         });
 }

function saveFileContent() {
    const fileName = document.getElementById('file-name').value;
    const content = editor.getValue();
    const id = document.getElementById('file_id').value;
    const base64Content = btoa(content);
    fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrf_token
        },
        body: JSON.stringify({
            'title': fileName,
            'content': base64Content,
            'id': id,
        })
    }).then(response => {
        if (response.ok) {
            alert('File saved successfully!');
        }
    });
}

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
        }).then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('File created successfully!');
                window.location.reload();
            } else {
                alert('File creation failed. A file with this name may already exist.');
            }
        });
    }
}

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
