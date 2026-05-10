from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def get_timetable(request):

    data = [
        {"train":"CSMT_FAST","station":"Thane","time":"08:30"},
        {"train":"CSMT_FAST","station":"Dadar","time":"09:00"},
        {"train":"CSMT_SLOW","station":"Kurla","time":"10:30"},
        {"train":"CSMT_FAST","station":"Thane","time":"18:00"},
        {"train":"CSMT_SLOW","station":"Dadar","time":"14:00"},
    ]

    return Response(data)