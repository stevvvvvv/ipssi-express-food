from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from delivery.documents import Livreur
from delivery.serializers import LivreurSerializer


class LivreurListView(APIView):
    """Supervision de la flotte de livreurs — réservé aux admins (chefs)."""

    permission_classes = [IsAdminUser]

    def get(self, request):
        livreurs = Livreur.objects()
        return Response([LivreurSerializer.from_document(l) for l in livreurs])


class MonStatutView(APIView):
    """Le livreur consulte/modifie son propre statut (libre / en_livraison)."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        livreur = Livreur.objects(user_id=request.user.id).first()
        if livreur is None:
            return Response({"detail": "Aucun profil livreur pour cet utilisateur."}, status=404)
        return Response(LivreurSerializer.from_document(livreur))

    def patch(self, request):
        livreur = Livreur.objects(user_id=request.user.id).first()
        if livreur is None:
            return Response({"detail": "Aucun profil livreur pour cet utilisateur."}, status=404)
        statut = request.data.get("statut")
        if statut not in Livreur.STATUTS:
            return Response({"detail": "Statut invalide."}, status=400)
        livreur.statut = statut
        livreur.save()
        return Response(LivreurSerializer.from_document(livreur))
