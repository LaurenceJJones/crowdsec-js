import { Api } from './api'
import { CrowdsecConfig, DecisionFilter, Decision } from './types';

export class Crowdsec {
    private _config: CrowdsecConfig;
    constructor (config: CrowdsecConfig = {
        httpVerb: `http`,
        endpoint: `localhost`,
        port: `8080`,
        timeout: 2000,
        bypass: false,
        apiVersion: `v1`,
        apiKey: ``,
        userAgent: ``,
    }) {
        if (config.machine_id !== undefined || config.password !== undefined)
            config._machineReady = true;
        this._config = config
    }



    formatUrl (endpoint: string) {
        return `${this._config.httpVerb}://${this._config.endpoint}${this._config.port ? `:${this._config.port}` : ``}/${this._config.apiVersion}${endpoint[0] === `/` ? `${endpoint}` : `/${endpoint}`}`
    }

    generateRequest (endpoint: string, additionalHeaders: Record<string, string> = {}, method: string = `GET`): Request {
        return new Request(this.formatUrl(endpoint), {
            headers: {
                'Accept': 'application/json',
                ...additionalHeaders,
            },
            method,
        })
    }

    generateJSONRequest<T> (endpoint: string, body: T,additionalHeaders: Record<string, string> = {}, method: string = `POST`): Request {
        return new Request(this.formatUrl(endpoint), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...additionalHeaders,
            },
            method,
            body: JSON.stringify(body),
        })
    }

    generateQuerystring<T> (o: T): string {
        let _temp = []
        for (const [key, value] of Object.entries(o)) {
            _temp.push(`${encodeURIComponent(key)}=${encodeURIComponent(Array.isArray(value) ? value.join(`,`) : value)}`)
        }
        return _temp.join(`&`)
    }

    async testBouncerConnection (): Promise<Boolean> {
        let valid: Boolean;
        try {
            await Api(this.generateRequest(`/decisions`, {
                'X-Api-Key': this._config.apiKey,
            }, `HEAD`))
            valid = true
        } catch (err) {
            valid = false
        }
        return valid
    }

    async getDecisions (Filter?: DecisionFilter): Promise<Decision[]> {
        let _queryString = ""
        if (Filter !== undefined)
            _queryString = this.generateQuerystring<DecisionFilter>(Filter)
        const res = await Api(this.generateRequest(`/decisions?${_queryString}`))
        return await (res.json() as Promise<Decision[]>)
    }
}