from datetime import datetime, timezone

from mongoengine import DateTimeField, Document, FloatField, IntField, StringField


class Livreur(Document):
    """
    Un livreur = un User Django (role="livreur") côté auth,
    + ce document Mongo pour son statut/position en temps réel.
    """

    STATUT_LIBRE = "libre"
    STATUT_EN_LIVRAISON = "en_livraison"
    STATUTS = (STATUT_LIBRE, STATUT_EN_LIVRAISON)

    user_id = IntField(required=True, unique=True)  # id du User Django correspondant
    nom = StringField(required=True, max_length=150)
    statut = StringField(choices=STATUTS, default=STATUT_LIBRE)
    position_lat = FloatField(null=True)
    position_lng = FloatField(null=True)
    derniere_maj = DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {"collection": "livreurs"}

    @classmethod
    def trouver_libre(cls):
        return cls.objects(statut=cls.STATUT_LIBRE).first()
