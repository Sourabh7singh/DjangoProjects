# views.py
from django import forms

class NewFileForm(forms.Form):
    file_name = forms.CharField(label='File Name', max_length=100, widget=forms.TextInput(attrs={'placeholder': 'Enter file name without .md'}))
    content = forms.CharField(label='Content', widget=forms.Textarea(attrs={'placeholder': 'Enter Markdown content here...'}))

class EditFileForm(forms.Form):
    content = forms.CharField(label='Content', widget=forms.Textarea(attrs={'placeholder': 'Edit Markdown content here...'}))
