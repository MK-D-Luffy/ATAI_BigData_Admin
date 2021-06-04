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
          
            option : {
    title: {
        text: '各类比赛参赛人数-赛事数',
        subtext: '数据来自ATAI数据库'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['参赛人数', '赛事数']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        type: 'category',
        data: ['新人赛', '测试赛', '程序设计大赛', '创新应用大赛', '算法大赛']
    },
    series: [
        {
            name: '参赛人数',
            type: 'bar',
            data: [3, 0, 0, 4, 0]
        },
        {
            name: '赛事数',
            type: 'bar',
            data: [1, 0, 2, 1, 1]
        }
    ]
        }}
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
            statisticsApi.compCnumAndPnum()
                .then(response => {
                    console.log('*****************'+response)
                    this.option.yAxis.data = response.data.level
                    for(var i=0;i<this.option.series.length;i++){
                        if(this.option.series[i].name=="参赛人数"){
                            this.option.series[i].data=response.data.pnum
                        }else{
                            this.option.series[i].data=response.data.cnum
                        }
                    }
                 
            this.chart.setOption(this.option)

               
                })

        }
    }
}
</script>
