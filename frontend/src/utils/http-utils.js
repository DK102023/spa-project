import config from "../config/config";
import {AuthUtils} from "./auth-utils";

export class HttpUtils{
    constructor() {
    }
    static async request (url, method = "GET", useAuth = true, body = null){
        const result = {
            error: false,
            response: null
        };



        const params = {
            method: method,
            headers: {
                'Content-type' : 'application/json',
                'Accept': 'application/json'
            },
        };
        let token = null;
        if (useAuth){
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
           // console.log('getAuthInfo: ', token)
            if(token){
                params.headers['authorization'] = token;
                params.headers['x-auth-token'] = token;
            }

        }

        if (body){
            params.body = JSON.stringify(body)
        }
        let response = null;
        try{
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (e){
            result.error = true;
            return result;
        }
        if(response.status <200 || response.status >=300 ){
            result.error = true;
            if (useAuth && response.status === 401){
                // Токена нет - пользователь не авторизован
                if (!token){
                    console.log('нет токена')
                    result.redirect = '/login';
                } else{
                    //Токен устарел  - необходимо его обновить
                    console.log('токен устарел')
                    const updateTokenResult =  await AuthUtils.updateRefreshToken();
                    console.log('Зарефрешили токен', updateTokenResult)
                    if (updateTokenResult){
                        // делаем запрос на получение freelancers повторно
                        return this.request(url,method, useAuth, body);

                    } else{
                        result.redirect = '/login';
                    }

                }

            }
        }

        return result;
    }
}