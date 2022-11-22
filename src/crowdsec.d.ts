export interface CrowdsecConfig {
    httpVerb: string,
    host: string,
    apiVersion: string,
    port: Number | string,
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