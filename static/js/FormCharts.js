
// 新建一个JS文件用于存放各种用到的echarts图表

function myChartsetOption(option, myChart) {
    /* 每种表格后面都会有setOption函数 */
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

function activeDataZoomSelect(myChart) {
    /* 渲染完成后激活toolbox某项 */
    myChart.dispatchAction({
        type: 'takeGlobalCursor',
        key: 'dataZoomSelect',
        // 启动或关闭区域缩放
        dataZoomSelectActive: true
    });
}


function formMixLine(chatId, dataRet, isDisplayMark = true) {
    /* 单图模式中用的，一个图里显示多条曲线 */
    var dom = document.getElementById(chatId);
    var myChart = echarts.init(dom);

    // 进行数据解析构造
    // "value": [{"index":0,"shot":3602,"channel":"ip",'xAis':{"len":10002,"start":-15.0,"end":15.003},'yAis':[],'unit':'',}, {...}]}
    var curve_num = dataRet['value'].length;
    var rate_equal_1 = 0.001;
    var xAis_start = dataRet['xAis']['start'];
    var xAis_end = dataRet['xAis']['end'];

    // x轴
    var xAxisData = ['time',];
    for (var i = xAis_start; i <= xAis_end; i += (rate_equal_1 * dataRet['rate'])) {
        xAxisData.push(Math.round(i * 1000) / 1000);
    }

    var title_list = [];
    var dataset_source = [xAxisData,];
    var series_data = [];
    for (var i = 0; i < curve_num; i++) {
        // 曲线标题
        var curve_title = dataRet['value'][i]['shot'].toString() + '_' + dataRet['value'][i]['channel'];
        title_list.push(curve_title);
        
        // series构建
        dataset_source.push([curve_title,].concat(dataRet['value'][i]['yAis']));
        var data_info = {
            name: curve_title,
            type: 'line',
            symbol: 'none',
            connectNulls: true,
            encode: {x: 0, y: i+1},
            seriesLayoutBy: 'row',
            large: true,
        };
        if (isDisplayMark) {
            data_info.markPoint = {
                data: [{ type: 'max', name: curve_title, },],
                label: { show: true, formatter: '{b}_max:\n{c}', },
            };
            data_info.markLine = { data: [{ type: 'average', name: '平均值' },], };
        }
        series_data.push(data_info);
    }

    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        toolbox: {
            feature: {
                myTool1: {
                    title: '显示/隐藏极&均值',
                    icon: 'path://M486.8 460.3c1.3 9.7 9.7 16.8 19.2 16.8 0.9 0 1.7 0 2.6-0.2 10.6-1.4 18.1-11.2 16.6-21.8l-6.7-49c-10.2-81.9-61.4-132.8-133.7-132.8-35.2 0-101.8 22.1-130.3 62.1-6.2 8.8-4.2 20.9 4.6 27.1 8.7 6.2 20.8 4.1 27.1-4.6 18.9-26.6 72-45.8 98.6-45.8 51.9 0 87.5 36.9 95.2 99l6.8 49.2zM737.8 666c-18.9 26.6-72 45.8-98.6 45.8-52 0-87.5-36.9-95.2-99l-6.7-49.3c-1.4-10.6-11.2-18.6-21.8-16.6-10.6 1.4-18.1 11.2-16.6 21.8l6.7 49c10.1 81.9 61.4 132.8 133.7 132.8 35.2 0 101.8-22.1 130.3-62.1 6.2-8.8 4.2-20.9-4.6-27.1-8.9-6.1-21-4-27.2 4.7zM289.9 500.1h-19.4c-10.7 0-19.4 8.7-19.4 19.4s8.7 19.4 19.4 19.4h19.4c10.7 0 19.4-8.7 19.4-19.4s-8.7-19.4-19.4-19.4zM411.1 500.1h-40.4c-10.7 0-19.4 8.7-19.4 19.4s8.7 19.4 19.4 19.4h40.4c10.7 0 19.4-8.7 19.4-19.4s-8.7-19.4-19.4-19.4zM551.6 519.5c0-10.7-8.7-19.4-19.4-19.4h-40.4c-10.7 0-19.4 8.7-19.4 19.4s8.7 19.4 19.4 19.4h40.4c10.8 0 19.4-8.7 19.4-19.4zM613 500.1c-10.7 0-19.4 8.7-19.4 19.4s8.7 19.4 19.4 19.4h40.4c10.7 0 19.4-8.7 19.4-19.4s-8.7-19.4-19.4-19.4H613zM753.6 500.1h-19.4c-10.7 0-19.4 8.7-19.4 19.4s8.7 19.4 19.4 19.4h19.4c10.7 0 19.4-8.7 19.4-19.4s-8.7-19.4-19.4-19.4zM599.7 364.3c5 0 9.9-1.9 13.7-5.7l27.2-27.2v115.5c0 10.7 8.7 19.4 19.4 19.4s19.4-8.7 19.4-19.4V331.5l27.2 27.2c3.8 3.8 8.8 5.7 13.7 5.7s9.9-1.9 13.7-5.7c7.6-7.6 7.6-19.9 0-27.5l-60.4-60.3c-7.6-7.6-19.9-7.6-27.5 0l-60.4 60.3c-7.6 7.6-7.6 19.9 0 27.5 4 3.8 9 5.6 14 5.6z',
                    onclick: function () {
                        if (isDisplayMark) {
                            formMixLine(chatId, dataRet, isDisplayMark = false);
                        } else {
                            formMixLine(chatId, dataRet, isDisplayMark = true);
                        }
                    }
                },
                dataZoom: {},
                restore: { show: true },
                saveAsImage: { pixelRatio: 2 },
            }
        },
        grid: { bottom: 90 },
        dataZoom: [{ type: 'inside' }, { type: 'slider' }],
        legend: { data: title_list },
        dataset: { source: dataset_source,},
        xAxis: [
            {
                type: 'value',
                name: '时间/s',
                axisTick: { alignWithLabel: true },
            }
        ],
        yAxis: [
            {
                type: 'value',
            },
        ],
        series: series_data,
    };
    myChartsetOption(option, myChart);
    activeDataZoomSelect(myChart);
}


function formSimLine(chatId, dataRet) {
    /* 用于显示单一图形的设置波形图 */
    var dom = document.getElementById(chatId);
    var myChart = echarts.init(dom);

    // 进行数据解析构造
    var title = dataRet['channelName'];
    var series_data = dataRet['data'];
    var y_unit = dataRet['y_unit'];

    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        toolbox: {
            feature: {
                dataZoom: { yAxisIndex: 'none' },
                restore: { show: true },
                dataView: { readOnly: true },
                saveAsImage: { pixelRatio: 2 },
            }
        },
        grid: { bottom: 90 },
        dataZoom: [{ type: 'inside' }, { type: 'slider' }],
        legend: { data: title },
        xAxis: [
            {
                type: 'value',
                scale:true, // true时，绘图X轴不会强制包含0刻度
                name: 'ms',
                axisPointer: { type: 'shadow' },
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLine : {onZero: false},
                name: title,
                axisLabel: { formatter: '{value}' + y_unit }
            },
        ],
        series: [{
            type: 'line'
        }],
        dataset: {
            source: series_data,
        },
    };
    myChartsetOption(option, myChart);
    activeDataZoomSelect(myChart);
}


function formStackLine(itemId, curveData, rate = 0.75, isDisplayMark = false) {
    /* 一个图中显示多个堆叠图表, x轴使用value类型，数据使用dataset */
    // 初始化容器
    var dom = document.getElementById(itemId);
    var gridNmu = curveData.setting.gridNmu;
    var unitHeight = curveData.setting.block_height;
    dom.style.height = (unitHeight * gridNmu / rate).toString() + 'px';
    var myChart = echarts.init(dom);

    // 构建x轴
    var curve_rate = curveData.setting.rate;

    var timeUnit = 'time/s';
    var xAis_start = curveData.setting.xAxis.start;
    var xAis_end = curveData.setting.xAxis.end;

    // 构建dataset、颜色列表、曲线列表
    var dataset_source = [];
    var color_list = [];
    var legendData = [];
    var seriesData = [];
    for (var i = 0; i < curveData.values.length; i++) {
        if ( curveData.values[i].unit == undefined || curveData.values[i].unit == '-' ){
            curveData.values[i].unit = '';
        }

        // 相同炮号的数据，title将炮号提取出来
        if ( curveData.setting.model_type == 1){
            var title_temp = curveData.values[i].channel + '(' + curveData.values[i].unit + ')';
        }else{
            var title_temp = curveData.values[i].shot + '_' + curveData.values[i].channel + '(' + curveData.values[i].unit + ')';
        }
        dataset_source.push(['time',].concat(curveData.values[i].time));
        dataset_source.push([title_temp,].concat(curveData.values[i].data));
        color_list.push(curveData.values[i].color);
        legendData.push(title_temp);
        var data_info = {
            name: legendData[i],
            type: "line",
            symbol: 'none',
            connectNulls: true,
            xAxisIndex: curveData.values[i].position - 1,
            yAxisIndex: curveData.values[i].position - 1,
            encode: {x: 2*i, y: 2*i+1},
            seriesLayoutBy: 'row',
            large: true,
        };
        if (curveData.values[i].data.length > 20000) {
            data_info['sampling'] = 'average';
        }
        if (isDisplayMark) {
            data_info.markPoint = {
                data: [{ type: 'max', name: legendData[i], },],
                label: { show: true, formatter: '{b}_max:\n{c}', },
            };
            data_info.markLine = { data: [{ type: 'average', name: '平均值' },], };
        }
        seriesData.push(data_info);
    }

    var gridData = [];
    var dataZoomXAxisIndexData = [];
    var xAxisInfo = [];
    var yAxisData = [];

    for (var i = 0; i < gridNmu; i++) {
        dataZoomXAxisIndexData.push(i);
        // gridData来设置图块的位置与大小
        gridData.push({ x: '3%', y: (8 + i * 82 / gridNmu).toString() + '%', height: unitHeight, left: '9%', right: '6%' });

        var temp_yAxisTitle = '';
        for (var j = 0; j < curveData.values.length; j++) {
            if (curveData.values[j].position == i + 1) {
                temp_yAxisTitle += ('\n' + legendData[j]);
            }
        }
        yAxisData.push({
            type: 'value',
            axisLine : {onZero: false},
            gridIndex: i,
            name: temp_yAxisTitle,
            splitNumber: 4,
            nameTextStyle: {
                padding: 28,
                fontSize: 14,
            },
            nameLocation: 'middle',
            axisLabel: { formatter: '{value}', }
        });
        
        if (i == gridNmu - 1) {
            xAxisInfo.push({
                type: 'value',
                scale:true, // true时，绘图X轴不会强制包含0刻度
                axisLine : {onZero: false},
                name: timeUnit,
                gridIndex: i,
                axisTick: { alignWithLabel: true },
                min:xAis_start,
                max:xAis_end,
            });
        } else {
            xAxisInfo.push({
                type: 'value',
                scale:true,
                axisLine : {onZero: false},
                gridIndex: i,
                axisTick: { alignWithLabel: true },
                axisLabel: { show: false },
                min:xAis_start,
                max:xAis_end,
            });
        }
    }

    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross', crossStyle: { color: '#999' },}
        },
        axisPointer: {
            link: { xAxisIndex: 'all' },
            label: {backgroundColor: '#777'}
        },
        toolbox: {
            feature: {
                brush: { type: ['lineX', 'clear']},
                dataZoom: { yAxisIndex: 'none' },
                restore: { show: true },
                myTool1: {
                    title: '显示/隐藏极&均值',
                    icon: 'path://M486.8 460.3c1.3 9.7 9.7 16.8 19.2 16.8 0.9 0 1.7 0 2.6-0.2 10.6-1.4 18.1-11.2 16.6-21.8l-6.7-49c-10.2-81.9-61.4-132.8-133.7-132.8-35.2 0-101.8 22.1-130.3 62.1-6.2 8.8-4.2 20.9 4.6 27.1 8.7 6.2 20.8 4.1 27.1-4.6 18.9-26.6 72-45.8 98.6-45.8 51.9 0 87.5 36.9 95.2 99l6.8 49.2zM737.8 666c-18.9 26.6-72 45.8-98.6 45.8-52 0-87.5-36.9-95.2-99l-6.7-49.3c-1.4-10.6-11.2-18.6-21.8-16.6-10.6 1.4-18.1 11.2-16.6 21.8l6.7 49c10.1 81.9 61.4 132.8 133.7 132.8 35.2 0 101.8-22.1 130.3-62.1 6.2-8.8 4.2-20.9-4.6-27.1-8.9-6.1-21-4-27.2 4.7zM289.9 500.1h-19.4c-10.7 0-19.4 8.7-19.4 19.4s8.7 19.4 19.4 19.4h19.4c10.7 0 19.4-8.7 19.4-19.4s-8.7-19.4-19.4-19.4zM411.1 500.1h-40.4c-10.7 0-19.4 8.7-19.4 19.4s8.7 19.4 19.4 19.4h40.4c10.7 0 19.4-8.7 19.4-19.4s-8.7-19.4-19.4-19.4zM551.6 519.5c0-10.7-8.7-19.4-19.4-19.4h-40.4c-10.7 0-19.4 8.7-19.4 19.4s8.7 19.4 19.4 19.4h40.4c10.8 0 19.4-8.7 19.4-19.4zM613 500.1c-10.7 0-19.4 8.7-19.4 19.4s8.7 19.4 19.4 19.4h40.4c10.7 0 19.4-8.7 19.4-19.4s-8.7-19.4-19.4-19.4H613zM753.6 500.1h-19.4c-10.7 0-19.4 8.7-19.4 19.4s8.7 19.4 19.4 19.4h19.4c10.7 0 19.4-8.7 19.4-19.4s-8.7-19.4-19.4-19.4zM599.7 364.3c5 0 9.9-1.9 13.7-5.7l27.2-27.2v115.5c0 10.7 8.7 19.4 19.4 19.4s19.4-8.7 19.4-19.4V331.5l27.2 27.2c3.8 3.8 8.8 5.7 13.7 5.7s9.9-1.9 13.7-5.7c7.6-7.6 7.6-19.9 0-27.5l-60.4-60.3c-7.6-7.6-19.9-7.6-27.5 0l-60.4 60.3c-7.6 7.6-7.6 19.9 0 27.5 4 3.8 9 5.6 14 5.6z',
                    onclick: function () {
                        if (isDisplayMark) {
                            formStackLine(itemId, curveData, rate = 0.75, isDisplayMark = false);
                        } else {
                            formStackLine(itemId, curveData, rate = 0.75, isDisplayMark = true);
                        }
                    }
                },
                saveAsImage: { show: true }
            }
        },
        dataZoom: [{ xAxisIndex: dataZoomXAxisIndexData }, { type: 'inside' }, { type: 'slider' }],
        brush: {
            xAxisIndex: 'all',
            brushLink: 'all',
            outOfBrush: { colorAlpha: 0.1,}
        },
        grid: gridData,
        color: color_list,
        legend: { data: legendData, },
        dataset: { source: dataset_source},
        xAxis: xAxisInfo,
        yAxis: yAxisData,
        series: seriesData,
    };

    // 相同炮号的数据，title将炮号提取出来
    if ( curveData.setting.model_type == 1){
        option.title = { text: 'Shot: '+curveData.values[0].shot, };
    }
    myChartsetOption(option, myChart);
    activeDataZoomSelect(myChart);
}

