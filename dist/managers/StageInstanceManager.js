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
const CachedManager = require('./CachedManager');
const { TypeError, Error } = require('../errors');
const StageInstance = require('../structures/StageInstance');
const { PrivacyLevels } = require('../util/Constants');
/**
 * Manages API methods for {@link StageInstance} objects and holds their cache.
 * @extends {CachedManager}
 */
class StageInstanceManager extends CachedManager {
    constructor(guild, iterable) {
        super(guild.client, StageInstance, iterable);
        /**
         * The guild this manager belongs to
         * @type {Guild}
         */
        this.guild = guild;
    }
    /**
     * The cache of this Manager
     * @type {Collection<Snowflake, StageInstance>}
     * @name StageInstanceManager#cache
     */
    /**
     * Options used to create a stage instance.
     * @typedef {Object} StageInstanceCreateOptions
     * @property {string} topic The topic of the stage instance
     * @property {PrivacyLevel|number} [privacyLevel] The privacy level of the stage instance
     */
    /**
     * Creates a new stage instance.
     * @param {StageChannel|Snowflake} channel The stage channel to associate the created stage instance to
     * @param {StageInstanceCreateOptions} options The options to create the stage instance
     * @returns {Promise<StageInstance>}
     * @example
     * // Create a stage instance
     * guild.stageInstances.create('1234567890123456789', {
     *  topic: 'A very creative topic',
     *  privacyLevel: 'GUILD_ONLY'
     * })
     *  .then(stageInstance => console.log(stageInstance))
     *  .catch(console.error);
     */
    create(channel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelId = this.guild.channels.resolveId(channel);
            if (!channelId)
                throw new Error('STAGE_CHANNEL_RESOLVE');
            if (typeof options !== 'object')
                throw new TypeError('INVALID_TYPE', 'options', 'object', true);
            let { topic, privacyLevel } = options;
            if (privacyLevel)
                privacyLevel = typeof privacyLevel === 'number' ? privacyLevel : PrivacyLevels[privacyLevel];
            const data = yield this.client.api['stage-instances'].post({
                data: {
                    channel_id: channelId,
                    topic,
                    privacy_level: privacyLevel,
                },
            });
            return this._add(data);
        });
    }
    /**
     * Fetches the stage instance associated with a stage channel, if it exists.
     * @param {StageChannel|Snowflake} channel The stage channel whose associated stage instance is to be fetched
     * @param {BaseFetchOptions} [options] Additional options for this fetch
     * @returns {Promise<StageInstance>}
     * @example
     * // Fetch a stage instance
     * guild.stageInstances.fetch('1234567890123456789')
     *  .then(stageInstance => console.log(stageInstance))
     *  .catch(console.error);
     */
    fetch(channel, { cache = true, force = false } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelId = this.guild.channels.resolveId(channel);
            if (!channelId)
                throw new Error('STAGE_CHANNEL_RESOLVE');
            if (!force) {
                const existing = this.cache.find(stageInstance => stageInstance.channelId === channelId);
                if (existing)
                    return existing;
            }
            const data = yield this.client.api('stage-instances', channelId).get();
            return this._add(data, cache);
        });
    }
    /**
     * Options used to edit an existing stage instance.
     * @typedef {Object} StageInstanceEditOptions
     * @property {string} [topic] The new topic of the stage instance
     * @property {PrivacyLevel|number} [privacyLevel] The new privacy level of the stage instance
     */
    /**
     * Edits an existing stage instance.
     * @param {StageChannel|Snowflake} channel The stage channel whose associated stage instance is to be edited
     * @param {StageInstanceEditOptions} options The options to edit the stage instance
     * @returns {Promise<StageInstance>}
     * @example
     * // Edit a stage instance
     * guild.stageInstances.edit('1234567890123456789', { topic: 'new topic' })
     *  .then(stageInstance => console.log(stageInstance))
     *  .catch(console.error);
     */
    edit(channel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof options !== 'object')
                throw new TypeError('INVALID_TYPE', 'options', 'object', true);
            const channelId = this.guild.channels.resolveId(channel);
            if (!channelId)
                throw new Error('STAGE_CHANNEL_RESOLVE');
            let { topic, privacyLevel } = options;
            if (privacyLevel)
                privacyLevel = typeof privacyLevel === 'number' ? privacyLevel : PrivacyLevels[privacyLevel];
            const data = yield this.client.api('stage-instances', channelId).patch({
                data: {
                    topic,
                    privacy_level: privacyLevel,
                },
            });
            if (this.cache.has(data.id)) {
                const clone = this.cache.get(data.id)._clone();
                clone._patch(data);
                return clone;
            }
            return this._add(data);
        });
    }
    /**
     * Deletes an existing stage instance.
     * @param {StageChannel|Snowflake} channel The stage channel whose associated stage instance is to be deleted
     * @returns {Promise<void>}
     */
    delete(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelId = this.guild.channels.resolveId(channel);
            if (!channelId)
                throw new Error('STAGE_CHANNEL_RESOLVE');
            yield this.client.api('stage-instances', channelId).delete();
        });
    }
}
module.exports = StageInstanceManager;
