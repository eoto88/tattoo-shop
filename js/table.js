import { hide, show } from './utility.js'

export class TableDepots {
    constructor() {
        
    }

    static getTable() {
        return document.querySelector('#tblDepots tbody');
    }

    static load(clientDepots) {
        const tblDepots = this.getTable();

        let depotsHtml = '';
        clientDepots.forEach(function (depot) {
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
        tblDepots.innerHTML = depotsHtml;

        this.listeners();
    }

    static listeners() {
        const tblDepots = this.getTable();
        const editDepotBtns = tblDepots.querySelectorAll('.btn-edit-depot');
        for (let i = 0; i < editDepotBtns.length; i++) {
            editDepotBtns[i].addEventListener('click', this.editRowDepot);
        }
        const cancelDepotBtns = tblDepots.querySelectorAll('.btn-cancel-depot');
        for (let i = 0; i < cancelDepotBtns.length; i++) {
            cancelDepotBtns[i].addEventListener('click', this.cancelEditRowDepot);
        }
    }

    static removeListeners() {
        const tblDepots = this.getTable();
        const editDepotBtns = tblDepots.querySelectorAll('.btn-edit-depot');
        for (let i = 0; i < editDepotBtns.length; i++) {
            editDepotBtns[i].removeEventListener('click', this.editRowDepot);
        }
        const cancelDepotBtns = tblDepots.querySelectorAll('.btn-cancel-depot');
        for (let i = 0; i < cancelDepotBtns.length; i++) {
            cancelDepotBtns[i].removeEventListener('click', this.cancelEditRowDepot);
        }
    }

    static editRowDepot(event) {
        const row = event.target.closest('tr');
        const cells = row.querySelectorAll('td');
        for (let i = 0; i < cells.length; i++) {
            const value = cells[i].innerHTML;
            if (cells[i].classList.contains('montant')) {
                cells[i].innerHTML = `<input type="number" />`;
            } else if (cells[i].classList.contains('etat')) {
                const etat = cells[i].querySelector('.badge').innerHTML;
                cells[i].innerHTML = TableDepots.getSelectEtat(etat);
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

    static cancelEditRowDepot(event) {
        const row = event.target.closest('tr');
        const cells = row.querySelectorAll('td');
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].classList.contains('montant')) {
                const value = cells[i].querySelector('input').value;
                cells[i].innerHTML = value;
            } else if (cells[i].classList.contains('etat')) {
                const value = cells[i].querySelector('select').value;
                cells[i].innerHTML = TableDepots.getEtatBadge(value);
                // TODO Badge
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

    static addRow() {
        const tblDepots = this.getTable();

        tblDepots.innerHTML = "<tr><td></td><td></td><td></td><td></td><td></td></tr>" + tblDepots.innerHTML;
    }

    static close() {
        this.removeListeners();
        const tblDepots = this.getTable();
        tblDepots.innerHTML = '';
    }

    static getEtatBadge(etat) {
        if(etat == "En attente") {
            return `<span class="badge bg-warning text-dark rounded-pill">En attente</span>`;
        } else if(etat == "Perdu") {
            return `<span class="badge bg-primary rounded-pill">Perdu</span>`;
        } else {
            return `<span class="badge bg-primary rounded-pill">Déduit</span>`;
        }
    }

    static getBadge(depot) {
        let badge;
        if (depot.deduit) {
            badge = `<span class="badge bg-primary rounded-pill">Déduit</span>`;
        } else if (depot.perdu) {
            badge = `<span class="badge bg-primary rounded-pill">Perdu</span>`;
        } else {
            badge = `<span class="badge bg-warning text-dark rounded-pill">En attente</span>`;
        }
    }
}