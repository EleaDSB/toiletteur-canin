# Configuration de la synchronisation Google Calendar

Ce guide explique comment configurer la synchronisation automatique des rendez-vous avec Google Calendar.

## 📋 Prérequis

- Un compte Google
- Accès à Google Cloud Console
- Node.js et npm installés

## 🚀 Étapes de configuration

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Cliquez sur **"Créer un projet"**
3. Donnez un nom à votre projet (ex: "Toutouchic Calendrier")
4. Cliquez sur **"Créer"**

### 2. Activer l'API Google Calendar

1. Dans votre projet, allez dans **"APIs & Services"** > **"Library"**
2. Recherchez **"Google Calendar API"**
3. Cliquez sur **"Activer"** (Enable)

### 3. Créer un compte de service

1. Allez dans **"APIs & Services"** > **"Credentials"**
2. Cliquez sur **"Create Credentials"** > **"Service Account"**
3. Remplissez les informations :
   - **Nom du compte de service** : `toiletteur-calendar`
   - **Description** : "Service account pour synchronisation calendrier"
4. Cliquez sur **"Create and Continue"**
5. **Rôle** : Sélectionnez "Editor" ou "Project > Editor"
6. Cliquez sur **"Continue"** puis **"Done"**

### 4. Créer une clé JSON

1. Dans la liste des comptes de service, cliquez sur celui que vous venez de créer
2. Allez dans l'onglet **"Keys"**
3. Cliquez sur **"Add Key"** > **"Create new key"**
4. Choisissez le format **JSON**
5. Cliquez sur **"Create"**
6. Un fichier JSON sera téléchargé automatiquement ⚠️ **GARDEZ-LE EN SÉCURITÉ**

### 5. Partager votre calendrier avec le compte de service

1. Ouvrez [Google Calendar](https://calendar.google.com)
2. Dans la liste des calendriers (à gauche), trouvez le calendrier que vous voulez synchroniser
3. Cliquez sur les **3 points** à côté du calendrier > **"Settings and sharing"**
4. Scrollez jusqu'à **"Share with specific people"**
5. Cliquez sur **"Add people"**
6. Copiez l'email du compte de service depuis le fichier JSON téléchargé
   - Il ressemble à : `toiletteur-calendar@projet-xxx.iam.gserviceaccount.com`
7. Collez cet email et donnez les permissions **"Make changes to events"**
8. Cliquez sur **"Send"**

### 6. Récupérer l'ID du calendrier

1. Toujours dans **"Settings and sharing"** du calendrier
2. Scrollez jusqu'à **"Integrate calendar"**
3. Copiez le **"Calendar ID"** (ex: `abc123@group.calendar.google.com` ou `primary` pour le calendrier principal)

### 7. Configurer les variables d'environnement

1. Ouvrez le fichier JSON téléchargé à l'étape 4
2. Copiez tout son contenu (c'est un objet JSON complet)
3. Ouvrez votre fichier `.env` dans le dossier `/server`
4. Ajoutez les variables suivantes :

```env
# Google Calendar Configuration
GOOGLE_CALENDAR_CREDENTIALS={"type":"service_account","project_id":"votre-projet",...}
GOOGLE_CALENDAR_ID=votre-calendar-id@group.calendar.google.com
```

⚠️ **Important** :
- `GOOGLE_CALENDAR_CREDENTIALS` doit contenir le contenu complet du fichier JSON **sur une seule ligne**
- N'ajoutez pas de retours à la ligne dans les credentials
- Si vous utilisez `primary` comme ID, les événements seront ajoutés à votre calendrier principal

### 8. Format du fichier .env

Exemple complet :

```env
# Configuration du serveur
PORT=5001

# Configuration email (Gmail)
EMAIL_USER=votre.email@gmail.com
EMAIL_PASS=votre_mot_de_passe_application

# Email de destination
RECIPIENT_EMAIL=votre.email@gmail.com

# URL du frontend
FRONTEND_URL=http://localhost:3000

# Admin authentication (JWT)
ADMIN_PASSWORD_HASH=$2b$10$...
JWT_SECRET=votre_secret_jwt

# Google Calendar Configuration
GOOGLE_CALENDAR_CREDENTIALS={"type":"service_account","project_id":"toutouchic-123456","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"toiletteur-calendar@toutouchic-123456.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
GOOGLE_CALENDAR_ID=abc123def456@group.calendar.google.com
```

## ✅ Tester la configuration

1. Redémarrez votre serveur backend :
```bash
cd server
npm start
```

2. Créez un nouveau rendez-vous via l'application
3. Vérifiez dans Google Calendar que l'événement a bien été créé

## 🔧 Dépannage

### Erreur : "Token has been expired or revoked"
- Vérifiez que le compte de service a bien accès au calendrier
- Régénérez une nouvelle clé JSON si nécessaire

### Erreur : "Calendar not found"
- Vérifiez que le `GOOGLE_CALENDAR_ID` est correct
- Assurez-vous que le calendrier existe et est partagé avec le compte de service

### Erreur : "Invalid JSON"
- Vérifiez que les credentials JSON sont bien formatés sur une seule ligne
- Assurez-vous qu'il n'y a pas de caractères d'échappement incorrects

### Les événements ne sont pas créés
- Vérifiez les logs du serveur pour voir les messages d'erreur
- Assurez-vous que l'API Google Calendar est bien activée
- Vérifiez que les permissions du compte de service sont correctes

## 🎯 Fonctionnalités

Une fois configuré, le système :

- ✅ Crée automatiquement un événement Google Calendar pour chaque nouveau rendez-vous
- ✅ Supprime l'événement lors de l'annulation d'un rendez-vous
- ✅ Envoie des invitations par email aux clients
- ✅ Définit des rappels automatiques (24h avant et 1h avant)
- ✅ Colore les événements en vert pour faciliter l'identification

## 📱 Mode dégradé

Si Google Calendar n'est pas configuré :
- Le système continuera de fonctionner normalement
- Les rendez-vous seront stockés dans `appointments.json`
- Les emails de confirmation seront toujours envoyés
- Un message d'avertissement apparaîtra dans les logs : `⚠️ Google Calendar non configuré - synchronisation désactivée`

## 🔒 Sécurité

⚠️ **IMPORTANT** :
- Ne committez JAMAIS le fichier JSON des credentials sur Git
- Ne partagez JAMAIS vos credentials
- Le fichier `.gitignore` est déjà configuré pour protéger le `.env`
- En production, utilisez des variables d'environnement sécurisées (pas de fichier .env committé)

## 📚 Ressources

- [Documentation Google Calendar API](https://developers.google.com/calendar/api/guides/overview)
- [Guide des comptes de service](https://cloud.google.com/iam/docs/service-accounts)
- [Console Google Cloud](https://console.cloud.google.com/)
