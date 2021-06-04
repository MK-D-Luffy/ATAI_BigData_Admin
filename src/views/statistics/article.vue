<template>
  <div class="app-container">
   

    <div class="chart-container">
      <div id="chart" class="chart" style="height:500px;width:100%" />
    </div>
  </div>
</template>
<script>
//引入图表显示框架
import echarts from 'echarts'
//引入statistics.js文件
import statisticsApi from '@/api/sta/statistics'
export default {
    data() {
        return {
          
            option :{
            title: {
        text: '文章根据分类对点击量与评论数的统计',
        subtext: ''
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['点击量', '评论数','文章数量']
    },
    toolbox: {
        show: true,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['生活', '后端', '前端', '新闻']
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value} '
        }
    },
    series: [
        {
            name: '点击量',
            type: 'line',
            data: [110, 110, 150, 130],
            markPoint: {
                data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                ]
            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'}
                ]
            }
        },
        {
            name: '评论数',
            type: 'line',
            data: [10, 20, 20, 50],
           
            markLine: {
                data: [
                    {type: 'average', name: '平均值'},
                    [{
                        symbol: 'none',
                        x: '90%',
                        yAxis: 'max'
                    }, {
                        symbol: 'circle',
                        label: {
                            position: 'start',
                            formatter: '最大值'
                        },
                        type: 'max',
                        name: '最高点'
                    }]
                ]
            }
        },
         {
            name: '文章数量',
            type: 'line',
            data: [110, 110, 150, 130],
            markPoint: {
                data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                ]
            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'}
                ]
            }
        },
    ]
        }
                }
    },
        mounted:function(){
        this.setChart();
    },
    methods:{
 
        //设置图表参数
        setChart() {
            debugger
            // 基于准备好的dom，初始化echarts实例
            this.chart = echarts.init(document.getElementById('chart'))
            statisticsApi.articleSta()
                .then(response => {
                    console.log('*****************'+response)
                    this.option.xAxis.data = response.data.category
                    for(var i=0;i<this.option.series.length;i++){
                        if(this.option.series[i].name=="点击量"){
                            this.option.series[i].data=response.data.viewCounts
                        }else if(this.option.series[i].name=="文章数量"){
                            this.option.series[i].data=response.data.cnum
                        }else{
                            this.option.series[i].data=response.data.commentCounts
                        }
                    }
                 
            this.chart.setOption(this.option)

               
                })
        }
    }
}
</script>
