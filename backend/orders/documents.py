from datetime import datetime, timedelta, timezone

from mongoengine import (
    DateTimeField,
    Document,
    EmbeddedDocument,
    EmbeddedDocumentListField,
    FloatField,
    IntField,
    StringField,
)

SEUIL_LIVRAISON_GRATUITE = 19.99
FRAIS_LIVRAISON_STANDARD = 2.50
DELAI_LIVRAISON_MINUTES = 20


class CommandeItem(EmbeddedDocument):
    plat_id = StringField(required=True)
    nom = StringField(required=True)
    prix_unitaire = FloatField(required=True)
    quantite = IntField(required=True, default=1, min_value=1)


class Commande(Document):
    STATUT_EN_ATTENTE = "en_attente"
    STATUT_EN_LIVRAISON = "en_livraison"
    STATUT_LIVREE = "livree"
    STATUTS = (STATUT_EN_ATTENTE, STATUT_EN_LIVRAISON, STATUT_LIVREE)

    client_id = IntField(required=True)
    items = EmbeddedDocumentListField(CommandeItem, required=True)
    total_articles = FloatField(required=True)
    frais_livraison = FloatField(required=True, default=0)
    total = FloatField(required=True)
    statut = StringField(choices=STATUTS, default=STATUT_EN_ATTENTE)
    livreur_id = IntField(null=True)
    livreur_nom = StringField(null=True)
    adresse_livraison = StringField(default="")
    date_creation = DateTimeField(default=lambda: datetime.now(timezone.utc))
    heure_estimee_livraison = DateTimeField(null=True)

    meta = {"collection": "commandes", "ordering": ["-date_creation"]}

    @staticmethod
    def calculer_frais_livraison(total_articles: float) -> float:
        return 0.0 if total_articles >= SEUIL_LIVRAISON_GRATUITE else FRAIS_LIVRAISON_STANDARD

    def assigner_livreur_si_possible(self):
        """Assigne automatiquement le premier livreur libre trouvé (règle MVP)."""
        from delivery.documents import Livreur

        livreur = Livreur.trouver_libre()
        if livreur is None:
            self.statut = self.STATUT_EN_ATTENTE
            return

        livreur.statut = Livreur.STATUT_EN_LIVRAISON
        livreur.save()

        self.livreur_id = livreur.user_id
        self.livreur_nom = livreur.nom
        self.statut = self.STATUT_EN_LIVRAISON
        self.heure_estimee_livraison = datetime.now(timezone.utc) + timedelta(minutes=DELAI_LIVRAISON_MINUTES)

    def temps_restant_minutes(self):
       if not self.heure_estimee_livraison or self.statut != self.STATUT_EN_LIVRAISON:
           return None
       heure_estimee = self.heure_estimee_livraison
       if heure_estimee.tzinfo is None:
           heure_estimee = heure_estimee.replace(tzinfo=timezone.utc)
       delta = heure_estimee - datetime.now(timezone.utc)
       return max(0, round(delta.total_seconds() / 60))