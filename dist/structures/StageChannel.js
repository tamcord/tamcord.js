'use strict';
const BaseGuildVoiceChannel = require('./BaseGuildVoiceChannel');
/**
 * Represents a guild stage channel on Discord.
 * @extends {BaseGuildVoiceChannel}
 */
class StageChannel extends BaseGuildVoiceChannel {
    _patch(data) {
        super._patch(data);
        if ('topic' in data) {
            /**
             * The topic of the stage channel
             * @type {?string}
             */
            this.topic = data.topic;
        }
    }
    /**
     * The instance of this stage channel, if it exists
     * @type {?StageInstance}
     * @readonly
     */
    get instance() {
        var _a;
        return (_a = this.guild.stageInstances.cache.find(stageInstance => stageInstance.channelID === this.id)) !== null && _a !== void 0 ? _a : null;
    }
}
module.exports = StageChannel;
