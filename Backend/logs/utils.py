from datetime import datetime
from .models import Logs

def log_action(message, log_type="INFO", message_extended=None):
    """Logs an action to the Logs table."""
    now = datetime.now()
    Logs.objects.create(
        log_date=now.date(),
        log_time=now.time(),
        log_message=message,
        log_message_extended=message_extended,
        log_type=log_type
    )