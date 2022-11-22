import { BouncerConfig, Decision, DecisionFilter } from './bouncer.d'
export class Bouncer {
    private _config: BouncerConfig;
    constructor (config: BouncerConfig = {
        apiKey: ``,
    }) {
        this._config = config
    }
    generateQuerystring (o: DecisionFilter): string {
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
            _queryString = this.generateQuerystring(Filter)
        const res = await Api(this.generateRequest(`/decisions?${_queryString}`))
        return await (res.json() as Promise<Decision[]>)
    }
}