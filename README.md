# IPSSI Express Food

Projet annuel MIA4 (NAT MIA4 28.1) — réalisé en solo par Steven Jansen, avec l'accord du professeur.

Livraison de plats faits maison en moins de 20 minutes par des livreurs à vélo.

## Stack technique

- **Backend** : Django + Django REST Framework
- **Authentification** : Django auth (User + Profil client/livreur), base SQLite
- **Données métier** (plats, commandes, livreurs) : MongoDB Atlas via MongoEngine (ODM)
- **Front** : React (Vite) + Tailwind CSS

## Lancer le projet en local

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # ou venv\Scripts\activate sous Windows
pip install -r requirements.txt
cp .env.example .env       # puis renseigner MONGO_URI (cluster Atlas) et SECRET_KEY
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

L'API est disponible sur `http://localhost:8000/api/`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env       # VITE_API_URL=http://localhost:8000/api
npm run dev
```

Le site est disponible sur `http://localhost:5173`.

## Créer un compte livreur

Un livreur est un `User` Django classique dont le `Profile.role = "livreur"` (à créer depuis l'admin `/admin/`, ou via l'API register avec `role=livreur`). Un document MongoDB `Livreur` (statut, position) est créé automatiquement à la création du profil.

## Organisation du travail

Projet réalisé en solo (accord du professeur) : la répartition de tâches habituellement faite via un board Trello est remplacée par une répartition du temps et de l'organisation personnelle, détaillée dans [`ORGANISATION.md`](./ORGANISATION.md).

- Support de présentation (slides) : *à compléter*
- Application déployée : *à compléter une fois le déploiement fait*

## RGPD

Les seules données personnelles collectées sont celles nécessaires au service : nom, téléphone et adresse du client pour la livraison, nom et position du livreur pour le suivi de commande. Ces données ne sont pas partagées avec des tiers et servent uniquement à l'exécution de la commande.

## Arborescence

```
express-food/
  backend/          # Django + DRF + MongoEngine
  frontend/         # React + Vite + Tailwind
  ORGANISATION.md   # planning et suivi d'avancement (solo)
```
