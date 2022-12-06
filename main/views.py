from http.client import HTTPResponse
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseNotFound, Http404

def index(request):
    return HttpResponse('index')

def auth(request):
    return HttpResponse('auth')

def categories(request, itemid):
    
    if itemid > 10:
        return redirect('index', permanent=True)
    
    return HttpResponse(f'categories {itemid}')

def pageNotFound(request, exception):
    return HttpResponseNotFound('Page not found')
