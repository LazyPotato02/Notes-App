# Generated by Django 4.2.4 on 2023-08-31 13:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='note',
            old_name='creator_id',
            new_name='creatorId',
        ),
        migrations.RenameField(
            model_name='note',
            old_name='is_done',
            new_name='isDone',
        ),
    ]