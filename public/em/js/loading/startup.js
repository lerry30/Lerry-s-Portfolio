document.body.insertAdjacentHTML('beforeend', `
    <div class="loading-background">
        <svg width="297" height="297" viewBox="0 0 297 297" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M285 148.5C285 223.887 223.887 285 148.5 285C73.1131 285 12 223.887 12 148.5C12 73.1131 73.1131 12 148.5 12C223.887 12 285 73.1131 285 148.5Z" stroke="#0AE4D6" stroke-width="4"/>
            <path d="M295 148.5C295 229.41 229.41 295 148.5 295C67.5903 295 2 229.41 2 148.5C2 67.5903 67.5903 2 148.5 2C229.41 2 295 67.5903 295 148.5Z" stroke="#0AE4D6" stroke-width="4"/>
            <path d="M87 218.768H85V220.768V223.982C85 237.953 88.2314 249.08 94.964 257.092L94.9703 257.099L94.9768 257.107C101.838 265.109 111.635 269 124.052 269C136.854 269 146.732 264.696 153.311 255.865C159.863 247.161 163 234.888 163 219.317V114V112H161H149.647H147.647V114V218.28C147.647 231.987 145.41 241.358 141.334 246.837L141.332 246.84C137.35 252.214 131.684 254.945 124.052 254.945C115.495 254.945 109.669 252.219 106.084 247.096C102.362 241.708 100.353 233.412 100.353 221.909V220.768V218.768H98.3529H87Z" stroke="#0AE4D6" stroke-width="4"/>
            <path d="M176 221V223H178H251H253V221V210.733V208.733H251H191.406V70V68H189.406H178H176V70V221Z" stroke="#0AE4D6" stroke-width="4"/>
        </svg>                             
    </div>
`);

const loadingBackground = document.querySelector('.loading-background');
document.body.style.overflow = 'hidden';
document.addEventListener('keydown', disableKeyBoardAndScroll);
document.addEventListener('scroll', disableKeyBoardAndScroll);

setTimeout(() => {
    loadingBackground.remove();
    document.removeEventListener('keydown', disableKeyBoardAndScroll);
    document.removeEventListener('scroll', disableKeyBoardAndScroll);
    document.body.style.overflowY = 'auto';
}, 4000);

function disableKeyBoardAndScroll(ev) {
    ev.preventDefault();
    return false;
}