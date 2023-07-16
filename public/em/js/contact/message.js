export const sendMessage = () => {
    try {
        const form = document.querySelector('.contact .contact-form');
        const name = form.querySelector('.name');
        const email = form.querySelector('.email');
        const message = form.querySelector('.message');
        const formButton = form.querySelector('.send-btn');

        const url = 'https://johnlerryramossamson.cyclic.app/newmessage';
        
        formButton.addEventListener('click', async (ev) => {
            ev.preventDefault();

            const data = { 
                name: name.value, 
                email: email.value, 
                message: message.value 
            };

            const response = await send(url, data);
            console.log(response);
            // make modal for sent status

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
        });
    } catch(error) {
        console.log(error);
    }
}

async function send(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(data)
    });

    return response.json();
}
