"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
async function Api(request) {
    const response = await fetch(request);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response;
}
exports.Api = Api;
