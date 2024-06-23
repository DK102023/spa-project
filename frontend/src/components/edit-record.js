import { HttpUtils } from "../utils/http-utils";
import { TableOps } from "../utils/table-ops";
import {AuthUtils} from "../utils/auth-utils";
// оптимизирован
export class EditRecord {
    constructor(openNewRoute, typeOps) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo()) {
            this.openNewRoute('/login');
        }
        this.typeOps = typeOps;

        const searchParams = new URLSearchParams(window.location.search);
        this.id = searchParams.get('id');
        this.createOps = searchParams.get('create');
        console.log('createOps: ', this.createOps);

        this.initElements();
        this.setTitle();
        TableOps.printBalance().then();

        if (this.typeOps == 1) {
            this.getEditData(this.id).then();
        } else {
            this.elements.saveBtn.innerText = "Создать";
            this.buildCategoryList(this.createOps, this.elements.categoryInput).then();
            this.elements.typeInput.value = this.createOps;
            this.elements.typeInput.disabled = true;
        }

        this.addEventListeners();
    }

    setTitle() {
        let pipeIndex = this.elements.pageTitle.indexOf('|');
        let pageTitle = pipeIndex !== -1 ? this.elements.pageTitle.substring(0, pipeIndex).trim() : this.elements.pageTitle;
        document.getElementsByTagName('h1')[0].innerText = pageTitle;
    }

    initElements() {
        this.elements = {
            typeInput: document.getElementById('ops-type'),
            categoryInput: document.getElementById('categorySelect'),
            amountInput: document.querySelector('input[placeholder="Сумма в $..."]'),
            dateInput: document.querySelector('input[placeholder="Дата..."]'),
            commentInput: document.querySelector('input[placeholder="Комментарий..."]'),
            cancelBtn: document.getElementById('cancel-ops'),
            saveBtn: document.getElementById('edit-save'),
            pageTitle: document.title
        };
    }

    addEventListeners() {
        this.elements.cancelBtn.addEventListener('click', () => this.openNewRoute('/balance'));
        this.elements.saveBtn.addEventListener('click', () => {
            if (this.isFormValid()) {
                this.saveEditData(this.id, this.typeOps).then();
            } else {
                alert('Пожалуйста, заполните все поля формы.');
            }
        });
    }

    isFormValid() {
        const { typeInput, categoryInput, amountInput, dateInput, commentInput } = this.elements;
        return typeInput.value && categoryInput.value && amountInput.value && dateInput.value && commentInput.value;
    }

    async getEditData(id) {
        let result = await HttpUtils.request('/operations/' + id);
        console.log(result.response);
        if (result.response) {
            this.fillForm(result.response);
            if (this.typeOps == 1) {
                this.elements.typeInput.disabled = true;
            }
        }
    }

    async buildCategoryList(dataType, categoryInput) {
        try {
            const list = await TableOps.getCategoryList(dataType);
            this.buildCategoryOptions(categoryInput, list);
            return list;
        } catch (error) {
            console.error('Ошибка получения списка категорий:', error);
            return null;
        }
    }

    async fillForm(data) {
        const { typeInput, categoryInput, amountInput, dateInput, commentInput } = this.elements;

        const list = await this.buildCategoryList(data.type, categoryInput);
        if (!list) return;

        typeInput.value = data.type || '';
        categoryInput.value = await this.findCategory(data.type, data.category) || '';
        amountInput.value = data.amount || '';
        dateInput.value = data.date || '';
        commentInput.value = data.comment || '';
    }

    buildCategoryOptions(selectElement, options) {
        options.forEach(option => {
            let optionElement = document.createElement('option');
            optionElement.value = option.id;
            optionElement.textContent = option.title;
            selectElement.appendChild(optionElement);
        });
    }

    async findCategory(type, category) {
        const categoryList = await HttpUtils.request(`/categories/${type}/`);
        const categories = categoryList.response;
        const matchingCategory = categories.find(cat => cat.title === category);

        if (!matchingCategory) {
            alert('Проверьте правильность ввода категории!');
            return;
        }

        return matchingCategory.id;
    }

    async saveEditData(id, typeOps) {
        const { typeInput, categoryInput, amountInput, dateInput, commentInput } = this.elements;

        if (typeOps == 1) {
            const data = {
                type: typeInput.value,
                category_id: parseInt(categoryInput.value, 10),
                amount: amountInput.value,
                date: dateInput.value,
                comment: commentInput.value
            };
            await HttpUtils.request('/operations/' + id, 'PUT', true, data);
            this.openNewRoute('/balance');
        } else if (typeOps == 2 && (this.createOps === 'expense' || this.createOps === 'income')) {
            const data = {
                type: this.createOps,
                category_id: parseInt(categoryInput.value, 10),
                amount: amountInput.value,
                date: dateInput.value,
                comment: commentInput.value
            };
            await HttpUtils.request('/operations/', 'POST', true, data);
            this.openNewRoute('/balance');
        }
    }
}
