from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.documents import Plat
from catalog.serializers import PlatSerializer


class MenuDuJourView(APIView):
    """Menu public du jour (2 plats + 2 desserts, en théorie)."""

    permission_classes = [AllowAny]

    def get(self, request):
        plats = Plat.menu_du_jour()
        return Response([PlatSerializer.from_document(p) for p in plats])


class PlatCreerView(APIView):
    """
    Création d'un plat/dessert du jour — réservé aux chefs (is_staff=True).
    Pas d'admin Django ici : MongoEngine n'est pas nativement intégré à
    l'admin Django, donc on expose ce endpoint (utilisable directement
    depuis l'API navigable de DRF, très bien pour un usage interne).
    """

    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = PlatSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        plat = serializer.save()
        return Response(PlatSerializer.from_document(plat), status=status.HTTP_201_CREATED)
