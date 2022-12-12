from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Product)
admin.site.register(ProductStatus)
admin.site.register(Category)
admin.site.register(Availability)
admin.site.register(Subcategory)
admin.site.register(Account)
admin.site.register(Order)
admin.site.register(Banners)
admin.site.register(UserOrder)
admin.site.register(DeliveryAddresses)


