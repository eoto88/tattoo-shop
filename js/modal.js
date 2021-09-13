import { hide, show } from './utility.js'

export class Modal {
    constructor(element, options) {
        this.element = element;
        if (options) {
            if (typeof options.onClose  === "function") {
                this.onClose = options.onClose;
            }
            if (typeof options.onOpen === "function") {
                this.onOpen = options.onOpen;
            }
        }
    }

    open() {
        if (this.onOpen) {
            this.onOpen();
        }

        this.element.style.display = 'block';
        this.element.classList.add('show');
    }

    close() {
        if (this.onClose) {
            this.onClose();
        }

        this.element.style.display = 'none';
        this.element.classList.remove('show');
    }
}