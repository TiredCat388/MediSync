from django.db import models

class UserSettings(models.Model):
    volume = models.IntegerField(default=50)
    alert_sound = models.CharField(max_length=225, default='default')

    def __str__(self):
        return f"Volume: {self.volume}, Alert Sound: {self.alert_sound}"
