from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser

from .models import Product, Category, Subcategory, Availability, ProductStatus

class SubcategorySerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = Subcategory
        fields = "__all__"


class AvailabilitySerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = Availability
        fields = "__all__"

class ProductStatusSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = ProductStatus
        fields = "__all__"



class ProductSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    category = SubcategorySerializer()
    availability = AvailabilitySerializer()
    product_status = ProductStatusSerializer()
    
    class Meta:
        model = Product
        fields = "__all__"