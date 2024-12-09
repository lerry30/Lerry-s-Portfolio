export const selectImage = () => {
    const images = document.querySelectorAll('.s-img');
    for(const image of images) {
        image?.addEventListener('click', () => {
            const currentPageY = document.documentElement.scrollTop;

            const imageCont = document.createElement('div');
            const exitButton = document.createElement('button');
            const imageClone = image.cloneNode(true);
            imageCont.classList.add('image-cont');
            exitButton.classList.add('x-button');

            imageCont.style.top = `${currentPageY}px`;
            imageCont.style.height = `${innerHeight}px`;

            document.body.style.overflow = 'hidden';
            document.body.append(imageCont);

            exitButton.innerText = 'x';
            imageCont.append(imageClone);
            imageCont.append(exitButton);

            imageClone.addEventListener('mousemove', (e) => {
                const x = e.clientX - e.target.offsetLeft;
                const y = e.clientY - e.target.offsetTop;
                imageClone.style.transformOrigin = `${x}px ${y}px`;
                imageClone.style.transform = 'scale(1.4)';
            });

            imageClone.addEventListener('mouseleave', () => {
                imageClone.style.transformOrigin = 'center center';
                imageClone.style.transform = 'scale(1)';
            });

            exitButton?.addEventListener('click', () => {
                document.body.style.overflowY = 'auto';
                imageCont.remove();
            });
        });
    }
}
