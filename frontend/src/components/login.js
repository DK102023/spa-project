import {AuthUtils} from "../utils/auth-utils";
import config from "../config/config";
import {HttpUtils} from "../utils/http-utils";

export class Login{
    constructor(contentElement,openNewRoute ) {
        this.openNewRoute = openNewRoute; // получение ф-ции переданной в экземпляр класса из router.js
        this.contentElement = contentElement;
        this.contentElement.style = 'flex-direction: column;';
        console.log('LOGIN!!!');
        if(localStorage.getItem(AuthUtils.accessTokenKey)){
            return this.openNewRoute('/'); // если залогинен - переход на главную
        }

        this.emailElement =  document.getElementById('email');
        this.passwordElement =  document.getElementById('password');
        this.rememberMeElement =  document.getElementById('remember');
        this.commonErrorElement =  document.getElementById('common-error');
        document.getElementById('process-button').addEventListener('click', this.login.bind(this));

    }

    validateForm(){
        let isValid = true;
        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)){
            this.emailElement.classList.remove('is-invalid');
        }  else{
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordElement.value ){
            this.passwordElement.classList.remove('is-invalid');
            //console.log(this.passwordElement.value , this.passwordElement.password)
        }  else{
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }
        console.log('isValid = '+ isValid)
        return isValid;
    }
    async login(){
        const addressToFetch = config.host + config.api + '/login'
        console.log(addressToFetch)
        this.commonErrorElement.style.display = 'none';
        if  (this.validateForm()){
            //request
            const result = await  HttpUtils.request('/login','POST', false,{
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked
            });
           // const response = await fetch('http://localhost:3000/api/login',{
           /* const response = await fetch(addressToFetch,{
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json',
                    'Accept': 'application/json'
                },
                body : JSON.stringify({
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberMeElement.checked
                })
            });
            const result = await response.json();*/
           /* console.log('оТВЕТ ПОСЛЕ ЛОГИНА: ', result)
            console.log('result.error: ', result.error)
            console.log('result.response: ', result.response)
            console.log('result.response.response ', result.response.response)
            console.log('result.response.tokens.refreshToken ', result.response.tokens.refreshToken)
            console.log('result.response.user.name', result.response.user.name)
            console.log('result.response.user.id', result.response.user.id)*/

           // if (result.error || !result.tokens || !result.user){
            if (result.error || !result.response || (result.response.response && !result.response.tokens.refreshToken || !result.response.user.name || !result.response.user.id) ){
                //user: test@itlogia.ru  pwd: 12345678Qq
                console.log (result.tokens)
                this.commonErrorElement.style.display = 'block';
                return
            }

            AuthUtils.setAuthInfo(result.response.tokens,result.response.user );
            /*  localStorage.setItem('accessToken', result.accessToken);
              localStorage.setItem('refreshToken', result.refreshToken);
              localStorage.setItem('userInfo', JSON.stringify({name: result.name, id: result.id}));*/
            this.openNewRoute('/'); // исп-е переданной ф-ции
        }

    }

}