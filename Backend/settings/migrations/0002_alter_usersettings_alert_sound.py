# Generated by Django 5.1.6 on 2025-04-27 06:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('settings', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usersettings',
            name='alert_sound',
            field=models.CharField(default='default', max_length=225),
        ),
    ]
