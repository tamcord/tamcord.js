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
const BaseMessageComponent = require('./BaseMessageComponent');
const MessageEmbed = require('./MessageEmbed');
const { RangeError } = require('../errors');
const { MessageComponentTypes, browser } = require('../util/Constants');
const DataResolver = require('../util/DataResolver');
const MessageFlags = require('../util/MessageFlags');
const Util = require('../util/Util');
/**
 * Represents a message to be sent to the API.
 */
class MessagePayload {
    /**
     * @param {MessageTarget} target - The target for this message to be sent to
     * @param {MessageOptions|WebhookMessageOptions} options - Options passed in from send
     */
    constructor(target, options) {
        /**
         * The target for this message to be sent to
         * @type {MessageTarget}
         */
        this.target = target;
        /**
         * Options passed in from send
         * @type {MessageOptions|WebhookMessageOptions}
         */
        this.options = options;
        /**
         * Data sendable to the API
         * @type {?APIMessage}
         */
        this.data = null;
        /**
         * @typedef {Object} MessageFile
         * @property {Buffer|string|Stream} attachment The original attachment that generated this file
         * @property {string} name The name of this file
         * @property {Buffer|Stream} file The file to be sent to the API
         */
        /**
         * Files sendable to the API
         * @type {?MessageFile[]}
         */
        this.files = null;
    }
    /**
     * Whether or not the target is a {@link Webhook} or a {@link WebhookClient}
     * @type {boolean}
     * @readonly
     */
    get isWebhook() {
        const Webhook = require('./Webhook');
        const WebhookClient = require('../client/WebhookClient');
        return this.target instanceof Webhook || this.target instanceof WebhookClient;
    }
    /**
     * Whether or not the target is a {@link User}
     * @type {boolean}
     * @readonly
     */
    get isUser() {
        const User = require('./User');
        const GuildMember = require('./GuildMember');
        return this.target instanceof User || this.target instanceof GuildMember;
    }
    /**
     * Whether or not the target is a {@link Message}
     * @type {boolean}
     * @readonly
     */
    get isMessage() {
        const Message = require('./Message');
        return this.target instanceof Message;
    }
    /**
     * Wether or not the target is a {@link MessageManager}
     * @type {boolean}
     * @readonly
     */
    get isMessageManager() {
        const MessageManager = require('../managers/MessageManager');
        return this.target instanceof MessageManager;
    }
    /**
     * Whether or not the target is an {@link Interaction} or an {@link InteractionWebhook}
     * @type {boolean}
     * @readonly
     */
    get isInteraction() {
        const Interaction = require('./Interaction');
        const InteractionWebhook = require('./InteractionWebhook');
        return this.target instanceof Interaction || this.target instanceof InteractionWebhook;
    }
    /**
     * Makes the content of this message.
     * @returns {?string}
     */
    makeContent() {
        let content;
        if (this.options.content === null) {
            content = '';
        }
        else if (typeof this.options.content !== 'undefined') {
            content = Util.verifyString(this.options.content, RangeError, 'MESSAGE_CONTENT_TYPE', false);
        }
        return content;
    }
    /**
     * Resolves data.
     * @returns {MessagePayload}
     */
    resolveData() {
        var _a, _b, _c, _d, _e, _f, _g;
        if (this.data)
            return this;
        const isInteraction = this.isInteraction;
        const isWebhook = this.isWebhook;
        const content = this.makeContent();
        const tts = Boolean(this.options.tts);
        let nonce;
        if (typeof this.options.nonce !== 'undefined') {
            nonce = this.options.nonce;
            // eslint-disable-next-line max-len
            if (typeof nonce === 'number' ? !Number.isInteger(nonce) : typeof nonce !== 'string') {
                throw new RangeError('MESSAGE_NONCE_TYPE');
            }
        }
        const components = (_a = this.options.components) === null || _a === void 0 ? void 0 : _a.map(c => BaseMessageComponent.create(c).toJSON());
        let username;
        let avatarURL;
        if (isWebhook) {
            username = (_b = this.options.username) !== null && _b !== void 0 ? _b : this.target.name;
            if (this.options.avatarURL)
                avatarURL = this.options.avatarURL;
        }
        let flags;
        if (this.isMessage || this.isMessageManager) {
            // eslint-disable-next-line eqeqeq
            flags = this.options.flags != null ? new MessageFlags(this.options.flags).bitfield : (_c = this.target.flags) === null || _c === void 0 ? void 0 : _c.bitfield;
        }
        else if (isInteraction && this.options.ephemeral) {
            flags = MessageFlags.FLAGS.EPHEMERAL;
        }
        let allowedMentions = typeof this.options.allowedMentions === 'undefined'
            ? this.target.client.options.allowedMentions
            : this.options.allowedMentions;
        if (allowedMentions) {
            allowedMentions = Util.cloneObject(allowedMentions);
            allowedMentions.replied_user = allowedMentions.repliedUser;
            delete allowedMentions.repliedUser;
        }
        let message_reference;
        if (typeof this.options.reply === 'object') {
            const reference = this.options.reply.messageReference;
            const message_id = this.isMessage ? (_d = reference.id) !== null && _d !== void 0 ? _d : reference : this.target.messages.resolveId(reference);
            if (message_id) {
                message_reference = {
                    message_id,
                    fail_if_not_exists: (_e = this.options.reply.failIfNotExists) !== null && _e !== void 0 ? _e : this.target.client.options.failIfNotExists,
                };
            }
        }
        this.data = {
            content,
            tts,
            nonce,
            embeds: (_f = this.options.embeds) === null || _f === void 0 ? void 0 : _f.map(embed => new MessageEmbed(embed).toJSON()),
            components,
            username,
            avatar_url: avatarURL,
            allowed_mentions: typeof content === 'undefined' && typeof message_reference === 'undefined' ? undefined : allowedMentions,
            flags,
            message_reference,
            attachments: this.options.attachments,
            sticker_ids: (_g = this.options.stickers) === null || _g === void 0 ? void 0 : _g.map(sticker => { var _a; return (_a = sticker.id) !== null && _a !== void 0 ? _a : sticker; }),
        };
        return this;
    }
    /**
     * Resolves files.
     * @returns {Promise<MessagePayload>}
     */
    resolveFiles() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.files)
                return this;
            this.files = yield Promise.all((_b = (_a = this.options.files) === null || _a === void 0 ? void 0 : _a.map(file => this.constructor.resolveFile(file))) !== null && _b !== void 0 ? _b : []);
            return this;
        });
    }
    /**
     * Resolves a single file into an object sendable to the API.
     * @param {BufferResolvable|Stream|FileOptions|MessageAttachment} fileLike Something that could be resolved to a file
     * @returns {MessageFile}
     */
    static resolveFile(fileLike) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let attachment;
            let name;
            const findName = thing => {
                if (typeof thing === 'string') {
                    return Util.basename(thing);
                }
                if (thing.path) {
                    return Util.basename(thing.path);
                }
                return 'file.jpg';
            };
            const ownAttachment = typeof fileLike === 'string' ||
                fileLike instanceof (browser ? ArrayBuffer : Buffer) ||
                typeof fileLike.pipe === 'function';
            if (ownAttachment) {
                attachment = fileLike;
                name = findName(attachment);
            }
            else {
                attachment = fileLike.attachment;
                name = (_a = fileLike.name) !== null && _a !== void 0 ? _a : findName(attachment);
            }
            const resource = yield DataResolver.resolveFile(attachment);
            return { attachment, name, file: resource };
        });
    }
    /**
     * Creates a {@link MessagePayload} from user-level arguments.
     * @param {MessageTarget} target Target to send to
     * @param {string|MessageOptions|WebhookMessageOptions} options Options or content to use
     * @param {MessageOptions|WebhookMessageOptions} [extra={}] - Extra options to add onto specified options
     * @returns {MessagePayload}
     */
    static create(target, options, extra = {}) {
        return new this(target, typeof options !== 'object' || options === null ? Object.assign({ content: options }, extra) : Object.assign(Object.assign({}, options), extra));
    }
}
module.exports = MessagePayload;
