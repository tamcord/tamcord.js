'use strict';
const Interaction = require('./Interaction');
const InteractionWebhook = require('./InteractionWebhook');
const InteractionResponses = require('./interfaces/InteractionResponses');
const { ApplicationCommandOptionTypes } = require('../util/Constants');
/**
 * Represents a command interaction.
 * @extends {Interaction}
 * @implements {InteractionResponses}
 * @abstract
 */
class BaseCommandInteraction extends Interaction {
    constructor(client, data) {
        super(client, data);
        /**
         * The channel this interaction was sent in
         * @type {?TextBasedChannels}
         * @name BaseCommandInteraction#channel
         * @readonly
         */
        /**
         * The id of the channel this interaction was sent in
         * @type {Snowflake}
         * @name BaseCommandInteraction#channelId
         */
        /**
         * The invoked application command's id
         * @type {Snowflake}
         */
        this.commandId = data.data.id;
        /**
         * The invoked application command's name
         * @type {string}
         */
        this.commandName = data.data.name;
        /**
         * Whether the reply to this interaction has been deferred
         * @type {boolean}
         */
        this.deferred = false;
        /**
         * Whether this interaction has already been replied to
         * @type {boolean}
         */
        this.replied = false;
        /**
         * Whether the reply to this interaction is ephemeral
         * @type {?boolean}
         */
        this.ephemeral = null;
        /**
         * An associated interaction webhook, can be used to further interact with this interaction
         * @type {InteractionWebhook}
         */
        this.webhook = new InteractionWebhook(this.client, this.applicationId, this.token);
    }
    /**
     * The invoked application command, if it was fetched before
     * @type {?ApplicationCommand}
     */
    get command() {
        var _a, _b, _c;
        const id = this.commandId;
        return (_c = (_b = (_a = this.guild) === null || _a === void 0 ? void 0 : _a.commands.cache.get(id)) !== null && _b !== void 0 ? _b : this.client.application.commands.cache.get(id)) !== null && _c !== void 0 ? _c : null;
    }
    /**
     * Represents an option of a received command interaction.
     * @typedef {Object} CommandInteractionOption
     * @property {string} name The name of the option
     * @property {ApplicationCommandOptionType} type The type of the option
     * @property {string|number|boolean} [value] The value of the option
     * @property {CommandInteractionOption[]} [options] Additional options if this option is a
     * subcommand (group)
     * @property {User} [user] The resolved user
     * @property {GuildMember|APIGuildMember} [member] The resolved member
     * @property {GuildChannel|APIChannel} [channel] The resolved channel
     * @property {Role|APIRole} [role] The resolved role
     */
    /**
     * Transforms an option received from the API.
     * @param {APIApplicationCommandOption} option The received option
     * @param {APIInteractionDataResolved} resolved The resolved interaction data
     * @returns {CommandInteractionOption}
     * @private
     */
    transformOption(option, resolved) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const result = {
            name: option.name,
            type: ApplicationCommandOptionTypes[option.type],
        };
        if ('value' in option)
            result.value = option.value;
        if ('options' in option)
            result.options = option.options.map(opt => this.transformOption(opt, resolved));
        if (resolved) {
            const user = (_a = resolved.users) === null || _a === void 0 ? void 0 : _a[option.value];
            if (user)
                result.user = this.client.users._add(user);
            const member = (_b = resolved.members) === null || _b === void 0 ? void 0 : _b[option.value];
            if (member)
                result.member = (_d = (_c = this.guild) === null || _c === void 0 ? void 0 : _c.members._add(Object.assign({ user }, member))) !== null && _d !== void 0 ? _d : member;
            const channel = (_e = resolved.channels) === null || _e === void 0 ? void 0 : _e[option.value];
            if (channel)
                result.channel = (_f = this.client.channels._add(channel, this.guild)) !== null && _f !== void 0 ? _f : channel;
            const role = (_g = resolved.roles) === null || _g === void 0 ? void 0 : _g[option.value];
            if (role)
                result.role = (_j = (_h = this.guild) === null || _h === void 0 ? void 0 : _h.roles._add(role)) !== null && _j !== void 0 ? _j : role;
        }
        return result;
    }
    // These are here only for documentation purposes - they are implemented by InteractionResponses
    /* eslint-disable no-empty-function */
    defer() { }
    reply() { }
    fetchReply() { }
    editReply() { }
    deleteReply() { }
    followUp() { }
}
InteractionResponses.applyToClass(BaseCommandInteraction, ['deferUpdate', 'update']);
module.exports = BaseCommandInteraction;
