from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from .models import FileModel

def get_file_tree(request):
    def serialize_node(node):
        data = {
            'id': node.id,
            'text': node.file_name,
            'state': {'opened': True} if node.children.exists() else {},
            'children': [serialize_node(child) for child in node.children.all()]
        }
        return data

    root_nodes = FileModel.objects.filter(parent__isnull=True)
    tree_data = [serialize_node(node) for node in root_nodes]
    return JsonResponse(tree_data, safe=False)



from django.shortcuts import render

def file_tree_view(request):
    return render(request, 'JstreeApplication/jstree.html')
