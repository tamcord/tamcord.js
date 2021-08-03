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
const TextChannel = require('./TextChannel');
const { Error } = require('../errors');
/**
 * Represents a guild news channel on Discord.
 * @extends {TextChannel}
 */
class NewsChannel extends TextChannel {
    _patch(data) {
        super._patch(data);
        // News channels don't have a rate limit per user, remove it
        this.rateLimitPerUser = undefined;
    }
    /**
     * Adds the target to this channel's followers.
     * @param {GuildChannelResolvable} channel The channel where the webhook should be created
     * @param {string} [reason] Reason for creating the webhook
     * @returns {Promise<NewsChannel>}
     * @example
     * if (channel.type === 'news') {
     *   channel.addFollower('222197033908436994', 'Important announcements')
     *     .then(() => console.log('Added follower'))
     *     .catch(console.error);
     * }
     */
    addFollower(channel, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelID = this.guild.channels.resolveID(channel);
            if (!channelID)
                throw new Error('GUILD_CHANNEL_RESOLVE');
            yield this.client.api.channels(this.id).followers.post({ data: { webhook_channel_id: channelID }, reason });
            return this;
        });
    }
}
module.exports = NewsChannel;
