"""ANFITRION URL's"""
from django.urls import path
from anfitrion import views

urlpatterns = [
    path(
        route='evento/confirmar/',
        view=views.confirm_view,
        name="confirmar"
    ),
    path(
        route='menu/',
        view=views.menu_view,
        name='menu'
    ),
    path(
        route='signup/',
        view=views.SignUpView.as_view(),
        name='signup'
    ),
    path(
        route='login/',
        view=views.login_view,
        name='login'
    ),
    path(
        route='logout/',
        view=views.logout_view,
        name='logout'
    ),
    path(
        route='evento/crear/',
        view=views.create_view,
        name='crear'
    ),
]
