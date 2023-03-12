"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watcher = void 0;
class Watcher {
    constructor(config = {
        username: ``,
        password: ``
    }, parent) {
        if (config.username === `` || config.password === ``)
            throw new Error(`No username or password provided`);
        this._config = config;
        this._parent = parent;
        this._jwt = ``;
    }
    async Login() {
        const res = await fetch(this._parent.GenerateJSONRequest(`/login`, {
            username: this._config.username,
            password: this._config.password,
        }, {
            'Authorization': `Bearer ${this._jwt}`,
        }, `POST`));
        if (res.status !== 200)
            return false;
        this._jwt = (await res.json()).token;
        return true;
    }
    //Local helper to generate with bearer token
    get(endpoint) {
        return this._parent.GenerateRequest(endpoint, {
            'Authorization': `Bearer ${this._jwt}`,
        });
    }
    //Local helper to generate with bearer token
    postJson(endpoint, body) {
        return this._parent.GenerateJSONRequest(endpoint, body, {
            'Authorization': `Bearer ${this._jwt}`,
        }, `POST`);
    }
    //Local helper to generate with bearer token
    delete(endpoint) {
        return this._parent.GenerateRequest(endpoint, {
            'Authorization': `Bearer ${this._jwt}`,
        }, `DELETE`);
    }
}
exports.Watcher = Watcher;
