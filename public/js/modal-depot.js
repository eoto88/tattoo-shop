import { Modal } from './modal.js'
import { callApi } from './utility.js'
import {Auth} from './auth.js'


export class ModalDepot extends Modal {
    constructor(options) {
        super(document.getElementById('tsmsDepotModal'), options);

        if (typeof options.onSave  === "function") {
            this.onSave = options.onSave;
        }
    }

    listeners() {
        const cancelBtn = this.element.querySelector('.btn-cancel')
        const saveBtn = this.element.querySelector('.btn-save')

        cancelBtn.addEventListener('click', this.close.bind(this))
        saveBtn.addEventListener('click', this.saveDepot.bind(this))

        super.listeners()
    }

    async open(depot, newDepot = false) {
        if(typeof depot !== 'object') {
            depot = await callApi('depots/' + depot);
        }
        // TODO empty form
        const depotStateInput = this.element.querySelector('.depot-state-input')
        const depotIdInput = this.element.querySelector('.depot-id-input')
        const clientIdInput = this.element.querySelector('.client-id-input')
        const dateDepotInput = this.element.querySelector('.date-depot-input')
        const montantDepotInput = this.element.querySelector('.montant-depot-input')
        const etatDepotInput = this.element.querySelector('.etat-depot-input')
        const dateChangementDepotInput = this.element.querySelector('.date-changement-depot-input')
        const noteDepotInput = this.element.querySelector('.note-depot-input')

        let stateDepot
        if(newDepot) {
            stateDepot = this.newState
        } else {
            stateDepot = this.existingState
        }

        depotStateInput.value = stateDepot
        depotIdInput.value = depot.id
        clientIdInput.value = depot.clientId
        dateDepotInput.value = depot.dateDepot
        montantDepotInput.value = depot.montant
        etatDepotInput.value = depot.etat
        dateChangementDepotInput.value = depot.dateEtat
        noteDepotInput.value = depot.note

        super.open()
    }

    async saveDepot() {
        const depotId = this.getDepotId()

        const depot = {
            "id": depotId,
            "clientId": this.getDepotClientId(),
            "dateDepot": this.getDateDepot(),
            "montant": this.getMontantDepot(),
            "etat": this.getEtatDepot(),
            "dateEtat": this.getDateChangementDepot(),
            "note": this.getNoteDepot()
        }

        let method = 'PUT';
        let path = 'depots/' + depotId;
        if (this.getDepotState() == this.newState) {
            method = 'POST';
            path = 'depots';
        }
        depot.userId = Auth.getUser().id;
        let response = await callApi(path, method, depot);

        if (response) {
            this.setDepotState(this.existingState);
            if (this.onSave) {
                this.onSave();
            }
            this.close()
        } else {
            alert('error')
        }
    }

    getDepotState() {
        const depotStateInput = this.element.querySelector('.depot-state-input')
        return depotStateInput.value || ""
    }

    setDepotState(state) {
        const depotStateInput = this.element.querySelector('.depot-state-input')
        depotStateInput.value = state;
    }

    getDepotId() {
        const depotIdInput = this.element.querySelector('.depot-id-input')
        return depotIdInput.value || ""
    }

    getDepotClientId() {
        const clientIdInput = this.element.querySelector('.client-id-input')
        return clientIdInput.value || ""
    }

    getDateDepot() {
        const dateDepotInput = this.element.querySelector('.date-depot-input')
        return dateDepotInput.value || ""
    }

    getMontantDepot() {
        const montantDepotInput = this.element.querySelector('.montant-depot-input')
        return montantDepotInput.value || ""
    }

    getEtatDepot() {
        const etatDepotInput = this.element.querySelector('.etat-depot-input')
        return etatDepotInput.value || ""
    }

    getDateChangementDepot() {
        const dateChangementDepotInput = this.element.querySelector('.date-changement-depot-input')
        return dateChangementDepotInput.value || ""
    }

    getNoteDepot() {
        const noteDepotInput = this.element.querySelector('.note-depot-input')
        return noteDepotInput.value || ""
    }
}
