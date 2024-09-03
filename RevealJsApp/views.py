import os
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
from django.conf import settings
from .models import RevealJsApp
class Index(View):
    def get(self, request):
        files = RevealJsApp.objects.all()
        return render(request, 'RevealJsApp/home.html',{'files':files})
    
class ModeledData(View):
    def get(self, request,title):
        data = RevealJsApp.objects.get(title=title).data
        return render(request, 'RevealJsApp/index.html',{'file_data':data})
    
class EditableMarkdown(View):
    def get(self, request):
        return render(request, 'RevealJsApp/index.html')
    
    def post(self, request):
        md_content = request.POST.get('md_content')
        print(md_content)
        with open(os.path.join(settings.BASE_DIR, 'RevealJsApp/static/slide.md'), 'w') as md_file:
            md_file.write(md_content)
        return render(request, 'RevealJsApp/index.html',{'file_data':md_content})


class GetFileContent(View):
    def get(self, request, file_id):
        file = RevealJsApp.objects.get(id=file_id)
        return JsonResponse({'title':file.title,'content': file.content}) 