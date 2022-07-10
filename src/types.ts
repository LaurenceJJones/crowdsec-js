export interface CrowdsecConfig {
    httpVerb: string,
    endpoint: string,
    timeout: Number,
    bypass: Boolean,
    apiKey: string,
    userAgent: string,
    apiVersion: string,
    port: Number | string,
    machine_id?: string,
    password?: string,
    _machineReady?: Boolean,
}

export interface MachineLogin {
    machineId: string,
    password: string,
    scenarios?: string[],
}

export interface MachineLoginValidResponse {
    code: Number;
    expire: string;
    token: string;
}

export interface DecisionFilter {
    scope?: string;
    value?: string;
    type?: string;
    ip?: string;
    range?: string;
    contains?: Boolean;
    origins?: string;
    scenarios_containing?: string | string[];
    scenarios_not_containing?: string | string[];
}

export interface Decision {
    id: Number;
    origin: string;
    type: string;
    scope: string;
    value: string;
    duration: string;
    until: string;
    scenario: string;
    simulated: Boolean;
}