import { BouncerConfig, Decision, DecisionFilter } from './bouncer.d'
import { Crowdsec } from './crowdsec'
export class Bouncer {
    private _config: BouncerConfig;
    private _parent: Crowdsec;
    constructor (config: BouncerConfig = {
        apiKey: ``,
        userAgent: `crowdsec/crowdsec-js`
    }, parent: Crowdsec) {
        if (config.apiKey === ``)
            throw new Error(`No API key provided`)
        this._config = config
        this._parent = parent
    }
    //Local helper to generate with api key
    Get (endpoint: string): Request {
        return this._parent.GenerateRequest(endpoint, {
            'X-Api-Key': this._config.apiKey,
        })
    }
    //Local helper to generate with api key
    GetJson<T> (endpoint: string, body: T): Request {
        return this._parent.GenerateJSONRequest(endpoint, body, {
            'X-Api-Key': this._config.apiKey,
        })
    }

    async TestBouncerConnection (): Promise<Boolean> {
        let valid: Boolean;
        try {
            await fetch(this._parent.GenerateRequest(`/decisions`, {
                'X-Api-Key': this._config.apiKey,
            }, `HEAD`))
            valid = true
        } catch (err) {
            valid = false
        }
        return valid
    }

    async GetDecisions (Filter?: DecisionFilter): Promise<Decision[]> {
        let _queryString = ""
        if (Filter !== undefined)
            _queryString = this._parent.GenerateQuerystring(Filter)
        const res = await fetch(this.Get(`/decisions?${_queryString}`))
        return await (res.json() as Promise<Decision[]>)
    }

    async IsIpBanned (ip: string): Promise<Boolean> {
        const res = await fetch(this.Get(`/decisions?ip=${ip}`))
        const _decisions = await (res.json() as Promise<Decision[]>)
        return _decisions.length > 0
    }
}