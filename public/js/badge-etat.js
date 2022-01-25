export class BadgeEtat {

    static depotEnAttente = 'En attente';
    static depotPerdu = 'Perdu';

    static getBadge(etat) {
        if(etat == this.depotEnAttente) {
            return `<span class="badge bg-warning text-dark rounded-pill">En attente</span>`;
        } else if(etat == this.depotPerdu) {
            return `<span class="badge bg-primary rounded-pill">Perdu</span>`;
        } else {
            return `<span class="badge bg-primary rounded-pill">Déduit</span>`;
        }
    }

    static getBadgeEnAttenteDepuis(date) {
        return `<span class="badge bg-warning text-dark rounded-pill">En attente depuis ${date}</span>`;
    }
}