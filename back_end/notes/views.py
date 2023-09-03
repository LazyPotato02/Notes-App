from django.http import Http404
from django.shortcuts import render
from rest_framework import viewsets, views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from notes.models import Note
from notes.serializers import NoteSerializer


# Create your views here.


class NoteViewCreateSet(views.APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        notes = Note.objects.all()
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SnippetDetail(views.APIView):
    permission_classes = (IsAuthenticated,)

    def get_object(self, pk, note_id=None):
        if note_id is not None:
            try:
                return Note.objects.get(creator_id=pk, note_id=note_id)
            except Note.DoesNotExist:
                raise Http404
        else:
            return Note.objects.filter(creator_id=pk)

    def get(self, request, pk, note_id=None, format=None):
        if note_id is not None:
            note = self.get_object(pk, note_id)
            serializer = NoteSerializer(note)
        else:
            notes = self.get_object(pk)
            serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

    def patch(self, request, pk, note_id):
        try:
            note = self.get_object(pk, note_id)
        except Http404:
            return Response({'detail': 'Note not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = NoteSerializer(note, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, note_id, format=None):
        try:
            note = self.get_object(pk, note_id)
        except Http404:
            return Response({'detail': 'Note not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = NoteSerializer(note, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, note_id, format=None):
        try:
            note = self.get_object(pk, note_id)

        except Http404:
            return Response({'detail': 'Note not found.'}, status=status.HTTP_404_NOT_FOUND)

        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
