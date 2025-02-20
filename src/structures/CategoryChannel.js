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

  /**
   * Sets the category parent of this channel.
   * <warn>It is not currently possible to set the parent of a CategoryChannel.</warn>
   * @method setParent
   * @memberof CategoryChannel
   * @instance
   * @param {?CategoryChannelResolvable} channel The channel to set as parent
   * @param {SetParentOptions} [options={}] The options for setting the parent
   * @returns {Promise<GuildChannel>}
   */
}

module.exports = CategoryChannel;
