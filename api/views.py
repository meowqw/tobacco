from django.shortcuts import render
from django.shortcuts import render
from rest_framework import generics, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from django.forms import model_to_dict
from rest_framework import mixins
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser, IsAuthenticated
# from .permissions import IsAdminReadOnly, IsOwnerOrReadOnly
from .models import *
from .serializers import *


# Create your views here.
class ProductAPIList(generics.ListCreateAPIView):
    """
    GET and POST request PRODUCT LIST
    """
    


    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # permission_classes = (IsAuthenticatedOrReadOnly,)
    # pagination_class = CatAPIListPagination

class SubcategoryAPIList(generics.ListCreateAPIView):
    """
    GET and POST request SUBCATEGORY LIST
    """
    


    queryset = Subcategory.objects.all()
    serializer_class = SubcategorySerializer
    # permission_classes = (IsAuthenticatedOrReadOnly,)
    # pagination_class = CatAPIListPagination


class ProductByCategoryAPIView(APIView):
    """
    GET ProductByCategory
    """
    def get(self, request, *args, **kwargs):
        cat = kwargs.get("cat", None)
        product = Product.objects.filter(category=cat).all()

        return Response({'products': ProductSerializer(product, many=True).data})


class ProductAPIUpdate(generics.RetrieveUpdateAPIView):
    """
    UPDATE request PRODUCT LIST
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # permission_classes = (IsAuthenticated,)  # only auth user
    # authentication_classes = (TokenAuthentication, )  # access only token


class OrderAPIList(APIView):
    """
    GET and POST request ORDER
    """
    def get(self, request, *args, **kwargs):
        order = Order.objects.filter(user=request.user).all()
        return Response({'orders': OrderSerializer(order, many=True).data})

    def post(self, request):
        Order.objects.filter(user=request.user).delete()

        request.data['user'] = request.user.id
        data = request.data
        serializer = OrderSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({'post': serializer.data})


class OrderAPIUpdate(generics.RetrieveUpdateAPIView):
    """
    UPDATE request ORDER
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    # permission_classes = (IsAuthenticated,)  # only auth user
    # authentication_classes = (TokenAuthentication, )  # access only token

class OrderAPIDestroy(generics.RetrieveDestroyAPIView):
    """
    DELETE request ORDER
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    # permission_classes = (IsAdminReadOnly,)