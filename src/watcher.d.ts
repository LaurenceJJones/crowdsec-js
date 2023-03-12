import { Decision } from "./bouncer.d"
import { BaseFilter } from "./shared"
export interface WatcherConfig {
    username: string
    password: string
}

export interface ValidWatcherLoginResponse {
    token: string
    code : number
    expire: string
}

export interface AlertFilter extends BaseFilter {
    scenario?: string
    since?: string
    until?: string
    simulated?: boolean
    has_active_decision?: boolean
    decision_type?: string
    limit?: number
    origin?: string
}

export interface AlertDeleteFilter extends BaseFilter {
    scenario?: string
    since?: string
    until?: string
    has_active_decision?: boolean
    altert_source?: string
}
export interface Alert {
    id: number
    uuid: string
    machine_id: string
    created_at: string
    scenario: string
    scenario_hash: string
    scenario_version: string
    message: string
    events_count: number
    start_at: string
    stop_at: string
    capacity: number
    leakspeed: string
    simulated: boolean
    events: Event[]
    remediation: boolean
    decisions: DecisionWithUUID[]
    source: Source
    meta: Meta[]
    labels: string[]
}

export interface DecisionWithUUID extends Decision {
    uuid: string
}

export interface Meta {
    key: string
    value: string
}

export interface Source {
    scope: string
    value: string
    ip: string
    range: string
    as_number: string
    as_name: string
    cn: string
    latitude: number
    longitude: number
}

export interface Event {
    timestamp: string
    meta: Meta[]
}