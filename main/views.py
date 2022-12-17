from http.client import HTTPResponse
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseNotFound, Http404
from api.models import *
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
import json


@login_required
def main(request):
    """Main page"""
    subcategories = Subcategory.objects.all().order_by('parent_category_id')
    categories = Category.objects.all()

    return render(request, 'main/main.html', {'categories': categories, 'subcategories': subcategories})


def auth(request):
    """Authentication"""
    if request.method == 'POST':

        email = request.POST['email']
        password = request.POST['password']

        user = authenticate(request, email=email, password=password)
        print(user)
        if user is not None:
            login(request, user)
            return redirect('banners')
        else:
            return redirect('auth')

    return render(request, 'main/auth.html')


@login_required
def banners(request):
    """Banners page"""
    subcategories = Subcategory.objects.all().order_by('parent_category_id')
    categories = Category.objects.all()
    banners = Banners.objects.all()

    return render(request, 'main/banners.html', {'categories': categories, 'subcategories': subcategories, 'banners': banners})


@login_required
def payment(request):
    """Payment page"""
    subcategories = Subcategory.objects.all().order_by('parent_category_id')

    orders = Order.objects.filter(user=request.user).first()
    account = Account.objects.filter(user=request.user.id).first()
    deliveryAddresses = DeliveryAddresses.objects.all()
    total = 0

    json_order = json.loads(orders.order)

    # get current order
    for item in json_order:
        total += sum([i['total'] for i in list(json_order[item].values())])

    # Create USER ORDER
    if request.method == 'POST':
        comment = request.POST.get('comment')
        delivery = request.POST.get('radiodelivery')
        address = request.POST.get('radioaddress')
        pay = request.POST.get('radiopay')

        UserOrder.objects.create(user=request.user,
                                 address=DeliveryAddresses.objects.filter(id=address).first(),
                                 comment=comment,
                                 number=orders.id,
                                 payment_status=PaymentStatus.objects.filter(name='Не оплачен').first(),
                                 order_status=OrderStatus.objects.filter(name='В обработке').first(),
                                 total=total,
                                 items=orders.order,
                                 payment_method=pay,
                                 way_get=delivery
                                 )
        

    return render(request, 'main/payment.html', {'total': total, 'order_id': orders.id, 'account': account, 'deliveryAddresses': deliveryAddresses, 'subcategories': subcategories})


@login_required
def basket(request):
    """Basket page"""
    subcategories = Subcategory.objects.all().order_by('parent_category_id')

    order = {}
    orders = Order.objects.filter(user=request.user).first()

    total = {'total': 0, 'way': 0, 'stock': 0, 'remote': 0}

    # get current state of order
    json_order = json.loads(orders.order)
    availability_list = ['stock', 'remote', 'way']

    
    for item in json_order:
        item_id = Product.objects.get(id=item)
        category = item_id.category.parent_category.name
        # print(category, item_id, json_order[item])

        clean_json_order = {}  # order list without empty fields
        category_total = 0

        # totals
        for availability in availability_list:
            if json_order[item][availability]['count'] != 0:
                total[availability] += json_order[item][availability]['total']
                category_total += json_order[item][availability]['total']
                total['total'] += json_order[item][availability]['total']

                # clean
                rest = eval(f"item_id.availability.{availability}")
                price = item_id.price
                clean_json_order[availability] = {'total': json_order[item][availability]['total'], 'count': json_order[item][availability]['count'], 'rest': rest, 'price': price}

        
        item_ = {'item': item_id, 'availability': clean_json_order}

        if item_['availability'] != {}:
            if category not in order:
                order[category] = {'total': category_total, 'items': [item_]}
            else:
                order[category]['items'].append(item_)
                order[category]['total'] += category_total
        

    print(order)
    return render(request, 'main/basket.html', {'order': order, 'total': total, 'subcategories': subcategories})


@login_required
def account(request):
    """Account page"""
    subcategories = Subcategory.objects.all().order_by('parent_category_id')

    account = Account.objects.filter(user=request.user.id).first()
    deliveryAddresses = DeliveryAddresses.objects.all()
    orders = UserOrder.objects.filter(user=request.user).all()


    return render(request, 'main/account.html', {'account': account, 'deliveryAddresses': deliveryAddresses, "orders": orders, 'subcategories': subcategories})


def pageNotFound(request, exception):
    """404"""
    return redirect('auth')


@login_required
def logout_(request):
    """Logout"""
    logout(request)
    return redirect('auth')
