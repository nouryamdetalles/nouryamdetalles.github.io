
from django.db import models
from users.models import CustomUser
from listaDeRegalos.models import ListaDeRegalos

class Anfitrion(CustomUser, models.Model):
    phone = models.CharField(max_length=15, blank=False, null=False)

    def __str__(self):
        return self.first_name

class Evento(models.Model):
    # About Event
    TYPE_EVENTS = (
        ('BO', 'Boda'),
        ('XV', 'XV Años'),
        ('BA', 'Bautizos'),
        ('IN', 'Infantiles'),
        ('PH', 'Para él'),
        ('PM', 'Para ella')
    )
    id = models.BigAutoField(primary_key=True)
    event_type = models.CharField(max_length=2, choices=TYPE_EVENTS, blank=False)
    date = models.DateField(blank=False)
    time = models.TimeField(blank=False)
    guests = models.TextField(max_length=2000)
    address = models.TextField(max_length=500)
    
    anfitrion = models.ForeignKey(Anfitrion, on_delete=models.CASCADE, null=False, related_name="anfitrion_user_set")
    festejado_first_name = models.CharField(max_length=50, blank=False, null=False)
    festejado_last_name = models.CharField(max_length=50, blank=False, null=False)
    festejado_age = models.PositiveIntegerField(null=False, default=0)
    lista_regalo = models.ManyToManyField(ListaDeRegalos)
    regalos = models.CharField(max_length=300, blank=True) # Regalos comprados
    card = models.CharField(max_length=19)
    cvv = models.CharField(max_length=3)
    terminado = models.BooleanField(default=False)
    total = models.IntegerField(default=0)

    def __str__(self):
        return str(self.event_type)