from django.urls import path

from notes.views import NoteViewCreateSet, SnippetDetail

urlpatterns = [
    path('view',NoteViewCreateSet.as_view()),
    path('view/<int:pk>/', SnippetDetail.as_view()),
]