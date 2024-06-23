import { AuthUtils } from "../utils/auth-utils";
import { HttpUtils } from "../utils/http-utils";
import { TableOps } from "../utils/table-ops";
//Оптимизировано 23062024
export class Dashboard {
    constructor(openNewRoute) {
       // console.log('DASHBOARD');
        this.openNewRoute = openNewRoute; // получение ф-ции переданной в экземпляр класса из router.js
        if (!AuthUtils.getAuthInfo()) {
            this.openNewRoute('/login');
        }
        TableOps.printBalance().then();
        this.chartStartFunction().then();
        this.filterElements = document.querySelectorAll('#buttons-panel .btn');
        document.getElementById('date-start').value = this.formatDate(new Date());
        document.getElementById('date-end').value = this.formatDate(new Date());
        document.getElementById('date-start').addEventListener('change', this.emulateClick.bind(this)); // привязываем контекст к emulateClick
        document.getElementById('date-end').addEventListener('change', this.emulateClick.bind(this)); // привязываем контекст к emulateClick
        this.filterElements.forEach(button => {
            button.addEventListener('click', (event) => {
                console.log(button.dataset.filter);
                this.chartStartFunction(button.dataset.filter).then();
                this.filterElements.forEach(element => {
                    element.classList.remove('btn-secondary');
                    element.style.color = '#000';
                });
                event.target.classList.add('btn-secondary');
                event.target.style.color = '#fff';
            });
        });

        // Инициализация переменных для графиков
        this.chart1Instance = null;
        this.chart2Instance = null;

        // Вызов начальной отрисовки графика
        this.chartStartFunction().then();
    }

    async chartStartFunction(filter = 'all') {
        try {
            this.chartData = await this.getBalanceData(filter);
            //console.log('chartData', this.chartData);
            this.initChart(this.chartData);
        } catch (error) {
            console.error('Ошибка при получении данных для графика:', error);
        }
    }

    initChart(data) {
        console.log('initChart called');

        const incomeData = data.filter(item => item.type === 'income');
        const expenseData = data.filter(item => item.type === 'expense');

        const incomeCategories = this.aggregateDataByCategory(incomeData);
        const expenseCategories = this.aggregateDataByCategory(expenseData);

        const chart1Element = document.getElementById('chart1');
        const chart2Element = document.getElementById('chart2');

        if (!chart1Element || !chart2Element) {
            console.error('Chart elements not found');
            return;
        }

        const ctx1 = chart1Element.getContext('2d');
        const ctx2 = chart2Element.getContext('2d');

        if (!ctx1 || !ctx2) {
            console.error('Unable to get context for charts');
            return;
        }

        // Уничтожаем старые графики, если они существуют
        if (this.chart1Instance) {
            this.chart1Instance.destroy();
        }

        if (this.chart2Instance) {
            this.chart2Instance.destroy();
        }


        this.chart1Instance = new Chart(ctx1, {
            type: 'pie',
            data: {
                labels: Object.keys(incomeCategories),
                datasets: [{
                    label: 'Income by Category',
                    data: Object.values(incomeCategories),
                    backgroundColor: this.generateColors(Object.keys(incomeCategories).length),
                    hoverOffset: 4
                }]
            },
            options: {}
        });

        this.chart2Instance = new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: Object.keys(expenseCategories),
                datasets: [{
                    label: 'Expenses by Category',
                    data: Object.values(expenseCategories),
                    backgroundColor: this.generateColors(Object.keys(expenseCategories).length),
                    hoverOffset: 4
                }]
            },
            options: {}
        });


    }

    aggregateDataByCategory(data) {
        return data.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = 0;
            }
            acc[item.category] += item.amount;
            return acc;
        }, {});
    }

    generateColors(count) {
        const colors = [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)'
        ];
        return Array.from({length: count}, (_, i) => colors[i % colors.length]);
    }

    async getBalanceData(filter = 'all') {
        console.log('filter: ', filter);
        let nowDate = this.formatDate(new Date());
        let result;

        try {
            switch (filter) {
                case 'now':
                    result = await HttpUtils.request('/operations?period=interval&dateFrom=' + nowDate + '&dateTo=' + nowDate);
                    break;
                case 'interval':
                    let dateStart = document.getElementById('date-start').value;
                    let dateEnd = document.getElementById('date-end').value;
                    result = await HttpUtils.request('/operations?period=interval&dateFrom=' + dateStart + '&dateTo=' + dateEnd);
                    break;
                default:
                    result = await HttpUtils.request('/operations?period=' + filter);
            }

            if (result && result.response) {
                return result.response;
            } else {
                throw new Error('Ошибка в получении данных');
            }
        } catch (error) {
            console.error('Возникла ошибка при запросе данных о балансе:', error);
            alert('Возникла ошибка при запросе данных о балансе');
            return null;  // Или другое значение по умолчанию
        }
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    emulateClick() {
        document.querySelector('button[data-filter="interval"]').click();
    }
}
