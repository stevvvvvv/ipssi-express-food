from datetime import date

from rest_framework import serializers

from catalog.documents import Plat


class PlatSerializer(serializers.Serializer):
    id = serializers.CharField(required=False)
    nom = serializers.CharField(max_length=150)
    description = serializers.CharField(required=False, allow_blank=True)
    prix = serializers.FloatField(min_value=0)
    type = serializers.ChoiceField(choices=Plat.TYPES)
    disponible = serializers.BooleanField(required=False, default=True)

    def create(self, validated_data):
        return Plat(date_du_jour=date.today(), **validated_data).save()

    @staticmethod
    def from_document(doc):
        return {
            "id": str(doc.id),
            "nom": doc.nom,
            "description": doc.description,
            "prix": doc.prix,
            "type": doc.type,
            "disponible": doc.disponible,
        }
