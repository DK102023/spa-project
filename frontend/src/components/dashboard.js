import {AuthUtils} from "../utils/auth-utils";

export class Dashboard{
    constructor(openNewRoute) {
        console.log('DASHBOARD');
        this.openNewRoute = openNewRoute; // получение ф-ции переданной в экземпляр класса из router.js
        if (!AuthUtils.getAuthInfo()){
            this.openNewRoute('/login');
        }
    }
}