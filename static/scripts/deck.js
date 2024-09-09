var editor; 

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs' }});
require(['vs/editor/editor.main'], function() {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: "",
        language: 'markdown',
        theme: 'vs-light',
        readOnly: false,
        automaticLayout: true,
    });

    // Define snippets for each language
    const snippets = {
        python: [
            {
                label: 'for loop',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: 'for ${1:item} in ${2:items}:\n\t${3:pass}',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'Python for loop'
            },
            {
                label: 'def function',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: 'def ${1:function_name}(${2:args}):\n\t${3:pass}',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'Python function definition'
            }
        ],
        javascript: [
            {
                label: 'for loop',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${3:console.log(${2:array}[${1:i}]);}\n}',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'JavaScript for loop'
            },
            {
                label: 'function',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: 'function ${1:functionName}(${2:params}) {\n\t${3:// body}\n}',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'JavaScript function'
            }
        ],
        html: [
            {
                label: 'html5 boilerplate',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: '<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>${1:Title}</title>\n</head>\n<body>\n\t${2:<!-- Content -->}\n</body>\n</html>',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'HTML5 Boilerplate'
            }
        ],
        css: [
            {
                label: 'media query',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: '@media screen and (max-width: ${1:600px}) {\n\t${2:/* CSS rules */}\n}',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'CSS media query'
            }
        ],
        markdown: [
            {
                label: 'Heading 1',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: '# ${1:Heading}\n',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'Markdown Heading 1'
            }
        ],
        cpp: [
            {
                label: 'for loop',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:N}; ${1:i}++) {\n\t${3:// body}\n}',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'C++ for loop'
            }
        ],
        java: [
            {
                label: 'main method',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: 'public static void main(String[] args) {\n\t${1:// body}\n}',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'Java main method'
            }
        ],
        json: [
            {
                label: 'key-value',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: '"${1:key}": "${2:value}"',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'JSON key-value pair'
            }
        ],
        typescript: [
            {
                label: 'interface',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: 'interface ${1:InterfaceName} {\n\t${2:property}: ${3:type};\n}',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'TypeScript interface'
            }
        ]
    };

    // Register snippets for each language
    for (let lang in snippets) {
        monaco.languages.registerCompletionItemProvider(lang, {
            provideCompletionItems: function(model, position) {
                return { suggestions: snippets[lang] };
            }
        });
    }

    // Add language workers
    monaco.languages.register({ id: 'python' });
    monaco.languages.register({ id: 'javascript' });
    monaco.languages.register({ id: 'html' });
    monaco.languages.register({ id: 'css' });
    monaco.languages.register({ id: 'markdown' });
    monaco.languages.register({ id: 'cpp' });
    monaco.languages.register({ id: 'java' });
    monaco.languages.register({ id: 'json' });
    monaco.languages.register({ id: 'typescript' });

    // Repeat similar setup for other languages...
});



const csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
const LanguageMap = {
    'py': 'python',
    'js': 'javascript',
    'html': 'html',
    'css': 'css',
    'md': 'markdown',
    'cpp': 'cpp',
    'java': 'java',
    'json': 'json',
    'tsx': 'typescript'
};
function loadFileContent(fileId) {
    document.getElementById("file_id").value = fileId;
    fetch(`/code-editor/get-content/${fileId}`)
        .then(response => response.json())
        .then(text => {
            let content = text['content'];
            let language = text['language'];
            document.getElementById('language-select').value = language;
            changeLanguage();
            content = atob(content);
            editor.setValue(content);
            editor.updateOptions({ readOnly: false });
            document.getElementById('file-name').value = text['file_name'];
        });
}

function saveFileContent() {
    const selectedLanguage = document.getElementById('language-select').value;
    const fileName = document.getElementById('file-name').value;
    const content = editor.getValue();
    const id = document.getElementById('file_id').value;
    const base64Content = btoa(content);
    fetch('/code-editor/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrf_token
        },
        body: JSON.stringify({
            'file_name': fileName,
            'content': base64Content,
            'id': id,
            'language': selectedLanguage
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
        fetch('/code-editor/create-file/', {
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

function previewFileContent() {
    const content = editor.getValue();
    fetch('/code-editor/preview-markdown/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrf_token
        },
        body: new URLSearchParams({
            'content': content
        })
    }).then(response => response.text())
    .then(html => {
        const iframe = document.querySelector('.preview iframe');
        const previewDiv = document.querySelector('.preview');
        const fileList = document.querySelector('.file-list');
        iframe.srcdoc = html;
        previewDiv.style.display = 'flex';
        previewDiv.style.width = '50%';
        fileList.style.display = 'none'; 
    });
}

function showFileList() {
    const previewDiv = document.querySelector('.preview');
    const fileList = document.querySelector('.file-list');
    previewDiv.style.display = 'none';
    fileList.style.display = 'block';
}

// Save file with Ctrl+S
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault(); // Prevent default save action
        saveFileContent(); // Call save function
    }
});


function changeLanguage() {
    const selectedLanguage = document.getElementById('language-select').value;
    if(selectedLanguage=="md"){
        // document.getElementById("run").style.display = 'none';
        document.getElementById("previewbtn").style.display = 'block';
        document.getElementById("backbtn").style.display = 'block';
    }
    else{
        // document.getElementById("run").style.display = 'block';
        document.getElementById("previewbtn").style.display = 'none';
        document.getElementById("backbtn").style.display = 'none';
    }
    monaco?.editor.setModelLanguage(editor.getModel(), LanguageMap[selectedLanguage]);
}


function runCode() {
    const code = editor.getValue(); // Get the code from the Monaco Editor
    const language = document.getElementById('language-select').value; // Get the selected language
    const fileName = document.getElementById('file-name').value; // Get the file name
    // Show loader
    document.getElementById('loader').classList.remove('d-none');

    // Prepare the data to send to the server
    const data = new URLSearchParams({
        language: language,
        code: code
    });

    fetch('/code-editor/run_code/', { // Adjust the URL to your Django view endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: data.toString()
    })
    .then(response => response.json())
    .then(data => {
        let outputContainer = document.getElementById('output');
        if (!outputContainer) {
            outputContainer = document.createElement('div');
            outputContainer.id = 'output';
            document.querySelector('.content-area').appendChild(outputContainer);
        }
        if (data.output) {
            outputContainer.innerText = `${fileName}: ${data.output}`;
            // outputContainer.innerText = "Output: "+ "\n" + data.output;
        } else if (data.error) {
            outputContainer.innerText = `Error: ${data.error}`;
        } else {
            outputContainer.innerText = 'No output received.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        let outputContainer = document.getElementById('output');
        if (!outputContainer) {
            outputContainer = document.createElement('div');
            outputContainer.id = 'output';
            document.querySelector('.content-area').appendChild(outputContainer);
        }
        outputContainer.innerText = 'An error occurred.';
    })
    .finally(() => {
        // Hide loader
        document.getElementById('loader').classList.add('d-none');
    });
}


function deleteFile(fileId, event) {
    event.stopPropagation(); // Prevent triggering the loadFileContent function

    if (confirm('Are you sure you want to delete this file?')) {
        fetch(`/code-editor/delete-file/${fileId}/`, {
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