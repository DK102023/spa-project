import {Dashboard} from "./components/dashboard";
import {Login} from "./components/login";
import {SignUp} from "./components/signup";
import {Logout} from "./components/logout";
import {Balance} from "./components/balance";
import MenuUtils from "./utils/menu-utils";
import {EditRecord} from "./components/edit-record";
import {Debts} from "./components/debts";
import {CreateCategory} from "./components/create-category";

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
                    console.log('chart.min.js loaded');
                    new Dashboard(this.openNewRoute.bind(this));
                    MenuUtils.setActiveMenuItem('/');
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
                route: '/logout',
                load: ()=>{
                    new Logout(this.openNewRoute.bind(this));// передаем ф-ю в экземпляр класса Logout
                }
            },
            {
                route: '/debts',
                title: 'Доходы',
                filePathTemplate: '/templates/debts.html', // Пути указаны для сборки!
                useLayout: '/templates/layout.html',
                load: () =>{
                    new Debts(this.openNewRoute.bind(this));
                    MenuUtils.setActiveMenuItem('/debts');
                },
            },
            {
                route: '/balance',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/balance.html', // Пути указаны для сборки!
                useLayout: '/templates/layout.html',
                load: () =>{
                    new Balance(this.openNewRoute.bind(this));
                    MenuUtils.setActiveMenuItem('/balance');
                },
            },
            {
                route: '/credits',
                title: 'Расходы ',
                filePathTemplate: '/templates/debts.html', // Пути указаны для сборки!
                useLayout: '/templates/layout.html',
                load: () =>{
                    //    new SignUp();
                    new Debts(this.openNewRoute.bind(this),'expense');
                    MenuUtils.setActiveMenuItem('/credits');
                },
            },
            {
                route: '/edit',
                title: 'Редактирование дохода/расхода ',
                filePathTemplate: '/templates/edit.html', // Пути указаны для сборки!
                useLayout: '/templates/layout.html',
                load: () =>{
                        new EditRecord(this.openNewRoute.bind(this),1);
                   // MenuUtils.setActiveMenuItem('/credits');
                },
            },
            {
                route: '/create-action',
                title: 'Создание дохода/расхода ',
                filePathTemplate: '/templates/edit.html', // Пути указаны для сборки!
                useLayout: '/templates/layout.html',
                load: () =>{
                    new EditRecord(this.openNewRoute.bind(this),2);
                    // MenuUtils.setActiveMenuItem('/credits');
                },
            },
            {
                route: '/create',
                title: 'Создание категории ',
                filePathTemplate: '/templates/create-cat.html', // Пути указаны для сборки!
                useLayout: '/templates/layout.html',
                load: () =>{
                    new CreateCategory(this.openNewRoute.bind(this),1);// 1-создать
                    // MenuUtils.setActiveMenuItem('/credits');
                },
            },
            {
                route: '/edit-category',
                title: 'Редактирование категории ',
                filePathTemplate: '/templates/create-cat.html', // Пути указаны для сборки!
                useLayout: '/templates/layout.html',
                load: () =>{
                   // new CreateCategory(this.openNewRoute.bind(this),1);
                   new CreateCategory(this.openNewRoute.bind(this),2 ); //2 -редактировать
                    // MenuUtils.setActiveMenuItem('/credits');
                },
            },
        ];
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }
    async openNewRoute(url){
        const currentRoute = window.location.pathname; //Текущее содержимое строки url
        history.pushState({}, '', url); // вручную передаем в поисковую строку ссылку на страницу
        //console.log(url);
        await this.activateRoute(null, currentRoute); // первый параметр предусмотрен для событий
    }

    //16062024
    async clickHandler(e) {

        // console.log('etarget = ',e.target);
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();
            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, ''); // удаляем часть строки с http:
            // if (!url || url.href === '/#' || url.startsWith('javascript:void(0)') ) {
            if (!url ||  (currentRoute === url.replace('#','')) || url.startsWith('javascript:void(0)') ) {
                return;
            }
            await this.openNewRoute(url);
        }

    }
    //

   // async activateRoute() {
    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);// Выбираем наш роут,
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove(); // удаляем стили текущего роута

                });
            }
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove(); // удаляем скрипты текущего роута

                });
            }
            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }}
    // - изм 16062024
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
                    const userString = localStorage.getItem("user");
                    const user = JSON.parse(userString);
                    const name = user.name;
                    const lastName = user.lastName;
                    document.getElementById('user-name').innerText = name + ' ' + lastName ;
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

   /* loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(script);
            script.onerror = () => reject(new Error(`Failed to load script ${src}`));
            document.head.append(script);
        });
    }*/
    loadScript(src) {
        return new Promise((resolve, reject) => {
            console.log(`Loading script: ${src}`);
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                console.log(`Загружен скрипт: ${src}`);
                resolve(script);
            };
            script.onerror = () => {
                console.error(`Проблема с загрузкой скрипта: ${src}`);
                reject(new Error(`Проблема с загрузкой скрипта: ${src}`));
            };
            document.head.append(script);
        });
    }




}