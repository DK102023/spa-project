import { HttpUtils } from "../utils/http-utils";
import { TableOps } from "../utils/table-ops";
import {AuthUtils} from "../utils/auth-utils";
// оптимизирован
export class CreateCategory {
    constructor(openNewRoute, typeOps) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo()) {
            this.openNewRoute('/login');
        }
        this.typeOps = typeOps;
        this.routAddress = '/debts';
        TableOps.printBalance().then();
        this.initElements()
        this.addEventListeners()
        const searchParams = new URLSearchParams(window.location.search);
        this.cat = searchParams.get('cat');
        this.catId = searchParams.get('id');
        this.setTitle(this.typeOps).then();

        console.log('cat: ', this.cat)
        console.log('typeOps: ', this.typeOps)
        console.log('catId: ', this.catId)
    }
   async  setTitle(typeOps){
        if (typeOps ===1 && this.cat=='income'){
            document.getElementsByTagName('h1')[0].innerText='Создание категории доходов';
        }else if (typeOps ===1 && this.cat=='expense'){
            document.getElementsByTagName('h1')[0].innerText='Создание категории расходов';
            this.routAddress = '/credits';
        }else if (typeOps ===2 && this.cat=='income'){
            document.getElementsByTagName('h1')[0].innerText='Редактирование категории доходов';
            this.elements.categoryInput.value = await TableOps.getCategoryTitleById(this.cat, this.catId).then()
            this.elements.saveBtn.innerText='Сохранить';
        }else if (typeOps ===2 && this.cat=='expense'){
            document.getElementsByTagName('h1')[0].innerText='Редактирование категории расходов';
            this.elements.categoryInput.value = await TableOps.getCategoryTitleById(this.cat, this.catId).then()
            this.elements.saveBtn.innerText='Сохранить';
        }

    }
    initElements(){
        this.elements = {
        cancelBtn: document.getElementById('cancel-button'),
        saveBtn: document.getElementById('save-button'),
        categoryInput: document.getElementById('category-input'),
        }
    }
    addEventListeners(){
        this.elements.cancelBtn.addEventListener('click', () => this.openNewRoute('/debts'));
        this.elements.saveBtn.addEventListener('click', async () => {
            if (this.elements.categoryInput.value) {
                await this.fetchCategoryData(this.typeOps);
              //  this.saveEditData(this.id, this.typeOps).then();
            } else {
                alert('Пожалуйста, заполните все поля формы.');
            }
        });
    }
  async  fetchCategoryData(typeOps){
        let body = {
            title:this.elements.categoryInput.value,
        }
            console.log('route', this.routAddress)
            switch (typeOps){
                case 1:{
                    await HttpUtils.request('/categories/'+this.cat+'/','POST', true, body);
                    setTimeout(() => {
                        this.openNewRoute(this.routAddress);
                    }, 100);
                }
                case 2: {
                    await HttpUtils.request('/categories/'+this.cat+'/' + this.catId, 'PUT', true, body);
                    this.openNewRoute(this.routAddress);

                }
            }
    }


}
