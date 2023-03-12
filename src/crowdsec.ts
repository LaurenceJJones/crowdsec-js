import { CrowdsecConfig } from './crowdsec.d';
import { Bouncer } from './bouncer'
import { BouncerConfig } from './bouncer.d';

export class Crowdsec {
    private _config: CrowdsecConfig;
    constructor (config: CrowdsecConfig = {
        scheme: `http`,
        host: `localhost`,
        port: `8080`,
        apiVersion: `v1`
    }) {
        this._config = config
    }

    FormatUrl (endpoint: string) {
        return `${this._config.scheme}://${this._config.host}${this._config.port ? `:${this._config.port}` : ``}/${this._config.apiVersion}${endpoint[0] === `/` ? `${endpoint}` : `/${endpoint}`}`
    }

    GenerateRequest (endpoint: string, additionalHeaders: Record<string, string> = {}, method: string = `GET`): Request {
        return new Request(this.FormatUrl(endpoint), {
            headers: {
                'Accept': 'application/json',
                ...additionalHeaders,
            },
            method,
        })
    }

    GenerateJSONRequest<T> (endpoint: string, body: T,additionalHeaders: Record<string, string> = {}, method: string = `POST`): Request {
        return new Request(this.FormatUrl(endpoint), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...additionalHeaders,
            },
            method,
            body: JSON.stringify(body),
        })
    }

    GenerateQuerystring (o: Object): string {
        let _temp = []
        for (const [key, value] of Object.entries(o)) {
            _temp.push(`${encodeURIComponent(key)}=${encodeURIComponent(Array.isArray(value) ? value.join(`,`) : value)}`)
        }
        return _temp.join(`&`)
    }

    Bouncer(Config: BouncerConfig): Bouncer {
        return new Bouncer(Config, this)
    }
}