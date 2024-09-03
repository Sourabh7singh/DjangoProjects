function UpdateSlides() {
    const text = document.getElementById('md_content').value;
    const FrontPart = `
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Reveal.js Presentation with Plugins</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="reveal/dist/reset.css">
        <link rel="stylesheet" href="reveal/dist/reveal.css">
        <link rel="stylesheet" href="reveal/dist/theme/black.css" id="theme">
        <body>
            <div class="reveal">
            <div class="slides">
    `

    const Lastpart = `
            </div>
            </div>

            <script src="reveal/dist/reveal.js"></script>
            <script src="reveal/pluginmarkdown/marked.js"></script>  
            <script src="reveal/notes/notes.js"></script>  

            <script>
            Reveal.initialize({
            plugins: [RevealMarkdown,RevealNotes],
        });
            </script>
        </body>
        </html>`

    const content = FrontPart + text + Lastpart;
    const iframe = document.querySelector('iframe');
    iframe.srcdoc = content;
}