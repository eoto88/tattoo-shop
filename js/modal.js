import { hide, show, callApi } from './utility.js'
import { TableDepots } from './table.js';
export class ModalClient {
    constructor() {
        const dialog = this.getDialog();
        this.closeBtn = dialog.querySelector('.btn-close');
        this.editNameBtn = dialog.querySelector('.btn-name-input');
        this.cancelEditNameBtn = dialog.querySelector('.btn-name-cancel');
        this.saveEditNameBtn = dialog.querySelector('.btn-name-save');
        this.addDepotBtn = dialog.querySelector("#create-depot");

        this.listeners();
    }

    getDialog() {
        return document.getElementById('tsmsModal');
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

    static setIdField(clientId) {
        const idInput = document.getElementById('clientId');
        idInput.value = clientId;
    }

    static setNameField(clientName) {
        const modal = document.getElementById("tsmsModal");
        const modalBody = modal.querySelector('.modal-body');
        const nameSpan = modalBody.querySelector('.name');
        const btnNameInput = modalBody.querySelector('.btn-name-input');
        const btnNameSave = modalBody.querySelector('.btn-name-save');
        const btnNameCancel = modalBody.querySelector('.btn-name-cancel');
        const nameInput = modal.querySelector('.name-input');

        nameSpan.innerHTML = clientName;
        nameInput.value = clientName;
        if (clientName == "") {
            hide(btnNameInput);
            show(nameInput, nameSpan, btnNameSave);
        } else {
            hide(nameInput, btnNameSave, btnNameCancel);
            show(btnNameInput);
        }
    }

    static async open(id) {
        let client
        if (id == 'new') {
            client = { "id": id, "name": "", "depots": [] };
        } else {
            client = await callApi('clients/' + id);
            client.depots = await callApi('depots?clientId=' + id + '&_sort=dateDepot&_order=desc');
        }

        this.setIdField(client.id);
        this.setNameField(client.name);

        const modal = document.getElementById("tsmsModal");
        // const depots = modal.querySelector('.depots tbody');

        TableDepots.load(client.depots);

        modal.style.display = "block";
    }

    close() {
        TableDepots.close();
        const dialog = this.getDialog();
        dialog.style.display = 'none';
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
        const nameInput = dialog.querySelector('.name-input');

        let method = 'PUT';
        let id = clientIdInput.value;
        let path = 'clients/' + id;
        const name = nameInput.value;
        if (id == 'new') {
            method = 'POST';
            id = await getNextClientId();
            path = 'clients';
        }
        const client = { "id": id, "name": name };
        let response = await callApi(path, method, client);
        nameSpan.innerHTML = name;
        const listeClients = document.getElementById('liste-clients');
        const listClientLink = listeClients.querySelector("[data-id='" + id + "']");
        listClientLink.innerHTML = name;

        this.closeEditName();

        // TODO Ajuster fnCloseNameEdit si création

        // TODO Mettre à jour la liste des clients
    }

    addDepot() {
        TableDepots.addRow();
    }
}