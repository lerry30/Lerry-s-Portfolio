import Throttle from '../utils/throttle.js';
import { loadingScreen, removeLoading } from '../loading/load.js';

const form = document.querySelector('.contact .contact-form');
const name = form.querySelector('.name');
const email = form.querySelector('.email');
const message = form.querySelector('.message');
const formButton = form.querySelector('.send-btn');

const modalSuccess = document.querySelector('.message-sent-success');
const modalFailed = document.querySelector('.message-sent-failed');
const errorMessage = document.querySelector('.error-message');

export const sendMessage = () => {
    contactForm();
    contactGmail();
}

function contactForm() {
    const url = 'https://lerrysamson.cyclic.app/newmessage';
    // const url = '/newmessage';

    const sendMessageWithInfo = async (ev) => {
        ev.preventDefault();

        loadingScreen();

        const data = {
            name: name.value, 
            email: email.value, 
            message: message.value 
        };

        const response = await send(url, data);
        removeLoading();

        // console.log(response);
        if (response?.success) {
            modalSuccess.showModal();

            name.value = email.value = message.value ='';
        } else {
            errorMessage.textContent = response?.error || 'Something went wrong.';
            modalFailed.showModal();
        }
    }

    const sendMessageThrottle = Throttle(sendMessageWithInfo);
    formButton.addEventListener('click', sendMessageThrottle);
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

function contactGmail() {
    const link = document.querySelector('.gmail-link');
    link.addEventListener('click', () => {
        const nameOfUser = name.value || '<Your Name Here>';
        const messageOfUser = message.value || 'Your Message Here';
        const alternative = `https://mail.google.com/mail/u/0/?fs=1&to=johnlerryramossamson@gmail.com&su=Message%20from%20${nameOfUser}%20via%20Your%20Portfolio%20Website&body=${messageOfUser}&tf=cm`;
        link.href = alternative;
    });
}
