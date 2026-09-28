from django.urls import path

from delivery.views import LivreurListView, MonStatutView

urlpatterns = [
    path("livreurs/", LivreurListView.as_view(), name="livreurs-liste"),
    path("livreurs/mon-statut/", MonStatutView.as_view(), name="livreur-mon-statut"),
]
