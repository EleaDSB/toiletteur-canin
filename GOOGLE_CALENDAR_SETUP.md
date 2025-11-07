# Configuration Google Calendar API

Ce guide vous explique comment configurer l'intégration avec Google Calendar pour permettre la prise de rendez-vous automatique.

## Étapes de configuration

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Cliquez sur "Sélectionner un projet" puis "Nouveau projet"
3. Donnez un nom à votre projet (ex: "Toiletteur Canin")
4. Cliquez sur "Créer"

### 2. Activer l'API Google Calendar

1. Dans le menu de gauche, allez dans "API et services" > "Bibliothèque"
2. Recherchez "Google Calendar API"
3. Cliquez sur "Google Calendar API"
4. Cliquez sur "Activer"

### 3. Créer des identifiants OAuth 2.0

1. Dans le menu de gauche, allez dans "API et services" > "Identifiants"
2. Cliquez sur "Créer des identifiants" > "ID client OAuth"
3. Si c'est votre premier ID client OAuth, vous devrez configurer l'écran de consentement:
   - Cliquez sur "Configurer l'écran de consentement"
   - Sélectionnez "Externe" puis "Créer"
   - Remplissez les informations requises:
     - Nom de l'application
     - Email d'assistance utilisateur
     - Domaine de l'application (optionnel)
   - Cliquez sur "Enregistrer et continuer"
   - Dans "Champs d'application", ajoutez `.../auth/calendar.events`
   - Cliquez sur "Enregistrer et continuer"
   - Cliquez sur "Retour au tableau de bord"

4. Revenez à "Identifiants" et cliquez sur "Créer des identifiants" > "ID client OAuth"
5. Sélectionnez "Application Web"
6. Donnez un nom (ex: "Client Web Toiletteur")
7. Dans "Origines JavaScript autorisées", ajoutez:
   - `http://localhost:3000` (pour le développement)
   - Votre URL de production (ex: `https://votre-domaine.com`)
8. Dans "URI de redirection autorisés", ajoutez:
   - `http://localhost:3000`
   - Votre URL de production
9. Cliquez sur "Créer"
10. Notez votre **Client ID** (il ressemble à: `xxxxx.apps.googleusercontent.com`)

### 4. Créer une clé API

1. Dans "Identifiants", cliquez sur "Créer des identifiants" > "Clé API"
2. Notez votre **API Key**
3. Pour sécuriser la clé:
   - Cliquez sur "Modifier la clé API"
   - Dans "Restrictions relatives aux applications", sélectionnez "Références HTTP"
   - Ajoutez vos domaines autorisés
   - Dans "Restrictions relatives aux API", sélectionnez "Google Calendar API"
   - Cliquez sur "Enregistrer"

### 5. Configurer l'application

1. Ouvrez le fichier `src/utils/googleCalendar.js`
2. Remplacez les valeurs suivantes:

```javascript
const GOOGLE_API_CONFIG = {
  apiKey: 'VOTRE_API_KEY_ICI',
  clientId: 'VOTRE_CLIENT_ID_ICI.apps.googleusercontent.com',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: 'https://www.googleapis.com/auth/calendar.events'
};
```

### 6. Tester l'intégration

1. Redémarrez votre serveur de développement:
```bash
npm start
```

2. Allez sur la page "Prendre RDV"
3. La première fois, l'application vous demandera de vous connecter avec votre compte Google
4. Autorisez l'application à accéder à votre calendrier
5. Créez un rendez-vous test
6. Vérifiez qu'il apparaît dans votre Google Calendar

## Fonctionnalités

### Création d'événements

Quand un client prend un rendez-vous, l'événement est automatiquement créé dans Google Calendar avec:
- Le nom du client et du chien
- Le service demandé
- Les coordonnées du client
- Des rappels automatiques (1 jour et 1 heure avant)
- Une invitation envoyée par email au client

### Vérification des disponibilités

L'application peut vérifier les créneaux déjà occupés dans votre calendrier pour ne proposer que les créneaux disponibles. Cette fonctionnalité est prête mais nécessite d'être activée dans le composant `RendezVous.jsx`.

Pour l'activer, décommentez les lignes qui utilisent `isTimeSlotAvailable()`.

## Sécurité

**Important**: Ne committez jamais vos clés API et Client ID dans un dépôt public !

Pour un environnement de production:
1. Utilisez des variables d'environnement
2. Créez un fichier `.env`:
```
REACT_APP_GOOGLE_API_KEY=votre_api_key
REACT_APP_GOOGLE_CLIENT_ID=votre_client_id
```

3. Modifiez `src/utils/googleCalendar.js`:
```javascript
const GOOGLE_API_CONFIG = {
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  // ...
};
```

## Limites et quotas

Google Calendar API a des limites:
- **Requêtes par jour**: 1,000,000
- **Requêtes par 100 secondes par utilisateur**: 100

Pour une utilisation normale d'un salon de toilettage, ces limites sont largement suffisantes.

## Support

Pour plus d'informations:
- [Documentation Google Calendar API](https://developers.google.com/calendar/api/guides/overview)
- [Console Google Cloud](https://console.cloud.google.com/)

## Dépannage

### Erreur: "Access blocked: This app's request is invalid"
- Vérifiez que vous avez bien configuré l'écran de consentement OAuth
- Vérifiez que les origines JavaScript sont correctement configurées

### Erreur: "API key not valid"
- Vérifiez que l'API Google Calendar est activée
- Vérifiez les restrictions de votre clé API

### Les événements ne s'affichent pas
- Vérifiez que vous êtes bien connecté avec le bon compte Google
- Vérifiez les autorisations dans [Paramètres de sécurité Google](https://myaccount.google.com/permissions)
