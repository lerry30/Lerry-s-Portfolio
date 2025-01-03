export const copySyntax = () => {
    const template = document.getElementById('template-copy-button');
    const copyButton = template.content.querySelector('.copy-button');

    const darkBoxes = document.querySelectorAll('.dark-box');
    for(const darkBox of darkBoxes) {
        const newCopyButton = copyButton.cloneNode(true);
        const allTextElem = darkBox.querySelectorAll('.text');
        let text = '';
        for(const key in allTextElem) {
            if(!allTextElem.hasOwnProperty(key)) continue;
            text = `${text}\n${String(allTextElem[key].textContent).trim()}`;
        }

        darkBox.append(newCopyButton);

        const svgCopy = newCopyButton.querySelector('.copy');
        const svgCopied = newCopyButton.querySelector('.copied');

        newCopyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(String(text).trim());
            svgCopy.style.display = 'none';
            svgCopied.style.display = 'flex';
            setTimeout(() => {
                svgCopied.style.display = 'none'
                svgCopy.style.display = 'flex';
            }, 2000);
        });
    }
}
