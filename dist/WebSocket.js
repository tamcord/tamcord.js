// @ts-nocheck
'use strict';
const { browser } = require('./util/Constants');
require('text-decoding');
let TextDecoder;
if (browser) {
    TextDecoder = globalThis.TextDecoder; // eslint-disable-line no-undef
    exports.WebSocket = globalThis.WebSocket; // eslint-disable-line no-undef
}
else {
    TextDecoder = require('util').TextDecoder;
    exports.WebSocket = require('ws');
}
const ab = new TextDecoder();
exports.encoding = 'json';
exports.pack = JSON.stringify;
exports.unpack = (data, type) => {
    if (typeof data !== 'string') {
        data = ab.decode(data);
    }
    return JSON.parse(data);
};
exports.create = (gateway, query = {}, ...args) => {
    const [g, q] = gateway.split('?');
    query.encoding = exports.encoding;
    query = new URLSearchParams(query);
    if (q)
        new URLSearchParams(q).forEach((v, k) => query.set(k, v));
    const ws = new exports.WebSocket(`${g}?${query}`, ...args);
    if (browser)
        ws.binaryType = 'arraybuffer';
    return ws;
};
for (const state of ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'])
    exports[state] = exports.WebSocket[state];
