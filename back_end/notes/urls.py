from django.urls import path

from notes.views import NoteViewCreateSet, SnippetDetail

urlpatterns = [
    path('notes',NoteViewCreateSet.as_view()),
    path('notes/<int:pk>/', SnippetDetail.as_view()),
]