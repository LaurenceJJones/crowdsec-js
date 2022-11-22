import { CrowdsecConfig } from './crowdsec.d';
import { Bouncer } from './bouncer'
import { BouncerConfig } from './bouncer.d';

export class Crowdsec {
    private _config: CrowdsecConfig;
    constructor (config: CrowdsecConfig = {
        httpVerb: `http`,
        host: `localhost`,
        port: `8080`,
        apiVersion: `v1`
    }) {
        this._config = config
    }

    formatUrl (endpoint: string) {
        return `${this._config.httpVerb}://${this._config.host}${this._config.port ? `:${this._config.port}` : ``}/${this._config.apiVersion}${endpoint[0] === `/` ? `${endpoint}` : `/${endpoint}`}`
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

    bouncer(Config: BouncerConfig): Bouncer {
        return new Bouncer(Config)
    }
}