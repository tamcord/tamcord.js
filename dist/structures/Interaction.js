// @ts-nocheck
'use strict';
const Base = require('./Base');
const { InteractionTypes, MessageComponentTypes } = require('../util/Constants');
const SnowflakeUtil = require('../util/SnowflakeUtil');
/**
 * Represents an interaction.
 * @extends {Base}
 */
class Interaction extends Base {
    constructor(client, data) {
        var _a, _b, _c, _d, _e;
        super(client);
        /**
         * The interaction's type
         * @type {InteractionType}
         */
        this.type = InteractionTypes[data.type];
        /**
         * The interaction's id
         * @type {Snowflake}
         */
        this.id = data.id;
        /**
         * The interaction's token
         * @type {string}
         * @name Interaction#token
         * @readonly
         */
        Object.defineProperty(this, 'token', { value: data.token });
        /**
         * The application's id
         * @type {Snowflake}
         */
        this.applicationId = data.application_id;
        /**
         * The id of the channel this interaction was sent in
         * @type {?Snowflake}
         */
        this.channelId = (_a = data.channel_id) !== null && _a !== void 0 ? _a : null;
        /**
         * The id of the guild this interaction was sent in
         * @type {?Snowflake}
         */
        this.guildId = (_b = data.guild_id) !== null && _b !== void 0 ? _b : null;
        /**
         * The user which sent this interaction
         * @type {User}
         */
        this.user = this.client.users._add((_c = data.user) !== null && _c !== void 0 ? _c : data.member.user);
        /**
         * If this interaction was sent in a guild, the member which sent it
         * @type {?(GuildMember|APIGuildMember)}
         */
        this.member = data.member ? (_e = (_d = this.guild) === null || _d === void 0 ? void 0 : _d.members._add(data.member)) !== null && _e !== void 0 ? _e : data.member : null;
        /**
         * The version
         * @type {number}
         */
        this.version = data.version;
    }
    /**
     * The timestamp the interaction was created at
     * @type {number}
     * @readonly
     */
    get createdTimestamp() {
        return SnowflakeUtil.deconstruct(this.id).timestamp;
    }
    /**
     * The time the interaction was created at
     * @type {Date}
     * @readonly
     */
    get createdAt() {
        return new Date(this.createdTimestamp);
    }
    /**
     * The channel this interaction was sent in
     * @type {?TextBasedChannels}
     * @readonly
     */
    get channel() {
        var _a;
        return (_a = this.client.channels.cache.get(this.channelId)) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * The guild this interaction was sent in
     * @type {?Guild}
     * @readonly
     */
    get guild() {
        var _a;
        return (_a = this.client.guilds.cache.get(this.guildId)) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Indicates whether this interaction is received from a guild.
     * @returns {boolean}
     */
    inGuild() {
        return Boolean(this.guildId && this.member);
    }
    /**
     * Indicates whether this interaction is a {@link CommandInteraction}.
     * @returns {boolean}
     */
    isCommand() {
        return InteractionTypes[this.type] === InteractionTypes.APPLICATION_COMMAND && typeof this.targetId === 'undefined';
    }
    /**
     * Indicates whether this interaction is a {@link ContextMenuInteraction}
     * @returns {boolean}
     */
    isContextMenu() {
        return InteractionTypes[this.type] === InteractionTypes.APPLICATION_COMMAND && typeof this.targetId !== 'undefined';
    }
    /**
     * Indicates whether this interaction is a {@link MessageComponentInteraction}.
     * @returns {boolean}
     */
    isMessageComponent() {
        return InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT;
    }
    /**
     * Indicates whether this interaction is a {@link ButtonInteraction}.
     * @returns {boolean}
     */
    isButton() {
        return (InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT &&
            MessageComponentTypes[this.componentType] === MessageComponentTypes.BUTTON);
    }
    /**
     * Indicates whether this interaction is a {@link SelectMenuInteraction}.
     * @returns {boolean}
     */
    isSelectMenu() {
        return (InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT &&
            MessageComponentTypes[this.componentType] === MessageComponentTypes.SELECT_MENU);
    }
}
module.exports = Interaction;
