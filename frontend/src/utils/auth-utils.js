import config from "../config/config";

export class AuthUtils {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoTokenKey = 'user';

    static setAuthInfo(tokens, userInfo) {
        const { accessToken, refreshToken } = tokens;
        console.log('Setting accessToken:', accessToken);
        console.log('Setting refreshToken:', refreshToken);
        console.log('Setting userInfo:', userInfo);
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
    }

    static removeAuthInfo() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    static getAuthInfo(key = null) {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            if (key === this.userInfoTokenKey) {
                return JSON.parse(localStorage.getItem(key));
            } else {
                return localStorage.getItem(key);
            }
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoTokenKey]: JSON.parse(localStorage.getItem(this.userInfoTokenKey))
            };
        }
    }

    static async updateRefreshToken() {
        let result = false;
        const refreshToken = this.getAuthInfo(this.refreshTokenKey);
        if (refreshToken) {
            try {
                const response = await fetch(config.api + '/refresh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ refreshToken: refreshToken })
                });
                console.log('refreshToken:', refreshToken);
                console.log('response:', response);

                if (response && response.status === 200) {
                    const data = await response.json();
                    if (data && !data.error) {
                        const tokens = data.tokens; // Извлекаем токены из вложенного объекта
                        console.log('tokens.accessToken:', tokens.accessToken);
                        console.log('tokens.refreshToken:', tokens.refreshToken);
                        console.log('UserInfo before setting:', this.getAuthInfo(this.userInfoTokenKey));
                        this.setAuthInfo(tokens, this.getAuthInfo(this.userInfoTokenKey));
                        console.log('UserInfo after setting:', this.getAuthInfo(this.userInfoTokenKey));
                        result = true;
                    }
                }
            } catch (error) {
                console.error('Error refreshing token:', error);
            }
        }

        if (!result) {
            this.removeAuthInfo();
        }

        return result;
    }

    constructor() {}
}
