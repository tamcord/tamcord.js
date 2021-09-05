// @ts-nocheck
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
     * The stage instance of this stage channel, if it exists
     * @type {?StageInstance}
     * @readonly
     */
    get stageInstance() {
        var _a;
        return (_a = this.guild.stageInstances.cache.find(stageInstance => stageInstance.channelId === this.id)) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Creates a stage instance associated to this stage channel.
     * @param {StageInstanceCreateOptions} options The options to create the stage instance
     * @returns {Promise<StageInstance>}
     */
    createStageInstance(options) {
        return this.guild.stageInstances.create(this.id, options);
    }
    /**
     * Sets a new topic for the guild channel.
     * @param {?string} topic The new topic for the guild channel
     * @param {string} [reason] Reason for changing the guild channel's topic
     * @returns {Promise<GuildChannel>}
     * @example
     * // Set a new channel topic
     * channel.setTopic('needs more rate limiting')
     *   .then(newChannel => console.log(`Channel's new topic is ${newChannel.topic}`))
     *   .catch(console.error);
     */
    setTopic(topic, reason) {
        return this.edit({ topic }, reason);
    }
}
module.exports = StageChannel;
