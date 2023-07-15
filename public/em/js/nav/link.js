import { cssVarFromElement } from '../utils/css.js';

const links = document.querySelectorAll('header nav ul li .link'); // navigational buttons
const sections = {}; // container to hold all properties that are needed for further functionalities

// get css variables
const defTextColor = cssVarFromElement(document.body, '--txt-prime');
const hightLightText = cssVarFromElement(document.body, '--txt-highlight');

// calculate the distance between the top of the screen to the top of page section(about me, contact, etc.) 
export const scrollPageCalc = () => {
    // the body contains all sections for the web page so scroll down will push it through the top and change its y position
    const pageTop = document.body.getBoundingClientRect().top; // page y position from screen

    for(const link of links) {
        // get section names from nav links
        const nameOfSection = Object.keys(link.dataset)[0];
        const sectionElem = document.querySelector(`main .${nameOfSection}`) || undefined; // select the section element

        // store section data
        sections[nameOfSection] = {
            element: sectionElem,
            yPos: (sectionElem?.getBoundingClientRect()?.top || 0) - pageTop,
            half: (sectionElem?.getBoundingClientRect()?.height || 0) / 2 // half of section element height
        };
    }
}

export const scrollPage = () => {
    if(Object.keys(sections).length == 0) scrollPageCalc();
    for(const link of links) {
        // get section names from nav links
        const nameOfSection = Object.keys(link.dataset)[0];

        // click event
        link.addEventListener('click', () => {
            const top = sections[nameOfSection].yPos;
            scrollTo(0, top);

            setHighLightColor(link);
        });
    }
}

export const highLightNavLink = () => { // hightlight the text or nav link if it is currently visible on screen
    for(const link of links) {
        const nameOfSection = Object.keys(link.dataset)[0];
        const sectionProps = sections[nameOfSection];
        const top = Math.abs(sectionProps?.element?.getBoundingClientRect()?.top);

        if(top < sectionProps.half) {
            setHighLightColor(link);
            break;
        }
    }
}

function setHighLightColor(link) { // hightlight the text selected or nav link selected
    // const side = document.querySelector('.move-nav').dataset.nav;
    // const counterSides = { left: 'right', right: 'left' };

    // set every nav links color to default
    for(const link of links) {
        link.style.color = defTextColor;
        // link.style.borderRight = 'none';
    }

    // set selected nav link color to hightlight
    link.style.color = hightLightText;
    // link.style.borderRight = `1px solid ${hightLightText}`;
}