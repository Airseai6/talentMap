
// 新建一个JS文件用于存放各种用到的echarts图表

function myChartSetOption(option, myChart) {
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


function formMapOption(data, mapType, title, currentIndex=0, autoPlay=false) {
    /* 构建显示地图的option */
    var mapLeft = '22%';
    if (mapType == 'world') {
        mapLeft = '5%';
    }
    var option = {
        baseOption: {
            animationDurationUpdate: 1000,
            animationEasingUpdate: 'quinticInOut',
            timeline: {
                axisType: 'category',
                orient: 'vertical',
                autoPlay: autoPlay,
                currentIndex: currentIndex,
                inverse: true,
                playInterval: 2000,
                left: null,
                right: 5,
                top: 20,
                bottom: 20,
                width: 46,
                height: null,
                label: {
                    normal: {
                        textStyle: {color: '#ddd'}
                    },
                    emphasis: {
                        textStyle: {color: '#fff'}
                    }
                },
                symbol: 'none',
                lineStyle: {color: '#555'},
                checkpointStyle: {
                    color: '#bbb',
                    borderColor: '#777',
                    borderWidth: 1
                },
                controlStyle: {
                    showNextBtn: false,
                    showPrevBtn: false,
                    normal: {
                        color: '#666',
                        borderColor: '#666'
                    },
                    emphasis: {
                        color: '#aaa',
                        borderColor: '#aaa'
                    }
                },
                data: data.map(function(ele) {
                    return ele.type
                })
            },
            backgroundColor: '#404a59',
            title: {
                // text: '聚变人才人员分布情况',
                subtext: '仅为单方收集数据',
                left: 'center',
                top: 'top',
                textStyle: {
                    fontSize: 25,
                    color: 'rgba(255,255,255, 0.9)'
                }
            },
            tooltip: {
                formatter: function(params) {
                    if (typeof(params.data)=='object' && 'value' in params.data) {
                        return params.data.value[1] + ': ' + params.data.value[0];
                    }
                }
            },
            grid: {
                left: '10%',
                right: '42%',
                top: '70%',
                bottom: 20
            },
            xAxis: {},
            yAxis: {},
            series: [{
                    id: 'map',
                    type: 'map',
                    mapType: mapType,
                    roam: true,//缩放和平移
                    top: '10%',
                    bottom: '20%',
                    left: mapLeft,
                    itemStyle: {
                        normal: {
                            areaColor: '#323c48',
                            borderColor: '#404a59'
                        },
                        emphasis: {
                            label: {
                                show: true
                            },
                            areaColor: 'rgba(255,255,255, 0.5)'
                        }
                    },
                    data: []
                }, {
                    id: 'bar',
                    type: 'bar',
                    tooltip: {
                        show: true
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            textStyle: {
                                color: '#ddd'
                            }
                        }
                    },
                    data: []
                }, {
                    id: 'pie',
                    type: 'pie',
                    radius: ['8%', '20%'],
                    center: ['80%', '82%'],
                    roseType: 'radius',
                    tooltip: {
                        formatter: '{b} {d}%'
                    },
                    data: [],
                    label: {
                        normal: {
                            textStyle: {
                                color: '#ddd'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: '#ddd'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: 'rgba(0,0,0,0.3)',
                            borderSize: 1
                        }
                    }
                }
            ]
        },
        options: []
    }
    
    for (var i = 0; i < data.length; i++) {
        /* 构建分支option */
        var talentNum = [0,];   // 构建人数列表，为了获取最大最小值
        for (var j = 0; j < data[i].data.length; j++) {
            talentNum.push(data[i].data[j].value[0]);
        };
        var barLabelFontSize = 12;
        if (data[i].data.length > 9) {
            barLabelFontSize = 8;
        }
        option.options.push({
            title: {text: title + '分布情况-' + data[i].type},
            visualMap: [{
                dimension: 0,
                left: '1%',
                itemWidth: '12%',
                min: Math.min.apply(null, talentNum),
                max: Math.max.apply(null, talentNum),
                text: ['High', 'Low'],
                textStyle: {
                    color: '#ddd'
                },
                inRange: {
                    color: ['lightskyblue', 'yellow', 'red']
                }
            }],
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.1],
                axisLabel: {
                    show: false,
                }
            },
            yAxis: {
                type: 'category',
                axisLabel: {
                    show:true, // 柱状图左侧标签
                    interval:0,
                    fontSize: barLabelFontSize,
                    // rotate:40,
                    textStyle: {
                        color: '#ddd'
                    }
                },
                data: data[i].data.map(function(ele) {
                    return ele.value[1]
                })//.reverse()
            },
            series: [{
                    id: 'map',
                    data: data[i].data
                },
                // 显示左下角的条形图
                {
                    id: 'bar',
                    data: data[i].data.map(function(ele) {
                        return ele.value[0];
                    })
                },
                // 显示饼图
                {
                    id: 'pie',
                    data: data[i].data.map(function(ele) {
                        return {
                            name: ele.value[1],
                            value: ele.value
                        }
                    })//.concat({
                    //     name: '其他国家',
                    //     value: 10
                    // }),
                }
            ]
        })
    }

    return option;

}

