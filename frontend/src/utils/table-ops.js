import config from "../config/config";
import {HttpUtils} from "./http-utils";
export class TableOps{
    constructor() {

    }
 static async   getBalance(){
        let result = await HttpUtils.request('/balance/', 'GET',true);
     console.log('BALANCE: ', result.response.balance)
     return result.response.balance
    }
 static async printBalance() {
        try {
            let balanceResult = await this.getBalance();
            document.querySelector('.balance').innerHTML = '<span class="balance-label">Баланс: </span><span class="balance-score">' + balanceResult + '$</span>';
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    }
 static    async getCategoryList(type) {
     switch (type) {
         case 'expense': {
             let categoryList = await HttpUtils.request('/categories/expense/');
             let categories = categoryList.response;
             return categories;
         }
         case 'income': {
             let categoryList = await HttpUtils.request('/categories/income/');
             let categories = categoryList.response;
             return categories;
         }
         default: {
             alert('Проблема с предоставленным типом операции при выборе списка категорй');
             return;
         }
     }
 }

    static async getCategoryTitleById(type, id) {
       // console.log('sadasdasd',type, id)
        try {
            let categories = await this.getCategoryList(type);
           // console.log('getCatList:', categories)
            let category = categories.find(category => category.id == id);
          //  console.log('category: ', category)
            if (category) {
                return category.title;
            } else {
                alert('Категория с данным ID не найдена');
                return null;
            }
        } catch (error) {
            console.error('Ошибка при получении категории:', error);
            alert('Произошла ошибка при получении категории.');
            return null;
        }
    }


}