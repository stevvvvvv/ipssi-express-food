from rest_framework import serializers


class LivreurSerializer(serializers.Serializer):
    id = serializers.CharField()
    user_id = serializers.IntegerField()
    nom = serializers.CharField()
    statut = serializers.CharField()
    position_lat = serializers.FloatField(required=False, allow_null=True)
    position_lng = serializers.FloatField(required=False, allow_null=True)

    @staticmethod
    def from_document(doc):
        return {
            "id": str(doc.id),
            "user_id": doc.user_id,
            "nom": doc.nom,
            "statut": doc.statut,
            "position_lat": doc.position_lat,
            "position_lng": doc.position_lng,
        }
