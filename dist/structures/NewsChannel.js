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
const BaseGuildTextChannel = require('./BaseGuildTextChannel');
const { Error } = require('../errors');
/**
 * Represents a guild news channel on Discord.
 * @extends {BaseGuildTextChannel}
 */
class NewsChannel extends BaseGuildTextChannel {
    /**
     * Adds the target to this channel's followers.
     * @param {GuildChannelResolvable} channel The channel where the webhook should be created
     * @param {string} [reason] Reason for creating the webhook
     * @returns {Promise<NewsChannel>}
     * @example
     * if (channel.type === 'GUILD_NEWS') {
     *   channel.addFollower('222197033908436994', 'Important announcements')
     *     .then(() => console.log('Added follower'))
     *     .catch(console.error);
     * }
     */
    addFollower(channel, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelId = this.guild.channels.resolveId(channel);
            if (!channelId)
                throw new Error('GUILD_CHANNEL_RESOLVE');
            yield this.client.api.channels(this.id).followers.post({ data: { webhook_channel_id: channelId }, reason });
            return this;
        });
    }
}
module.exports = NewsChannel;
