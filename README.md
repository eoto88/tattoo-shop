# tattoo-shop
TSMS - Tattoo shop management system

## Installation
```bash
sudo vim /etc/hosts
# Add those 2 lines
127.0.0.1       tsms.tattoo
127.0.0.1       api.tsms.tattoo

# Create database
cp db-sample.json db.json
```

## TODO 📜
- Pouvoir trier par nom, par dépôt en attente ou par date (dernier dépôt ajouté)
- Ajuster automatiquement les clients sans cleanName
- Mettre le badge perdu en rouge
- Possibilité de supprimer un client
- Pop-up si on ajoute un client en double (Empêcher de créer 2 clients avec le même nom)
- Afficher tout (au lieu de seulement 10) et possibilité de scroller
- Afficher le mois en lettres au lieu en chiffre (facultatif)
- Note undefined par défaut
- Affichage de clients par ordre alphabétique
- Bug après avoir ajouté un dépôt à un nouveau client
- Bug affichage mauvais dépot après création client et ensuite dépot
- Desktop shortcut https://www.npmjs.com/package/create-desktop-shortcuts
