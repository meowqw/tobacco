from django.db import models

# Create your models here.


class Product(models.Model):
    name = models.CharField(max_length=40)
    content = models.TextField(blank=True)
    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=True)
    # breed = models.ForeignKey('Breed', on_delete=models.PROTECT, null=True)
    # user = models.ForeignKey(User, verbose_name='Пользователь', on_delete=models.CASCADE)


    def __str__(self):
        return self.name