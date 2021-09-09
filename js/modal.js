// import { List } from './list.js';
import { hide, show, callApi } from './utility.js'


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
            nameInput.style.display = "block";
            btnNameInput.style.display = "none"
            btnNameSave.style.display = "inline-block";
            nameSpan.style.display = "block"
        } else {
            nameInput.style.display = "none";
            btnNameInput.style.display = "block"
            btnNameSave.style.display = "none";
            btnNameCancel.style.display = "none";
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
        const depots = modal.querySelector('.depots tbody');

        let depotsHtml = '';
        client.depots.forEach(function (depot) {
            let etat;
            if (depot.deduit) {
                etat = `<span class="badge bg-primary rounded-pill">Déduit</span>`;
            } else if (depot.perdu) {
                etat = `<span class="badge bg-primary rounded-pill">Perdu</span>`;
            } else {
                etat = `<span class="badge bg-warning text-dark rounded-pill">En attente</span>`;
            }
            const btnEditHtml = `<button class="btn-edit-depot btn btn-outline-primary" title="Modifier"><i class="bi bi-pencil"></i></button>`;
            const btnDeleteHtml = `<button class="btn-delete-depot btn btn-outline-primary" title="Supprimer"><i class="bi bi-trash"></i></button>`;
            const btnSaveHtml = `<button class="d-none btn-save-depot btn btn-outline-primary" title="Sauvegarder"><i class="bi bi-save"></i></button>`;
            const btnCancelHtml = `<button class="d-none btn-cancel-depot btn btn-outline-primary" title="Annuler"><i class="bi bi-x-lg"></i></button>`;
            const btnGroup = `<div class="btn-group" role="group">${btnEditHtml}${btnDeleteHtml}${btnSaveHtml}${btnCancelHtml}</div>`;
            depotsHtml += `<tr><td class="dateDepot">${depot.dateDepot}</td><td class="montant">${depot.montant}</td><td class="etat">${etat}</td><td class="dateEtat">${depot.dateEtat}</td><td class="actions">${btnGroup}</td></tr>`;
        });
        depots.innerHTML = depotsHtml;

        const editDepotBtns = depots.querySelectorAll('.btn-edit-depot');
        for (let i = 0; i < editDepotBtns.length; i++) {
            const me = this;
            editDepotBtns[i].addEventListener('click', function () {
                me.editRowDepot(this.closest('tr'));
            });
        }

        modal.style.display = "block";
    }

    close() {
        const dialog = this.getDialog();
        dialog.style.display = 'none';
    }

    editName() {
        const dialog = this.getDialog();
        const nameSpan = dialog.querySelector('.name');
        const nameInput = dialog.querySelector('.name-input')
        const btnNameSave = dialog.querySelector('.btn-name-save');

        this.editNameBtn.style.display = "none"
        nameSpan.style.display = "none"
        nameInput.style.display = "block"
        btnNameSave.style.display = "inline-block";
        this.cancelEditNameBtn.style.display = "inline-block";
    }

    closeEditName() {
        const dialog = this.getDialog();
        const nameSpan = dialog.querySelector('.name');
        const nameInput = dialog.querySelector('.name-input')
        const btnNameSave = dialog.querySelector('.btn-name-save');

        this.editNameBtn.style.display = "block"
        nameSpan.style.display = "block"
        nameInput.style.display = "none"
        btnNameSave.style.display = "none";
        this.cancelEditNameBtn.style.display = "none";
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
        const dialog = this.getDialog();
        const tblDepots = dialog.querySelector('table.depots tbody');

        tblDepots.innerHTML = "<tr><td></td><td></td><td></td><td></td><td></td></tr>" + tblDepots.innerHTML;
    }

    static editRowDepot(row) {
        const cells = row.querySelectorAll('td');
        for (let i = 0; i < cells.length; i++) {
            const value = cells[i].innerHTML;
            if (cells[i].classList.contains('montant')) {
                cells[i].innerHTML = `<input type="number" />`;
            } else if (cells[i].classList.contains('etat')) {
                const etat = cells[i].querySelector('.badge').innerHTML;
                cells[i].innerHTML = this.getSelectEtat(etat);
            } else if (cells[i].classList.contains('actions')) {
                const editBtn = cells[i].querySelector('.btn-edit-depot');
                const deleteBtn = cells[i].querySelector('.btn-delete-depot');
                const saveBtn = cells[i].querySelector('.btn-save-depot');
                const cancelBtn = cells[i].querySelector('.btn-cancel-depot');
                hide(editBtn, deleteBtn);
                show(saveBtn, cancelBtn);
            } else {
                cells[i].innerHTML = `<input type="text" />`;
            }
            const input = cells[i].querySelector('input');
            if (input) {
                input.value = value;
                input.style.width = '100%';
            }
        }
    }

    static getSelectEtat(etat) {
        let html = '<select>';
        ['En attente', 'Déduit', 'Perdu'].forEach(function (optionValue) {
            let selected = '';
            if (optionValue === etat) {
                selected = ' selected';
            }
            html += `<option${selected}>${optionValue}</option>`;
        });
        html += `</select>`;
        return html;
    }

    saveRowDepot(row) {
        let depot = {};
        const cells = row.querySelectorAll('td');
        for (i = 0; i < cells.length; i++) {
            if (cells[i].classList.contains('dateDepot')) {
                depot.dateDepot = cells[i].querySelector('input').value;
            } else if (cells[i].classList.contains('montant')) {
                depot.montant = cells[i].querySelector('input').value;
            }
        }
        // TODO callApi
    }

    closeRowDepot(row) {

    }
}