# -*- coding:utf-8 -*-
# 一些小工具的文件
import pandas as pd


class excelReader:
    """ 解析Excel，返回字典 """
    def __init__(self, filename):
        self.filename = filename
        self.trunk_df = pd.read_excel(self.filename, sheet_name=0)
        self.branch_df = pd.read_excel(self.filename, sheet_name=1)

    def getTrunk(self):
        """
        返回第一页总的数据, list
        # [{'地区': '广东', '人数': 10}, {'地区': '福建', '人数': 2}, {'地区': '甘肃', '人数': 36}...]
        """
        return self.trunk_df.to_dict(orient='records')

    def getBranch(self):
        """ 返回第二页的分支数据，地区，单位，人数，dic """
        talents = {}
        i = 0
        for item in self.branch_df.columns:
            if 'Unnamed' not in item:
                if i > 0:
                    talent = self.branch_df.iloc[1:, i-1:i+2].dropna(axis=0, how='any').set_axis(['地区', '单位', '人数'], axis='columns').to_dict(orient='records')
                    talents[item] = talent
            i += 1
        return talents

        