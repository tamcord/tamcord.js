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
const Base = require('./Base');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const { Error } = require('../errors');
const SnowflakeUtil = require('../util/SnowflakeUtil');
const UserFlags = require('../util/UserFlags');
/**
 * Represents a user on Discord.
 * @implements {TextBasedChannel}
 * @extends {Base}
 */
class User extends Base {
    /**
     * @param {Client} client The instantiating client
     * @param {APIUser} data The data for the user
     */
    constructor(client, data) {
        super(client);
        /**
         * The user's id
         * @type {Snowflake}
         */
        this.id = data.id;
        this.bot = null;
        this.system = null;
        this.flags = null;
        this._patch(data);
    }
    _patch(data) {
        if ('username' in data) {
            /**
             * The username of the user
             * @type {?string}
             */
            this.username = data.username;
        }
        else if (typeof this.username !== 'string') {
            this.username = null;
        }
        if ('bot' in data) {
            /**
             * Whether or not the user is a bot
             * @type {?boolean}
             */
            this.bot = Boolean(data.bot);
        }
        else if (!this.partial && typeof this.bot !== 'boolean') {
            this.bot = false;
        }
        if ('discriminator' in data) {
            /**
             * A discriminator based on username for the user
             * @type {?string}
             */
            this.discriminator = data.discriminator;
        }
        else if (typeof this.discriminator !== 'string') {
            this.discriminator = null;
        }
        if ('avatar' in data) {
            /**
             * The user avatar's hash
             * @type {?string}
             */
            this.avatar = data.avatar;
        }
        else if (typeof this.avatar !== 'string') {
            this.avatar = null;
        }
        if ('system' in data) {
            /**
             * Whether the user is an Official Discord System user (part of the urgent message system)
             * @type {?boolean}
             */
            this.system = Boolean(data.system);
        }
        else if (!this.partial && typeof this.system !== 'boolean') {
            this.system = false;
        }
        if ('public_flags' in data) {
            /**
             * The flags for this user
             * @type {?UserFlags}
             */
            this.flags = new UserFlags(data.public_flags);
        }
    }
    /**
     * Whether this User is a partial
     * @type {boolean}
     * @readonly
     */
    get partial() {
        return typeof this.username !== 'string';
    }
    /**
     * The timestamp the user was created at
     * @type {number}
     * @readonly
     */
    get createdTimestamp() {
        return SnowflakeUtil.deconstruct(this.id).timestamp;
    }
    /**
     * The time the user was created at
     * @type {Date}
     * @readonly
     */
    get createdAt() {
        return new Date(this.createdTimestamp);
    }
    /**
     * A link to the user's avatar.
     * @param {ImageURLOptions} [options={}] Options for the Image URL
     * @returns {?string}
     */
    avatarURL({ format, size, dynamic } = {}) {
        if (!this.avatar)
            return null;
        return this.client.rest.cdn.Avatar(this.id, this.avatar, format, size, dynamic);
    }
    /**
     * A link to the user's default avatar
     * @type {string}
     * @readonly
     */
    get defaultAvatarURL() {
        return this.client.rest.cdn.DefaultAvatar(this.discriminator % 5);
    }
    /**
     * A link to the user's avatar if they have one.
     * Otherwise a link to their default avatar will be returned.
     * @param {ImageURLOptions} [options={}] Options for the Image URL
     * @returns {string}
     */
    displayAvatarURL(options) {
        var _a;
        return (_a = this.avatarURL(options)) !== null && _a !== void 0 ? _a : this.defaultAvatarURL;
    }
    /**
     * The Discord "tag" (e.g. `hydrabolt#0001`) for this user
     * @type {?string}
     * @readonly
     */
    get tag() {
        return typeof this.username === 'string' ? `${this.username}#${this.discriminator}` : null;
    }
    /**
     * The DM between the client's user and this user
     * @type {?DMChannel}
     * @readonly
     */
    get dmChannel() {
        var _a;
        return (_a = this.client.channels.cache.find(c => c.type === 'DM' && c.recipient.id === this.id)) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Creates a DM channel between the client and the user.
     * @param {boolean} [force=false] Whether to skip the cache check and request the API
     * @returns {Promise<DMChannel>}
     */
    createDM(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force) {
                const { dmChannel } = this;
                if (dmChannel && !dmChannel.partial)
                    return dmChannel;
            }
            const data = yield this.client.api.users(this.client.user.id).channels.post({
                data: {
                    recipient_id: this.id,
                },
            });
            return this.client.channels._add(data);
        });
    }
    /**
     * Deletes a DM channel (if one exists) between the client and the user. Resolves with the channel if successful.
     * @returns {Promise<DMChannel>}
     */
    deleteDM() {
        return __awaiter(this, void 0, void 0, function* () {
            const { dmChannel } = this;
            if (!dmChannel)
                throw new Error('USER_NO_DMCHANNEL');
            yield this.client.api.channels(dmChannel.id).delete();
            this.client.channels._remove(dmChannel.id);
            return dmChannel;
        });
    }
    /**
     * Checks if the user is equal to another. It compares id, username, discriminator, avatar, and bot flags.
     * It is recommended to compare equality by using `user.id === user2.id` unless you want to compare all properties.
     * @param {User} user User to compare with
     * @returns {boolean}
     */
    equals(user) {
        let equal = user &&
            this.id === user.id &&
            this.username === user.username &&
            this.discriminator === user.discriminator &&
            this.avatar === user.avatar;
        return equal;
    }
    /**
     * Fetches this user's flags.
     * @param {boolean} [force=false] Whether to skip the cache check and request the API
     * @returns {Promise<UserFlags>}
     */
    fetchFlags(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.flags && !force)
                return this.flags;
            const data = yield this.client.api.users(this.id).get();
            this._patch(data);
            return this.flags;
        });
    }
    /**
     * Fetches this user.
     * @param {boolean} [force=true] Whether to skip the cache check and request the API
     * @returns {Promise<User>}
     */
    fetch(force = true) {
        return this.client.users.fetch(this.id, { force });
    }
    /**
     * When concatenated with a string, this automatically returns the user's mention instead of the User object.
     * @returns {string}
     * @example
     * // Logs: Hello from <@123456789012345678>!
     * console.log(`Hello from ${user}!`);
     */
    toString() {
        return `<@${this.id}>`;
    }
    toJSON(...props) {
        const json = super.toJSON({
            createdTimestamp: true,
            defaultAvatarURL: true,
            tag: true,
        }, ...props);
        json.avatarURL = this.avatarURL();
        json.displayAvatarURL = this.displayAvatarURL();
        return json;
    }
    // These are here only for documentation purposes - they are implemented by TextBasedChannel
    /* eslint-disable no-empty-function */
    send() { }
}
TextBasedChannel.applyToClass(User);
module.exports = User;
