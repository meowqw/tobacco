from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Product(models.Model):
    """Product model"""
    name = models.CharField('Наименование', max_length=40, blank=True)
    img = models.ImageField('Изображение', upload_to="img/%Y/%m/%d", blank=True)
    rest = models.IntegerField('Остаток', blank=True)
    price = models.IntegerField('Цена', blank=True)
    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=True)

    availability = models.ForeignKey('Availability', on_delete=models.PROTECT, null=True)  # наличие
    category = models.ForeignKey('Subcategory', on_delete=models.PROTECT, null=True)
    product_status = models.ForeignKey('ProductStatus', on_delete=models.PROTECT, null=True)  # статус товара(new, sale..)


    def __str__(self):
        return self.name


class Availability(models.Model):
    """Availability model"""
    name = models.CharField('Название', max_length=30)
    time_create = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Category(models.Model):
    """Category model"""
    name = models.CharField('Название', max_length=30)
    time_create = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Subcategory(models.Model):
    """Subcategory model"""
    name = models.CharField('Название', max_length=30)
    time_create = models.DateTimeField(auto_now_add=True)
    info = models.TextField('Информация', blank=True, null=True)
    img = models.ImageField('Изображение', upload_to="img/%Y/%m/%d", blank=True)
    parent_category = models.ForeignKey('Category', on_delete=models.PROTECT, null=True)

    def __str__(self):
        return self.name


class ProductStatus(models.Model):
    """Category model"""
    name = models.CharField('Название', max_length=30)
    time_create = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Account(models.Model):
    name = models.CharField('Имя', max_length=300)
    phone = models.CharField('Телефон', max_length=300)
    email = models.CharField('Почта', max_length=300)
    agents = models.CharField('Контрагенты', max_length=300)
    address = models.CharField('Адреса', max_length=300)

    user = models.ForeignKey(User, on_delete=models.PROTECT, null=True)

    def __str__(self):
        return self.name


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    order = models.JSONField("Ордер лист", null=True, blank=True)
    status = models.BooleanField("Status", default=False)
    # time_create = models.DateTimeField(auto_now_add=True)

class Banners(models.Model):
    name = models.CharField('Название', max_length=30)
    time_create = models.DateTimeField(auto_now_add=True)
    img = models.ImageField('Изображение', upload_to="img/%Y/%m/%d", blank=True)

class DeliveryAddresses(models.Model):
    address = models.CharField('Адрес', max_length=300)
    time_create = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.address

class UserOrder(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    number = models.CharField('Номер заказа', max_length=300)
    items = models.JSONField("Ордер лист", null=True, blank=True)
    pay_status = models.CharField('Статус оплаты', max_length=300)
    order_status = models.CharField('Статус заказа', max_length=300)
    address = models.ForeignKey(DeliveryAddresses, on_delete=models.PROTECT, null=True)
    comment = models.TextField('Комментарий', null=True, blank=True)
    time_create = models.DateTimeField(auto_now_add=True)
    total = models.IntegerField('Цена', blank=True)
    payment_method = models.CharField('Способ оплаты', max_length=300)
    way_get = models.CharField('Способ получения', max_length=300)




