from unicodedata import category
from django.urls import path

from .views import *

urlpatterns = [
    path('', index, name='index'),
    path('auth/', auth),
    path('categories/<int:itemid>/', categories)
]
