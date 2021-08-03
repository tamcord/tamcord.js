'use strict';
const Interaction = require('./Interaction');
const InteractionWebhook = require('./InteractionWebhook');
const InteractionResponses = require('./interfaces/InteractionResponses');
const Collection = require('../util/Collection');
const { ApplicationCommandOptionTypes } = require('../util/Constants');
/**
 * Represents a command interaction.
 * @extends {Interaction}
 * @implements {InteractionResponses}
 */
class CommandInteraction extends Interaction {
    constructor(client, data) {
        super(client, data);
        /**
         * The channel this interaction was sent in
         * @type {?TextChannel|NewsChannel|DMChannel}
         * @name CommandInteraction#channel
         * @readonly
         */
        /**
         * The ID of the channel this interaction was sent in
         * @type {Snowflake}
         * @name CommandInteraction#channelID
         */
        /**
         * The ID of the invoked application command
         * @type {Snowflake}
         */
        this.commandID = data.data.id;
        /**
         * The name of the invoked application command
         * @type {string}
         */
        this.commandName = data.data.name;
        /**
         * Whether the reply to this interaction has been deferred
         * @type {boolean}
         */
        this.deferred = false;
        /**
         * The options passed to the command.
         * @type {Collection<string, CommandInteractionOption>}
         */
        this.options = this._createOptionsCollection(data.data.options, data.data.resolved);
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
        this.webhook = new InteractionWebhook(this.client, this.applicationID, this.token);
    }
    /**
     * The invoked application command, if it was fetched before
     * @type {?ApplicationCommand}
     */
    get command() {
        var _a, _b, _c;
        const id = this.commandID;
        return (_c = (_b = (_a = this.guild) === null || _a === void 0 ? void 0 : _a.commands.cache.get(id)) !== null && _b !== void 0 ? _b : this.client.application.commands.cache.get(id)) !== null && _c !== void 0 ? _c : null;
    }
    /**
     * Represents an option of a received command interaction.
     * @typedef {Object} CommandInteractionOption
     * @property {string} name The name of the option
     * @property {ApplicationCommandOptionType} type The type of the option
     * @property {string|number|boolean} [value] The value of the option
     * @property {Collection<string, CommandInteractionOption>} [options] Additional options if this option is a
     * subcommand (group)
     * @property {User} [user] The resolved user
     * @property {GuildMember|APIGuildMember} [member] The resolved member
     * @property {GuildChannel|APIChannel} [channel] The resolved channel
     * @property {Role|APIRole} [role] The resolved role
     */
    /**
     * Transforms an option received from the API.
     * @param {APIApplicationCommandOption} option The received option
     * @param {APIApplicationCommandOptionResolved} resolved The resolved interaction data
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
            result.options = this._createOptionsCollection(option.options, resolved);
        const user = (_a = resolved === null || resolved === void 0 ? void 0 : resolved.users) === null || _a === void 0 ? void 0 : _a[option.value];
        if (user)
            result.user = this.client.users.add(user);
        const member = (_b = resolved === null || resolved === void 0 ? void 0 : resolved.members) === null || _b === void 0 ? void 0 : _b[option.value];
        if (member)
            result.member = (_d = (_c = this.guild) === null || _c === void 0 ? void 0 : _c.members.add(Object.assign({ user }, member))) !== null && _d !== void 0 ? _d : member;
        const channel = (_e = resolved === null || resolved === void 0 ? void 0 : resolved.channels) === null || _e === void 0 ? void 0 : _e[option.value];
        if (channel)
            result.channel = (_f = this.client.channels.add(channel, this.guild)) !== null && _f !== void 0 ? _f : channel;
        const role = (_g = resolved === null || resolved === void 0 ? void 0 : resolved.roles) === null || _g === void 0 ? void 0 : _g[option.value];
        if (role)
            result.role = (_j = (_h = this.guild) === null || _h === void 0 ? void 0 : _h.roles.add(role)) !== null && _j !== void 0 ? _j : role;
        return result;
    }
    /**
     * Creates a collection of options from the received options array.
     * @param {APIApplicationCommandOption[]} options The received options
     * @param {APIApplicationCommandOptionResolved} resolved The resolved interaction data
     * @returns {Collection<string, CommandInteractionOption>}
     * @private
     */
    _createOptionsCollection(options, resolved) {
        const optionsCollection = new Collection();
        if (typeof options === 'undefined')
            return optionsCollection;
        for (const option of options) {
            optionsCollection.set(option.name, this.transformOption(option, resolved));
        }
        return optionsCollection;
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
InteractionResponses.applyToClass(CommandInteraction, ['deferUpdate', 'update']);
module.exports = CommandInteraction;
