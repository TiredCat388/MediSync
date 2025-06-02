from django.db import models

class Logs(models.Model):
    log_id = models.BigAutoField(primary_key=True)
    log_date = models.DateField()
    log_time = models.TimeField()
    log_message = models.CharField(max_length=500)
    log_type = models.CharField(max_length=100)
    log_message_extended = models.TextField(blank=True)

    class Meta:
        db_table = 'Logs'
