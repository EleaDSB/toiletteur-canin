# Backend Toutouchic - Serveur de Contact

Ce serveur backend Node.js/Express gère l'envoi sécurisé des messages de contact depuis le site Toutouchic.

## 🔒 Sécurité

Ce backend utilise des **variables d'environnement** pour protéger les informations sensibles :
- Les clés API et mots de passe sont stockés dans `.env`
- Le fichier `.env` est dans `.gitignore` et **n'est jamais committé**
- Seul le propriétaire du serveur a accès aux secrets

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- Un compte Gmail avec un **mot de passe d'application** configuré

## 🚀 Installation

1. **Installer les dépendances**
   ```bash
   cd server
   npm install
   ```

2. **Configurer les variables d'environnement**

   Copiez le fichier `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```

3. **Éditer le fichier `.env`** avec vos informations :
   ```env
   PORT=5000
   EMAIL_USER=votre.email@gmail.com
   EMAIL_PASS=votre_mot_de_passe_application_gmail
   RECIPIENT_EMAIL=contact@toutouchic.fr
   FRONTEND_URL=http://localhost:3000
   ```

## 🔑 Configuration Gmail

Pour utiliser Gmail avec nodemailer, vous devez créer un **mot de passe d'application** :

1. Allez sur votre [compte Google](https://myaccount.google.com/)
2. Sécurité → Validation en deux étapes (activez-la si ce n'est pas fait)
3. Sécurité → Mots de passe des applications
4. Sélectionnez "Autre" et donnez un nom (ex: "Toutouchic Backend")
5. Copiez le mot de passe généré (16 caractères)
6. Collez-le dans le fichier `.env` → `EMAIL_PASS`

## ▶️ Démarrage

**Mode développement** :
```bash
npm run dev
```

**Mode production** :
```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

## 🧪 Test de l'API

### Route de test
```bash
curl http://localhost:5000/
```

Réponse attendue :
```json
{"message": "Serveur backend Toutouchic actif!"}
```

### Test d'envoi de message
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Jean Dupont",
    "email": "jean@example.com",
    "telephone": "01 23 45 67 89",
    "chien": "Golden Retriever - Max",
    "message": "Test de message"
  }'
```

## 📡 Endpoints

### `GET /`
Vérification que le serveur est actif.

### `POST /api/contact`
Envoie un email avec les données du formulaire.

**Body (JSON)** :
```json
{
  "nom": "string (requis)",
  "email": "string (requis)",
  "telephone": "string (requis)",
  "chien": "string (optionnel)",
  "message": "string (requis)"
}
```

**Réponse succès (200)** :
```json
{
  "success": true,
  "message": "Message envoyé avec succès!"
}
```

**Réponse erreur (400/500)** :
```json
{
  "success": false,
  "message": "Message d'erreur"
}
```

## 🛡️ Sécurité

### Variables d'environnement protégées
- ✅ Le fichier `.env` est dans `.gitignore`
- ✅ Les secrets ne sont jamais exposés au frontend
- ✅ CORS configuré pour accepter uniquement le frontend autorisé

### Validation des données
- ✅ Validation des champs obligatoires
- ✅ Validation du format email
- ✅ Protection contre les injections

### Recommandations production
- [ ] Utiliser HTTPS en production
- [ ] Limiter le taux de requêtes (rate limiting)
- [ ] Ajouter un captcha pour éviter le spam
- [ ] Logger les erreurs dans un fichier
- [ ] Utiliser des variables d'environnement différentes par environnement

## 🚨 Déploiement

Pour déployer en production :

1. **Hébergeur recommandé** : Heroku, Railway, Render, DigitalOcean
2. **Configurer les variables d'environnement** sur la plateforme
3. **Mettre à jour `FRONTEND_URL`** avec l'URL de production
4. **Activer HTTPS**

## 📝 Notes

- Le serveur utilise **nodemailer** pour l'envoi d'emails via Gmail
- Le format de l'email envoyé est en HTML avec un design responsive
- Les erreurs sont loggées dans la console pour faciliter le débogage

## 🆘 Dépannage

### "Erreur de configuration email"
- Vérifiez que `EMAIL_USER` et `EMAIL_PASS` sont corrects dans `.env`
- Assurez-vous d'utiliser un mot de passe d'application Gmail (pas votre mot de passe principal)

### "CORS error"
- Vérifiez que `FRONTEND_URL` correspond à l'URL de votre frontend
- En production, mettez à jour avec l'URL réelle (ex: https://monsite.com)

### "Cannot find module"
- Exécutez `npm install` dans le dossier `/server`
