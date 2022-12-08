from http.client import HTTPResponse
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseNotFound, Http404
from api.models import *
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

@login_required
def main(request):
    
    subcategories = Subcategory.objects.all().order_by('parent_category_id')
    categories  = Category.objects.all()
    
    return render(request, 'main/main.html', {'categories': categories, 'subcategories': subcategories})

def auth(request):

    if request.method == 'POST':

        email = request.POST['email']
        password = request.POST['password']

        user = authenticate(request, email=email, password=password)
        print(user)
        if user is not None:
            login(request, user)
            return redirect('main')
        else:
            return redirect('auth')

    return render(request, 'main/auth.html')


@login_required
def banners(request):
    return render(request, 'main/banners.html')

@login_required
def payment(request):
    return render(request, 'main/payment.html')

@login_required
def basket(request):
    return render(request, 'main/basket.html')

@login_required
def account(request):

    account = Account.objects.filter(user=request.user.id).first()
    return render(request, 'main/account.html', {'account': account})

@login_required
def categories(request, itemid):
    
    if itemid > 10:
        return redirect('main', permanent=True)
    
    return HttpResponse(f'categories {itemid}')

def pageNotFound(request, exception):
    return redirect('auth')


@login_required
def logout_(request):
    """Logout"""
    logout(request)
    return redirect('auth')


