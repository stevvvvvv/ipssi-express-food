# IPSSI Express Food

Projet annuel MIA4 (NAT MIA4 28.1), fait en solo avec l'accord du professeur — j'ai obtenu de présenter la soutenance sous forme de vidéo enregistrée plutôt qu'en direct.

L'idée : une appli de livraison de plats faits maison, livrés en moins de 20 minutes par des livreurs à vélo.

## Stack technique

J'ai choisi une architecture un peu hybride : Django + Django REST Framework pour le backend, avec l'authentification classique de Django (User + un profil client/livreur) sur SQLite. Pour les données métier en revanche — les plats, les commandes, les livreurs — j'utilise MongoDB Atlas via l'ODM MongoEngine, plus adapté à des données qui changent souvent (statut d'une commande, position d'un livreur). Le front est en React (Vite) avec Tailwind CSS.

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

Un livreur est simplement un `User` Django dont le `Profile.role = "livreur"` (à créer depuis l'admin `/admin/`, ou via l'API register avec `role=livreur`). Ça déclenche la création automatique d'un document MongoDB `Livreur` (statut, position) via un signal Django.

## Organisation du travail

Comme je suis seul sur ce projet, la répartition de tâches habituellement demandée (à faire / en cours / fait entre membres d'un groupe) n'avait pas vraiment de sens. Je l'ai remplacée par une répartition de mon temps de travail sur la semaine, détaillée dans [`ORGANISATION.md`](./ORGANISATION.md).

- Support de présentation (slides) : [IPSSI FOOD EXPRESS Slides - Steven JANSEN.pdf](./IPSSI%20FOOD%20EXPRESS%20Slides%20-%20Steven%20JANSEN.pdf)

## RGPD

Je ne collecte que ce qui est nécessaire au service : nom, téléphone et adresse du client pour la livraison, nom et position du livreur pour le suivi de commande. Rien n'est partagé avec des tiers, ces données servent uniquement à faire fonctionner la livraison.

## Arborescence

```
express-food/
  backend/          # Django + DRF + MongoEngine
  frontend/         # React + Vite + Tailwind
  ORGANISATION.md   # planning et suivi d'avancement (solo)
  IPSSI FOOD EXPRESS Slides - Steven JANSEN.pdf   # support de présentation
```
