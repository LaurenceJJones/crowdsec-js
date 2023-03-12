import { BaseFilter } from "./shared";
export interface BouncerConfig {
    apiKey: string,
    userAgent?: string,
}

export interface DecisionFilter extends BaseFilter {
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