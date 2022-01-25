import { Modal } from './modal.js'

export class ModalConfirm extends Modal {
    constructor(options) {
        super(document.getElementById('confirmModal'), options);

        const modalBody = this.element.querySelector('.modal-body');
        const confirmBtn = this.element.querySelector('.btn-confirm')

        modalBody.innerHTML = options.message;

        confirmBtn.innerHTML = options.confirmLabel;

        if (typeof options.onConfirm  === "function") {
            this.onConfirm = options.onConfirm;
        }
        if (typeof options.onCancel  === "function") {
            this.onCancel = options.onCancel;
        }
    }

    listeners() {
        const confirmBtn = this.element.querySelector('.btn-confirm')
        const cancelBtn = this.element.querySelector('.btn-cancel')

        confirmBtn.addEventListener('click', this.confirm.bind(this))
        cancelBtn.addEventListener('click', this.cancel.bind(this))

        super.listeners()
    }

    confirm() {
        if(this.onConfirm) {
            this.onConfirm()
        }
        this.close()
    }

    cancel() {
        if(this.onCancel) {
            this.onCancel()
        }
        this.close()
    }
}
