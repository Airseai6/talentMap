from django.shortcuts import render, HttpResponse, redirect
from django.urls import reverse
from utils import tools, global_variable, caches_dm


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

