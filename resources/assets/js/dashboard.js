import Vue from 'vue';
import axios from 'axios';
import Chart from 'chart.js';

new Vue({
    el: '#dw',
    data: {
        dwChartData: {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Total Penjualan',
                        data: [],
                        backgroundColor: [
                            'rgba(71, 183,132,.5)',
                            'rgba(71, 183,132,.5)',
                            'rgba(71, 183,132,.5)',
                            'rgba(71, 183,132,.5)',
                            'rgba(71, 183,132,.5)',
                            'rgba(71, 183,132,.5)',
                            'rgba(71, 183,132,.5)'
                        ],
                        borderColor: [
                            '#47b784',
                            '#47b784',
                            '#47b784',
                            '#47b784',
                            '#47b784',
                            '#47b784',
                            '#47b784'
                        ],
                        borderWidth: 3
                    }
                ]
            },
            options: {
                responsive: true,
                lineTension: 1,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            padding: 25,
                        }
                    }]
                }
            }
        }
    },
    mounted() {
        this.getData();
        this.createChart('dw-chart', this.dwChartData);
    },
    methods: {
        createChart(chartId, chartData) {
            const ctx = document.getElementById(chartId);
            const myChart = new Chart(ctx, {
                type: chartData.type,
                data: chartData.data,
                options: chartData.options,
            });
        },
        getData() {
            axios.get('/api/chart')
            .then((response) => {
                Object.entries(response.data).forEach(
                    ([key, value]) => {
                        this.dwChartData.data.labels.push(key);
                        this.dwChartData.data.datasets[0].data.push(value);
                    }
                );
            })
        }
    }
})