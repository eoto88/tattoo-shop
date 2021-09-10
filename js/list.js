import { ModalClient } from './modal.js';
import { callApi } from './utility.js'

export class ListClients {
    constructor(options) {
        this.clients = [];

        this.onItemClick = options.onItemClick
    }

    async updateClients(query = '') {
        this.clients = await callApi('clients' + query);
    }

    async updateList(query = '') {
        await this.updateClients(query);
        let html = "";
        this.clients.forEach(function (client) {
            console.log(client.name);
            html += `<li class="list-group-item"><h5 class="my-1"><a href="javascript:void(0);" data-id="${client.id}">${client.name}</a></h5></li>`;
        });
        const listeClients = document.getElementById('liste-clients');
        listeClients.innerHTML = html;

        let links = listeClients.querySelectorAll('a');

        for (let i = 0; i < links.length; i++) {
            const me = this;
            links[i].addEventListener("click", async function () {
                const id = links[i].dataset.id;

                me.onItemClick(id);
            });
        }
    }
}