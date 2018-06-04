let configChart = {
    chart: {
        type: 'column',
        backgroundColor:'#e1f5fe'
    },
    credits: {
        enabled: false
    },
    title: {
        text: '',
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
    xAxis: {
        categories: [],
        labels: {
            style: {
                color: '#ffffff'
            }
        }
    },
    yAxis: {
        title: {
            text: ''
        },
        labels: {
            style: {
                color: '#ffffff',
            },
            formatter: function () {
                return this.value + ' Hrs';
            }
        },
        gridLineWidth: 0

    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                color: '#000000',
                inside: true,
                format: '{point.y:,.2f}'
            }
        },
        bar:{
            depth: 75
        }
    },
    colors: ['#01579b'],
    series: [],
};



export {
    configChart
}