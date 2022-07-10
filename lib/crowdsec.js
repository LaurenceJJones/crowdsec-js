"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crowdsec = void 0;
const api_1 = require("./api");
class Crowdsec {
    constructor(config = {
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
        this._config = config;
    }
    formatUrl(endpoint) {
        return `${this._config.httpVerb}://${this._config.endpoint}${this._config.port ? `:${this._config.port}` : ``}/${this._config.apiVersion}${endpoint[0] === `/` ? `${endpoint}` : `/${endpoint}`}`;
    }
    generateRequest(endpoint, additionalHeaders = {}, method = `GET`) {
        return new Request(this.formatUrl(endpoint), {
            headers: {
                'Accept': 'application/json',
                ...additionalHeaders,
            },
            method,
        });
    }
    generateJSONRequest(endpoint, body, additionalHeaders = {}, method = `POST`) {
        return new Request(this.formatUrl(endpoint), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...additionalHeaders,
            },
            method,
            body: JSON.stringify(body),
        });
    }
    generateQuerystring(o) {
        let _temp = [];
        for (const [key, value] of Object.entries(o)) {
            _temp.push(`${encodeURIComponent(key)}=${encodeURIComponent(Array.isArray(value) ? value.join(`,`) : value)}`);
        }
        return _temp.join(`&`);
    }
    async testBouncerConnection() {
        let valid;
        try {
            await (0, api_1.Api)(this.generateRequest(`/decisions`, {
                'X-Api-Key': this._config.apiKey,
            }, `HEAD`));
            valid = true;
        }
        catch (err) {
            valid = false;
        }
        return valid;
    }
    async getDecisions(Filter) {
        let _queryString = "";
        if (Filter !== undefined)
            _queryString = this.generateQuerystring(Filter);
        const res = await (0, api_1.Api)(this.generateRequest(`/decisions?${_queryString}`));
        return await res.json();
    }
}
exports.Crowdsec = Crowdsec;
