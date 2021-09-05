// @ts-nocheck
'use strict';
const Util = require('../util/Util');
/**
 * Represents an attachment in a message.
 */
class MessageAttachment {
    /**
     * @param {BufferResolvable|Stream} attachment The file
     * @param {string} [name=null] The name of the file, if any
     * @param {APIAttachment} [data] Extra data
     */
    constructor(attachment, name = null, data) {
        this.attachment = attachment;
        /**
         * The name of this attachment
         * @type {?string}
         */
        this.name = name;
        if (data)
            this._patch(data);
    }
    /**
     * Sets the file of this attachment.
     * @param {BufferResolvable|Stream} attachment The file
     * @param {string} [name=null] The name of the file, if any
     * @returns {MessageAttachment} This attachment
     */
    setFile(attachment, name = null) {
        this.attachment = attachment;
        this.name = name;
        return this;
    }
    /**
     * Sets the name of this attachment.
     * @param {string} name The name of the file
     * @returns {MessageAttachment} This attachment
     */
    setName(name) {
        this.name = name;
        return this;
    }
    _patch(data) {
        var _a, _b, _c;
        /**
         * The attachment's id
         * @type {Snowflake}
         */
        this.id = data.id;
        /**
         * The size of this attachment in bytes
         * @type {number}
         */
        this.size = data.size;
        /**
         * The URL to this attachment
         * @type {string}
         */
        this.url = data.url;
        /**
         * The Proxy URL to this attachment
         * @type {string}
         */
        this.proxyURL = data.proxy_url;
        /**
         * The height of this attachment (if an image or video)
         * @type {?number}
         */
        this.height = (_a = data.height) !== null && _a !== void 0 ? _a : null;
        /**
         * The width of this attachment (if an image or video)
         * @type {?number}
         */
        this.width = (_b = data.width) !== null && _b !== void 0 ? _b : null;
        /**
         * This media type of this attachment
         * @type {?string}
         */
        this.contentType = (_c = data.content_type) !== null && _c !== void 0 ? _c : null;
    }
    /**
     * Whether or not this attachment has been marked as a spoiler
     * @type {boolean}
     * @readonly
     */
    get spoiler() {
        return Util.basename(this.url).startsWith('SPOILER_');
    }
    toJSON() {
        return Util.flatten(this);
    }
}
module.exports = MessageAttachment;
