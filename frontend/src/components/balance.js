import {HttpUtils} from "../utils/http-utils";
import config from "../config/config";
import {TableOps} from "../utils/table-ops";
import {AuthUtils} from "../utils/auth-utils";
export class Balance{
    constructor(openNewRoute) {
        console.log('balance')
        this.openNewRoute = openNewRoute; // получение ф-ции переданной в экземпляр класса из router.js
        if (!AuthUtils.getAuthInfo()) {
            this.openNewRoute('/login');
        }
        TableOps.printBalance().then()
        this.getBalanceData().then();
        this.filterElements  = document.querySelectorAll('#buttons-panel .btn');
        document.getElementById('date-start').value = this.formatDate(new Date());
        document.getElementById('date-end').value = this.formatDate(new Date());
        document.getElementById('date-start').addEventListener('change', this.emulateClick);
        document.getElementById('date-end').addEventListener('change', this.emulateClick);
        document.getElementById('create-debit').addEventListener('click', ()=>{
            this.openNewRoute('/create-action?create=expense');
        });
        document.getElementById('create-credit').addEventListener('click', ()=>{
            this.openNewRoute('/create-action?create=income');
        });

        this.filterElements.forEach(button => {
            button.addEventListener('click', (event) => {
                 console.log(button.dataset.filter);
               //  this.dataFiltering(button.dataset.filter).then();
                this.getBalanceData(button.dataset.filter).then()
                this.filterElements.forEach(function(element) {
                    element.classList.remove('btn-secondary');
                 //   element.classList.add('btn-outline-secondary');
                    element.style.color = '#000'
                });
                event.target.classList.add('btn-secondary')
                event.target.style.color = '#fff'

            });
        });
        this.confirmDeleteButton = document.getElementById('delete-record');
        // Находим таблицу по id
        this.tableData = document.getElementById('table-data');

        // Переменная для хранения значения data-rec-id
        this.biTrashData = null;

        // Добавляем обработчик для кликов в таблице
        this.tableData.addEventListener('click', (event) => {

            if (event.target.classList.contains('bi-trash')) {
                // Получаем значение атрибута data-rec-id текущего элемента
                this.biTrashData = event.target.getAttribute('data-rec-id');
                console.log(`Clicked trash button with data-rec-id: ${this.biTrashData}`);
            }
        });


        this.confirmDeleteButton.addEventListener('click', () => {
            this.deleteRecord(this.biTrashData);
        });


    }

  /*  init() {
        this.confirmDeleteButton.addEventListener('click', () => {
            this.deleteRecord(this.biTrashData);
        });
    }*/

  async  deleteRecord(dataId) {
        //const url = `/operations/${dataId}`;
        let result = await  HttpUtils.request('/operations/'+dataId, 'DELETE',);
        this.getBalanceData().then();
        TableOps.printBalance().then()


    }

     emulateClick() {
         document.querySelector('button[data-filter="interval"]').click();
    }
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    async getBalanceData(filter='all'){

        let result;
        let nowDate = this.formatDate(new Date());
        let toDate = this.formatDate(new Date());
        switch (filter){
            case 'now':
               // result = await  HttpUtils.request('/operations?period=interval&dateFrom=2022-09-12&dateTo=2022-09-12'); // -тест
                result = await  HttpUtils.request('/operations?period=interval&dateFrom='+nowDate+'&dateTo='+nowDate); // - в релиз
                break;
          //  case 'week':
               // result = await HttpUtils.request('/operations?period=interval&dateFrom=2022-09-12&dateTo=2022-09-19');// -тест
               // result = await  HttpUtils.request('/operations?period=interval&dateFrom='+nowDate+'&dateTo='+ this.formatDate(this.addDays(new Date(), 7));// / в релиз
               // result = await HttpUtils.request('/operations?period=week'); // - то же самое
          //      break;
         /*   case 'month':
                result = await HttpUtils.request('/operations?period=month');
                break;
            case 'year':
                result = await HttpUtils.request('/operations?period=year');
                break;*/
            case 'interval':
                let dateStart = document.getElementById('date-start').value;
                let dateEnd = document.getElementById('date-end').value;
                result = await HttpUtils.request('/operations?period=interval&dateFrom='+ dateStart+'&dateTo='+ dateEnd)
                break;
            default: result = await  HttpUtils.request('/operations?period='+filter);
        }


        if(result.redirect){
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response ) {
            return alert('Возникла ошибка при запросе данных о балансе');
        }
        TableOps.printBalance().then()
        this.showRecords(result.response);
        console.log('Таблица ',result.response, result.response.length);
        //console.log('filterButtons ',this.filterElements);

    }
   /* async getBalanceData(){

        const result = await  HttpUtils.request('/operations?period=all');
        if(result.redirect){
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response ) {
            return alert('Возникла ошибка при запросе данных о балансе');
        }
        this.showRecords(result.response);
        console.log('Таблица ',result.response);
        console.log('filterButtons ',this.filterElements);

    }*/

    showRecords(tableData){
        const recordsElement = document.getElementById('table-data');
        recordsElement.innerHTML='';
        for (let i = 0; i < tableData.length; i++)    {
            const trElement = document.createElement('tr');
           // trElement.insertCell().innerText = i + 1;
            trElement.insertCell().innerText = tableData[i].id;
           // trElement.insertCell().innerText = tableData[i].type;

            // Добавляем ячейку с типом (доход или расход)
            const typeCell = trElement.insertCell();
            typeCell.innerText = tableData[i].type === 'income' ? 'Доход' : 'Расход';

            // Устанавливаем цвет текста в зависимости от типа данных
            if (tableData[i].type === 'income') {
                typeCell.style.color = 'green'; // Зеленый цвет для дохода
            } else if (tableData[i].type === 'expense') {
                typeCell.style.color = 'red'; // Красный цвет для расхода
            }

            trElement.insertCell().innerText = tableData[i].category;
            //trElement.insertCell(); // в ответе нет категорий
            trElement.insertCell().innerText = tableData[i].amount;
            trElement.insertCell().innerText = tableData[i].date;
            trElement.insertCell().innerText = tableData[i].comment;
            /*trElement.insertCell().innerHTML = '<div class="d-flex justify-content-end">'+'<a href="/balance/delete?id="'+ tableData[i].id +' class="bi bi-trash"  ></a>' +
                '<a href="/balance/edit?id="'+ tableData[i].id +' class="bi bi-pencil me-2" ></a></div>';*/
            trElement.insertCell().innerHTML =
                '<div class="d-flex justify-content-end">' +
                '<a href="#" data-rec-id="' + tableData[i].id + '" class="bi bi-trash" data-bs-toggle="modal" data-bs-target="#ModalBox"></a>' +
                '<a href="/edit?id=' + tableData[i].id + '" class="bi bi-pencil me-2"></a>' +
                '</div>';

            recordsElement.appendChild(trElement);

        }

}

}