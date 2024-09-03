# views.py
from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth.models import User
from django.shortcuts import render, redirect, get_object_or_404
from .models import EmployeeDetails

class home(View):
    def get(self, request):
        return render(request, 'AuthApp/index.html')
    
    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        email = request.POST.get('email')
        if email=="" or password=="" or username=="":
            return render(request, 'AuthApp/index.html', {'message': 'Please enter all the fields'})
        user = User.objects.create_user(username, email, password) 
        return redirect('add-details', user)
    
# class Success(View):
#     def get(self, request,user):
#         return render(request, 'AuthApp/success.html',{'message':"User "})
    
class addDetails(View):
    def get(self, request,user):
        return render(request, 'AuthApp/addDetails.html',{'user':user,'edit':False})
    
    def post(self,request,user):
        newuser = get_object_or_404(User, username=user)
        name = request.POST.get('name')
        department = request.POST.get('department')
        address = request.POST.get('address')
        phone = request.POST.get('phone')
        if name=="" or department=="" or address=="" or phone=="":
            return render(request, 'AuthApp/addDetails.html',{'user':newuser,'message': 'Please enter all the fields','edit':False})
        emp = EmployeeDetails(user=newuser,name=name,department=department,address=address,phone=phone)
        emp.save()
        return render(request, 'AuthApp/success.html',{'message':"User added successfully",'title':"Success"})
    
class ViewEmployees(View):
    def get(self, request):
        employees = EmployeeDetails.objects.select_related('user').all()
        return render(request, 'AuthApp/viewEmployees.html', {'employees': employees})
    

class EditEmployee(View):
    def get(self, request,user):
        user = get_object_or_404(User, username=user)
        employee = EmployeeDetails.objects.select_related('user').get(user=user)
        return render(request, 'AuthApp/addDetails.html',{'user':employee,'edit':True})
    
    def post(self, request,user):
        name = request.POST.get('name')
        department = request.POST.get('department')
        address = request.POST.get('address')
        phone = request.POST.get('phone')
        # Assuming 'user' is a unique identifier for the user, such as a username or user ID
        existing_user = get_object_or_404(User, username=user)
        EmployeeDetails.objects.filter(user_id=existing_user.id).update(
            name=name,
            department=department,
            address=address,
            phone=phone
        )
        return render(request, 'AuthApp/success.html',{'message':"User Updated successfully",'title':"Updation Successfull"})