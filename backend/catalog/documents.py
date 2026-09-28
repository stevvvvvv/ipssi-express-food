from datetime import date

from mongoengine import BooleanField, DateField, Document, FloatField, StringField


class Plat(Document):
    TYPE_PLAT = "plat"
    TYPE_DESSERT = "dessert"
    TYPES = (TYPE_PLAT, TYPE_DESSERT)

    nom = StringField(required=True, max_length=150)
    description = StringField(default="")
    prix = FloatField(required=True, min_value=0)
    type = StringField(choices=TYPES, required=True)
    date_du_jour = DateField(required=True, default=date.today)
    disponible = BooleanField(default=True)

    meta = {"collection": "plats", "ordering": ["type", "nom"]}

    @classmethod
    def menu_du_jour(cls):
        return cls.objects(date_du_jour=date.today(), disponible=True)
