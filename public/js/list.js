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

        const btnPaginationUp = document.getElementById('paginationUp');
        const btnPaginationDown = document.getElementById('paginationDown');
        const me = this
        btnPaginationUp.addEventListener("click", async function () {
            const pagenumber = this.dataset.pagenumber;

            me.updateList(me.query, parseInt(pagenumber));
        });
        btnPaginationDown.addEventListener("click", async function () {
            const pagenumber = this.dataset.pagenumber;

            me.updateList(me.query, parseInt(pagenumber));
        });

        this.onItemClick = options.onItemClick
    }

    updatePagination() {
        const inputPageNumber = document.getElementById('pageNumber');
        const btnPaginationUp = document.getElementById('paginationUp');
        const btnPaginationDown = document.getElementById('paginationDown');
        const spanPageTotal = document.getElementById('pageTotal');
        const nbPages = Math.ceil(this.count / this.limit)

        inputPageNumber.value = this.page

        spanPageTotal.innerHTML = '/' + nbPages

        btnPaginationUp.dataset.pagenumber = (this.page - 1).toString()
        btnPaginationDown.dataset.pagenumber = (this.page + 1).toString()

        if( this.page == 1) {
            btnPaginationUp.classList.add('disabled');
        } else {
            btnPaginationUp.classList.remove('disabled');
        }

        if(this.page == nbPages) {
            btnPaginationDown.classList.add('disabled');
        } else {
            btnPaginationDown.classList.remove('disabled');
        }

        // const paginationClients = document.getElementById('pagination-clients');
        //
        // const nbPages = Math.ceil(this.count / this.limit)
        //
        // let previousDisabled = '';
        // if(this.page == 1) {
        //     previousDisabled = 'disabled'
        // }
        // const previousPageNumber = this.page - 1;
        // let html = `<li class="page-item ${previousDisabled}">
        //   <a class="page-link" href="javascript:void(0)" data-pagenumber="${previousPageNumber}" aria-label="Précédent">
        //     <span aria-hidden="true">&laquo;</span>
        //   </a>
        // </li>`
        // let hasDots = false;
        // const hrefJsVoid = `href="javascript:void(0)"`
        // for (let i = 0; i < nbPages; i++) {
        //     const pageNumber = i + 1;
        //     let active = ''
        //     if(nbPages > 3) {
        //         if( (pageNumber >= (this.page + 3) && pageNumber <= (nbPages - 3)) || (this.page > 3) ) {
        //             if( ! hasDots) {
        //                 html += `<li class="page-item"><a class="page-link" ${hrefJsVoid} data-pagenumber="${pageNumber}"><i class="bi bi-three-dots"></i></a></li>`
        //                 hasDots = true
        //             }
        //             continue;
        //         }
        //     }
        //     if(this.page == pageNumber) {
        //         active = 'active'
        //     }
        //     html += `<li class="page-item ${active}"><a class="page-link" ${hrefJsVoid} data-pagenumber="${pageNumber}">${pageNumber}</a></li>`
        // }
        // let nextDisabled = '';
        // if(this.page >= nbPages) {
        //     nextDisabled = 'disabled'
        // }
        // const nextPageNumber = this.page + 1;
        // html += `<li class="page-item ${nextDisabled}">
        //   <a class="page-link" href="javascript:void(0)" data-pagenumber="${nextPageNumber}" aria-label="Suivant">
        //     <span aria-hidden="true">&raquo;</span>
        //   </a>
        // </li>`
        //
        // paginationClients.innerHTML = html;
        //
        // const paginationLinks = paginationClients.querySelectorAll('.page-link')
        // for (let i = 0; i < paginationLinks.length; i++) {
        //     const me = this;
        //     paginationLinks[i].addEventListener("click", async function () {
        //         const pagenumber = paginationLinks[i].dataset.pagenumber;
        //
        //         me.updateList(me.query, parseInt(pagenumber));
        //     });
        // }
    }

    async updateList(query, page ) {
        if(query === undefined) {
            query = this.query;
        }
        if(page === undefined) {
            page = this.page;
        }

        const filtre = document.getElementById('filtrer').value;

        await this.getData(query, page, filtre);
        let html = "";
        const me = this
        this.clients.forEach(function (client) {
            html += me.formatClientItem(client);
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

    async getData(query = '', page = 1, filtre = '') {
        if(query !== this.query) {
            page = 1;
        }
        let filtreDepots = ''
        if(filtre == 'En attente') {
            filtreDepots ='&depotsEtat=En attente'
        } else if (filtre == 'Perdu') {
            filtreDepots ='&depotsEtat=Perdu'
        } else if (filtre == 'Déduit') {
            filtreDepots ='&depotsEtat=Déduit'
        }
        let url = `clients?_page=${page}&_limit=${this.limit}${filtreDepots}`;
        if (query != '') {
            url += '&q=' + query;
        }

        const response = await callApi(url);

        this.query = query;
        this.count = parseInt(response.count);

        if(response.status == 403) {
            this.clients = []
        } else {
            this.clients = response.json.clients;
        }

        this.page = page;

        this.updatePagination();
    }
}
