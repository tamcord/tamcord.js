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
const Collection = require('../util/Collection');
const CachedManager = require('./CachedManager');
const { TypeError } = require('../errors');
const MessagePayload = require('../structures/MessagePayload');
const Sticker = require('../structures/Sticker');
/**
 * Manages API methods for Guild Stickers and stores their cache.
 * @extends {CachedManager}
 */
class GuildStickerManager extends CachedManager {
    constructor(guild, iterable) {
        super(guild.client, Sticker, iterable);
        /**
         * The guild this manager belongs to
         * @type {Guild}
         */
        this.guild = guild;
    }
    /**
     * The cache of Guild Stickers
     * @type {Collection<Snowflake, Sticker>}
     * @name GuildStickerManager#cache
     */
    _add(data, cache) {
        return super._add(data, cache, { extras: [this.guild] });
    }
    /**
     * Options for creating a guild sticker.
     * @typedef {Object} GuildStickerCreateOptions
     * @param {?string} [description] The description for the sticker
     * @param {string} [reason] Reason for creating the sticker
     */
    /**
     * Creates a new custom sticker in the guild.
     * @param {BufferResolvable|Stream|FileOptions|MessageAttachment} file The file for the sticker
     * @param {string} name The name for the sticker
     * @param {string} tags The Discord name of a unicode emoji representing the sticker's expression
     * @param {GuildStickerCreateOptions} [options] Options
     * @returns {Promise<Sticker>} The created sticker
     * @example
     * // Create a new sticker from a url
     * guild.stickers.create('https://i.imgur.com/w3duR07.png', 'rip')
     *   .then(sticker => console.log(`Created new sticker with name ${sticker.name}!`))
     *   .catch(console.error);
     * @example
     * // Create a new sticker from a file on your computer
     * guild.stickers.create('./memes/banana.png', 'banana')
     *   .then(sticker => console.log(`Created new sticker with name ${sticker.name}!`))
     *   .catch(console.error);
     */
    create(file, name, tags, { description, reason } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            file = Object.assign(Object.assign({}, (yield MessagePayload.resolveFile(file))), { key: 'file' });
            if (!file)
                throw new TypeError('REQ_RESOURCE_TYPE');
            const data = { name, tags, description: description !== null && description !== void 0 ? description : '' };
            const sticker = yield this.client.api
                .guilds(this.guild.id)
                .stickers.post({ data, files: [file], reason, dontUsePayloadJSON: true });
            return this.client.actions.GuildStickerCreate.handle(this.guild, sticker).sticker;
        });
    }
    /**
     * Data that resolves to give a Sticker object. This can be:
     * * A Sticker object
     * * A Snowflake
     * @typedef {Sticker|Snowflake} StickerResolvable
     */
    /**
     * Resolves a StickerResolvable to a Sticker object.
     * @method resolve
     * @memberof GuildStickerManager
     * @instance
     * @param {StickerResolvable} sticker The Sticker resolvable to identify
     * @returns {?Sticker}
     */
    /**
     * Resolves a StickerResolvable to a Sticker id string.
     * @method resolveId
     * @memberof GuildStickerManager
     * @instance
     * @param {StickerResolvable} sticker The Sticker resolvable to identify
     * @returns {?Snowflake}
     */
    /**
     * Edits a sticker.
     * @param {StickerResolvable} sticker The sticker to edit
     * @param {GuildStickerEditData} [data] The new data for the sticker
     * @param {string} [reason] Reason for editing this sticker
     * @returns {Promise<Sticker>}
     */
    edit(sticker, data, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const stickerId = this.resolveId(sticker);
            if (!stickerId)
                throw new TypeError('INVALID_TYPE', 'sticker', 'StickerResolvable');
            const d = yield this.client.api.guilds(this.guild.id).stickers(stickerId).patch({
                data,
                reason,
            });
            const existing = this.cache.get(stickerId);
            if (existing) {
                const clone = existing._clone();
                clone._patch(d);
                return clone;
            }
            return this._add(d);
        });
    }
    /**
     * Deletes a sticker.
     * @param {StickerResolvable} sticker The sticker to delete
     * @param {string} [reason] Reason for deleting this sticker
     * @returns {Promise<void>}
     */
    delete(sticker, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            sticker = this.resolveId(sticker);
            if (!sticker)
                throw new TypeError('INVALID_TYPE', 'sticker', 'StickerResolvable');
            yield this.client.api.guilds(this.guild.id).stickers(sticker).delete({ reason });
        });
    }
    /**
     * Obtains one or more stickers from Discord, or the sticker cache if they're already available.
     * @param {Snowflake} [id] The Sticker's id
     * @param {BaseFetchOptions} [options] Additional options for this fetch
     * @returns {Promise<Sticker|Collection<Snowflake, Sticker>>}
     * @example
     * // Fetch all stickers from the guild
     * message.guild.stickers.fetch()
     *   .then(stickers => console.log(`There are ${stickers.size} stickers.`))
     *   .catch(console.error);
     * @example
     * // Fetch a single sticker
     * message.guild.stickers.fetch('222078108977594368')
     *   .then(sticker => console.log(`The sticker name is: ${sticker.name}`))
     *   .catch(console.error);
     */
    fetch(id, { cache = true, force = false } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id) {
                if (!force) {
                    const existing = this.cache.get(id);
                    if (existing)
                        return existing;
                }
                const sticker = yield this.client.api.guilds(this.guild.id).stickers(id).get();
                return this._add(sticker, cache);
            }
            const data = yield this.client.api.guilds(this.guild.id).stickers.get();
            return new Collection(data.map(sticker => [sticker.id, this._add(sticker, cache)]));
        });
    }
}
module.exports = GuildStickerManager;
