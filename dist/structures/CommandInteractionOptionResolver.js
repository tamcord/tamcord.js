// @ts-nocheck
'use strict';
const { TypeError } = require('../errors');
/**
 * A resolver for command interaction options.
 */
class CommandInteractionOptionResolver {
    constructor(client, options) {
        var _a, _b, _c, _d;
        /**
         * The client that instantiated this.
         * @name CommandInteractionOptionResolver#client
         * @type {Client}
         * @readonly
         */
        Object.defineProperty(this, 'client', { value: client });
        /**
         * The name of the subcommand group.
         * @type {?string}
         * @private
         */
        this._group = null;
        /**
         * The name of the subcommand.
         * @type {?string}
         * @private
         */
        this._subcommand = null;
        /**
         * The bottom-level options for the interaction.
         * If there is a subcommand (or subcommand and group), this is the options for the subcommand.
         * @type {CommandInteractionOption[]}
         * @private
         */
        this._hoistedOptions = options;
        // Hoist subcommand group if present
        if (((_a = this._hoistedOptions[0]) === null || _a === void 0 ? void 0 : _a.type) === 'SUB_COMMAND_GROUP') {
            this._group = this._hoistedOptions[0].name;
            this._hoistedOptions = (_b = this._hoistedOptions[0].options) !== null && _b !== void 0 ? _b : [];
        }
        // Hoist subcommand if present
        if (((_c = this._hoistedOptions[0]) === null || _c === void 0 ? void 0 : _c.type) === 'SUB_COMMAND') {
            this._subcommand = this._hoistedOptions[0].name;
            this._hoistedOptions = (_d = this._hoistedOptions[0].options) !== null && _d !== void 0 ? _d : [];
        }
        /**
         * The interaction options array.
         * @name CommandInteractionOptionResolver#data
         * @type {ReadonlyArray<CommandInteractionOption>}
         * @readonly
         */
        Object.defineProperty(this, 'data', { value: Object.freeze([...options]) });
    }
    /**
     * Gets an option by its name.
     * @param {string} name The name of the option.
     * @param {boolean} [required=false] Whether to throw an error if the option is not found.
     * @returns {?CommandInteractionOption} The option, if found.
     */
    get(name, required = false) {
        const option = this._hoistedOptions.find(opt => opt.name === name);
        if (!option) {
            if (required) {
                throw new TypeError('COMMAND_INTERACTION_OPTION_NOT_FOUND', name);
            }
            return null;
        }
        return option;
    }
    /**
     * Gets an option by name and property and checks its type.
     * @param {string} name The name of the option.
     * @param {ApplicationCommandOptionType} type The type of the option.
     * @param {string[]} properties The properties to check for for `required`.
     * @param {boolean} required Whether to throw an error if the option is not found.
     * @returns {?CommandInteractionOption} The option, if found.
     * @private
     */
    _getTypedOption(name, type, properties, required) {
        const option = this.get(name, required);
        if (!option) {
            return null;
        }
        else if (option.type !== type) {
            throw new TypeError('COMMAND_INTERACTION_OPTION_TYPE', name, option.type, type);
        }
        else if (required && properties.every(prop => option[prop] === null || typeof option[prop] === 'undefined')) {
            throw new TypeError('COMMAND_INTERACTION_OPTION_EMPTY', name, option.type);
        }
        return option;
    }
    /**
     * Gets the selected subcommand.
     * @param {boolean} [required=true] Whether to throw an error if there is no subcommand.
     * @returns {?string} The name of the selected subcommand, or null if not set and not required.
     */
    getSubcommand(required = true) {
        if (required && !this._subcommand) {
            throw new TypeError('COMMAND_INTERACTION_OPTION_NO_SUB_COMMAND');
        }
        return this._subcommand;
    }
    /**
     * Gets the selected subcommand group.
     * @param {boolean} [required=true] Whether to throw an error if there is no subcommand group.
     * @returns {?string} The name of the selected subcommand group, or null if not set and not required.
     */
    getSubcommandGroup(required = true) {
        if (required && !this._group) {
            throw new TypeError('COMMAND_INTERACTION_OPTION_NO_SUB_COMMAND_GROUP');
        }
        return this._group;
    }
    /**
     * Gets a boolean option.
     * @param {string} name The name of the option.
     * @param {boolean} [required=false] Whether to throw an error if the option is not found.
     * @returns {?boolean} The value of the option, or null if not set and not required.
     */
    getBoolean(name, required = false) {
        var _a;
        const option = this._getTypedOption(name, 'BOOLEAN', ['value'], required);
        return (_a = option === null || option === void 0 ? void 0 : option.value) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Gets a channel option.
     * @param {string} name The name of the option.
     * @param {boolean} [required=false] Whether to throw an error if the option is not found.
     * @returns {?(GuildChannel|APIGuildChannel)}
     * The value of the option, or null if not set and not required.
     */
    getChannel(name, required = false) {
        var _a;
        const option = this._getTypedOption(name, 'CHANNEL', ['channel'], required);
        return (_a = option === null || option === void 0 ? void 0 : option.channel) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Gets a string option.
     * @param {string} name The name of the option.
     * @param {boolean} [required=false] Whether to throw an error if the option is not found.
     * @returns {?string} The value of the option, or null if not set and not required.
     */
    getString(name, required = false) {
        var _a;
        const option = this._getTypedOption(name, 'STRING', ['value'], required);
        return (_a = option === null || option === void 0 ? void 0 : option.value) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Gets an integer option.
     * @param {string} name The name of the option.
     * @param {boolean} [required=false] Whether to throw an error if the option is not found.
     * @returns {?number} The value of the option, or null if not set and not required.
     */
    getInteger(name, required = false) {
        var _a;
        const option = this._getTypedOption(name, 'INTEGER', ['value'], required);
        return (_a = option === null || option === void 0 ? void 0 : option.value) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Gets a number option.
     * @param {string} name The name of the option.
     * @param {boolean} [required=false] Whether to throw an error if the option is not found.
     * @returns {?number} The value of the option, or null if not set and not required.
     */
    getNumber(name, required = false) {
        var _a;
        const option = this._getTypedOption(name, 'NUMBER', ['value'], required);
        return (_a = option === null || option === void 0 ? void 0 : option.value) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Gets a user option.
     * @param {string} name The name of the option.
     * @param {boolean} [required=false] Whether to throw an error if the option is not found.
     * @returns {?User} The value of the option, or null if not set and not required.
     */
    getUser(name, required = false) {
        var _a;
        const option = this._getTypedOption(name, 'USER', ['user'], required);
        return (_a = option === null || option === void 0 ? void 0 : option.user) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Gets a member option.
     * @param {string} name The name of the option.
     * @param {boolean} [required=false] Whether to throw an error if the option is not found.
     * @returns {?(GuildMember|APIGuildMember)}
     * The value of the option, or null if not set and not required.
     */
    getMember(name, required = false) {
        var _a;
        const option = this._getTypedOption(name, 'USER', ['member'], required);
        return (_a = option === null || option === void 0 ? void 0 : option.member) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Gets a role option.
     * @param {string} name The name of the option.
     * @param {boolean} [required=false] Whether to throw an error if the option is not found.
     * @returns {?(Role|APIRole)} The value of the option, or null if not set and not required.
     */
    getRole(name, required = false) {
        var _a;
        const option = this._getTypedOption(name, 'ROLE', ['role'], required);
        return (_a = option === null || option === void 0 ? void 0 : option.role) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Gets a mentionable option.
     * @param {string} name The name of the option.
     * @param {boolean} [required=false] Whether to throw an error if the option is not found.
     * @returns {?(User|GuildMember|APIGuildMember|Role|APIRole)}
     * The value of the option, or null if not set and not required.
     */
    getMentionable(name, required = false) {
        var _a, _b, _c;
        const option = this._getTypedOption(name, 'MENTIONABLE', ['user', 'member', 'role'], required);
        return (_c = (_b = (_a = option === null || option === void 0 ? void 0 : option.member) !== null && _a !== void 0 ? _a : option === null || option === void 0 ? void 0 : option.user) !== null && _b !== void 0 ? _b : option === null || option === void 0 ? void 0 : option.role) !== null && _c !== void 0 ? _c : null;
    }
    /**
     * Gets a message option.
     * @param {string} name The name of the option.
     * @param {boolean} [required=false] Whether to throw an error if the option is not found.
     * @returns {?(Message|APIMessage)}
     * The value of the option, or null if not set and not required.
     */
    getMessage(name, required = false) {
        var _a;
        const option = this._getTypedOption(name, '_MESSAGE', ['message'], required);
        return (_a = option === null || option === void 0 ? void 0 : option.message) !== null && _a !== void 0 ? _a : null;
    }
}
module.exports = CommandInteractionOptionResolver;
