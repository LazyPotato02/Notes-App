from django.db import models


# Create your models here.
class Note(models.Model):
    class Meta:
        ordering = ['id']

    id = models.AutoField(
        primary_key=True
    )
    title = models.TextField(
        blank=False,
        null=False,
    )
    content = models.TextField(
        blank=False,
        null=False,
    )
    creator_id = models.IntegerField(
        blank=False,
        null=False,
    )
    is_done = models.BooleanField(
        blank=False,
        null=False,
    )
    def __str__(self):
        return f'ID: {self.id}, Title: {self.title}, Creator ID: {self.creator_id}, Done: {self.is_done}'
