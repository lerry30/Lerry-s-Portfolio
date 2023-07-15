import { cssVarFromElement } from '../utils/css.js';
import { findNumbers } from '../utils/number.js';

const moveNavBar = document.querySelector('.move-nav'); // button to toggle sidebar from left to right
const navBar = document.querySelector('header'); // header however because it is mobile size it sets as sidebar
const content = document.querySelector('main'); // main or the entire page content

const counterSides = { left: 'right', right: 'left' };
const sidebarWidth = findNumbers(cssVarFromElement(document.body, '--mobile-sb-width')); // get css value. it's originally 100px

export const toggleSidePos = () => {
    moveNavBar.addEventListener('click', (ev) => {
        ev.preventDefault();
        const newPosition = moveNavBar.dataset.nav; // to retrieve data to exchange the position of main content and sidebar
        let sidebarOffset = 0; // zero for right side to back to its own original position
        let mainContentPos = 0; // zero for right side if the main content doesn't need to move or to back to its own original position

        if(newPosition == 'left') {
            sidebarOffset = -(innerWidth - sidebarWidth);
            mainContentPos = sidebarWidth;
        }

        navBar.style.transform = `translateX(${sidebarOffset}px)`;
        content.style.transform = `translateX(${mainContentPos}px)`;

        moveNavLinks(newPosition);
        sidebarLine(newPosition);

        moveNavBar.textContent = counterSides[newPosition]?.toUpperCase(); // change button text
        moveNavBar.dataset.nav = counterSides[newPosition]; // set new value its new side when it clicks again
    });
}

export function resetSideBarPos() { // resetting to original state while screen resizing
    navBar.style.transform = `translateX(0px)`;
    content.style.transform = `translateX(0px)`;

    moveNavLinks('right');
    sidebarLine('right');

    moveNavBar.textContent = 'LEFT'; // change button text
    moveNavBar.dataset.nav = 'left';
}

// it will just justify the text from sidebar to left or right
function moveNavLinks(side) {
    const links = document.querySelectorAll('header nav ul li'); // li contains p as link to scroll page
    for(const link of links) {
        link.style.justifyContent = side; // side = left or right
    }
}

// it will set margin left to fit with the design
function sidebarLine(side) {
    const line = document.querySelector('header .line');
    const newMargin = { 
        left: '20px',
        right: `${ sidebarWidth - 20 }px`
    };

    line.style.margin = `0 0 0 ${ newMargin[side] }`; // margin left and reset other sides
}