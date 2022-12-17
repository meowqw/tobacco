# Generated by Django 4.1.4 on 2022-12-17 01:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_rename_remote_rest_availability_remote_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrderStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=40, verbose_name='Наименование')),
            ],
        ),
        migrations.CreateModel(
            name='PaymentStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=40, verbose_name='Наименование')),
            ],
        ),
        migrations.RemoveField(
            model_name='userorder',
            name='pay_status',
        ),
        migrations.AddField(
            model_name='userorder',
            name='payment_status',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='api.paymentstatus'),
        ),
        migrations.AlterField(
            model_name='userorder',
            name='order_status',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='api.orderstatus'),
        ),
    ]
