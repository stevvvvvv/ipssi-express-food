from django.contrib.auth.models import User
from django.db import models


class Profile(models.Model):
    """
    Étend le User Django avec un rôle métier.
    Les chefs/admins utilisent simplement is_staff=True (accès à /admin/),
    pas besoin d'un rôle dédié pour eux.
    """

    ROLE_CLIENT = "client"
    ROLE_LIVREUR = "livreur"
    ROLE_CHOICES = [
        (ROLE_CLIENT, "Client"),
        (ROLE_LIVREUR, "Livreur"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_CLIENT)
    telephone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"
