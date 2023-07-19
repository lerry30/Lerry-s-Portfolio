const loadingBackground = document.querySelector('.loading-background');
const offset = innerHeight * 0.2; // 20%                                   20% * -1
const pageTop = Math.abs(sessionStorage.getItem('page-top')) - offset || (offset * -1); // subtract 20% since this loading container or background has 140vh of height to prevent displaying the behind from unexpected pushing downward of this loading container

loadingBackground.style.top = `${pageTop}px`;
document.body.style.overflow = 'hidden';
document.addEventListener('keydown', disableKeyBoardAndScroll);
document.addEventListener('scroll', disableKeyBoardAndScroll);

setTimeout(() => {
    loadingBackground.style.display = 'none';
    document.removeEventListener('keydown', disableKeyBoardAndScroll);
    document.removeEventListener('scroll', disableKeyBoardAndScroll);
    document.body.style.overflowY = 'auto';
}, 4000);

function disableKeyBoardAndScroll(ev) {
    ev.preventDefault();
    return false;
}