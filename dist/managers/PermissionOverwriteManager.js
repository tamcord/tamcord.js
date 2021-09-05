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
const CachedManager = require('./CachedManager');
const { TypeError } = require('../errors');
const PermissionOverwrites = require('../structures/PermissionOverwrites');
const Role = require('../structures/Role');
const { OverwriteTypes } = require('../util/Constants');
let cacheWarningEmitted = false;
/**
 * Manages API methods for guild channel permission overwrites and stores their cache.
 * @extends {CachedManager}
 */
class PermissionOverwriteManager extends CachedManager {
    constructor(channel, iterable) {
        super(channel.client, PermissionOverwrites);
        /**
         * The channel of the permission overwrite this manager belongs to
         * @type {GuildChannel}
         */
        this.channel = channel;
        if (iterable) {
            for (const item of iterable) {
                this._add(item);
            }
        }
    }
    /**
     * The cache of this Manager
     * @type {Collection<Snowflake, PermissionOverwrites>}
     * @name PermissionOverwriteManager#cache
     */
    _add(data, cache) {
        return super._add(data, cache, { extras: [this.channel] });
    }
    /**
     * Replaces the permission overwrites in this channel.
     * @param {OverwriteResolvable[]|Collection<Snowflake, OverwriteResolvable>} overwrites
     * Permission overwrites the channel gets updated with
     * @param {string} [reason] Reason for updating the channel overwrites
     * @returns {Promise<GuildChannel>}
     * @example
     * message.channel.permissionOverwrites.set([
     *   {
     *      id: message.author.id,
     *      deny: [Permissions.FLAGS.VIEW_CHANNEL],
     *   },
     * ], 'Needed to change permissions');
     */
    set(overwrites, reason) {
        if (!Array.isArray(overwrites) && !(overwrites instanceof Collection)) {
            return Promise.reject(new TypeError('INVALID_TYPE', 'overwrites', 'Array or Collection of Permission Overwrites', true));
        }
        return this.channel.edit({ permissionOverwrites: overwrites, reason });
    }
    /**
     * Extra information about the overwrite
     * @typedef {Object} GuildChannelOverwriteOptions
     * @property {string} [reason] Reason for creating/editing this overwrite
     * @property {number} [type] The type of overwrite, either `0` for a role or `1` for a member. Use this to bypass
     * automatic resolution of type that results in an error for uncached structure
     */
    /**
     * Creates or edits permission overwrites for a user or role in this channel.
     * @param {RoleResolvable|UserResolvable} userOrRole The user or role to update
     * @param {PermissionOverwriteOptions} options The options for the update
     * @param {GuildChannelOverwriteOptions} [overwriteOptions] The extra information for the update
     * @param {PermissionOverwrites} [existing] The existing overwrites to merge with this update
     * @returns {Promise<GuildChannel>}
     * @private
     */
    upsert(userOrRole, options, overwriteOptions = {}, existing) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let userOrRoleId = (_a = this.channel.guild.roles.resolveId(userOrRole)) !== null && _a !== void 0 ? _a : this.client.users.resolveId(userOrRole);
            let { type, reason } = overwriteOptions;
            if (typeof type !== 'number') {
                userOrRole = (_b = this.channel.guild.roles.resolve(userOrRole)) !== null && _b !== void 0 ? _b : this.client.users.resolve(userOrRole);
                if (!userOrRole)
                    throw new TypeError('INVALID_TYPE', 'parameter', 'User nor a Role');
                type = userOrRole instanceof Role ? OverwriteTypes.role : OverwriteTypes.member;
            }
            const { allow, deny } = PermissionOverwrites.resolveOverwriteOptions(options, existing);
            yield this.client.api
                .channels(this.channel.id)
                .permissions(userOrRoleId)
                .put({
                data: { id: userOrRoleId, type, allow, deny },
                reason,
            });
            return this.channel;
        });
    }
    /**
     * Creates permission overwrites for a user or role in this channel, or replaces them if already present.
     * @param {RoleResolvable|UserResolvable} userOrRole The user or role to update
     * @param {PermissionOverwriteOptions} options The options for the update
     * @param {GuildChannelOverwriteOptions} [overwriteOptions] The extra information for the update
     * @returns {Promise<GuildChannel>}
     * @example
     * // Create or Replace permission overwrites for a message author
     * message.channel.permissionOverwrites.create(message.author, {
     *   SEND_MESSAGES: false
     * })
     *   .then(channel => console.log(channel.permissionOverwrites.cache.get(message.author.id)))
     *   .catch(console.error);
     */
    create(userOrRole, options, overwriteOptions) {
        return this.upsert(userOrRole, options, overwriteOptions);
    }
    /**
     * Edits permission overwrites for a user or role in this channel, or creates an entry if not already present.
     * @param {RoleResolvable|UserResolvable} userOrRole The user or role to update
     * @param {PermissionOverwriteOptions} options The options for the update
     * @param {GuildChannelOverwriteOptions} [overwriteOptions] The extra information for the update
     * @returns {Promise<GuildChannel>}
     * @example
     * // Edit or Create permission overwrites for a message author
     * message.channel.permissionOverwrites.edit(message.author, {
     *   SEND_MESSAGES: false
     * })
     *   .then(channel => console.log(channel.permissionOverwrites.cache.get(message.author.id)))
     *   .catch(console.error);
     */
    edit(userOrRole, options, overwriteOptions) {
        var _a;
        userOrRole = (_a = this.channel.guild.roles.resolveId(userOrRole)) !== null && _a !== void 0 ? _a : this.client.users.resolveId(userOrRole);
        const existing = this.cache.get(userOrRole);
        return this.upsert(userOrRole, options, overwriteOptions, existing);
    }
    /**
     * Deletes permission overwrites for a user or role in this channel.
     * @param {UserResolvable|RoleResolvable} userOrRole The user or role to delete
     * @param {string} [reason] The reason for deleting the overwrite
     * @returns {GuildChannel}
     */
    delete(userOrRole, reason) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userOrRoleId = (_a = this.channel.guild.roles.resolveId(userOrRole)) !== null && _a !== void 0 ? _a : this.client.users.resolveId(userOrRole);
            if (!userOrRoleId)
                throw new TypeError('INVALID_TYPE', 'parameter', 'User nor a Role');
            yield this.client.api.channels(this.channel.id).permissions(userOrRoleId).delete({ reason });
            return this.channel;
        });
    }
}
module.exports = PermissionOverwriteManager;
