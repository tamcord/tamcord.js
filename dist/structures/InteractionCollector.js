// @ts-nocheck
'use strict';
const Collection = require('../util/Collection');
const Collector = require('./interfaces/Collector');
const { Events } = require('../util/Constants');
const { InteractionTypes, MessageComponentTypes } = require('../util/Constants');
/**
 * @typedef {CollectorOptions} InteractionCollectorOptions
 * @property {TextBasedChannels} [channel] The channel to listen to interactions from
 * @property {MessageComponentType} [componentType] The type of component to listen for
 * @property {Guild} [guild] The guild to listen to interactions from
 * @property {InteractionType} [interactionType] The type of interaction to listen for
 * @property {number} [max] The maximum total amount of interactions to collect
 * @property {number} [maxComponents] The maximum number of components to collect
 * @property {number} [maxUsers] The maximum number of users to interact
 * @property {Message|APIMessage} [message] The message to listen to interactions from
 */
/**
 * Collects interactions.
 * Will automatically stop if the message ({@link Client#messageDelete messageDelete}),
 * channel ({@link Client#channelDelete channelDelete}), or guild ({@link Client#guildDelete guildDelete}) is deleted.
 * @extends {Collector}
 */
class InteractionCollector extends Collector {
    /**
     * @param {Client} client The client on which to collect interactions
     * @param {InteractionCollectorOptions} [options={}] The options to apply to this collector
     */
    constructor(client, options = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        super(client, options);
        /**
         * The message from which to collect interactions, if provided
         * @type {?Snowflake}
         */
        this.messageId = (_b = (_a = options.message) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
        /**
         * The channel from which to collect interactions, if provided
         * @type {?Snowflake}
         */
        this.channelId =
            (_f = (_d = this.client.channels.resolveId((_c = options.message) === null || _c === void 0 ? void 0 : _c.channel)) !== null && _d !== void 0 ? _d : (_e = options.message) === null || _e === void 0 ? void 0 : _e.channel_id) !== null && _f !== void 0 ? _f : this.client.channels.resolveId(options.channel);
        /**
         * The guild from which to collect interactions, if provided
         * @type {?Snowflake}
         */
        this.guildId =
            (_m = (_k = (_h = this.client.guilds.resolveId((_g = options.message) === null || _g === void 0 ? void 0 : _g.guild)) !== null && _h !== void 0 ? _h : (_j = options.message) === null || _j === void 0 ? void 0 : _j.guild_id) !== null && _k !== void 0 ? _k : this.client.guilds.resolveId((_l = options.channel) === null || _l === void 0 ? void 0 : _l.guild)) !== null && _m !== void 0 ? _m : this.client.guilds.resolveId(options.guild);
        /**
         * The the type of interaction to collect
         * @type {?InteractionType}
         */
        this.interactionType =
            typeof options.interactionType === 'number'
                ? InteractionTypes[options.interactionType]
                : (_o = options.interactionType) !== null && _o !== void 0 ? _o : null;
        /**
         * The the type of component to collect
         * @type {?MessageComponentType}
         */
        this.componentType =
            typeof options.componentType === 'number'
                ? MessageComponentTypes[options.componentType]
                : (_p = options.componentType) !== null && _p !== void 0 ? _p : null;
        /**
         * The users which have interacted to this collector
         * @type {Collection<Snowflake, User>}
         */
        this.users = new Collection();
        /**
         * The total number of interactions collected
         * @type {number}
         */
        this.total = 0;
        this.empty = this.empty.bind(this);
        this.client.incrementMaxListeners();
        if (this.messageId) {
            this._handleMessageDeletion = this._handleMessageDeletion.bind(this);
            this.client.on(Events.MESSAGE_DELETE, this._handleMessageDeletion);
        }
        if (this.channelId) {
            this._handleChannelDeletion = this._handleChannelDeletion.bind(this);
            this.client.on(Events.CHANNEL_DELETE, this._handleChannelDeletion);
        }
        if (this.guildId) {
            this._handleGuildDeletion = this._handleGuildDeletion.bind(this);
            this.client.on(Events.GUILD_DELETE, this._handleGuildDeletion);
        }
        this.client.on(Events.INTERACTION_CREATE, this.handleCollect);
        this.once('end', () => {
            this.client.removeListener(Events.INTERACTION_CREATE, this.handleCollect);
            this.client.removeListener(Events.MESSAGE_DELETE, this._handleMessageDeletion);
            this.client.removeListener(Events.CHANNEL_DELETE, this._handleChannelDeletion);
            this.client.removeListener(Events.GUILD_DELETE, this._handleGuildDeletion);
            this.client.decrementMaxListeners();
        });
        this.on('collect', interaction => {
            this.total++;
            this.users.set(interaction.user.id, interaction.user);
        });
    }
    /**
     * Handles an incoming interaction for possible collection.
     * @param {Interaction} interaction The interaction to possibly collect
     * @returns {?Snowflake}
     * @private
     */
    collect(interaction) {
        var _a;
        /**
         * Emitted whenever an interaction is collected.
         * @event InteractionCollector#collect
         * @param {Interaction} interaction The interaction that was collected
         */
        if (this.interactionType && interaction.type !== this.interactionType)
            return null;
        if (this.componentType && interaction.componentType !== this.componentType)
            return null;
        if (this.messageId && ((_a = interaction.message) === null || _a === void 0 ? void 0 : _a.id) !== this.messageId)
            return null;
        if (this.channelId && interaction.channelId !== this.channelId)
            return null;
        if (this.guildId && interaction.guildId !== this.guildId)
            return null;
        return interaction.id;
    }
    /**
     * Handles an interaction for possible disposal.
     * @param {Interaction} interaction The interaction that could be disposed of
     * @returns {?Snowflake}
     */
    dispose(interaction) {
        var _a;
        /**
         * Emitted whenever an interaction is disposed of.
         * @event InteractionCollector#dispose
         * @param {Interaction} interaction The interaction that was disposed of
         */
        if (this.type && interaction.type !== this.type)
            return null;
        if (this.componentType && interaction.componentType !== this.componentType)
            return null;
        if (this.messageId && ((_a = interaction.message) === null || _a === void 0 ? void 0 : _a.id) !== this.messageId)
            return null;
        if (this.channelId && interaction.channelId !== this.channelId)
            return null;
        if (this.guildId && interaction.guildId !== this.guildId)
            return null;
        return interaction.id;
    }
    /**
     * Empties this interaction collector.
     */
    empty() {
        this.total = 0;
        this.collected.clear();
        this.users.clear();
        this.checkEnd();
    }
    /**
     * The reason this collector has ended with, or null if it hasn't ended yet
     * @type {?string}
     * @readonly
     */
    get endReason() {
        if (this.options.max && this.total >= this.options.max)
            return 'limit';
        if (this.options.maxComponents && this.collected.size >= this.options.maxComponents)
            return 'componentLimit';
        if (this.options.maxUsers && this.users.size >= this.options.maxUsers)
            return 'userLimit';
        return null;
    }
    /**
     * Handles checking if the message has been deleted, and if so, stops the collector with the reason 'messageDelete'.
     * @private
     * @param {Message} message The message that was deleted
     * @returns {void}
     */
    _handleMessageDeletion(message) {
        if (message.id === this.messageId) {
            this.stop('messageDelete');
        }
    }
    /**
     * Handles checking if the channel has been deleted, and if so, stops the collector with the reason 'channelDelete'.
     * @private
     * @param {GuildChannel} channel The channel that was deleted
     * @returns {void}
     */
    _handleChannelDeletion(channel) {
        if (channel.id === this.channelId) {
            this.stop('channelDelete');
        }
    }
    /**
     * Handles checking if the guild has been deleted, and if so, stops the collector with the reason 'guildDelete'.
     * @private
     * @param {Guild} guild The guild that was deleted
     * @returns {void}
     */
    _handleGuildDeletion(guild) {
        if (guild.id === this.guildId) {
            this.stop('guildDelete');
        }
    }
}
module.exports = InteractionCollector;
