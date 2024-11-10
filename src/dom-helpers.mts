export const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export const getFocusableElements = (element: HTMLElement, includeDisabled: boolean = false) => {
    const elements = Array.from(element.querySelectorAll(FOCUSABLE_SELECTOR));

    if (includeDisabled) {
        return elements;
    }

    return elements.filter(el => !el.hasAttribute('disabled'));
};

export const tabTrap = (element: HTMLElement) => (event: KeyboardEvent) => {
    const focusableElements = getFocusableElements(element);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                event.preventDefault();
            }
        }
    }
};