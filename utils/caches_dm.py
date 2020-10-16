# -*- coding:utf-8 -*-
# 用于缓存与处理数据

from utils import tools, global_variable
import os
const = global_variable.const()


def getExcelData(index):
    """ 获取excel原始可用数据 """
    excel_dir = const.excel_dir
    file = const.excel_groups[index]
    row_data = {}
    exceler = tools.excelReader(os.path.join(excel_dir, file))
    row_data['trunk'] = exceler.getTrunk()
    row_data['branch'] = exceler.getBranch()

    return row_data
        

def formData2Echarts(index):
    """
    处理数据到echarts可用格式
    """
    row_data = getExcelData(index)
    dataTotal = {'trunk':{'world':[],'China':[]},'branch':[],}
    # 'branch':[{'type':{'world':[],'China':[]},}...]

    # form trunk
    TalentInChina = 0
    for item in row_data['trunk']:
        if item['地区'].strip() in const.ChinaProvinces:
            TalentInChina += item['人数']
            dataTotal['trunk']['China'].append({
                "name": item['地区'].strip(),"value": [item['人数'], item['地区']]
            })
        else:
            countryName = const.worldCountries[item['地区'].strip()] if item['地区'].strip() in const.worldCountries else item['地区']
            dataTotal['trunk']['world'].append({
                "name": countryName,"value": [item['人数'], item['地区']]
            })
    dataTotal['trunk']['world'].append({
        "name": 'China',"value": [TalentInChina, '中国']
    })

    # form branch
    dataTotal['branchName'] = []
    for key, value in row_data['branch'].items():
        if len(value) > 0:
            dataTotal['branchName'].append(key)
            # 两个中间变量字典，用于去重合并
            China_dic = {}  # {地区:{"num":int, "unit":[{unit:num},{}...]}}
            world_dic = {}
            TalentInChina = 0
            for item in value:
                if item['地区'].strip() in const.ChinaProvinces:
                    TalentInChina += item['人数']
                    if item['地区'] in China_dic:
                        China_dic[item['地区']]['num'] += item['人数']
                        China_dic[item['地区']]['unit'].append({item['单位']:item['人数']})
                    else:
                        China_dic[item['地区']] = {"num":item['人数'], "unit":[{item['单位']:item['人数']},]}
                else:
                    if item['地区'] in world_dic:
                        world_dic[item['地区']]['num'] += item['人数']
                        world_dic[item['地区']]['unit'].append({item['单位']:item['人数']})
                    else:
                        world_dic[item['地区']] = {"num":item['人数'], "unit":[{item['单位']:item['人数']},]}
            world_dic['China'] = {"num":TalentInChina,}

            # 构建echarts显示的数据结构
            branchDic = {key:{'world':[],'China':[]}}
            for k,v in world_dic.items():
                countryName = const.worldCountries[k] if k in const.worldCountries else k
                try:
                    branchDic[key]['world'].append({
                        "name": countryName,
                        "value": [v['num'], k],
                        "unit":v['unit']
                    })
                except:
                    branchDic[key]['world'].append({
                        "name": countryName,
                        "value": [v['num'], k],
                    })
            for k,v in China_dic.items():
                try:
                    branchDic[key]['China'].append({
                        "name": k,
                        "value": [v['num'], k],
                        "unit":v['unit']
                    })
                except:
                    branchDic[key]['China'].append({
                        "name": k,
                        "value": [v['num'], k],
                    })
            dataTotal['branch'].append(branchDic)
    
    # form dataRet
    dataRet = {}    # 按照world与China分类
    dataRet['branchName'] = dataTotal['branchName']
    dataRet['world'] = [{"type": '整体数据',"data": dataTotal['trunk']['world'],},]
    dataRet['China'] = [{"type": '整体数据',"data": dataTotal['trunk']['China'],},]
    for item in dataTotal['branch']:
        for k,v in item.items():
            dataRet['world'].append({'type':k,'data':v['world']})
            dataRet['China'].append({'type':k,'data':v['China']})

    return dataRet


def getData(db_caches, index='all'):
    """
    从缓存中获取数据，如果没有新建再加入缓存
    当强制手动刷新的时候，index手动赋值为int型
    """
    groups = const.menus_groups
    dataRet = {'groups':groups, 'data':[]}
    for i in range(len(groups)):
        if (index=='all' or index!=i) and db_caches.exists(groups[i]):
            data = db_caches.read(groups[i])
        else:
            data = formData2Echarts(i)
            db_caches.write(groups[i], data)
        dataRet['data'].append(data)
    return dataRet



