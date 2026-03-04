# 🧾 Sports Match Management System

## 🧾 Présentation Rapide du Projet

**Application de Gestion de Matchs Sportifs** avec système de rôles multi-niveaux.

C'est une application web permettant de gérer des matchs sportifs avec authentification par rôles :
- **Administrateur** : Accès complet (création, modification, suppression de matchs)
- **Utilisateur** : Consultation uniquement
- **Invité** : Consultation minimale

Le système fournit une interface intuitive pour consulter les matchs, voir les statuts (Planifié, En cours, Terminé), les scores et les équipes associées. Une base de données persistante sauvegarde tous les changements en temps réel.

**Stack Technique :**
- Frontend : Angular 20+ (standalone components, TypeScript)
- Backend : Quarkus (Jakarta EE, Hibernate ORM)
- Base de données : MySQL (configurable)
- API : REST (`/matchs` endpoints)

---

## ⚙️ Comment l'Installer

### Prérequis
- **Node.js** v18+ et npm
- **Java** JDK 17+
- **Maven** 3.6+
- **MySQL** 9+

### Installation Frontend

1. **Accéder au répertoire frontend :**
   ```bash
   cd frontend
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Démarrer le serveur de développement :**
   ```bash
   ng serve
   ```
   L'application sera accessible à `http://localhost:4200`

### Installation Backend

1. **Accéder au répertoire backend :**
   ```bash
   cd quarkus-getting-started
   ```

2. **Démarrer le serveur Quarkus :**
   ```bash
   ./mvnw quarkus:dev
   ```
   Le backend sera accessible à `http://localhost:8080`

   > Sur Windows, utilisez `mvnw.cmd` à la place de `./mvnw`

### Configuration Base de Données

**Fichier :** `quarkus-getting-started/src/main/resources/application.properties`

Pour **MySQL** (production) :
```properties
quarkus.datasource.db-kind=mysql
quarkus.datasource.username=root
quarkus.datasource.password=
quarkus.datasource.jdbc.url=jdbc:mysql://localhost:3306/tournois
quarkus.hibernate-orm.database.generation=update
quarkus.hibernate-orm.log.sql=true
```

---

## ▶️ Comment l'Utiliser

### Démarrage Rapide

1. **Assurer que le backend est actif** (terminal 1) :
   ```bash
   cd quarkus-getting-started && ./mvnw quarkus:dev
   ```

2. **Lancer le frontend** (terminal 2) :
   ```bash
   cd frontend && ng serve
   ```

3. **Ouvrir le navigateur** et aller à `http://localhost:4200`

### Interface Principale

L'écran principal affiche un tableau de matchs avec les colonnes suivantes :
- **Tournoi** : Nom du tournoi
- **Équipe 1** : Équipe participant au match
- **Équipe 2** : Deuxième équipe
- **Statut** : État du match (Planifié, En cours, Terminé)
- **Score** : Affichage conditionnel
  - `X` si match Planifié
  - `Score1 - Score2` si En cours ou Terminé
- **Gestion** : Actions disponibles selon le rôle

### Commutation de Rôles

Un panneau en haut de l'application permet de changer de rôle instantanément :
```
📋 Rôles disponibles : [ admin ] [ user ] [ guest ]
```

**Permissions par rôle :**
- **Admin** : Voir formulaire ➕ "Ajouter un match", boutons Modifier/Supprimer
- **User/Guest** : Vue seule (lecture des données)

### Opérations CRUD (Administrateur)

#### Créer un Match
1. Cliquer sur le bouton **➕ Ajouter un match**
2. Remplir le formulaire :
   - Sélectionner un **Tournoi**
   - Choisir **Équipe 1** et **Équipe 2**
   - Définir le **Statut** (par défaut : Planifié)
   - Entrer les **Scores** (optionnel si Planifié)
3. Cliquer **Enregistrer**

#### Modifier un Match
1. Cliquer le bouton **✏️ Modifier** dans la colonne Gestion
2. Le formulaire se pré-remplit avec les données actuelles
3. Modifier les champs souhaités
4. Cliquer **Enregistrer**

**Note importante :** Si le score est > 0 et le statut est "Planifié", le statut bascule automatiquement à "En cours"

#### Supprimer un Match
1. Cliquer le bouton **🗑️ Supprimer** dans la colonne Gestion
2. Confirmer la suppression via la fenêtre de dialogue

### Affichage des Données

- **Liste complète** : Tous les matchs stockés en BDD
- **Statuts visibles** : Les statuts changeants en temps réel reflètent les modifications
- **Équipes** : Affichées avec leur nom récupéré de la base de données
- **Persistance** : Toutes les modifications sont immédiatement sauvegardées

---

## ℹ️ Infos Utiles

### Structure du Projet

```
frontend/
├── src/
│   ├── app/
│   │   ├── app.ts              # Composant racine
│   │   ├── app.routes.ts       # Définition routes
│   │   ├── components/
│   │   │   └── match-list/     # Composant principal (tableau + formulaire)
│   │   └── services/
│   │       ├── match.service.ts     # API REST + mapping statuts
│   │       └── auth.service.ts      # Gestion rôles
│   └── main.ts                 # Point d'entrée

quarkus-getting-started/
├── src/main/java/com/example/tournois/
│   ├── entity/                 # Modèles JPA (Tournoi, Equipe, Match)
│   ├── repository/             # Interfaces Repository
│   ├── resource/               # Contrôleurs REST
│   ├── service/                # Logique métier
│   └── enums/                  # StatutMatch (PENDING, ONGOING, FINISHED)
└── src/main/resources/
    └── application.properties  # Configuration

```

### API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/matchs` | Récupérer tous les matchs |
| GET | `/matchs/{id}` | Récupérer un match spécifique |
| POST | `/matchs` | Créer un nouveau match |
| PUT | `/matchs/{id}` | Modifier un match existant |
| DELETE | `/matchs/{id}` | Supprimer un match |

**Exemple POST/PUT payload :**
```json
{
  "tournoi": { "id": 1 },
  "equipe1": { "id": 1 },
  "equipe2": { "id": 2 },
  "statut": "PENDING",
  "score1": 0,
  "score2": 0
}
```

### Statuts des Matchs

| Nom Backend | Nom Affichage | Description |
|-------------|---------------|-------------|
| `PENDING` | Planifié | Match à venir, pas encore commencé |
| `ONGOING` | En cours | Match en cours de jeu |
| `FINISHED` | Terminé | Match terminé, résultats finaux |

### Dépannage Courant

**❌ Le frontend ne se connecte pas au backend**
- Vérifier que le backend est actif sur `http://localhost:8080`
- Vérifier les logs du navigateur (F12 → Console)
- Vérifier les logs du terminal Quarkus pour les erreurs

**❌ Les données ne se sauvegardent pas**
- Vérifier la configuration de la base de données
- Vérifier que Quarkus est bien lancé en mode dev (`./mvnw quarkus:dev`)
- Vérifier les logs Quarkus pour les erreurs de persistence

**❌ Erreur "404 Not Found" sur `/matchs`**
- S'assurer que le backend a bien compilé sans erreur
- Relancer : `./mvnw clean quarkus:dev`

### Commandes Utiles

**Frontend :**
```bash
ng serve              # Mode développement avec rechargement automatique
ng build              # Build production
ng test               # Exécuter tests unitaires
```

**Backend :**
```bash
./mvnw clean          # Nettoyer artifacts
./mvnw quarkus:dev    # Mode développement avec rechargement
./mvnw clean package  # Build production JAR
```

### Infos Système

- **Version Angular** : 20.3.6+
- **Version Node** : v18+
- **Version Java** : JDK 17+
- **Version Quarkus** : 3.x
- **Version TypeScript** : 5.x
- **Système de rôles** : Basé sur localStorage (AuthService)
- **Authentification** : Rôle-basée (sans JWT)

### Auteur & License

**Projet** : Application de Gestion Sportive  
**Année** : 2026
**Status** : En développement ✅  
**License** : MIT

---

**Besoin d'aide ?** Consulter les logs ou ouvrir une issue.
