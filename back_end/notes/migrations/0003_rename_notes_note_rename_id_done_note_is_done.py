# Generated by Django 4.2.3 on 2023-07-30 08:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0002_alter_notes_id'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Notes',
            new_name='Note',
        ),
        migrations.RenameField(
            model_name='note',
            old_name='id_done',
            new_name='is_done',
        ),
    ]
