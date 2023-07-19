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


addEventListener('scroll', () => {
    const pageTop = document.body.getBoundingClientRect().top;
    sessionStorage.setItem('page-top', pageTop);
});