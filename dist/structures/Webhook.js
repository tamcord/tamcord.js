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
const APIMessage = require('./APIMessage');
const Channel = require('./Channel');
const { Error } = require('../errors');
const { WebhookTypes } = require('../util/Constants');
const DataResolver = require('../util/DataResolver');
const SnowflakeUtil = require('../util/SnowflakeUtil');
/**
 * Represents a webhook.
 */
class Webhook {
    constructor(client, data) {
        /**
         * The client that instantiated the webhook
         * @name Webhook#client
         * @type {Client}
         * @readonly
         */
        Object.defineProperty(this, 'client', { value: client });
        if (data)
            this._patch(data);
    }
    _patch(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        /**
         * The name of the webhook
         * @type {string}
         */
        this.name = data.name;
        /**
         * The token for the webhook, unavailable for follower webhooks and webhooks owned by another application.
         * @name Webhook#token
         * @type {?string}
         */
        Object.defineProperty(this, 'token', { value: data.token || null, writable: true, configurable: true });
        /**
         * The avatar for the webhook
         * @type {?string}
         */
        this.avatar = data.avatar;
        /**
         * The ID of the webhook
         * @type {Snowflake}
         */
        this.id = data.id;
        /**
         * The type of the webhook
         * @type {WebhookType}
         */
        this.type = WebhookTypes[data.type];
        /**
         * The guild the webhook belongs to
         * @type {Snowflake}
         */
        this.guildID = data.guild_id;
        /**
         * The channel the webhook belongs to
         * @type {Snowflake}
         */
        this.channelID = data.channel_id;
        /**
         * The owner of the webhook
         * @type {?User|APIUser}
         */
        this.owner = data.user ? (_b = (_a = this.client.users) === null || _a === void 0 ? void 0 : _a.add(data.user)) !== null && _b !== void 0 ? _b : data.user : null;
        /**
         * The source guild of the webhook
         * @type {?Guild|APIGuild}
         */
        this.sourceGuild = data.source_guild
            ? (_d = (_c = this.client.guilds) === null || _c === void 0 ? void 0 : _c.add(data.source_guild, false)) !== null && _d !== void 0 ? _d : data.source_guild
            : null;
        /**
         * The source channel of the webhook
         * @type {?Channel|APIChannel}
         */
        this.sourceChannel = (_h = (_g = (_e = this.client.channels) === null || _e === void 0 ? void 0 : _e.resolve((_f = data.source_channel) === null || _f === void 0 ? void 0 : _f.id)) !== null && _g !== void 0 ? _g : data.source_channel) !== null && _h !== void 0 ? _h : null;
    }
    /**
     * Options that can be passed into send.
     * @typedef {BaseMessageOptions} WebhookMessageOptions
     * @property {string} [username=this.name] Username override for the message
     * @property {string} [avatarURL] Avatar URL override for the message
     * @property {Snowflake} [threadID] The id of the thread in the channel to send to.
     * <info>For interaction webhooks, this property is ignored</info>
     */
    /**
     * Options that can be passed into editMessage.
     * @typedef {Object} WebhookEditMessageOptions
     * @property {MessageEmbed[]|APIEmbed[]} [embeds] See {@link WebhookMessageOptions#embeds}
     * @property {string} [content] See {@link BaseMessageOptions#content}
     * @property {FileOptions[]|BufferResolvable[]|MessageAttachment[]} [files] See {@link BaseMessageOptions#files}
     * @property {MessageMentionOptions} [allowedMentions] See {@link BaseMessageOptions#allowedMentions}
     * @property {MessageActionRow[]|MessageActionRowOptions[]|MessageActionRowComponentResolvable[][]} [components]
     * Action rows containing interactive components for the message (buttons, select menus)
     */
    /**
     * Sends a message with this webhook.
     * @param {string|APIMessage|WebhookMessageOptions} options The options to provide
     * @returns {Promise<Message|APIMessageRaw>}
     * @example
     * // Send a basic message
     * webhook.send('hello!')
     *   .then(message => console.log(`Sent message: ${message.content}`))
     *   .catch(console.error);
     * @example
     * // Send a basic message in a thread
     * webhook.send('hello!', { threadID: '836856309672348295' })
     *   .then(message => console.log(`Sent message: ${message.content}`))
     *   .catch(console.error);
     * @example
     * // Send a remote file
     * webhook.send({
     *   files: ['https://cdn.discordapp.com/icons/222078108977594368/6e1019b3179d71046e463a75915e7244.png?size=2048']
     * })
     *   .then(console.log)
     *   .catch(console.error);
     * @example
     * // Send a local file
     * webhook.send({
     *   files: [{
     *     attachment: 'entire/path/to/file.jpg',
     *     name: 'file.jpg'
     *   }]
     * })
     *   .then(console.log)
     *   .catch(console.error);
     * @example
     * // Send an embed with a local image inside
     * webhook.send({
     *   content: 'This is an embed',
     *   embeds: [{
     *     thumbnail: {
     *          url: 'attachment://file.jpg'
     *       }
     *    }],
     *    files: [{
     *       attachment: 'entire/path/to/file.jpg',
     *       name: 'file.jpg'
     *    }]
     * })
     *   .then(console.log)
     *   .catch(console.error);
     */
    send(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token)
                throw new Error('WEBHOOK_TOKEN_UNAVAILABLE');
            let apiMessage;
            if (options instanceof APIMessage) {
                apiMessage = options.resolveData();
            }
            else {
                apiMessage = APIMessage.create(this, options).resolveData();
            }
            if (Array.isArray(apiMessage.data.content)) {
                return Promise.all(apiMessage.split().map(this.send.bind(this)));
            }
            const { data, files } = yield apiMessage.resolveFiles();
            return this.client.api
                .webhooks(this.id, this.token)
                .post({
                data,
                files,
                query: { thread_id: apiMessage.options.threadID, wait: true },
                auth: false,
            })
                .then(d => {
                const channel = this.client.channels ? this.client.channels.cache.get(d.channel_id) : undefined;
                if (!channel)
                    return d;
                return channel.messages.add(d, false);
            });
        });
    }
    /**
     * Sends a raw slack message with this webhook.
     * @param {Object} body The raw body to send
     * @returns {Promise<boolean>}
     * @example
     * // Send a slack message
     * webhook.sendSlackMessage({
     *   'username': 'Wumpus',
     *   'attachments': [{
     *     'pretext': 'this looks pretty cool',
     *     'color': '#F0F',
     *     'footer_icon': 'http://snek.s3.amazonaws.com/topSnek.png',
     *     'footer': 'Powered by sneks',
     *     'ts': Date.now() / 1000
     *   }]
     * }).catch(console.error);
     * @see {@link https://api.slack.com/messaging/webhooks}
     */
    sendSlackMessage(body) {
        if (!this.token)
            throw new Error('WEBHOOK_TOKEN_UNAVAILABLE');
        return this.client.api
            .webhooks(this.id, this.token)
            .slack.post({
            query: { wait: true },
            auth: false,
            data: body,
        })
            .then(data => data.toString() === 'ok');
    }
    /**
     * Options used to edit a {@link Webhook}.
     * @typedef {Object} WebhookEditData
     * @property {string} [name=this.name] The new name for the webhook
     * @property {BufferResolvable} [avatar] The new avatar for the webhook
     * @property {ChannelResolvable} [channel] The new channel for the webhook
     */
    /**
     * Edits this webhook.
     * @param {WebhookEditData} options Options for editing the webhook
     * @param {string} [reason] Reason for editing the webhook
     * @returns {Promise<Webhook>}
     */
    edit({ name = this.name, avatar, channel }, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            if (avatar && !(typeof avatar === 'string' && avatar.startsWith('data:'))) {
                avatar = yield DataResolver.resolveImage(avatar);
            }
            if (channel)
                channel = channel instanceof Channel ? channel.id : channel;
            const data = yield this.client.api.webhooks(this.id, channel ? undefined : this.token).patch({
                data: { name, avatar, channel_id: channel },
                reason,
            });
            this.name = data.name;
            this.avatar = data.avatar;
            this.channelID = data.channel_id;
            return this;
        });
    }
    /**
     * Gets a message that was sent by this webhook.
     * @param {Snowflake|'@original'} message The ID of the message to fetch
     * @param {boolean} [cache=true] Whether to cache the message
     * @returns {Promise<Message|APIMessageRaw>} Returns the raw message data if the webhook was instantiated as a
     * {@link WebhookClient} or if the channel is uncached, otherwise a {@link Message} will be returned
     */
    fetchMessage(message, cache = true) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token)
                throw new Error('WEBHOOK_TOKEN_UNAVAILABLE');
            const data = yield this.client.api.webhooks(this.id, this.token).messages(message).get();
            return (_c = (_b = (_a = this.client.channels) === null || _a === void 0 ? void 0 : _a.cache.get(data.channel_id)) === null || _b === void 0 ? void 0 : _b.messages.add(data, cache)) !== null && _c !== void 0 ? _c : data;
        });
    }
    /**
     * Edits a message that was sent by this webhook.
     * @param {MessageResolvable|'@original'} message The message to edit
     * @param {string|APIMessage|WebhookEditMessageOptions} options The options to provide
     * @returns {Promise<Message|APIMessageRaw>} Returns the raw message data if the webhook was instantiated as a
     * {@link WebhookClient} or if the channel is uncached, otherwise a {@link Message} will be returned
     */
    editMessage(message, options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token)
                throw new Error('WEBHOOK_TOKEN_UNAVAILABLE');
            let apiMessage;
            if (options instanceof APIMessage)
                apiMessage = options;
            else
                apiMessage = APIMessage.create(this, options);
            const { data, files } = yield apiMessage.resolveData().resolveFiles();
            const d = yield this.client.api
                .webhooks(this.id, this.token)
                .messages(typeof message === 'string' ? message : message.id)
                .patch({ data, files });
            const messageManager = (_b = (_a = this.client.channels) === null || _a === void 0 ? void 0 : _a.cache.get(d.channel_id)) === null || _b === void 0 ? void 0 : _b.messages;
            if (!messageManager)
                return d;
            const existing = messageManager.cache.get(d.id);
            if (!existing)
                return messageManager.add(d);
            const clone = existing._clone();
            clone._patch(d);
            return clone;
        });
    }
    /**
     * Deletes the webhook.
     * @param {string} [reason] Reason for deleting this webhook
     * @returns {Promise}
     */
    delete(reason) {
        return this.client.api.webhooks(this.id, this.token).delete({ reason });
    }
    /**
     * Delete a message that was sent by this webhook.
     * @param {MessageResolvable|'@original'} message The message to delete
     * @returns {Promise<void>}
     */
    deleteMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token)
                throw new Error('WEBHOOK_TOKEN_UNAVAILABLE');
            yield this.client.api
                .webhooks(this.id, this.token)
                .messages(typeof message === 'string' ? message : message.id)
                .delete();
        });
    }
    /**
     * The timestamp the webhook was created at
     * @type {number}
     * @readonly
     */
    get createdTimestamp() {
        return SnowflakeUtil.deconstruct(this.id).timestamp;
    }
    /**
     * The time the webhook was created at
     * @type {Date}
     * @readonly
     */
    get createdAt() {
        return new Date(this.createdTimestamp);
    }
    /**
     * The url of this webhook
     * @type {string}
     * @readonly
     */
    get url() {
        return this.client.options.http.api + this.client.api.webhooks(this.id, this.token);
    }
    /**
     * A link to the webhook's avatar.
     * @param {StaticImageURLOptions} [options={}] Options for the Image URL
     * @returns {?string}
     */
    avatarURL({ format, size } = {}) {
        if (!this.avatar)
            return null;
        return this.client.rest.cdn.Avatar(this.id, this.avatar, format, size);
    }
    static applyToClass(structure, ignore = []) {
        for (const prop of [
            'send',
            'sendSlackMessage',
            'fetchMessage',
            'edit',
            'editMessage',
            'delete',
            'deleteMessage',
            'createdTimestamp',
            'createdAt',
            'url',
        ]) {
            if (ignore.includes(prop))
                continue;
            Object.defineProperty(structure.prototype, prop, Object.getOwnPropertyDescriptor(Webhook.prototype, prop));
        }
    }
}
module.exports = Webhook;
