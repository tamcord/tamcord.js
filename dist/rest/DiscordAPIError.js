// @ts-nocheck
'use strict';
/**
 * Represents an error from the Discord API.
 * @extends Error
 */
class DiscordAPIError extends Error {
    constructor(error, status, request) {
        var _a, _b, _c;
        super();
        const flattened = this.constructor.flattenErrors((_a = error.errors) !== null && _a !== void 0 ? _a : error).join('\n');
        this.name = 'DiscordAPIError';
        this.message = error.message && flattened ? `${error.message}\n${flattened}` : (_b = error.message) !== null && _b !== void 0 ? _b : flattened;
        /**
         * The HTTP method used for the request
         * @type {string}
         */
        this.method = request.method;
        /**
         * The path of the request relative to the HTTP endpoint
         * @type {string}
         */
        this.path = request.path;
        /**
         * HTTP error code returned by Discord
         * @type {number}
         */
        this.code = error.code;
        /**
         * The HTTP status code
         * @type {number}
         */
        this.httpStatus = status;
        /**
         * The data associated with the request that caused this error
         * @type {HTTPErrorData}
         */
        this.requestData = {
            json: request.options.data,
            files: (_c = request.options.files) !== null && _c !== void 0 ? _c : [],
        };
    }
    /**
     * Flattens an errors object returned from the API into an array.
     * @param {APIError} obj Discord errors object
     * @param {string} [key] Used internally to determine key names of nested fields
     * @returns {string[]}
     * @private
     */
    static flattenErrors(obj, key = '') {
        var _a;
        let messages = [];
        for (const [k, v] of Object.entries(obj)) {
            if (k === 'message')
                continue;
            const newKey = key ? (isNaN(k) ? `${key}.${k}` : `${key}[${k}]`) : k;
            if (v._errors) {
                messages.push(`${newKey}: ${v._errors.map(e => e.message).join(' ')}`);
            }
            else if ((_a = v.code) !== null && _a !== void 0 ? _a : v.message) {
                messages.push(`${v.code ? `${v.code}: ` : ''}${v.message}`.trim());
            }
            else if (typeof v === 'string') {
                messages.push(v);
            }
            else {
                messages = messages.concat(this.flattenErrors(v, newKey));
            }
        }
        return messages;
    }
}
module.exports = DiscordAPIError;
