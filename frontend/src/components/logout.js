import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute; // получение ф-ции переданной в экземпляр класса из router.js


        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.logout().then();
    }


    async logout(){

        await  HttpUtils.request('/logout','POST', false,{
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
        });



        AuthUtils.removeAuthInfo();

        this.openNewRoute('/login'); // исп-е переданной ф-ции
    }


}