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
const BaseManager = require('./BaseManager');
const Channel = require('../structures/Channel');
const { Events, ThreadChannelTypes } = require('../util/Constants');
/**
 * A manager of channels belonging to a client
 * @extends {BaseManager}
 */
class ChannelManager extends BaseManager {
    constructor(client, iterable) {
        super(client, iterable, Channel);
    }
    /**
     * The cache of Channels
     * @type {Collection<Snowflake, Channel>}
     * @name ChannelManager#cache
     */
    add(data, guild, cache = true) {
        var _a, _b;
        const existing = this.cache.get(data.id);
        if (existing) {
            if (existing._patch && cache)
                existing._patch(data);
            if (guild)
                (_a = guild.channels) === null || _a === void 0 ? void 0 : _a.add(existing);
            if (ThreadChannelTypes.includes(existing.type) && typeof ((_b = existing.parent) === null || _b === void 0 ? void 0 : _b.threads) !== 'undefined') {
                existing.parent.threads.add(existing);
            }
            return existing;
        }
        const channel = Channel.create(this.client, data, guild);
        if (!channel) {
            this.client.emit(Events.DEBUG, `Failed to find guild, or unknown type for channel ${data.id} ${data.type}`);
            return null;
        }
        if (cache)
            this.cache.set(channel.id, channel);
        return channel;
    }
    remove(id) {
        var _a, _b, _c;
        const channel = this.cache.get(id);
        (_a = channel === null || channel === void 0 ? void 0 : channel.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.delete(id);
        (_c = (_b = channel === null || channel === void 0 ? void 0 : channel.parent) === null || _b === void 0 ? void 0 : _b.threads) === null || _c === void 0 ? void 0 : _c.cache.delete(id);
        this.cache.delete(id);
    }
    /**
     * Data that can be resolved to give a Channel object. This can be:
     * * A Channel object
     * * A Snowflake
     * @typedef {Channel|Snowflake} ChannelResolvable
     */
    /**
     * Resolves a ChannelResolvable to a Channel object.
     * @method resolve
     * @memberof ChannelManager
     * @instance
     * @param {ChannelResolvable} channel The channel resolvable to resolve
     * @returns {?Channel}
     */
    /**
     * Resolves a ChannelResolvable to a channel ID string.
     * @method resolveID
     * @memberof ChannelManager
     * @instance
     * @param {ChannelResolvable} channel The channel resolvable to resolve
     * @returns {?Snowflake}
     */
    /**
     * Obtains a channel from Discord, or the channel cache if it's already available.
     * @param {Snowflake} id ID of the channel
     * @param {BaseFetchOptions} [options] Additional options for this fetch
     * @returns {Promise<?Channel>}
     * @example
     * // Fetch a channel by its id
     * client.channels.fetch('222109930545610754')
     *   .then(channel => console.log(channel.name))
     *   .catch(console.error);
     */
    fetch(id, { cache = true, force = false } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force) {
                const existing = this.cache.get(id);
                if (existing && !existing.partial)
                    return existing;
            }
            const data = yield this.client.api.channels(id).get();
            return this.add(data, null, cache);
        });
    }
}
module.exports = ChannelManager;
