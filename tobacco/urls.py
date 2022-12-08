from django.contrib import admin
from django.urls import path, include

from main.views import *
from api.views import *


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),

    # api
    path('api/v1/product/', ProductAPIList.as_view()),
    path('api/v1/product/<int:pk>/', ProductAPIUpdate.as_view()),

    path('api/v1/subcategory/', SubcategoryAPIList.as_view()),

    path('api/v1/productbycat/<int:cat>/', ProductByCategoryAPIView.as_view()),

    
]


handler404 = pageNotFound