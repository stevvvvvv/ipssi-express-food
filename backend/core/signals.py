from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import Profile
from delivery.documents import Livreur


@receiver(post_save, sender=Profile)
def creer_ou_maj_livreur_mongo(sender, instance: Profile, created, **kwargs):
    """
    Quand un profil passe (ou est créé) en rôle "livreur", on s'assure
    qu'un document Livreur existe côté MongoDB, lié par user_id.
    """
    if instance.role != Profile.ROLE_LIVREUR:
        return

    livreur = Livreur.objects(user_id=instance.user.id).first()
    if livreur is None:
        Livreur(
            user_id=instance.user.id,
            nom=instance.user.get_full_name() or instance.user.username,
        ).save()
