from django.db import models
from django.contrib.auth.models import User

class Relationship(models.Model):
    RELATIONSHIP_KIND_CHOICES = [
        ("unformal", "Unformal"),
        ("engagement", "Engagement"),
        ("marriage", "Marriage"),
        ("separation", "Separation"),
        ("divorce", "Divorce"),
    ]

    uid = models.ForeignKey(User, on_delete=models.CASCADE)
    partner1 = models.ForeignKey(
        'Person.Person', 
        on_delete=models.CASCADE, 
        related_name='partner1_relationships'
    )
    partner2 = models.ForeignKey(
        'Person.Person', 
        on_delete=models.CASCADE, 
        related_name='partner2_relationships'
    )
    kind = models.CharField(
        max_length=20,
        choices=RELATIONSHIP_KIND_CHOICES
    )

    def __str__(self):
        return f"{self.get_kind_display()} between {self.partner1} and {self.partner2}"
