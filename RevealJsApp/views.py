import json
import os
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
from django.conf import settings
from django.views.generic.edit import DeleteView
from django.urls import reverse_lazy
from .models import slides
class Index(View):
    def get(self, request):
        files = slides.objects.all()
        return render(request, 'RevealJsApp/home.html',{'files':files})
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            file_id = data['id']
            title = data['title']
            content = data['content']
            file = slides.objects.get(id=file_id)
            file.title = title
            file.content = content
            file.save()
            return JsonResponse({'success': True})
        except Exception as e:
            print(f'Error saving file: {e}')
            return JsonResponse({'error': 'Failed to save file'})
    
class ModeledData(View):
    def get(self, request,title):
        data = slides.objects.get(title=title).data
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
        file = slides.objects.get(id=file_id)
        return JsonResponse({'title':file.title,'content': file.content}) 
    
def create_file(request):
    file_name = request.POST.get('file_name')
    if file_name:
        slides.objects.create(title=file_name, content="")
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})
 

# views.py

class FileDeleteView(DeleteView):
    model = slides
    success_url = reverse_lazy('file_list') 
    def delete(self, request, *args, **kwargs):
        if request.method == 'DELETE':
            try:
                file = self.get_object()
                file.delete()
                return JsonResponse({'success': True}, status=200)
            except slides.DoesNotExist:
                return JsonResponse({'error': 'File not found'}, status=404)
        return JsonResponse({'error': 'Invalid request method'}, status=405)
