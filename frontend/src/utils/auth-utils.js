export class AuthUtils{
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoTokenKey = 'user';

    static setAuthInfo(tokens,userInfo){
        const { accessToken, refreshToken } = tokens;
        console.log(accessToken);
        console.log(refreshToken)
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
       /* localStorage.setItem(this.accessTokenKey, JSON.stringify(tokens)[0]);
        localStorage.setItem(this.refreshTokenKey, JSON.stringify(tokens)[1]);*/
        localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
    }
    static removeAuthInfo(){
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }
    constructor() {

    }
}