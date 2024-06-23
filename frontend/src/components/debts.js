import {HttpUtils} from "../utils/http-utils";
import config from "../config/config";
import {TableOps} from "../utils/table-ops";
import {AuthUtils} from "../utils/auth-utils";
export class Debts{
    constructor(openNewRoute, cat='income') {
        this.openNewRoute = openNewRoute; // получение ф-ции переданной в экземпляр класса из router.js
        if (!AuthUtils.getAuthInfo()) {
            this.openNewRoute('/login');
        }
        this.cat = cat; // получение ф-ции переданной в экземпляр класса из router.js

        TableOps.printBalance().then()
        this.CreateDebtsBlock(this.cat).then()
        this.modal= new bootstrap.Modal(document.getElementById("ModalBox")),
        this.deleteBtn = document.getElementById('delete-record');
        this.catToDelete =null;
        this.addEventListeners();
        this.setTitle();

    }
     setTitle(){
        if (this.cat !=='income' ){document.getElementsByTagName('h1')[0].innerText='Расходы';}
    }
    addEventListeners() {
        this.deleteBtn.addEventListener('click',()=>{
            this.deleteCategory(this.catToDelete).then()
        })
    }

 async   CreateDebtsBlock(cat){
        let categoryList = await TableOps.getCategoryList(cat)
        console.log('categoryList: ',categoryList)
        let insertElement = document.getElementById('elements-container');
        insertElement.innerHTML='';
     for (let i = 0; i < categoryList.length; i++){
         // Создаем внешний div
         const outerDiv = document.createElement('div');
         outerDiv.className = 'col px-2 ps-0 py-2 mb-2';
         // Создаем внутренний div
         const innerDiv = document.createElement('div');
         innerDiv.className = 'border rounded px-4 py-4';
         // Создаем элемент с заголовком
         const titleDiv = document.createElement('div');
         titleDiv.className = 'block-title mb-2';
         titleDiv.setAttribute('data-cat-id',categoryList[i].id) ;// или на кнопки повесить?

         titleDiv.textContent = categoryList[i].title;
         // Создаем блок с кнопками
         const actionsDiv = document.createElement('div');
         actionsDiv.className = 'block-actions';
         // Создаем кнопку "Редактировать"
         const editButton = document.createElement('button');
         editButton.type = 'button';
         editButton.className = 'btn btn-primary mb-1 me-1';
         editButton.textContent = 'Редактировать';
         editButton.setAttribute('data-cat-id',categoryList[i].id) ;//
         editButton.addEventListener('click', ()=>{
             this.openNewRoute('/edit-category?cat='+this.cat+'&id='+categoryList[i].id);
         });
         // Создаем кнопку "Удалить"
         const deleteButton = document.createElement('button');
         deleteButton.type = 'button';
         deleteButton.className = 'btn btn-danger mb-1';
         deleteButton.textContent = 'Удалить';
         deleteButton.setAttribute('data-cat-id',categoryList[i].id) ;//
         deleteButton.addEventListener('click',async ()=>{
             this.catToDelete = categoryList[i].id;
             this.modal.show();
            // await this.deleteCategory(categoryList[i].id)
         })
         // Добавляем кнопки в блок действий
         actionsDiv.appendChild(editButton);
         actionsDiv.appendChild(deleteButton);

         // Добавляем заголовок и блок действий во внутренний div
         innerDiv.appendChild(titleDiv);
         innerDiv.appendChild(actionsDiv);

         // Добавляем внутренний div во внешний div
         outerDiv.appendChild(innerDiv);

         // Добавляем внешний div в контейнер
         insertElement.appendChild(outerDiv);

     }
     // Создаем дополнительный элемент
     const extraDiv = document.createElement('div');
     extraDiv.className = 'col px-2 py-2 ps-0 mb-2';
    // extraDiv.setAttribute('id', 'insert-category');

     const innerExtraDiv = document.createElement('div');
     innerExtraDiv.className = 'border rounded px-4 py-4 w-100 h-100';

     const button = document.createElement('button');
     button.className = 'btn w-100 h-100';
     button.setAttribute('id', 'insert-category');
     button.addEventListener('click', ()=>{

         this.openNewRoute('/create?cat='+this.cat);
     });

     const span = document.createElement('span');
     span.className = 'plus-button d-flex align-items-center justify-content-center';
     span.textContent = '+';

     // Добавляем span в кнопку
     button.appendChild(span);

     // Добавляем кнопку во внутренний div
     innerExtraDiv.appendChild(button);

     // Добавляем внутренний div во внешний div
     extraDiv.appendChild(innerExtraDiv);

     // Добавляем внешний div в контейнер
     insertElement.appendChild(extraDiv);
    }

async deleteCategory(categoryId) {
    try {
        await HttpUtils.request('/categories/'+this.cat+'/'+ categoryId, 'DELETE');
        alert('Категория успешно удалена.');
        this.CreateDebtsBlock(this.cat).then(); // Обновляем список категорий после удаления
    } catch (error) {
        console.error('Ошибка при удалении категории:', error);
        alert('Произошла ошибка при удалении категории.');
    }
}

}