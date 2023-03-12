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
    async GetAlerts(Filter) {
        try {
            let _queryString = "";
            if (Filter !== undefined)
                _queryString = this._parent.GenerateQuerystring(Filter);
            const res = await this.fetchWrapper(this.get(`/alerts?${_queryString}`));
            return await res.json();
        }
        catch (error) {
            console.error(error);
        }
        return [];
    }
    async GetAlert(id) {
        try {
            const res = await this.fetchWrapper(this.get(`/alerts/${id}`));
            return await res.json();
        }
        catch (error) {
            console.error(error);
        }
        return {};
    }
    async DeleteAlerts(Filter) {
        try {
            let _queryString = "";
            if (Filter !== undefined)
                _queryString = this._parent.GenerateQuerystring(Filter);
            const res = await this.fetchWrapper(this.delete(`/alerts?${_queryString}`));
            return res.status === 200;
        }
        catch (error) {
            console.error(error);
        }
        return false;
    }
    async DeleteAlert(id) {
        try {
            const res = await this.fetchWrapper(this.delete(`/alerts/${id}`));
            return res.status === 200;
        }
        catch (error) {
            console.error(error);
        }
        return false;
    }
    //Local helper to handle 401s
    //Since we don't have a refresh token, we just relogin
    async fetchWrapper(req) {
        for (let i = 0; i < 5; i++) {
            const res = await fetch(req);
            if (res.status === 401) {
                await this.Login();
                continue;
            }
            return res;
        }
        throw new Error(`Failed to fetch after 5 attempts`);
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
