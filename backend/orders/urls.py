from django.urls import path

from orders.views import (
    CommandeDetailView,
    CommandeListCreateView,
    LivrerCommandeView,
    MesLivraisonsView,
)

urlpatterns = [
    path("commandes/", CommandeListCreateView.as_view(), name="commandes-liste-creation"),
    path("commandes/<str:commande_id>/", CommandeDetailView.as_view(), name="commande-detail"),
    path("commandes/<str:commande_id>/livrer/", LivrerCommandeView.as_view(), name="commande-livrer"),
    path("livreur/mes-livraisons/", MesLivraisonsView.as_view(), name="mes-livraisons"),
]
