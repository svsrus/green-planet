# Generated by Django 2.2.5 on 2019-10-12 20:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('green_planet_backend', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='articlerepresentation',
            name='article',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='article_representations', to='green_planet_backend.Article'),
        ),
    ]