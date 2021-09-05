// @ts-nocheck
'use strict';
const { Events } = require('../../util/Constants');
/**
 * Manages voice connections for the client
 */
class ClientVoiceManager {
    constructor(client) {
        /**
         * The client that instantiated this voice manager
         * @type {Client}
         * @readonly
         * @name ClientVoiceManager#client
         */
        Object.defineProperty(this, 'client', { value: client });
        /**
         * Maps guild ids to voice adapters created for use with @discordjs/voice.
         * @type {Map<Snowflake, Object>}
         */
        this.adapters = new Map();
        client.on(Events.SHARD_DISCONNECT, (_, shardId) => {
            var _a;
            for (const [guildId, adapter] of this.adapters.entries()) {
                if (((_a = client.guilds.cache.get(guildId)) === null || _a === void 0 ? void 0 : _a.shardId) === shardId) {
                    adapter.destroy();
                }
            }
        });
    }
    onVoiceServer(payload) {
        var _a;
        (_a = this.adapters.get(payload.guild_id)) === null || _a === void 0 ? void 0 : _a.onVoiceServerUpdate(payload);
    }
    onVoiceStateUpdate(payload) {
        var _a, _b;
        if (payload.guild_id && payload.session_id && payload.user_id === ((_a = this.client.user) === null || _a === void 0 ? void 0 : _a.id)) {
            (_b = this.adapters.get(payload.guild_id)) === null || _b === void 0 ? void 0 : _b.onVoiceStateUpdate(payload);
        }
    }
}
module.exports = ClientVoiceManager;
