from rest_framework import serializers


class CommandeItemInputSerializer(serializers.Serializer):
    plat_id = serializers.CharField()
    quantite = serializers.IntegerField(min_value=1, default=1)


class CommandeCreateSerializer(serializers.Serializer):
    items = CommandeItemInputSerializer(many=True)
    adresse_livraison = serializers.CharField(required=False, allow_blank=True, max_length=255)


class CommandeSerializer(serializers.Serializer):
    @staticmethod
    def from_document(doc):
        return {
            "id": str(doc.id),
            "statut": doc.statut,
            "items": [
                {
                    "plat_id": it.plat_id,
                    "nom": it.nom,
                    "prix_unitaire": it.prix_unitaire,
                    "quantite": it.quantite,
                }
                for it in doc.items
            ],
            "total_articles": doc.total_articles,
            "frais_livraison": doc.frais_livraison,
            "total": doc.total,
            "adresse_livraison": doc.adresse_livraison,
            "livreur_id": doc.livreur_id,
            "livreur_nom": doc.livreur_nom,
            "date_creation": doc.date_creation.isoformat(),
            "temps_restant_minutes": doc.temps_restant_minutes(),
        }
