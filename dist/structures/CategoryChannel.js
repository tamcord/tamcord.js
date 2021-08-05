// @ts-nocheck
'use strict';
const GuildChannel = require('./GuildChannel');
/**
 * Represents a guild category channel on Discord.
 * @extends {GuildChannel}
 */
class CategoryChannel extends GuildChannel {
    /**
     * @param {Guild} guild The guild the guild channel is part of
     * @param {APIChannel} data The data for the guild channel
     * @param {Client} [client] A safety parameter for the client that instantiated this
     * @param {boolean} [immediatePatch=true] Control variable for patching
     */
    constructor(guild, data, client, immediatePatch = true) {
        super(guild, data, client, immediatePatch);
        this.collapsed = false;
    }
    /**
     * Channels that are a part of this category
     * @type {Collection<Snowflake, GuildChannel>}
     * @readonly
     */
    get children() {
        return this.guild.channels.cache.filter(c => c.parentId === this.id);
    }
}
module.exports = CategoryChannel;
