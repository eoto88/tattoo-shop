import { Modal } from './modal.js'
export class ModalDepot extends Modal {
    constructor(options) {
        super(document.getElementById('tsmsDepotModal'), options);
    }
}