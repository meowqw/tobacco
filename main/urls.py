from unicodedata import category
from django.urls import path
from tobacco import settings
from django.conf.urls.static import static

from .views import *

urlpatterns = [
    path('', main, name='main'),
    path('auth/', auth, name='auth'),
    path('account/', account, name='account'),
    path('payment/', payment, name='payment'),
    path('basket/', basket, name='basket'),
    path('logout/', logout_, name='logout'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)