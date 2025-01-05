export const tab = () => {
    const textElems = document.querySelectorAll('[class*=tab]');

    for(const key in textElems) {
        const text = textElems[key];
        const classList = text?.classList ?? {};
        for(const cKey in classList) {
            if(!classList.hasOwnProperty(cKey)) continue;
            const tabClass = classList[cKey].match(/tab_[0-9]_[0-9]/);
            if(tabClass) {
                const tabSegments = tabClass[0].split('_');
                const spaces = tabSegments[1];
                const noOfSpaces = tabSegments[2];
                let whiteSpaces = '';
                for(let i = 0; i < (spaces*noOfSpaces); i++) {
                    whiteSpaces = `${whiteSpaces}&nbsp;`;
                }
                text.innerHTML = `${whiteSpaces}${text.textContent}`;
            }
        }
    }
}
