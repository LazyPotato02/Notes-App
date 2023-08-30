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

    def get_object(self, pk):
        try:
            return Note.objects.filter(creator_id=pk)
        except Note.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = NoteSerializer(snippet, many=True)
        return Response(serializer.data)

    def patch(self, request, pk):
        updated_instances = []

        for data in request.data:
            instance_id = data.get('id')
            try:
                instance = Note.objects.get(pk=instance_id, creator_id=pk)
            except Note.DoesNotExist:
                continue  # Skip this instance if it doesn't exist for the specified user

            serializer = NoteSerializer(instance, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                updated_instances.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(updated_instances, status=status.HTTP_200_OK)

    def put(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = NoteSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
