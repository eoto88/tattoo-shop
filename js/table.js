import { BadgeEtat } from './badge-etat.js';
import { hide, show, callApi, uuidv4 } from './utility.js'
import { ModalDepot } from './modal-depot.js';

export class TableDepots {
    constructor(options) {
        const modalDepotOptions = {
            'onSave': function() {
                alert('TODO reload')
            }
        }
        this.modalDepot = new ModalDepot(modalDepotOptions);
        this.clientDepots = [];
    }

    getTable() {
        return document.getElementById('tblDepots');
    }

    getTBody() {
        return this.getTable().querySelector('tbody');
    }

    load(clientDepots) {
        this.clientDepots = clientDepots;
        const tblDepots = this.getTBody();

        let depotsHtml = '';
        const me = this;
        clientDepots.forEach(function (depot) {
            depotsHtml += me.formatRow(depot)
        });
        tblDepots.innerHTML = depotsHtml;

        this.listeners();
    }

    formatRow(depot) {
        const badgeEtat = BadgeEtat.getBadge(depot.etat);
        const btnEditHtml = `<button class="btn-edit-depot btn btn-outline-primary" title="Modifier"><i class="bi bi-pencil"></i></button>`;
        const btnDeleteHtml = `<button class="btn-delete-depot btn btn-outline-primary" title="Supprimer"><i class="bi bi-trash"></i></button>`;
        const btnGroup = `<div class="btn-group" role="group">${btnEditHtml}${btnDeleteHtml}</div>`;
        return `<tr data-id="${depot.id}"><td class="dateDepot">${depot.dateDepot}</td><td class="montant">${depot.montant}</td><td class="etat">${badgeEtat}</td><td class="dateEtat">${depot.dateEtat}</td><td class="actions">${btnGroup}</td></tr>`;
    }

    hide() {
        hide(document.getElementById('tblDepotsWrapper'));
    }

    show() {
        show(document.getElementById('tblDepotsWrapper'));
    }

    listeners() {
        const tblDepots = this.getTBody();

        const rows = tblDepots.querySelectorAll('tr');
        for (let i = 0; i < rows.length; i++) {
            this.addRowListeners(rows[i])
        }
    }

    addRowListeners(row) {
        const editDepotBtn = row.querySelector('.btn-edit-depot');
        const deleteDepotBtn = row.querySelector('.btn-delete-depot');

        editDepotBtn.addEventListener('click', this.editRowDepot.bind(this));
        deleteDepotBtn.addEventListener('click', this.deleteRowDepot);
    }

    removeListeners() {
        const tblDepots = this.getTBody();

        const rows = tblDepots.querySelectorAll('tr');
        for (let i = 0; i < rows.length; i++) {
            this.removeRowListeners(rows[i])
        }
    }

    removeRowListeners(row) {
        const editDepotBtn = row.querySelector('.btn-edit-depot');
        const cancelDepotBtn = row.querySelector('.btn-cancel-depot');
        const deleteDepotBtn = row.querySelector('.btn-delete-depot');
        // TODO save button

        editDepotBtn.removeEventListener('click', this.editRowDepot);
        cancelDepotBtn.removeEventListener('click', this.closeEditRowDepot);
        deleteDepotBtn.removeEventListener('click', this.deleteRowDepot);
    }

    editRowDepot(event) {
        const row = event.target.closest('tr');
        const id = this.getRowId(row);
        const depot = this.getDepotById(id);
        this.modalDepot.open(depot);
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

    deleteRowDepot(event) {
        const row = event.target.closest('tr');
        const deleteDepotModal = document.getElementById('deleteDepotModal');
        const modalTitle = deleteDepotModal.querySelector('.modal-title');
        const depotDate = row.querySelector('.dateDepot').innerHTML;
        const montant = row.querySelector('.montant').innerHTML;
        const deleteBtn = deleteDepotModal.querySelector('.btn-delete');
        const cancelBtn = deleteDepotModal.querySelector('.btn-cancel');

        modalTitle.innerHTML = `Dépôt de ${montant}$ du ${depotDate}`

        deleteBtn.onclick = async function () {
            const depotId = TableDepots.getRowId(row)
            let response = await callApi('depots/' + depotId, 'DELETE');

            row.remove();

            deleteDepotModal.style.display = 'none';
        }
        cancelBtn.onclick = function () {
            deleteDepotModal.style.display = 'none';
        }

        deleteDepotModal.style.display = 'block';
    }

    closeEditRowDepot(event) {
        const row = event.target.closest('tr');
        const cells = row.querySelectorAll('td');
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].classList.contains('montant')) {
                const value = cells[i].querySelector('input').value;
                cells[i].innerHTML = value;
            } else if (cells[i].classList.contains('etat')) {
                const value = cells[i].querySelector('select').value;
                // cells[i].innerHTML = BadgeEtat.getBadgeEtat(value);
            } else if (cells[i].classList.contains('actions')) {
                const editBtn = cells[i].querySelector('.btn-edit-depot');
                const deleteBtn = cells[i].querySelector('.btn-delete-depot');
                const saveBtn = cells[i].querySelector('.btn-save-depot');
                const cancelBtn = cells[i].querySelector('.btn-cancel-depot');
                show(editBtn, deleteBtn);
                hide(saveBtn, cancelBtn);
            } else {
                const value = cells[i].querySelector('input').value;
                cells[i].innerHTML = value;
            }
        }
    }

    getRowId(row) {
        return row.dataset.id;
    }

    getDepotById(id) {
        return this.clientDepots.find(obj => {
            return obj.id === id
        });
    }

    addDepot(clientId) {
        const today = new Date()
        const newDepot = {
            "id": uuidv4(),
            "clientId": clientId,
            "dateDepot": today.toISOString().split('T')[0],
            "montant": "0",
            "etat": "En attente",
            "dateEtat": ""
        }
        this.modalDepot.open(newDepot, true);
    }

    // addRow() {
    //     const tblDepots = this.getTBody();
    //     const today = new Date()

    //     const newDepot = {
    //         "id": uuidv4(),
    //         "clientId": "658a0633-d750-45ab-928b-71f93d6eb95c",
    //         "dateDepot": today.toISOString().split('T')[0],
    //         "montant": "0",
    //         "deduit": false,
    //         "perdu": false,
    //         "dateEtat": ""
    //     }

    //     // this.removeListeners();

    //     const row = tblDepots.insertRow(0);
    //     const dateDepotCell = row.insertCell(0);
    //     const montantCell = row.insertCell(1);
    //     const etatCell = row.insertCell(2);
    //     const dateChangementCell = row.insertCell(3);
    //     const actionsCell = row.insertCell(4);

    //     // this.listeners();
    // }

    close() {
        // this.removeListeners();
        const tblDepots = this.getTBody();
        tblDepots.innerHTML = '';
    }
}