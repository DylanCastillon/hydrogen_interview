# Hydrogen_interview

## Installation du projet

Tout d'abord installer les dépendances du projet à l'aide de la commande: ``npm install``

Ensuite veuillez accéder au dossier ``./docker`` et démarrez le container docker du serveur mongoDB grace à la commande: ``docker-compose up -d``

## Demarrage

Pour vos données d'exemple vous pouvez utiliser le fichier ``input.js`` ou creer un nouveau fichier JSON contenant un ou des objets respectant cette structure:

```json
    "name": "string",
    "long": 0.00,
    "lat": 0.00,
    "desc": "string"
```

Pour importer des données sur votre base de données mongoDB, veuillez lancer le script ``migration.js`` avec un fichier JSON en paramètre, exemple: ``node migration input.json``

Enfin pour afficher les données aggrégés que vous aurez précédemment importer, veuillez simplement lancer le script ``aggreg.js``

