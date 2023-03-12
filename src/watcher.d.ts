export interface WatcherConfig {
    username: string,
    password: string,
}

export interface WatcherLoginResponse {
    token: string
    code : number
    expire: string
}