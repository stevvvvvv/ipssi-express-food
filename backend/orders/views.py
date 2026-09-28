from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.documents import Plat
from orders.documents import Commande, CommandeItem
from orders.serializers import CommandeCreateSerializer, CommandeSerializer


class CommandeListCreateView(APIView):
    """GET : mes commandes passées. POST : passer une nouvelle commande."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        commandes = Commande.objects(client_id=request.user.id)
        return Response([CommandeSerializer.from_document(c) for c in commandes])

    def post(self, request):
        serializer = CommandeCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        items_input = serializer.validated_data["items"]

        items = []
        total_articles = 0.0
        for entry in items_input:
            plat = Plat.objects(id=entry["plat_id"]).first()
            if plat is None:
                return Response(
                    {"detail": f"Plat introuvable : {entry['plat_id']}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            quantite = entry["quantite"]
            items.append(
                CommandeItem(
                    plat_id=str(plat.id),
                    nom=plat.nom,
                    prix_unitaire=plat.prix,
                    quantite=quantite,
                )
            )
            total_articles += plat.prix * quantite

        frais_livraison = Commande.calculer_frais_livraison(total_articles)

        commande = Commande(
            client_id=request.user.id,
            items=items,
            total_articles=round(total_articles, 2),
            frais_livraison=frais_livraison,
            total=round(total_articles + frais_livraison, 2),
            adresse_livraison=serializer.validated_data.get("adresse_livraison", ""),
        )
        commande.assigner_livreur_si_possible()
        commande.save()

        return Response(CommandeSerializer.from_document(commande), status=status.HTTP_201_CREATED)


class CommandeDetailView(APIView):
    """Page de suivi : statut, livreur assigné, temps estimé."""

    permission_classes = [IsAuthenticated]

    def get(self, request, commande_id):
        commande = Commande.objects(id=commande_id).first()
        if commande is None:
            return Response({"detail": "Commande introuvable."}, status=404)
        if commande.client_id != request.user.id and not request.user.is_staff:
            return Response({"detail": "Non autorisé."}, status=403)
        return Response(CommandeSerializer.from_document(commande))


class MesLivraisonsView(APIView):
    """Le livreur connecté voit les commandes qui lui sont assignées."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        commandes = Commande.objects(livreur_id=request.user.id, statut=Commande.STATUT_EN_LIVRAISON)
        return Response([CommandeSerializer.from_document(c) for c in commandes])


class LivrerCommandeView(APIView):
    """Le livreur marque une commande comme livrée -> il redevient "libre"."""

    permission_classes = [IsAuthenticated]

    def patch(self, request, commande_id):
        from delivery.documents import Livreur

        commande = Commande.objects(id=commande_id).first()
        if commande is None:
            return Response({"detail": "Commande introuvable."}, status=404)
        if commande.livreur_id != request.user.id:
            return Response({"detail": "Cette commande ne vous est pas assignée."}, status=403)

        commande.statut = Commande.STATUT_LIVREE
        commande.save()

        livreur = Livreur.objects(user_id=request.user.id).first()
        if livreur:
            livreur.statut = Livreur.STATUT_LIBRE
            livreur.save()

        return Response(CommandeSerializer.from_document(commande))
