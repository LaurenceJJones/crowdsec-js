"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bouncer = void 0;
class Bouncer {
    constructor(config = {
        apiKey: ``,
        userAgent: `crowdsec/crowdsec-js`
    }, parent) {
        if (config.apiKey === ``)
            throw new Error(`No API key provided`);
        this._config = config;
        this._parent = parent;
    }
    //Local helper to generate with api key
    get(endpoint) {
        return this._parent.GenerateRequest(endpoint, {
            'X-Api-Key': this._config.apiKey,
        });
    }
    async TestBouncerConnection() {
        let valid;
        try {
            await fetch(this._parent.GenerateRequest(`/decisions`, {
                'X-Api-Key': this._config.apiKey,
            }, `HEAD`));
            valid = true;
        }
        catch (err) {
            valid = false;
        }
        return valid;
    }
    async GetDecisions(Filter) {
        let _queryString = "";
        if (Filter !== undefined)
            _queryString = this._parent.GenerateQuerystring(Filter);
        const res = await fetch(this.get(`/decisions?${_queryString}`));
        return await res.json();
    }
    async IsIpBanned(ip) {
        const res = await fetch(this.get(`/decisions?ip=${ip}`));
        const _decisions = await res.json();
        return _decisions.length > 0;
    }
}
exports.Bouncer = Bouncer;
