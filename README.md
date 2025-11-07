# Toutou Chic - Application Toiletteur Canin

Application web moderne et responsive pour un salon de toilettage canin, développée avec React et Tailwind CSS.

## Description

Cette application vitrine présente les services d'un toiletteur canin professionnel. Elle comprend 5 sections principales :
- **Accueil** : Présentation du salon et de ses services
- **Tarifs** : Grille tarifaire détaillée selon la taille du chien
- **Créations** : Galerie photo des réalisations avec filtres
- **Contact** : Formulaire de contact et informations pratiques
- **Rendez-vous** : Système de prise de rendez-vous en ligne avec calendrier interactif et intégration Google Calendar

## Caractéristiques

- Design **mobile-first** et entièrement responsive
- Interface moderne et attractive avec **Tailwind CSS**
- Navigation fluide entre les sections
- Animations et transitions douces
- Composants réutilisables et modulaires
- Prêt pour la production

## Technologies utilisées

- React 19.2.0
- Tailwind CSS 3.x
- React Calendar (pour la prise de rendez-vous)
- date-fns (gestion des dates)
- Google Calendar API (intégration calendrier)
- Create React App

## Installation

1. Cloner le projet
```bash
git clone [url-du-repo]
cd toiletteur-canin
```

2. Installer les dépendances
```bash
npm install
```

3. Lancer l'application en mode développement
```bash
npm start
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

4. Construire pour la production
```bash
npm run build
```

## Configuration Google Calendar (optionnel)

Pour activer la prise de rendez-vous avec synchronisation Google Calendar :

1. Consultez le guide complet : [GOOGLE_CALENDAR_SETUP.md](./GOOGLE_CALENDAR_SETUP.md)
2. Créez un projet sur [Google Cloud Console](https://console.cloud.google.com/)
3. Activez l'API Google Calendar
4. Créez des identifiants OAuth 2.0
5. Configurez les clés dans `src/utils/googleCalendar.js`

Sans cette configuration, le système de prise de rendez-vous fonctionne quand même, mais les rendez-vous ne seront pas synchronisés avec Google Calendar.

## Personnalisation

Pour adapter cette application à votre propre salon :

1. **Couleurs et branding** : Modifiez les classes Tailwind dans les composants
2. **Textes** : Changez le nom "Toutou Chic" et les informations de contact dans les composants
3. **Tarifs** : Ajustez les prix dans `src/components/Tarifs.jsx`
4. **Images** : Remplacez les placeholders de couleur par de vraies photos dans `src/components/Creations.jsx`

## Structure du projet

```
toiletteur-canin/
├── src/
│   ├── components/
│   │   ├── Header.jsx       # En-tête avec navigation
│   │   ├── Footer.jsx       # Pied de page
│   │   ├── Accueil.jsx      # Page d'accueil
│   │   ├── Tarifs.jsx       # Grille tarifaire
│   │   ├── Creations.jsx    # Galerie photos
│   │   ├── Contact.jsx      # Formulaire de contact
│   │   └── RendezVous.jsx   # Prise de rendez-vous avec calendrier
│   ├── utils/
│   │   └── googleCalendar.js # Intégration Google Calendar API
│   ├── App.js               # Composant principal
│   └── index.css            # Styles Tailwind + Calendar
├── GOOGLE_CALENDAR_SETUP.md # Guide configuration Google Calendar
└── README.md
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
