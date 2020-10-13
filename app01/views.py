from django.shortcuts import render


def index(request):
    if request.method == 'GET':
        pass
    else:
        pass
    msg_err = 'ok'

    return render(request, 'index.html', {'msg_err': msg_err, })


def layout(request):
    if request.method == 'GET':
        pass
    else:
        pass
    msg_err = 'ok'

    return render(request, 'layout.html', {'msg_err': msg_err, })