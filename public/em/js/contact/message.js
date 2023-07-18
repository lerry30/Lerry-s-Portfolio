const modalSuccess = document.querySelector('.message-sent-success');
const modalFailed = document.querySelector('.message-sent-failed');

export const sendMessage = () => {
    const form = document.querySelector('.contact .contact-form');
    const name = form.querySelector('.name');
    const email = form.querySelector('.email');
    const message = form.querySelector('.message');
    const formButton = form.querySelector('.send-btn');

    const url = 'https://lerrysamson.cyclic.app/newmessage';
    
    formButton.addEventListener('click', async (ev) => {
        ev.preventDefault();

        const data = { 
            name: name.value, 
            email: email.value, 
            message: message.value 
        };

        const response = await send(url, data);
        if (response?.ok) {
            modalSuccess.showModal();
        }
    });
}

async function send(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(data)
        });

        return response.json();
    } catch (error) {
        modalFailed.showModal();
        console.log(error);
    }
}
