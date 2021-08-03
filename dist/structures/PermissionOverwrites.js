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
const Role = require('./Role');
const { TypeError } = require('../errors');
const { OverwriteTypes } = require('../util/Constants');
const Permissions = require('../util/Permissions');
/**
 * Represents a permission overwrite for a role or member in a guild channel.
 */
class PermissionOverwrites {
    constructor(guildChannel, data) {
        /**
         * The GuildChannel this overwrite is for
         * @name PermissionOverwrites#channel
         * @type {GuildChannel}
         * @readonly
         */
        Object.defineProperty(this, 'channel', { value: guildChannel });
        if (data)
            this._patch(data);
    }
    _patch(data) {
        /**
         * The ID of this overwrite, either a user ID or a role ID
         * @type {Snowflake}
         */
        this.id = data.id;
        /**
         * The type of this overwrite
         * @type {OverwriteType}
         */
        this.type = OverwriteTypes[data.type];
        /**
         * The permissions that are denied for the user or role.
         * @type {Readonly<Permissions>}
         */
        this.deny = new Permissions(BigInt(data.deny)).freeze();
        /**
         * The permissions that are allowed for the user or role.
         * @type {Readonly<Permissions>}
         */
        this.allow = new Permissions(BigInt(data.allow)).freeze();
    }
    /**
     * Updates this permissionOverwrites.
     * @param {PermissionOverwriteOptions} options The options for the update
     * @param {string} [reason] Reason for creating/editing this overwrite
     * @returns {Promise<PermissionOverwrites>}
     * @example
     * // Update permission overwrites
     * permissionOverwrites.update({
     *   SEND_MESSAGES: false
     * })
     *   .then(channel => console.log(channel.permissionOverwrites.get(message.author.id)))
     *   .catch(console.error);
     */
    update(options, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const { allow, deny } = this.constructor.resolveOverwriteOptions(options, this);
            yield this.channel.client.api
                .channels(this.channel.id)
                .permissions(this.id)
                .put({
                data: {
                    id: this.id,
                    type: OverwriteTypes[this.type],
                    allow,
                    deny,
                },
                reason,
            });
            return this;
        });
    }
    /**
     * Deletes this Permission Overwrite.
     * @param {string} [reason] Reason for deleting this overwrite
     * @returns {Promise<PermissionOverwrites>}
     */
    delete(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.channel.client.api.channels(this.channel.id).permissions(this.id).delete({ reason });
            return this;
        });
    }
    toJSON() {
        return {
            id: this.id,
            type: OverwriteTypes[this.type],
            allow: this.allow,
            deny: this.deny,
        };
    }
    /**
     * An object mapping permission flags to `true` (enabled), `null` (unset) or `false` (disabled).
     * ```js
     * {
     *  'SEND_MESSAGES': true,
     *  'EMBED_LINKS': null,
     *  'ATTACH_FILES': false,
     * }
     * ```
     * @typedef {Object} PermissionOverwriteOptions
     */
    /**
     * @typedef {Object} ResolvedOverwriteOptions
     * @property {Permissions} allow The allowed permissions
     * @property {Permissions} deny The denied permissions
     */
    /**
     * Resolves bitfield permissions overwrites from an object.
     * @param {PermissionOverwriteOptions} options The options for the update
     * @param {ResolvedOverwriteOptions} initialPermissions The initial permissions
     * @returns {ResolvedOverwriteOptions}
     */
    static resolveOverwriteOptions(options, { allow, deny } = {}) {
        allow = new Permissions(allow);
        deny = new Permissions(deny);
        for (const [perm, value] of Object.entries(options)) {
            if (value === true) {
                allow.add(Permissions.FLAGS[perm]);
                deny.remove(Permissions.FLAGS[perm]);
            }
            else if (value === false) {
                allow.remove(Permissions.FLAGS[perm]);
                deny.add(Permissions.FLAGS[perm]);
            }
            else if (value === null) {
                allow.remove(Permissions.FLAGS[perm]);
                deny.remove(Permissions.FLAGS[perm]);
            }
        }
        return { allow, deny };
    }
    /**
     * The raw data for a permission overwrite
     * @typedef {Object} RawOverwriteData
     * @property {Snowflake} id The id of the overwrite
     * @property {string} allow The permissions to allow
     * @property {string} deny The permissions to deny
     * @property {number} type The type of this OverwriteData
     */
    /**
     * Data that can be resolved into {@link RawOverwriteData}
     * @typedef {PermissionOverwrites|OverwriteData} OverwriteResolvable
     */
    /**
     * Data that can be used for a permission overwrite
     * @typedef {Object} OverwriteData
     * @property {GuildMemberResolvable|RoleResolvable} id Member or role this overwrite is for
     * @property {PermissionResolvable} [allow] The permissions to allow
     * @property {PermissionResolvable} [deny] The permissions to deny
     * @property {OverwriteType} [type] The type of this OverwriteData
     */
    /**
     * Resolves an overwrite into {@link RawOverwriteData}.
     * @param {OverwriteResolvable} overwrite The overwrite-like data to resolve
     * @param {Guild} [guild] The guild to resolve from
     * @returns {RawOverwriteData}
     */
    static resolve(overwrite, guild) {
        var _a, _b, _c, _d;
        if (overwrite instanceof this)
            return overwrite.toJSON();
        if (typeof overwrite.id === 'string' && overwrite.type in OverwriteTypes) {
            return {
                id: overwrite.id,
                type: OverwriteTypes[overwrite.type],
                allow: Permissions.resolve((_a = overwrite.allow) !== null && _a !== void 0 ? _a : Permissions.defaultBit).toString(),
                deny: Permissions.resolve((_b = overwrite.deny) !== null && _b !== void 0 ? _b : Permissions.defaultBit).toString(),
            };
        }
        const userOrRole = guild.roles.resolve(overwrite.id) || guild.client.users.resolve(overwrite.id);
        if (!userOrRole)
            throw new TypeError('INVALID_TYPE', 'parameter', 'User nor a Role');
        const type = userOrRole instanceof Role ? OverwriteTypes.role : OverwriteTypes.member;
        return {
            id: userOrRole.id,
            type,
            allow: Permissions.resolve((_c = overwrite.allow) !== null && _c !== void 0 ? _c : Permissions.defaultBit).toString(),
            deny: Permissions.resolve((_d = overwrite.deny) !== null && _d !== void 0 ? _d : Permissions.defaultBit).toString(),
        };
    }
}
module.exports = PermissionOverwrites;
