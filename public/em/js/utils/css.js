export function cssVarFromElement(element, cssvar) {
    const elementStyleProps = getComputedStyle(element);
    return elementStyleProps.getPropertyValue(cssvar);
}