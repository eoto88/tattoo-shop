import { callApi } from './utility.js'
import { BadgeEtat } from './badge-etat.js';
import { Auth } from './auth.js'

export class List {
    constructor(options) {
        this.clients = [];
        this.query = '';
        this.count = 0;
        this.page = 1;
        this.limit = 25;
        this.listOf = 'clients'

        this.onItemClick = options.onItemClick
    }

    updatePagination() {
        const paginationClients = document.getElementById('pagination-clients');

        const nbPages = this.count / this.limit

        let previousDisabled = '';
        if(this.page == 1) {
            previousDisabled = 'disabled'
        }
        const previousPageNumber = this.page - 1;
        let html = `<li class="page-item ${previousDisabled}">
          <a class="page-link" href="javascript:void(0)" data-pagenumber="${previousPageNumber}" aria-label="Précédent">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>`
        for (let i = 0; i < nbPages; i++) {
            const pageNumber = i + 1;
            html += `<li class="page-item"><a class="page-link" href="javascript:void(0)" data-pagenumber="${pageNumber}">${pageNumber}</a></li>`
        }
        let nextDisabled = '';
        if(this.page >= nbPages) {
            nextDisabled = 'disabled'
        }
        const nextPageNumber = this.page + 1;
        html += `<li class="page-item ${nextDisabled}">
          <a class="page-link" href="javascript:void(0)" data-pagenumber="${nextPageNumber}" aria-label="Suivant">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>`

        paginationClients.innerHTML = html;

        const paginationLinks = paginationClients.querySelectorAll('.page-link')
        for (let i = 0; i < paginationLinks.length; i++) {
            const me = this;
            paginationLinks[i].addEventListener("click", async function () {
                const pagenumber = paginationLinks[i].dataset.pagenumber;

                me.updateList(me.query, parseInt(pagenumber));
            });
        }
    }

    async updateList(query, page ) {
        if(query === undefined) {
            query = this.query;
        }
        if(page === undefined) {
            page = this.page;
        }
        const listOf = document.getElementById('listOf').value;
        this.listOf = listOf

        const filtre = document.getElementById('filtrer').value;

        await this.getData(listOf, query, page, filtre);
        let html = "";
        const me = this
        this.clients.forEach(function (client) {
            if(listOf == 'clients') {
                html += me.formatClientItem(client);
            } else {
                html += me.formatDepotItem(client);
            }
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

    emptyList() {
        const listeClients = document.getElementById('liste-clients');
        listeClients.innerHTML = '';
        this.page = 1;
        this.query = '';
    }

    formatClientItem(client) {
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
        return this.formatListItem(client.id, client.name, badgeDepot);
    }

    formatDepotItem(depot) {
        const badgeDepot = BadgeEtat.getBadge(depot.etat)
        const title = depot.client.name + ' (Dépôt créé le ' + depot.dateDepot + ")"
        return this.formatListItem(depot.client.id, title, badgeDepot);
    }

    formatListItem(id, title, badge) {
        const liClasses = 'list-group-item justify-content-between align-items-start d-flex'
        return `<li class="${liClasses}">
            <h5 class="my-1"><a href="javascript:void(0);" data-id="${id}">${title}</a></h5>
            <div class="my-1">${badge}</div>
        </li>`;
    }

    async getData(listOf, query = '', page = 1, filtre = '') {
        if(query !== this.query) {
            page = 1;
        }
        const userId = Auth.getUser().id;
        let url = `clients?_sort=cleanName&_embed=depots&_page=${page}&_limit=${this.limit}`;
        if(listOf == 'depots') {
            let filtreDepots = ''
            if(filtre == 'Dépôts en attente') {
                filtreDepots ='&etat=En attente'
            }
            url = `depots?_expand=client&userId=${userId}&_page=${page}&_limit=${this.limit}${filtreDepots}`;
        }
        if (query != '') {
            url += '&q=' + query;
        }

        const response = await callApi(url);

        this.query = query;
        this.count = parseInt(response.count);

        if(response.status == 403) {
            this.clients = []
        } else {
            if(listOf == 'clients') {
                this.clients = response.clients;
            } else {
                this.clients = response.json;
            }
        }

        this.page = page;

        this.updatePagination();
    }
}
