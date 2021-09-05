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
const { StickerFormatTypes, StickerTypes } = require('../util/Constants');
const SnowflakeUtil = require('../util/SnowflakeUtil');
/**
 * Represents a Sticker.
 * @extends {Base}
 */
class Sticker extends Base {
    /**
     * @param {Client} client The instantiating client
     * @param {APISticker | APIStickerItem} sticker The data for the sticker
     */
    constructor(client, sticker) {
        super(client);
        this._patch(sticker);
    }
    _patch(sticker) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        /**
         * The sticker's id
         * @type {Snowflake}
         */
        this.id = sticker.id;
        /**
         * The description of the sticker
         * @type {?string}
         */
        this.description = (_a = sticker.description) !== null && _a !== void 0 ? _a : null;
        /**
         * The type of the sticker
         * @type {?StickerType}
         */
        this.type = (_b = StickerTypes[sticker.type]) !== null && _b !== void 0 ? _b : null;
        /**
         * The format of the sticker
         * @type {StickerFormatType}
         */
        this.format = StickerFormatTypes[sticker.format_type];
        /**
         * The name of the sticker
         * @type {string}
         */
        this.name = sticker.name;
        /**
         * The id of the pack the sticker is from, for standard stickers
         * @type {?Snowflake}
         */
        this.packId = (_c = sticker.pack_id) !== null && _c !== void 0 ? _c : null;
        /**
         * An array of tags for the sticker
         * @type {?string[]}
         */
        this.tags = (_e = (_d = sticker.tags) === null || _d === void 0 ? void 0 : _d.split(', ')) !== null && _e !== void 0 ? _e : null;
        /**
         * Whether or not the guild sticker is available
         * @type {?boolean}
         */
        this.available = (_f = sticker.available) !== null && _f !== void 0 ? _f : null;
        /**
         * The id of the guild that owns this sticker
         * @type {?Snowflake}
         */
        this.guildId = (_g = sticker.guild_id) !== null && _g !== void 0 ? _g : null;
        /**
         * The user that uploaded the guild sticker
         * @type {?User}
         */
        this.user = sticker.user ? this.client.users.add(sticker.user) : null;
        /**
         * The standard sticker's sort order within its pack
         * @type {?number}
         */
        this.sortValue = (_h = sticker.sort_value) !== null && _h !== void 0 ? _h : null;
    }
    /**
     * The timestamp the sticker was created at
     * @type {number}
     * @readonly
     */
    get createdTimestamp() {
        return SnowflakeUtil.deconstruct(this.id).timestamp;
    }
    /**
     * The time the sticker was created at
     * @type {Date}
     * @readonly
     */
    get createdAt() {
        return new Date(this.createdTimestamp);
    }
    /**
     * Whether this sticker is partial
     * @type {boolean}
     * @readonly
     */
    get partial() {
        return !this.type;
    }
    /**
     * The guild that owns this sticker
     * @type {?Guild}
     * @readonly
     */
    get guild() {
        return this.client.guilds.resolve(this.guildId);
    }
    /**
     * A link to the sticker
     * <info>If the sticker's format is LOTTIE, it returns the URL of the Lottie json file.</info>
     * @type {string}
     */
    get url() {
        return this.client.rest.cdn.Sticker(this.id, this.format);
    }
    /**
     * Fetches this sticker.
     * @returns {Promise<Sticker>}
     */
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.client.api.stickers(this.id).get();
            this._patch(data);
            return this;
        });
    }
    /**
     * Fetches the pack this sticker is part of from Discord, if this is a Nitro sticker.
     * @returns {Promise<?StickerPack>}
     */
    fetchPack() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = (this.packId && (yield this.client.fetchPremiumStickerPacks()).get(this.packId))) !== null && _a !== void 0 ? _a : null;
        });
    }
    /**
     * Fetches the user who uploaded this sticker, if this is a guild sticker.
     * @returns {Promise<?User>}
     */
    fetchUser() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.partial)
                yield this.fetch();
            if (!this.guildId)
                throw new Error('NOT_GUILD_STICKER');
            const data = yield this.client.api.guilds(this.guildId).stickers(this.id).get();
            this._patch(data);
            return this.user;
        });
    }
    /**
     * Data for editing a sticker.
     * @typedef {Object} GuildStickerEditData
     * @property {string} [name] The name of the sticker
     * @property {?string} [description] The description of the sticker
     * @property {string} [tags] The Discord name of a unicode emoji representing the sticker's expression
     */
    /**
     * Edits the sticker.
     * @param {GuildStickerEditData} [data] The new data for the sticker
     * @param {string} [reason] Reason for editing this sticker
     * @returns {Promise<Sticker>}
     * @example
     * // Update the name of a sticker
     * sticker.edit({ name: 'new name' })
     *   .then(s => console.log(`Updated the name of the sticker to ${s.name}`))
     *   .catch(console.error);
     */
    edit(data, reason) {
        return this.guild.stickers.edit(this, data, reason);
    }
    /**
     * Deletes the sticker.
     * @returns {Promise<Sticker>}
     * @param {string} [reason] Reason for deleting this sticker
     * @example
     * // Delete a message
     * sticker.delete()
     *   .then(s => console.log(`Deleted sticker ${s.name}`))
     *   .catch(console.error);
     */
    delete(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.guild.stickers.delete(this, reason);
            return this;
        });
    }
    /**
     * Whether this sticker is the same as another one.
     * @param {Sticker|APISticker} other The sticker to compare it to
     * @returns {boolean}
     */
    equals(other) {
        if (other instanceof Sticker) {
            return (other.id === this.id &&
                other.description === this.description &&
                other.type === this.type &&
                other.format === this.format &&
                other.name === this.name &&
                other.packId === this.packId &&
                other.tags.length === this.tags.length &&
                other.tags.every(tag => this.tags.includes(tag)) &&
                other.available === this.available &&
                other.guildId === this.guildId &&
                other.sortValue === this.sortValue);
        }
        else {
            return (other.id === this.id &&
                other.description === this.description &&
                other.name === this.name &&
                other.tags === this.tags.join(', '));
        }
    }
}
module.exports = Sticker;
