"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crowdsec = void 0;
const bouncer_1 = require("./bouncer");
const watcher_1 = require("./watcher");
class Crowdsec {
    constructor(config = {
        scheme: `http`,
        host: `localhost`,
        port: `8080`,
        apiVersion: `v1`
    }) {
        this._config = config;
    }
    FormatUrl(endpoint) {
        return `${this._config.scheme}://${this._config.host}${this._config.port ? `:${this._config.port}` : ``}/${this._config.apiVersion}${endpoint[0] === `/` ? `${endpoint}` : `/${endpoint}`}`;
    }
    GenerateRequest(endpoint, additionalHeaders = {}, method = `GET`) {
        return new Request(this.FormatUrl(endpoint), {
            headers: {
                'Accept': 'application/json',
                ...additionalHeaders,
            },
            method,
        });
    }
    GenerateJSONRequest(endpoint, body, additionalHeaders = {}, method = `POST`) {
        return new Request(this.FormatUrl(endpoint), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...additionalHeaders,
            },
            method,
            body: JSON.stringify(body),
        });
    }
    GenerateQuerystring(o) {
        let _temp = [];
        for (const [key, value] of Object.entries(o)) {
            _temp.push(`${encodeURIComponent(key)}=${encodeURIComponent(Array.isArray(value) ? value.join(`,`) : value)}`);
        }
        return _temp.join(`&`);
    }
    Bouncer(Config) {
        return new bouncer_1.Bouncer(Config, this);
    }
    Watcher(Config) {
        return new watcher_1.Watcher(Config, this);
    }
}
exports.Crowdsec = Crowdsec;
