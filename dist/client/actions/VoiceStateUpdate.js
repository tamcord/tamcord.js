// @ts-nocheck
'use strict';
const Action = require('./Action');
const VoiceState = require('../../structures/VoiceState');
const { Events } = require('../../util/Constants');
class VoiceStateUpdate extends Action {
    handle(data) {
        var _a, _b, _c;
        const client = this.client;
        const guild = client.guilds.cache.get(data.guild_id);
        if (guild) {
            // Update the state
            const oldState = (_b = (_a = guild.voiceStates.cache.get(data.user_id)) === null || _a === void 0 ? void 0 : _a._clone()) !== null && _b !== void 0 ? _b : new VoiceState(guild, { user_id: data.user_id });
            const newState = guild.voiceStates._add(data);
            // Get the member
            let member = guild.members.cache.get(data.user_id);
            if (member && data.member) {
                member._patch(data.member);
            }
            else if (((_c = data.member) === null || _c === void 0 ? void 0 : _c.user) && data.member.joined_at) {
                member = guild.members._add(data.member);
            }
            // Emit event
            if ((member === null || member === void 0 ? void 0 : member.user.id) === client.user.id) {
                client.emit('debug', `[VOICE] received voice state update: ${JSON.stringify(data)}`);
                client.voice.onVoiceStateUpdate(data);
            }
            /**
             * Emitted whenever a member changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
             * @event Client#voiceStateUpdate
             * @param {VoiceState} oldState The voice state before the update
             * @param {VoiceState} newState The voice state after the update
             */
            client.emit(Events.VOICE_STATE_UPDATE, oldState, newState);
        }
    }
}
module.exports = VoiceStateUpdate;
