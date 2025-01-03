# Generated by Django 5.0.6 on 2024-09-09 16:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CodeEditor', '0008_delete_filemodel'),
    ]

    operations = [
        migrations.CreateModel(
            name='FileModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file_name', models.CharField(max_length=100)),
                ('content', models.CharField(blank=True, max_length=10000, null=True)),
                ('language', models.CharField(blank=True, max_length=100, null=True)),
                ('is_dir', models.BooleanField(default=False)),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='CodeEditor.filemodel')),
            ],
        ),
        migrations.DeleteModel(
            name='BookModel',
        ),
    ]
