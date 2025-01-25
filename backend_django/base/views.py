from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import *
from .serializers import *

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notes(request):
    notes = Note.objects.all().filter(user=request.user)
    # notes = request.user.note_set.all()
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)
