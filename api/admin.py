from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Product, ProductAdminFields)
admin.site.register(ProductStatus, ProductStatusAdminFields)
admin.site.register(Category, CategoryAdminFields)
admin.site.register(Availability, AvailabilityAdminFields)
admin.site.register(Subcategory, SubcategoryAdminFields)
admin.site.register(Account, AccountAdminFields)
admin.site.register(Order, OrderAdminFields)
admin.site.register(Banners, BannersAdminFields)
admin.site.register(UserOrder, UserOrderAdminFields)
admin.site.register(DeliveryAddresses, DeliveryAddressesAdminFields)



