# Generated by Django 5.0.6 on 2024-09-03 14:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('RevealJsApp', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='revealjsapp',
            old_name='data',
            new_name='content',
        ),
    ]
