import base64
import json
from django.http import JsonResponse
from django.shortcuts import render,redirect
from django.views import View
from .models import FileModel
from .forms import *
# views.py

class Index(View):
    def get(self, request):
        books = FileModel.objects.all()
        return render(request, 'CodeEditor/index.html', {'md_files': books})

    def post(self, request):
        try:
            data = json.loads(request.body)
            file_id = data['id']
            file_name = data['file_name']
            content = data['content']
            language = data['language']
            file = FileModel.objects.get(id=file_id)
            file.file_name = file_name
            file.content = content
            file.language = language
            file.save()
            return redirect('index')
        except Exception as e:
            print(f'Error saving file: {e}')
            return JsonResponse({'error': 'Failed to save file'})


class GetFileContent(View):
    def get(self, request, file_id):
        file = FileModel.objects.get(id=file_id)
        return JsonResponse({'file_name':file.file_name,'content': file.content,'language': file.language}) 

def create_file(request):
    # Create a new file via AJAX request
    file_name = request.POST.get('file_name')
    print("Creating file here")
    if file_name:
        FileModel.objects.create(file_name=file_name, content="")
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import markdown2

@csrf_exempt
def preview_markdown(request):
    if request.method == 'POST':
        markdown_content = request.POST.get('content', '')
        html_content = markdown2.markdown(markdown_content)
        return HttpResponse(html_content)



import os
import subprocess
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def run_code(request):
    if request.method == 'POST':
        code_type = request.POST.get('language')  # e.g., 'python', 'javascript'
        code_content = request.POST.get('code')  # The actual code from the editor

        # Ensure the media directory exists
        media_dir = os.path.join('media', 'code_files')
        os.makedirs(media_dir, exist_ok=True)

        # Save the code to a file in the media directory
        file_name = os.path.join(media_dir, f"code.{code_type}")
        with open(file_name, 'w') as code_file:
            code_file.write(code_content)
        
        # Map the language to the appropriate command
        command_map = {
            'py': f"python3 code.{code_type}",
            'js': f"node code.{code_type}",
            'cpp': f"g++ code.{code_type} -o code && ./code",
            # Add more mappings as needed
        }

        # Get the command to run based on the language
        command = command_map.get(code_type)

        if command:
            # Convert the volume path to an appropriate format for Docker
            docker_volume_path = os.path.abspath('media').replace('\\', '/')
            code_files_path = os.path.join(docker_volume_path,"code_files")
            docker_command = (
                f"docker run -v \"{code_files_path}:/app\" -w /app my-django-env bash -c \"{command}\""
            )

            # Run the command in the Docker container
            try:
                result = subprocess.check_output(
                    docker_command,
                    shell=True,
                    stderr=subprocess.STDOUT
                )
                output = result.decode('utf-8')
                return JsonResponse({'output': output})
            
            except subprocess.CalledProcessError as e:
                return JsonResponse({'error': e.output.decode('utf-8')})
        else:
            return JsonResponse({'error': 'Unsupported language'})
    else:
        return JsonResponse({'error': 'Invalid request method'})


# views.py
from django.http import JsonResponse
from django.views.generic.edit import DeleteView
from django.urls import reverse_lazy

class FileDeleteView(DeleteView):
    model = FileModel
    success_url = reverse_lazy('file_list')  # Redirect to the file list or a relevant page

    def delete(self, request, *args, **kwargs):
        if request.method == 'DELETE':
            try:
                file = self.get_object()
                file.delete()
                return JsonResponse({'success': True}, status=200)
            except FileModel.DoesNotExist:
                return JsonResponse({'error': 'File not found'}, status=404)
        return JsonResponse({'error': 'Invalid request method'}, status=405)




from django.http import JsonResponse
from django.views import View
from .models import FileModel

class FileTreeView(View):
    def get(self, request):
        def build_tree(node):
            children = list(node.children.all())
            if not children:
                return {
                    'id': node.id,
                    'text': f"{node.file_name}{('.' + node.language) if node.language else ''}",
                    'type': 'file' if not node.is_dir else 'folder'
                }
            return {
                'id': node.id,
                'text': node.file_name,
                'type': 'folder',
                'children': [build_tree(child) for child in children]
            }
        
        # Assuming you want to start from the root nodes
        root_nodes = FileModel.objects.filter(parent__isnull=True)
        tree_data = [build_tree(node) for node in root_nodes]
        print(tree_data)
        return JsonResponse(tree_data, safe=False)


from django.http import JsonResponse
from django.views import View
from .models import FileModel
import json

class CreateNodeView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            name = data['name']
            type = data['type']
            parent_id = data['parent']
            print(f"Creating node: {name}, {type}, {parent_id}")
            parent = FileModel.objects.get(id=parent_id) if parent_id else None
            if type == 'file':
                file = FileModel(file_name=name, is_dir=False, parent=parent)
            else:
                file = FileModel(file_name=name, is_dir=True, parent=parent)
            
            file.save()
            return JsonResponse({'status': 'success'})
        except Exception as e:
            print(f'Error creating node: {e}')
            return JsonResponse({'status': 'error'}, status=400)

class DeleteNodeView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            node_id = data['id']
            node = FileModel.objects.get(id=node_id)
            node.delete()
            return JsonResponse({'status': 'success'})
        except Exception as e:
            print(f'Error deleting node: {e}')
            return JsonResponse({'status': 'error'}, status=400)


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import FileModel

@csrf_exempt
def rename_node(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        node_id = data.get('id')
        new_name = data.get('new_name')

        try:
            file = FileModel.objects.get(id=node_id)
            file.file_name = new_name
            file.save()
            return JsonResponse({'success': True})
        except FileModel.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'File not found'})
    return JsonResponse({'success': False, 'error': 'Invalid request'})
