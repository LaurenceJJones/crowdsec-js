import { Crowdsec } from './crowdsec'
import { WatcherConfig, WatcherLoginResponse } from './watcher.d'

export class Watcher {
    private _config: WatcherConfig;
    private _parent: Crowdsec;
    private _jwt: string;
    constructor (config: WatcherConfig = {
        username: ``,
        password: ``
    }, parent: Crowdsec) {
        if (config.username === `` || config.password === ``)
            throw new Error(`No username or password provided`)
        this._config = config
        this._parent = parent
        this._jwt = ``
    }

    async Login (): Promise<Boolean> {
        const res = await fetch(this._parent.GenerateJSONRequest(`/login`, {
            username: this._config.username,
            password: this._config.password,
        },{
            'Authorization': `Bearer ${this._jwt}`,
        }, `POST`))
        if (res.status !== 200)
            return false
        this._jwt = (await res.json() as WatcherLoginResponse).token
        return true
    }

    //Local helper to generate with bearer token
    private get (endpoint: string): Request {
        return this._parent.GenerateRequest(endpoint, {
            'Authorization': `Bearer ${this._jwt}`,
        })
    }

    //Local helper to generate with bearer token
    private postJson (endpoint: string, body: any): Request {
        return this._parent.GenerateJSONRequest(endpoint, body, {
            'Authorization': `Bearer ${this._jwt}`,
        }, `POST`)
    }

    //Local helper to generate with bearer token
    private delete (endpoint: string): Request {
        return this._parent.GenerateRequest(endpoint, {
            'Authorization': `Bearer ${this._jwt}`,
        }, `DELETE`)
    
    }

}