# 🌿 WildWatch

**Une application mobile "révolutionnaire" pour explorer et documenter la nature sauvage**

WildWatch est une application React Native développée avec Expo qui permet aux aventuriers, naturalistes et passionnés de nature de créer, géolocaliser et partager leurs observations dans la nature. Grâce à l'intégration de Mapbox et des fonctionnalités avancées de géolocalisation, transformez vos sorties en carnet de bord interactif !

## ✨ Fonctionnalités

### 🗺️ **Cartographie Interactive**

- **Mapbox intégré** : Navigation fluide avec des cartes haute résolution
- **Géolocalisation en temps réel** : Votre position actuelle affichée automatiquement
- **Markers personnalisables** : Créez des points d'intérêt sur la carte

### 📸 **Documentation Complète**

- **Appareil photo intégré** : Capturez vos observations directement depuis l'app
- **Galerie photos** : Importez des images depuis votre photothèque
- **Stockage local sécurisé** : Vos données restent sur votre appareil (AsyncStorage)

### 📱 **Interface Moderne**

- **Design natif iOS/Android** : Interface fluide et intuitive
- **Modales élégantes** : Création et édition simplifiées
- **Responsive** : Optimisé pour tous les écrans

### 🔧 **Fonctionnalités Techniques**

- **Architecture feature-based** : Code organisé et maintenable
- **TypeScript** : Typage fort pour une meilleure robustesse
- **Permissions automatiques** : Gestion intelligente des accès caméra/localisation

## 🚀 Installation et Configuration

### Prérequis

- **Node.js** (version 18 ou supérieure)
- **Expo CLI** : `npm install -g @expo/cli`
- **iOS** : Xcode 13+ (macOS uniquement)
- **Android** : Android Studio avec SDK 31+

### 🛠️ Installation

1. **Cloner le repository**

   ```bash
   git clone git@github.com:diesos/wildWatch.git
   cd wildWatch
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configuration Mapbox**

   Récupérez votre token Mapbox sur [mapbox.com](https://mapbox.com) et remplacez le token dans :

   ```typescript
   // features/map/components/Maps.tsx
   Mapbox.setAccessToken("VOTRE_TOKEN_MAPBOX_ICI");
   ```

### 📱 Lancement de l'application

#### **Mode développement (recommandé)**

```bash
npx expo start
```

Scannez le QR code avec l'app Expo Go (iOS/Android)

#### **Build natif iOS**

```bash
npx expo run:ios
```

*Nécessite macOS et Xcode*

#### **Build natif Android**

```bash
npx expo run:android
```

*Nécessite Android Studio et un émulateur/appareil connecté*

## 🏗️ Architecture du Projet

```
wildWatch/
├── 📱 app/                     # Écrans principaux de l'app
├── 🚀 features/               # Fonctionnalités organisées par domaine
│   └── map/                   # Module cartographie
│       ├── components/        # Composants UI
│       │   ├── modals/        # Modales (création/édition)
│       │   ├── Maps.tsx       # Composant principal Mapbox
│       │   └── index.ts       # Exports centralisés
│       ├── hooks/             # Hooks React personnalisés
│       ├── services/          # Services (AsyncStorage, API)
│       └── index.ts           # Point d'entrée du module
├── 🎯 types/                  # Définitions TypeScript globales
└── 📦 assets/                 # Images, icônes, ressources
```

## 🎮 Utilisation

### Première utilisation

1. **Autoriser la géolocalisation** : L'app demande l'accès à votre position
2. **Naviguer sur la carte** : Zoom, pan, exploration libre
3. **Créer un marker** : Tapez n'importe où sur la carte

### Créer une observation

1. **Sélectionnez un point** sur la carte
2. **Ajoutez un nom** descriptif
3. **Prenez une photo** ou importez depuis la galerie
4. **Sauvegardez** : Votre observation est stockée localement

### Consulter vos observations

- **Tapez sur un marker** pour voir les détails
- **Mode édition** : Modifiez nom et photo
- **Informations complètes** : Date, coordonnées, ID unique

## 🔧 Technologies Utilisées

| Technologie | Usage | Version |
|-------------|--------|---------|
| **React Native** | Framework mobile | Latest |
| **Expo** | Plateforme de développement | SDK 51+ |
| **TypeScript** | Typage statique | 5.0+ |
| **Mapbox** | Cartographie interactive | @rnmapbox/maps |
| **AsyncStorage** | Stockage local | @react-native-async-storage/async-storage |
| **Expo Image Picker** | Caméra/Galerie | expo-image-picker |
| **Expo Location** | Géolocalisation | expo-location |

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. **Créez une branche** : `git checkout -b feature/nouvelle-fonctionnalite`
3. **Committez** : `git commit -m 'Ajout d'une nouvelle fonctionnalité'`
4. **Pushez** : `git push origin feature/nouvelle-fonctionnalite`
5. **Ouvrez une Pull Request**

## 📝 Roadmap

### 🔜 Prochaines fonctionnalités

- [ ] **Synchronisation cloud** (Firebase/Supabase)
- [ ] **Partage social** des observations
- [ ] **Identification automatique** des espèces (IA)
- [ ] **Mode hors-ligne** complet
- [ ] **Géofencing** et alertes
- [ ] **Export des données** (GPX, KML)

### 🎯 Améliorations techniques

- [ ] **Tests unitaires** (Jest/Detox)
- [ ] **CI/CD** automatisé
- [ ] **Monitoring** et analytics
- [ ] **Optimisations performances**

## 📄 License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📬 Contact

**Développé avec passion*

- 🐙 **GitHub** : [diesos/wildWatch](https://github.com/diesos/wildWatch)

---

*⭐ N'oubliez pas de starrer le repo si WildWatch vous plaît !*
