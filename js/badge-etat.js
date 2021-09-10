export class BadgeEtat {
    static getBadgeFromEtat(etat) {
        if(etat == "En attente") {
            return `<span class="badge bg-warning text-dark rounded-pill">En attente</span>`;
        } else if(etat == "Perdu") {
            return `<span class="badge bg-primary rounded-pill">Perdu</span>`;
        } else {
            return `<span class="badge bg-primary rounded-pill">Déduit</span>`;
        }
    }

    static getBadgeFromDepot(depot) {
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