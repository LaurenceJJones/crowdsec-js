import { Crowdsec } from './crowdsec'
import { WatcherConfig, ValidWatcherLoginResponse, Alert, AlertFilter, AlertDeleteFilter } from './watcher.d'

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
        this._jwt = (await res.json() as ValidWatcherLoginResponse).token
        return true
    }

    async GetAlerts (Filter?: AlertFilter): Promise<Alert[]> {
        try {
            let _queryString = ""
            if (Filter !== undefined)
                _queryString = this._parent.GenerateQuerystring(Filter)
            const res = await this.fetchWrapper(this.get(`/alerts?${_queryString}`))
            return await (res.json() as Promise<Alert[]>)
        } catch (error) {
            console.error(error)
        }
        return []
    }

    async GetAlert (id: number): Promise<Alert> {
        try {
            const res = await this.fetchWrapper(this.get(`/alerts/${id}`))
            return await (res.json() as Promise<Alert>)
        } catch (error) {
            console.error(error)
        }
        return {} as Alert
    }

    async DeleteAlerts (Filter?: AlertDeleteFilter): Promise<Boolean> {
        try {
            let _queryString = ""
            if (Filter !== undefined)
                _queryString = this._parent.GenerateQuerystring(Filter)
            const res = await this.fetchWrapper(this.delete(`/alerts?${_queryString}`))
            return res.status === 200
        } catch (error) {
            console.error(error)
        }
        return false
    }

    async DeleteAlert (id: number): Promise<Boolean> {
        try {
            const res = await this.fetchWrapper(this.delete(`/alerts/${id}`))
            return res.status === 200
        } catch (error) {
            console.error(error)
        }
        return false
    }

    //Local helper to handle 401s
    //Since we don't have a refresh token, we just relogin
    private async fetchWrapper (req: Request): Promise<Response> {
        for (let i = 0; i < 5; i++) {
            const res = await fetch(req)
            if (res.status === 401) {
                await this.Login()
                continue
            }
            return res
        }
        throw new Error(`Failed to fetch after 5 attempts`)
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