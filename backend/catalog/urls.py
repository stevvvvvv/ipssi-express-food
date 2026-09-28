from django.urls import path

from catalog.views import MenuDuJourView, PlatCreerView

urlpatterns = [
    path("plats/", MenuDuJourView.as_view(), name="menu-du-jour"),
    path("plats/creer/", PlatCreerView.as_view(), name="plat-creer"),
]
