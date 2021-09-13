import { Modal } from './modal.js'
import { hide, show, callApi, uuidv4 } from './utility.js'
import { TableDepots } from './table.js';
export class ModalClient extends Modal {
    constructor(options) {

        super(document.getElementById('tsmsClientModal'), options);

        const dialog = this.getDialog();

        this.existingState = 'existing';
        this.newState = 'new';

        this.onClose = options.onClose;

        this.closeBtn = dialog.querySelector('.btn-close');
        this.editNameBtn = dialog.querySelector('.btn-name-input');
        this.cancelEditNameBtn = dialog.querySelector('.btn-name-cancel');
        this.saveEditNameBtn = dialog.querySelector('.btn-name-save');
        this.addDepotBtn = dialog.querySelector("#create-depot");

        this.tableDepots = new TableDepots();

        this.listeners();
    }

    getDialog() {
        return document.getElementById('tsmsClientModal');
    }

    listeners() {
        let me = this;
        this.closeBtn.onclick = function () {
            me.close();
        }
        this.editNameBtn.onclick = function () {
            me.editName();
        }
        this.cancelEditNameBtn.onclick = function () {
            me.closeEditName();
        }
        this.saveEditNameBtn.onclick = async function () {
            me.saveEditName();
        }
        this.addDepotBtn.onclick = function () {
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
            client.depots = await callApi('depots?clientId=' + id + '&_sort=dateDepot&_order=desc');

            this.tableDepots.load(client.depots);
            this.tableDepots.show();
            show(this.addDepotBtn);
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
        const clientState = clientStateInput.value;
        if (clientState == this.newState) {
            method = 'POST';
            path = 'clients';
        }
        const client = { "id": id, "name": name };
        let response = await callApi(path, method, client);
        nameSpan.innerHTML = name;

        if (response) {
            this.setStateField(this.existingState);
            this.tableDepots.show();
            show(this.addDepotBtn);
        }

        // TODO Update client state if success

        // const listeClients = document.getElementById('liste-clients');
        // const listClientLink = listeClients.querySelector("[data-id='" + id + "']");
        // listClientLink.innerHTML = name;

        this.closeEditName();

        // TODO Ajuster fnCloseNameEdit si création

        // TODO Mettre à jour la liste des clients
    }

    addDepot() {
        this.tableDepots.addRow();
    }
}