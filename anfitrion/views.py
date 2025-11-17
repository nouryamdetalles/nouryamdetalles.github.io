
from django.urls import reverse_lazy
from django.views.generic import TemplateView, FormView
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .forms import AnfitrionForm, EventForm
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from listaDeRegalos.models import ListaDeRegalos
from .models import Evento, Anfitrion
import datetime

# Email
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.core.mail import send_mail

@login_required
def confirm_view(request):
    me = Anfitrion.objects.get(email=request.user.email)
    evento = Evento.objects.filter(anfitrion=me).last()
    context = ListaDeRegalos.objects.filter(type=evento.event_type)
    link = "localhost:8000/invitado/" + str(evento.id)
    to = evento.guests.split(',')
    send_mail("Te llego una invitacion", f"El link de tu evento es: {link}","Regalos Mx <noreply@regalosmx.com>", to)
    return render(request,'anfitrion/confirmar.html', {'regalos': context})

@login_required
def menu_view(request):
    me = Anfitrion.objects.get(email=request.user.email)
    eventos = Evento.objects.filter(anfitrion=me).order_by('terminado')

    context = {'eventos': eventos}

    return render(request, 'anfitrion/home.html', context)

@login_required
def create_view(request):
    if request.method == "POST":
        me = Anfitrion.objects.get(email=request.user.email)
        tipo = request.POST['event_type']
        lista_regalo = ListaDeRegalos.objects.filter(type=tipo)
        form = EventForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            
            evento = Evento.objects.create(
                anfitrion = me,
                festejado_first_name = data['festejado_first_name'],
                festejado_last_name = data['festejado_last_name'],
                festejado_age = data['festejado_age'],
                date = data['date'],
                time = data['time'],
                event_type = data['event_type'],
                card = data['card'],
                cvv = data['cvv'],
                address = data['address'],
                guests = data['guests'],
                terminado = False
            )
            if data['date'] <= datetime.date.today():
                evento.terminado = True
            evento.lista_regalo.set(lista_regalo)
            evento.save()
            return redirect('anfitrion:confirmar')
        else:
            return render(request,'anfitrion/event.html',{'form': form})
    return render(request,'anfitrion/event.html')

@login_required
def logout_view(request):
    logout(request)
    return redirect('anfitrion:login')

def login_view(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request,user)
            return redirect('anfitrion:menu')
        else: 
            return render(request, 'anfitrion/login.html', {'error': 'usuario o password invalido'})
    return render(request, 'anfitrion/login.html')    

class SignUpView(FormView):
    """
    Create a new anfitrion user.
    """
    template_name = 'anfitrion/signup.html'
    form_class = AnfitrionForm
    success_url = reverse_lazy('anfitrion:login')

    def form_invalid(self, form):
        context = self.get_context_data(form=form)
        context.update({'error': 'revisa que tus datos sean correctos.'})
        return self.render_to_response(context)

    def form_valid(self,form):
        form.save()
        return super().form_valid(form)
