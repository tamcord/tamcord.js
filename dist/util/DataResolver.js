// @ts-nocheck
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
const fetch = globalThis.fetch || require('node-fetch');
const { Error: DiscordError, TypeError } = require('../errors');
const Invite = require('../structures/Invite');
const { browser } = require('../util/Constants');
const Util = require('../util/Util');
/**
 * The DataResolver identifies different objects and tries to resolve a specific piece of information from them.
 * @private
 */
class DataResolver extends null {
    /**
     * Data that can be resolved to give an invite code. This can be:
     * * An invite code
     * * An invite URL
     * @typedef {string} InviteResolvable
     */
    /**
     * Data that can be resolved to give a template code. This can be:
     * * A template code
     * * A template URL
     * @typedef {string} GuildTemplateResolvable
     */
    /**
     * Resolves the string to a code based on the passed regex.
     * @param {string} data The string to resolve
     * @param {RegExp} regex The RegExp used to extract the code
     * @returns {string}
     */
    static resolveCode(data, regex) {
        var _a, _b;
        return (_b = (_a = data.matchAll(regex).next().value) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : data;
    }
    /**
     * Resolves InviteResolvable to an invite code.
     * @param {InviteResolvable} data The invite resolvable to resolve
     * @returns {string}
     */
    static resolveInviteCode(data) {
        return this.resolveCode(data, Invite.INVITES_PATTERN);
    }
    /**
     * Resolves GuildTemplateResolvable to a template code.
     * @param {GuildTemplateResolvable} data The template resolvable to resolve
     * @returns {string}
     */
    static resolveGuildTemplateCode(data) {
        const GuildTemplate = require('../structures/GuildTemplate');
        return this.resolveCode(data, GuildTemplate.GUILD_TEMPLATES_PATTERN);
    }
    /**
     * Resolves a Base64Resolvable, a string, or a BufferResolvable to a Base 64 image.
     * @param {BufferResolvable|Base64Resolvable} image The image to be resolved
     * @returns {Promise<?string>}
     */
    static resolveImage(image) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!image)
                return null;
            if (typeof image === 'string' && image.startsWith('data:')) {
                return image;
            }
            const file = yield this.resolveFileAsBuffer(image);
            return DataResolver.resolveBase64(file);
        });
    }
    /**
     * Data that resolves to give a Base64 string, typically for image uploading. This can be:
     * * A Buffer
     * * A base64 string
     * @typedef {Buffer|string} Base64Resolvable
     */
    /**
     * Resolves a Base64Resolvable to a Base 64 image.
     * @param {Base64Resolvable} data The base 64 resolvable you want to resolve
     * @returns {?string}
     */
    static resolveBase64(data) {
        if (Buffer.isBuffer(data))
            return `data:image/jpg;base64,${data.toString('base64')}`;
        return data;
    }
    /**
     * Data that can be resolved to give a Buffer. This can be:
     * * A Buffer
     * * The path to a local file
     * * A URL
     * @typedef {string|Buffer} BufferResolvable
     */
    /**
     * @external Stream
     * @see {@link https://nodejs.org/api/stream.html}
     */
    /**
     * Resolves a BufferResolvable to a Buffer or a Stream.
     * @param {BufferResolvable|Stream} resource The buffer or stream resolvable to resolve
     * @returns {Promise<Buffer|Stream>}
     */
    static resolveFile(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!browser && Buffer.isBuffer(resource))
                return resource;
            if (browser && resource instanceof ArrayBuffer)
                return Util.convertToBuffer(resource);
            // eslint-disable-next-line no-undef
            if (browser && resource instanceof Blob)
                return resource;
            if (resource instanceof stream.Readable)
                return resource;
            if (Buffer.isBuffer(resource) || resource instanceof stream.Readable)
                return resource;
            if (typeof resource === 'string') {
                if (/^https?:\/\//.test(resource)) {
                    const res = yield fetch(resource);
                    return browser ? res.blob() : res.body;
                }
                else if (!browser) {
                    return new Promise((resolve, reject) => {
                        const file = path.resolve(resource);
                        fs.stat(file, (err, stats) => {
                            if (err)
                                return reject(err);
                            if (!stats.isFile())
                                return reject(new DiscordError('FILE_NOT_FOUND', file));
                            return resolve(fs.createReadStream(file));
                        });
                    });
                }
            }
            throw new TypeError('REQ_RESOURCE_TYPE');
        });
    }
    /**
     * Resolves a BufferResolvable to a Buffer.
     * @param {BufferResolvable|Stream} resource The buffer or stream resolvable to resolve
     * @returns {Promise<Buffer>}
     */
    static resolveFileAsBuffer(resource) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.resolveFile(resource);
            if (Buffer.isBuffer(file))
                return file;
            const buffers = [];
            try {
                for (var file_1 = __asyncValues(file), file_1_1; file_1_1 = yield file_1.next(), !file_1_1.done;) {
                    const data = file_1_1.value;
                    buffers.push(data);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (file_1_1 && !file_1_1.done && (_a = file_1.return)) yield _a.call(file_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return Buffer.concat(buffers);
        });
    }
}
module.exports = DataResolver;
