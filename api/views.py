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
        
        if ('status' in self.request.GET):
            status = [i for i in self.request.GET['status'].split(',') if len(i) > 0]
            if len(status) > 0:
                status_ids = [ProductStatus.objects.get(name=i).id for i in status]
                product = product.filter(product_status__in=status_ids)
                
                
        if ('weight' in self.request.GET):
            weight = [i for i in self.request.GET['weight'].split(',') if i.isdigit()]
            if len(weight) > 0:
                product = product.filter(weight__in=weight)
                
                
        if ('availability' in self.request.GET):
            availability_ = [i for i in self.request.GET['availability'].split(',') if len(i) > 0]
            if len(availability_) > 0:
                arr = []
                for i in product:
                    for availability in availability_:
                        if availability == 'stock':
                            if i.availability.stock > 0:
                                if i not in arr:
                                    arr.append(i)
                        elif availability == 'way':
                            if i.availability.way > 0:
                                if i not in arr:
                                    arr.append(i)
                        elif availability == 'remote':
                            if i.availability.remote > 0:
                                if i not in arr:
                                    arr.append(i)
                        elif availability == 'all':
                            if i not in arr:
                                arr.append(i)
                                
                product = arr

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