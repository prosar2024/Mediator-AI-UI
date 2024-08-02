export default class SessionHandler {
    static setSessionItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static getSessionItem(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    static removeSessionItem(key) {
        localStorage.removeItem(key);
    }
}
