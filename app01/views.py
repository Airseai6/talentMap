from django.shortcuts import render, HttpResponse, redirect
from django.urls import reverse
from utils import tools, global_variable, caches_dm
import json


const = global_variable.const()
db_caches = global_variable.caches()
print('--------init app01 ok--------')


def index(request):
    dataRet = caches_dm.getData(db_caches)
    # {'groups': ['聚变人才'], 'data':[{'China': [{}...], 'branchName': ['行业专家'...], 'world': [{}...]},,,]}
    dataRet['setting'] = {}
    dataRet['setting']['mapType'] = 'world'
    dataRet['setting']['groupIndex'] = 0
    dataRet['setting']['currentIndex'] = 0

    return render(request, 'index.html', {'dataRet': dataRet, })


def updateData(request):
    # 手动更新excel表格数据
    ret = {'status': True, 'message': None}
    try:
        mapType = request.POST.get('mapType')
        groupIndex = int(request.POST.get('groupIndex'))
        currentIndex = int(request.POST.get('currentIndex'))

        dataRet = caches_dm.getData(db_caches, index=groupIndex)
        # {'groups': ['聚变人才'], 'data':[{'China': [{}...], 'branchName': ['行业专家'...], 'world': [{}...]},,,]}
        dataRet['setting'] = {}
        dataRet['setting']['mapType'] = mapType
        dataRet['setting']['groupIndex'] = groupIndex
        dataRet['setting']['currentIndex'] = currentIndex

        ret['message'] = dataRet
    except Exception as e:
        ret['status'] = False
        ret['message'] = str(e)

    return HttpResponse(json.dumps(ret))

    