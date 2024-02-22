let myChart;

const CHART_OPTIONS = {
    scales: {
        y: {
            beginAtZero: true
        }
    },
    indexAxis: 'y',
    plugins: {
        legend: {
            display: false
        }
    },
    layout: {
        padding: 16
    },
    responsive: true,
    maintainAspectRatio: false
};

const CHART_BG_COLOR = ['#ff5959', '#f5ac78', '#fae078', '#9db7f5', '#a7db8d', '#fa92b2'];

function loadChart() {
    const ctx = document.getElementById('myChart');
    if (myChart !== null && typeof myChart === 'object') { // wenn myChart NICHT gleich null ist, UND der Typ myChart ein object ist, dann ...
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: currentPokemonStatsNames,
            datasets: [{
                data: currentPokemonBaseStat,
                borderWidth: 1,
                backgroundColor: CHART_BG_COLOR
            }]
        },
        options: CHART_OPTIONS
    });
    currentPokemonStatsNames = [];
    currentPokemonBaseStat = [];
}