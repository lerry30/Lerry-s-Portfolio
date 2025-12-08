 async function loadMarkdown(markdownUrl) {
    const contentDiv = document.getElementById('content');
    
    try {
        const response = await fetch(markdownUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to load file: ${response.status}`);
        }
        
        const markdown = await response.text();
        const html = marked.parse(markdown);

        // another issue here is my homepage will be the response page if
        // the markdown file did not found.
        
        // right now the html elements from the mark down is a string, so later
        // I'll create a parser to convert them into a DOM element
        //contentDiv.append(html);
        contentDiv.innerHTML = html;
        contentDiv.className = 'markdown-content';
        
        Prism.highlightAllUnder(contentDiv);
    } catch (error) {
        const errorCont = document.createElement('div');
        const errorTitle = document.createElement('h2');
        const errorMessage = document.createElement('p');

        errorCont.classList.add('error');

        errorTitle.textContent = 'This page is unavailable.';

        errorCont.append(errorTitle);
        errorCont.append(errorMessage);
        contentDiv.append(errorCont);

        contentDiv.className = '';
    }
}

addEventListener('DOMContentLoaded', () => {
    const mdCont = document.querySelector('.container');
    const markdownUrl = String(mdCont?.dataset?.md) || '';
    loadMarkdown(markdownUrl);
});