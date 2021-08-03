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
         * The type of this interaction
         * @type {InteractionType}
         */
        this.type = InteractionTypes[data.type];
        /**
         * The ID of this interaction
         * @type {Snowflake}
         */
        this.id = data.id;
        /**
         * The token of this interaction
         * @type {string}
         * @name Interaction#token
         * @readonly
         */
        Object.defineProperty(this, 'token', { value: data.token });
        /**
         * The ID of the application
         * @type {Snowflake}
         */
        this.applicationID = data.application_id;
        /**
         * The ID of the channel this interaction was sent in
         * @type {?Snowflake}
         */
        this.channelID = (_a = data.channel_id) !== null && _a !== void 0 ? _a : null;
        /**
         * The ID of the guild this interaction was sent in
         * @type {?Snowflake}
         */
        this.guildID = (_b = data.guild_id) !== null && _b !== void 0 ? _b : null;
        /**
         * The user which sent this interaction
         * @type {User}
         */
        this.user = this.client.users.add((_c = data.user) !== null && _c !== void 0 ? _c : data.member.user);
        /**
         * If this interaction was sent in a guild, the member which sent it
         * @type {?GuildMember|APIGuildMember}
         */
        this.member = data.member ? (_e = (_d = this.guild) === null || _d === void 0 ? void 0 : _d.members.add(data.member)) !== null && _e !== void 0 ? _e : data.member : null;
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
     * @type {?Channel}
     * @readonly
     */
    get channel() {
        var _a;
        return (_a = this.client.channels.cache.get(this.channelID)) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * The guild this interaction was sent in
     * @type {?Guild}
     * @readonly
     */
    get guild() {
        var _a;
        return (_a = this.client.guilds.cache.get(this.guildID)) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Indicates whether this interaction is a command interaction.
     * @returns {boolean}
     */
    isCommand() {
        return InteractionTypes[this.type] === InteractionTypes.APPLICATION_COMMAND;
    }
    /**
     * Indicates whether this interaction is a message component interaction.
     * @returns {boolean}
     */
    isMessageComponent() {
        return InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT;
    }
    /**
     * Indicates whether this interaction is a button interaction.
     * @returns {boolean}
     */
    isButton() {
        return (InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT &&
            MessageComponentTypes[this.componentType] === MessageComponentTypes.BUTTON);
    }
    /**
     * Indicates whether this interaction is a select menu interaction.
     * @returns {boolean}
     */
    isSelectMenu() {
        return (InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT &&
            MessageComponentTypes[this.componentType] === MessageComponentTypes.SELECT_MENU);
    }
}
module.exports = Interaction;
