import {AuthUtils} from "../utils/auth-utils";
import config from "../config/config";
import {HttpUtils} from "../utils/http-utils";

export class SignUp{
    constructor(contentElement,openNewRoute) {
        this.openNewRoute = openNewRoute; // получение ф-ции переданной в экземпляр класса из router.js
        this.contentElement = contentElement;
        this.contentElement.style = 'flex-direction: column;';
        console.log('SIGNUP!!!');
        this.nameElement =  document.getElementById('name');
        this.emailElement =  document.getElementById('email');
        this.passwordElement =  document.getElementById('password');
        this.passwordRepeatElement =  document.getElementById('password-repeat');
        this.commonErrorElement =  document.getElementById('common-error');
        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }

    validateForm(){
        let isValid = true;


        if (this.nameElement.value && this.checkName(this.nameElement.value) ){
            this.nameElement.classList.remove('is-invalid');
        }  else{
            this.nameElement.classList.add('is-invalid');
            isValid = false;
        }


        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)){
            this.emailElement.classList.remove('is-invalid');
        }  else{
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }
        //Minimum eight characters, at least one letter and one number:
        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) ){
            this.passwordElement.classList.remove('is-invalid');
            //console.log(this.passwordElement.value , this.passwordElement.password)
        }  else{
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.passwordElement.value === this.passwordRepeatElement.value ){
            this.passwordRepeatElement.classList.remove('is-invalid');
        }  else{
            this.passwordRepeatElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;

    }
    async signUp(){

        this.commonErrorElement.style.display = 'none';
        if  (this.validateForm()){

            let fio =  this.nameElement.value.split(' ');
            let name = fio[0];
            let lastName = fio[fio.length-1];
            console.log(name);
            console.log(lastName);

            const result = await  HttpUtils.request('/signup','POST', false,{
                name: name,
                lastName: lastName,
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value,
            });
            console.log(result.response)
            //request
            //const response = await fetch('http://localhost:3000/api/signup',{
           /* const response = await fetch(config.host + config.api,{
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json',
                    'Accept': 'application/json'
                },
                body : JSON.stringify({
                    name: name,
                    lastName: lastName,
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    passwordRepeat: this.passwordRepeatElement.value,
                })
            });
            const result = await response.json();
            console.log(result) */

            if (result.error ){
                //user: ekaterina.ivanova@gmail.com  pwd: Ek4tIv#702
                this.commonErrorElement.style.display = 'block';
                return
            }


            //Т.к в ответ сервер не отдает ключей - перебрасываем на страницу входа
            this.openNewRoute('/login'); // исп-е переданной ф-ции
        }


    }
    checkName(fullName){
        // Шаг 1: Проверка на наличие только русских букв и пробелов
        const regexRussianLetters = /^[а-яА-ЯёЁ\s]+$/;
        if (!regexRussianLetters.test(fullName)) {
            return false;
        }

        // Шаг 2: Проверка, что каждое слово начинается с заглавной буквы
        const words = fullName.split(' ');
        for (let word of words) {
            if (word.length > 0 && word[0] !== word[0].toUpperCase()) {
                return false;
            }
        }

        return true;

    }


}