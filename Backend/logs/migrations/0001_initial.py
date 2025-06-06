# Generated by Django 5.1.5 on 2025-02-09 11:08

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Logs',
            fields=[
                ('log_id', models.BigIntegerField(primary_key=True, serialize=False)),
                ('log_date', models.DateField()),
                ('log_time', models.TimeField()),
                ('log_message', models.CharField(max_length=500)),
                ('log_type', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'Logs',
            },
        ),
    ]
