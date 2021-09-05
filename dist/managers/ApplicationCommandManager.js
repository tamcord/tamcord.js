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
const Collection = require('../util/Collection');
const ApplicationCommandPermissionsManager = require('./ApplicationCommandPermissionsManager');
const CachedManager = require('./CachedManager');
const { TypeError } = require('../errors');
const ApplicationCommand = require('../structures/ApplicationCommand');
const { ApplicationCommandTypes } = require('../util/Constants');
/**
 * Manages API methods for application commands and stores their cache.
 * @extends {CachedManager}
 */
class ApplicationCommandManager extends CachedManager {
    constructor(client, iterable) {
        super(client, ApplicationCommand, iterable);
        /**
         * The manager for permissions of arbitrary commands on arbitrary guilds
         * @type {ApplicationCommandPermissionsManager}
         */
        this.permissions = new ApplicationCommandPermissionsManager(this);
    }
    /**
     * The cache of this manager
     * @type {Collection<Snowflake, ApplicationCommand>}
     * @name ApplicationCommandManager#cache
     */
    _add(data, cache, guildId) {
        return super._add(data, cache, { extras: [this.guild, guildId] });
    }
    /**
     * The APIRouter path to the commands
     * @param {Snowflake} [options.id] The application command's id
     * @param {Snowflake} [options.guildId] The guild's id to use in the path,
     * ignored when using a {@link GuildApplicationCommandManager}
     * @returns {Object}
     * @private
     */
    commandPath({ id, guildId } = {}) {
        var _a, _b, _c;
        let path = this.client.api.applications(this.client.application.id);
        if ((_a = this.guild) !== null && _a !== void 0 ? _a : guildId)
            path = path.guilds((_c = (_b = this.guild) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : guildId);
        return id ? path.commands(id) : path.commands;
    }
    /**
     * Data that resolves to give an ApplicationCommand object. This can be:
     * * An ApplicationCommand object
     * * A Snowflake
     * @typedef {ApplicationCommand|Snowflake} ApplicationCommandResolvable
     */
    /**
     * Options used to fetch data from discord
     * @typedef {Object} BaseFetchOptions
     * @property {boolean} [cache=true] Whether to cache the fetched data if it wasn't already
     * @property {boolean} [force=false] Whether to skip the cache check and request the API
     */
    /**
     * Options used to fetch Application Commands from discord
     * @typedef {BaseFetchOptions} FetchApplicationCommandOptions
     * @property {Snowflake} [guildId] The guild's id to fetch commands for, for when the guild is not cached
     */
    /**
     * Obtains one or multiple application commands from Discord, or the cache if it's already available.
     * @param {Snowflake} [id] The application command's id
     * @param {FetchApplicationCommandOptions} [options] Additional options for this fetch
     * @returns {Promise<ApplicationCommand|Collection<Snowflake, ApplicationCommand>>}
     * @example
     * // Fetch a single command
     * client.application.commands.fetch('123456789012345678')
     *   .then(command => console.log(`Fetched command ${command.name}`))
     *   .catch(console.error);
     * @example
     * // Fetch all commands
     * guild.commands.fetch()
     *   .then(commands => console.log(`Fetched ${commands.size} commands`))
     *   .catch(console.error);
     */
    fetch(id, { guildId, cache = true, force = false } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof id === 'object') {
                ({ guildId, cache = true } = id);
            }
            else if (id) {
                if (!force) {
                    const existing = this.cache.get(id);
                    if (existing)
                        return existing;
                }
                const command = yield this.commandPath({ id, guildId }).get();
                return this._add(command, cache);
            }
            const data = yield this.commandPath({ guildId }).get();
            return data.reduce((coll, command) => coll.set(command.id, this._add(command, cache, guildId)), new Collection());
        });
    }
    /**
     * Creates an application command.
     * @param {ApplicationCommandData} command The command
     * @param {Snowflake} [guildId] The guild's id to create this command in,
     * ignored when using a {@link GuildApplicationCommandManager}
     * @returns {Promise<ApplicationCommand>}
     * @example
     * // Create a new command
     * client.application.commands.create({
     *   name: 'test',
     *   description: 'A test command',
     * })
     *   .then(console.log)
     *   .catch(console.error);
     */
    create(command, guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commandPath({ guildId }).post({
                data: this.constructor.transformCommand(command),
            });
            return this._add(data, !guildId, guildId);
        });
    }
    /**
     * Sets all the commands for this application or guild.
     * @param {ApplicationCommandData[]} commands The commands
     * @param {Snowflake} [guildId] The guild's id to create the commands in,
     * ignored when using a {@link GuildApplicationCommandManager}
     * @returns {Promise<Collection<Snowflake, ApplicationCommand>>}
     * @example
     * // Set all commands to just this one
     * client.application.commands.set([
     *   {
     *     name: 'test',
     *     description: 'A test command',
     *   },
     * ])
     *   .then(console.log)
     *   .catch(console.error);
     * @example
     * // Remove all commands
     * guild.commands.set([])
     *   .then(console.log)
     *   .catch(console.error);
     */
    set(commands, guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commandPath({ guildId }).put({
                data: commands.map(c => this.constructor.transformCommand(c)),
            });
            return data.reduce((coll, command) => coll.set(command.id, this._add(command, !guildId, guildId)), new Collection());
        });
    }
    /**
     * Edits an application command.
     * @param {ApplicationCommandResolvable} command The command to edit
     * @param {ApplicationCommandData} data The data to update the command with
     * @param {Snowflake} [guildId] The guild's id where the command registered,
     * ignored when using a {@link GuildApplicationCommandManager}
     * @returns {Promise<ApplicationCommand>}
     * @example
     * // Edit an existing command
     * client.application.commands.edit('123456789012345678', {
     *   description: 'New description',
     * })
     *   .then(console.log)
     *   .catch(console.error);
     */
    edit(command, data, guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.resolveId(command);
            if (!id)
                throw new TypeError('INVALID_TYPE', 'command', 'ApplicationCommandResolvable');
            const patched = yield this.commandPath({ id, guildId }).patch({ data: this.constructor.transformCommand(data) });
            return this._add(patched, !guildId, guildId);
        });
    }
    /**
     * Deletes an application command.
     * @param {ApplicationCommandResolvable} command The command to delete
     * @param {Snowflake} [guildId] The guild's id where the command is registered,
     * ignored when using a {@link GuildApplicationCommandManager}
     * @returns {Promise<?ApplicationCommand>}
     * @example
     * // Delete a command
     * guild.commands.delete('123456789012345678')
     *   .then(console.log)
     *   .catch(console.error);
     */
    delete(command, guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.resolveId(command);
            if (!id)
                throw new TypeError('INVALID_TYPE', 'command', 'ApplicationCommandResolvable');
            yield this.commandPath({ id, guildId }).delete();
            const cached = this.cache.get(id);
            if (!guildId)
                this.cache.delete(id);
            return cached !== null && cached !== void 0 ? cached : null;
        });
    }
    /**
     * Transforms an {@link ApplicationCommandData} object into something that can be used with the API.
     * @param {ApplicationCommandData} command The command to transform
     * @returns {APIApplicationCommand}
     * @private
     */
    static transformCommand(command) {
        var _a;
        return {
            name: command.name,
            description: command.description,
            type: typeof command.type === 'number' ? command.type : ApplicationCommandTypes[command.type],
            options: (_a = command.options) === null || _a === void 0 ? void 0 : _a.map(o => ApplicationCommand.transformOption(o)),
            default_permission: command.defaultPermission,
        };
    }
}
module.exports = ApplicationCommandManager;
