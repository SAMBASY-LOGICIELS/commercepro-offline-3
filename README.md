# CommercePro Offline v4.2 — Samba Sy Logiciels

Gestion commerciale hors ligne pour **PC Windows (.exe)** et **Android (.apk)**.

## Créer l'.exe (Windows 10/11, une seule fois, Internet requis)
1. Installer **Node.js LTS** : https://nodejs.org
2. Double-cliquer sur **`build-windows.bat`**
3. Récupérer les fichiers dans le dossier **`dist`** :
   - `CommercePro-Offline-Installateur-4.2.0.exe` : installation classique + raccourcis
   - `CommercePro-Offline-Portable-4.2.0.exe` : sans installation (clé USB)

Pas de Node.js sur le PC ? Mettre le dossier sur GitHub puis lancer l'action **Build Windows EXE** (onglet Actions) : le .exe est produit en ligne.

Pour tester sans compiler : `tester-sans-compiler.bat`.

> Windows 7/8 : Electron 33 ne les supporte pas. Dans `package.json`, remplacer `"electron": "^33.0.0"` par `"electron": "22.3.27"`.

## Où sont les données ?
Dans le profil Windows de l'utilisateur (`%APPDATA%\CommercePro Offline`). Elles survivent aux mises à jour et à la désinstallation. **Faire régulièrement une sauvegarde JSON** (Entreprise, Sync & Sauvegarde) : si le PC tombe en panne, c'est la seule copie.

## Android
`npm install`, `npm run cap:add` (une seule fois), puis `npm run cap:sync` et `npm run cap:open` (Android Studio), puis *Build → Build APK(s)*.
Vérifiez que `cap:sync` affiche bien les modules **@capacitor/filesystem** et **@capacitor/share** (nécessaires au PDF et à la sauvegarde). Sinon relancez `npm install`.

### Imprimer / PDF sur Android (v4.2)
`window.print()` n'existe pas dans une application Android. Le bouton **« Imprimer / Partager (PDF) »** génère maintenant une vraie facture PDF (hors ligne), puis ouvre la feuille de partage Android : WhatsApp, Drive, Enregistrer dans Fichiers, ou une application d'impression. Le bouton **Exporter sauvegarde (.json)** passe par le même chemin (le téléchargement direct ne marche pas non plus dans l'APK).
Sur PC, **Imprimer** reste l'impression Windows et **Enregistrer en PDF** crée le fichier PDF.

## Nouveautés de la v4.2
- Facture / reçu en **PDF** (A4, multi-pages, logo, totaux, signatures) sur PC et Android ; partage Android ; export de sauvegarde JSON réparé sur Android.

## Corrections de la v4.1
- **Encaissement de dette et ajout de stock** : fonctionnaient avec `prompt()`, qui n'existe pas dans Electron → remplacés par des boîtes de dialogue internes. Idem pour `alert()`/`confirm()`, qui bloquent la saisie sous Windows.
- Noms d'articles, clients, motifs… **échappés** (un nom contenant `<` ou `'` ne casse plus l'affichage ; un fichier importé ne peut plus injecter de code).
- **Synchronisation** : données chiffrées (AES-256) avec le code secret ; gestion des gros envois (pièce jointe ntfy) ; le service worker ne met plus en cache les réponses de synchronisation.
- **Importation / réception** : validation des données, fichier invalide refusé proprement, mode « Remplacer » avec confirmation.
- Vente : anti double-clic (facture en double), contrôle du stock à la validation, mode de règlement cohérent avec la situation du versement, versement limité à la dette restante.
- Réglages : l'ajout d'un logo n'efface plus les champs en cours de saisie ; les PNG transparents ne deviennent plus noirs.
- Impression : facture multi-pages complète (plus de coupure), couleurs conservées.
- Historique : 200 dernières factures (au lieu de 60) avec indication du total.
- Caisse : touche Entrée dans la recherche = ajout direct (lecteur code-barres).
- Texte « Supprimer ; » corrigé. `.exe` : fenêtre unique, maximisée, sans menu, liens externes bloqués, icône `.ico`, dépendances Android retirées de l'exe (plus léger).

## Limite connue de la synchronisation
Elle passe par le serveur public ntfy.sh, qui ne garde les données que quelques heures. Pour un transfert durable : sauvegarde JSON.
