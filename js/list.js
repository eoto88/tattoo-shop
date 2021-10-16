import { callApi } from './utility.js'
import { BadgeEtat } from './badge-etat.js';
export class ListClients {
    constructor(options) {
        this.clients = [];

        this.onItemClick = options.onItemClick
    }

    async updateClients(query = '') {
        let url = 'clients?_limit=10&_embed=depots';
        if (query != '') {
            url += '&q=' + query;
        }

        this.clients = await callApi(url);
    }

    async updateList(query = '') {
        await this.updateClients(query);
        let html = "";
        this.clients.forEach(function (client) {
            let badgeDepot = '';
            let hasDepotsEnattente = false;
            let oldestDepotEnAttente;
            let dateOldestDepotEnAttente = '';
            client.depots.forEach(function (depot) {
                if (depot.etat === BadgeEtat.depotEnAttente) {
                    hasDepotsEnattente = true
                    if (oldestDepotEnAttente === undefined) {
                        oldestDepotEnAttente = depot.dateDepot
                    } else {
                        if (moment(depot.dateDepot).isBefore(oldestDepotEnAttente)) {
                            oldestDepotEnAttente = depot.dateDepot
                        }
                    } 
                }
            });
            if (hasDepotsEnattente) {
                dateOldestDepotEnAttente = moment(oldestDepotEnAttente).format('YYYY-MM-DD')
                badgeDepot = BadgeEtat.getBadgeEnAttenteDepuis(dateOldestDepotEnAttente)
            }
            const liClasses = 'list-group-item justify-content-between align-items-start d-flex'
            html += `<li class="${liClasses}"><h5 class="my-1"><a href="javascript:void(0);" data-id="${client.id}">${client.name}</a></h5><div class="my-1">${badgeDepot}</div></li>`;
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