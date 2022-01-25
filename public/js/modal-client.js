import { Modal } from './modal.js'
import { hide, show, callApi, uuidv4, removeAccents } from './utility.js'
import { TableDepots } from './table.js';
import {ModalConfirm} from "./modal-confirm.js";

export class ModalClient extends Modal {
    constructor(options) {

        super(document.getElementById('tsmsClientModal'), options);

        this.onClose = options.onClose;

        this.tableDepots = new TableDepots();

        this.addDepotBtn = this.getAddDepotBtn();
        this.editNameBtn = this.getEditNameBtn();
        // this.deleteBtn = this.getDeleteBtn()
        this.cancelEditNameBtn = this.getCancelEditNameBtn();
    }

    getDialog() {
        return document.getElementById('tsmsClientModal');
    }

    getAddDepotBtn() {
        const dialog = this.getDialog();
        return dialog.querySelector("#create-depot");
    }

    getEditNameBtn() {
        const dialog = this.getDialog();
        return dialog.querySelector('.btn-name-input');
    }

    getDeleteBtn() {
        const dialog = this.getDialog();
        return dialog.querySelector('.btn-delete');
    }

    getCancelEditNameBtn() {
        const dialog = this.getDialog();
        return dialog.querySelector('.btn-name-cancel');
    }

    listeners() {
        super.listeners();

        const me = this;
        const dialog = this.getDialog();
        const editNameBtn = this.getEditNameBtn();
        const deleteBtn = this.getDeleteBtn();
        const cancelEditNameBtn = this.getCancelEditNameBtn();
        const saveEditNameBtn = dialog.querySelector('.btn-name-save');
        const addDepotBtn = this.getAddDepotBtn();

        editNameBtn.onclick = function () {
            me.editName();
        }
        deleteBtn.onclick = async function() {
            await me.delete();
        }
        cancelEditNameBtn.onclick = function () {
            me.closeEditName();
        }
        saveEditNameBtn.onclick = async function () {
            await me.saveEditName();
        }
        addDepotBtn.onclick = function () {
            me.addDepot();
        }
    }

    setStateField(clientState) {
        const stateInput = document.getElementById('clientState');
        stateInput.value = clientState;
    }

    setIdField(clientId) {
        const idInput = document.getElementById('clientId');
        idInput.value = clientId;
    }

    getClientId() {
        const idInput = document.getElementById('clientId')
        return idInput.value
    }

    setNameField(clientName) {
        const modal = document.getElementById("tsmsClientModal");
        const modalBody = modal.querySelector('.modal-body');
        const nameSpan = modalBody.querySelector('.name');
        const btnNameInput = modalBody.querySelector('.btn-name-input');
        const btnNameSave = modalBody.querySelector('.btn-name-save');
        const btnNameCancel = modalBody.querySelector('.btn-name-cancel');
        const nameInput = modal.querySelector('.name-input');

        nameSpan.innerHTML = clientName;
        nameInput.value = clientName;
        if (clientName == "") {
            hide(btnNameInput, nameSpan, btnNameCancel);
            show(nameInput, btnNameSave);
        } else {
            hide(nameInput, btnNameSave, btnNameCancel);
            show(btnNameInput, nameSpan);
        }
    }

    async open(id) {
        let client
        let state;
        if (id == this.newState) {
            state = this.newState
            client = { "id": uuidv4(), "name": "", "depots": [] };

            this.tableDepots.hide();
            hide(this.addDepotBtn);
        } else {
            state = this.existingState;
            client = await callApi('clients/' + id);

            this.tableDepots.load(id);
            this.tableDepots.show();

            const dialog = this.getDialog();
            const addDepotBtn = dialog.querySelector("#create-depot");
            show(addDepotBtn);
        }

        this.setStateField(state);
        this.setIdField(client.id);
        this.setNameField(client.name);
        super.open();
    }

    close() {
        this.tableDepots.close();
        const dialog = this.getDialog();
        super.close();
    }

    editName() {
        const dialog = this.getDialog();
        const nameSpan = dialog.querySelector('.name');
        const nameInput = dialog.querySelector('.name-input')
        const btnNameSave = dialog.querySelector('.btn-name-save');

        hide(this.editNameBtn, nameSpan);
        show(nameInput, btnNameSave, this.cancelEditNameBtn);
    }

    closeEditName() {
        const dialog = this.getDialog();
        const nameSpan = dialog.querySelector('.name');
        const nameInput = dialog.querySelector('.name-input')
        const btnNameSave = dialog.querySelector('.btn-name-save');

        hide(nameInput, btnNameSave, this.cancelEditNameBtn);
        show(this.editNameBtn, nameSpan);
    }

    async saveEditName() {
        const dialog = this.getDialog();
        const nameSpan = dialog.querySelector('.name');
        const clientIdInput = dialog.querySelector('#clientId');
        const clientStateInput = dialog.querySelector('#clientState');
        const nameInput = dialog.querySelector('.name-input');

        let method = 'PUT';
        let id = clientIdInput.value;
        let path = 'clients/' + id;
        const name = nameInput.value;
        const cleanName = removeAccents(name);
        const clientState = clientStateInput.value;
        if (clientState == this.newState) {
            method = 'POST';
            path = 'clients';
        }
        const client = { "id": id, "name": name, "cleanName": cleanName };
        let response = await callApi(path, method, client);
        nameSpan.innerHTML = name;

        if (response) {
            this.setStateField(this.existingState);
            this.tableDepots.show();
            show(this.addDepotBtn);
        } else {
            alert('error')
        }

        // TODO Update client state if success

        // const listeClients = document.getElementById('liste-clients');
        // const listClientLink = listeClients.querySelector("[data-id='" + id + "']");
        // listClientLink.innerHTML = name;

        this.closeEditName();

        // TODO Ajuster fnCloseNameEdit si création

        // TODO Mettre à jour la liste des clients
    }

    async delete() {
        const dialog = this.getDialog();
        const clientIdInput = dialog.querySelector('#clientId');
        let id = clientIdInput.value;
        let path = 'clients/' + id;

        const me = this;
        const modalConfirm = new ModalConfirm({
            'message': 'Êtes-vous sûre de vouloir supprimer ce client?',
            'confirmLabel': 'Supprimer',
            'onConfirm': async function() {
                let response = await callApi(path, 'DELETE');
                if(response.status == 200) {
                    me.close();
                } else {
                    alert('error')
                }
            }
        })
        modalConfirm.open();
    }

    addDepot() {
        const clientId = this.getClientId();
        this.tableDepots.addDepot(clientId);
    }
}
