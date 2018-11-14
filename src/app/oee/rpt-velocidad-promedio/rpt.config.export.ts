let configChartSpider = {

    chart: {
        height: null,
        polar: true,
        type: 'line',
        backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
                [0, 'rgb(66,165,245)'],
                [1, 'rgb(21,101,192)']
            ]
        }
    },
    exporting: {
        enabled: true
    },
    title: {
        text: '',
        x: 0,
        y: 10,
        style: {
            color: '#ffffff'
        }
    },
    subtitle: {
        text: '',
        style: {
            color: '#ffffff'
        }
    },
    credits: {
        enabled: false
    },
    pane: {
        size: '95%'
    },

    xAxis: {
        categories: [],
        tickmarkPlacement: 'on',
        lineWidth: 0,
        labels: {
            style: {
                color: '#ffffff'
            }
        }
    },

    yAxis: {
        
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: 0,
        labels: {
            enabled: false,
            style: {
                color: '#000000',
            },
            formatter: function () {
                // return this.value + ' T/Hr';
                return '';
            }
        }
    },

    tooltip: {
        shared: true,
        pointFormat: ''
    },

    legend: {
        align: 'right',
        itemStyle: {
            color: '#fff'
    	}
        // verticalAlign: 'top',
        // y: 70,
        // layout: 'vertical'
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: false,
                color: '#FFFFFF',
                inside: false,
                y: 0,
                distance: 10
            },
            events: {
                legendItemClick: function () {
                    return false;
                }
            }
        }
    },

    series: []

};



export {

    configChartSpider
}