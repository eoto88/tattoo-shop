import { ModalClient } from './modal.js';
import { callApi } from './utility.js'

export class List {
    constructor() {
        this.clients = [];
        this.totalClients = 0;
    }

    static async updateClients(query = '') {
        const response = await callApi('clients' + query);
        this.clients = response.clients;
        this.totalClients = response.count;
    }

    static async updateList(query = '') {
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
            links[i].addEventListener("click", async function () {
                const id = links[i].dataset.id;

                ModalClient.open(id);
            });
        }
    }
}