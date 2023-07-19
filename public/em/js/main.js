import { scrollPageCalc, scrollPage, highLightNavLink } from './nav/link.js';
import { sendMessage } from './contact/message.js';
import { toggleSidePos, resetSideBarPos } from './mobile/sidebar.js';

import Throttle from './utils/throttle.js';

scrollPageCalc(); // setting page section properties
scrollPage(); // scroll page section to display on screen when nav link is selected from nav bar
sendMessage(); // send message for contact section
toggleSidePos(); // toggle sidebar position to left or right

const calcPagePosThrottle = Throttle(scrollPageCalc);
// const highLightNavLinkThrottle = Throttle(highLightNavLink);
addEventListener('resize', () => {
    calcPagePosThrottle();
    resetSideBarPos();
}); // to update page section properties

addEventListener('scroll', highLightNavLink); // to highlight nav link that is active or currently displayed page section

// save page top or y position in session storage to persist its position to make sure loading is on the screen and not start 
// at the top of the page where I uses this page top number to define how much pixel I'll need to push loading page to button
addEventListener('scroll', () => {
    const pageTop = document.body.getBoundingClientRect().top;
    sessionStorage.setItem('page-top', pageTop);
});

// const backdrop = document.querySelector('.message-sent-failed');
// addEventListener('scroll', () => {
//     if (backdrop.open) {}
// });