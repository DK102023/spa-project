import {Dashboard} from "./components/dashboard";
import {Login} from "./components/login";
import {SignUp} from "./components/signup";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Main',
                filePathTemplate: '/templates/main.html',
                useLayout: '/templates/layout.html',
                load: async () =>{
                    await this.loadScript('/js/chart.min.js');
                    //this.initCharts();
                    new Dashboard(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/404',
                title: 'Страница 404',
                filePathTemplate: '/templates/404.html',
                useLayout:  false,
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                useLayout:  false,
                load: () =>{
                    new Login(this.contentPageElement,this.openNewRoute.bind(this));
                },
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/signup.html', // Пути указаны для сборки!
                useLayout:  false,
                load: () =>{
                    new SignUp(this.contentPageElement,this.openNewRoute.bind(this));
                },
            },
            {
                route: '/debts',
                title: 'Доходы',
                filePathTemplate: '/templates/debts.html', // Пути указаны для сборки!
                useLayout: '/templates/layout.html',
                load: () =>{
                    //    new SignUp();
                },
            },
            {
                route: '/balance',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/balance.html', // Пути указаны для сборки!
                useLayout: '/templates/layout.html',
                load: () =>{
                    //    new SignUp();
                },
            },
            {
                route: '/credits',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/credits.html', // Пути указаны для сборки!
                useLayout: '/templates/layout.html',
                load: () =>{
                    //    new SignUp();
                },
            },/**/
        ];
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    async activateRoute() {
        const urlRoute = window.location.pathname; //Текущее содержимое строки url
        const newRoute = this.routes.find(item => item.route === urlRoute);// Выбираем наш роут,  которому соответствует текущее содержимое url
        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin';
            }
            if (newRoute.filePathTemplate) {
                this.contentPageElement = document.getElementById('content');
                //console.log(this.contentPageElement.innerHTML)
                if (newRoute.useLayout) {

                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    this.contentPageElement =  document.getElementById('content-layout');
                    document.body.classList.add('sidebar-mini');
                    document.body.classList.add('layout-fixed');
                } else {
                    document.body.classList.remove('sidebar-mini');
                    document.body.classList.remove('layout-fixed');
                }
                this.contentPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }


            if(newRoute.load && typeof newRoute.load === 'function'){
                await newRoute.load(); //+await
            }
        } else {
            console.log('Страница не найдена');
            window.location.href = '/404';
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(script);
            script.onerror = () => reject(new Error(`Failed to load script ${src}`));
            document.head.append(script);
        });
    }


    async openNewRoute(url){
        const currentRoute = window.location.pathname; //Текущее содержимое строки url
        history.pushState({}, '', url); // вручную передаем в поисковую строку ссылку на страницу
        //console.log(url);
        await this.activateRoute(null, currentRoute); // первый параметр предусмотрен для событий
    }


}