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

## Développement
```bash
node app.js dev
```

## TODO 📜
- Pouvoir trier par nom, par dépôt en attente ou par date (dernier dépôt ajouté)
- Cacher le bouton supprimer pour la création d'un client
- Pop-up si on ajoute un client en double (Empêcher de créer 2 clients avec le même nom)
- Permettre de changer de mot de passe
- Afficher le mois en lettres au lieu en chiffre (facultatif)
- Note undefined par défaut
- Affichage de clients par ordre alphabétique
- Bug après avoir ajouté un dépôt à un nouveau client
- Bug affichage mauvais dépot après création client et ensuite dépot
- Desktop shortcut https://www.npmjs.com/package/create-desktop-shortcuts
