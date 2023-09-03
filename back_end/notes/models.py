from django.db import models
from django.db.models import F


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
    note_id = models.IntegerField(
        blank=False,
        null=False,
        default=0
    )

    def save(self, *args, **kwargs):
        if not self.note_id:
            # Find the next available note_id for the creator
            max_note_id = Note.objects.filter(creator_id=self.creator_id).aggregate(models.Max('note_id'))[
                'note_id__max']
            if max_note_id is None:
                self.note_id = 1
            else:
                self.note_id = max_note_id + 1

        super(Note, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        creator_id = self.creator_id
        note_id = self.note_id

        # Delete the object
        super(Note, self).delete(*args, **kwargs)

        # Reorder note_id values for the specific owner
        Note.objects.filter(creator_id=creator_id, note_id__gt=note_id).update(note_id=F('note_id') - 1)

    def __str__(self):
        return f'ID: {self.id}, Title: {self.title}, Creator ID: {self.creator_id}, Done: {self.is_done}'
