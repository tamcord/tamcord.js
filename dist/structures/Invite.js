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
const Base = require('./Base');
const IntegrationApplication = require('./IntegrationApplication');
const InviteStageInstance = require('./InviteStageInstance');
const { Error } = require('../errors');
const { Endpoints } = require('../util/Constants');
const Permissions = require('../util/Permissions');
/**
 * Represents an invitation to a guild channel.
 * <warn>The only guaranteed properties are `code`, `channel`, and `url`. Other properties can be missing.</warn>
 * @extends {Base}
 */
class Invite extends Base {
    constructor(client, data) {
        super(client);
        this._patch(data);
    }
    _patch(data) {
        var _a, _b, _c, _d, _e, _f, _g;
        const InviteGuild = require('./InviteGuild');
        const Guild = require('./Guild');
        /**
         * The guild the invite is for including welcome screen data if present
         * @type {?(Guild|InviteGuild)}
         */
        this.guild = null;
        if (data.guild) {
            this.guild = data.guild instanceof Guild ? data.guild : new InviteGuild(this.client, data.guild);
        }
        /**
         * The code for this invite
         * @type {string}
         */
        this.code = data.code;
        /**
         * The approximate number of online members of the guild this invite is for
         * @type {?number}
         */
        this.presenceCount = (_a = data.approximate_presence_count) !== null && _a !== void 0 ? _a : null;
        /**
         * The approximate total number of members of the guild this invite is for
         * @type {?number}
         */
        this.memberCount = (_b = data.approximate_member_count) !== null && _b !== void 0 ? _b : null;
        /**
         * Whether or not this invite is temporary
         * @type {?boolean}
         */
        this.temporary = (_c = data.temporary) !== null && _c !== void 0 ? _c : null;
        /**
         * The maximum age of the invite, in seconds, 0 if never expires
         * @type {?number}
         */
        this.maxAge = (_d = data.max_age) !== null && _d !== void 0 ? _d : null;
        /**
         * How many times this invite has been used
         * @type {?number}
         */
        this.uses = (_e = data.uses) !== null && _e !== void 0 ? _e : null;
        /**
         * The maximum uses of this invite
         * @type {?number}
         */
        this.maxUses = (_f = data.max_uses) !== null && _f !== void 0 ? _f : null;
        /**
         * The user who created this invite
         * @type {?User}
         */
        this.inviter = data.inviter ? this.client.users._add(data.inviter) : null;
        /**
         * The user whose stream to display for this voice channel stream invite
         * @type {?User}
         */
        this.targetUser = data.target_user ? this.client.users._add(data.target_user) : null;
        /**
         * The embedded application to open for this voice channel embedded application invite
         * @type {?IntegrationApplication}
         */
        this.targetApplication = data.target_application
            ? new IntegrationApplication(this.client, data.target_application)
            : null;
        /**
         * The type of the invite target:
         * * 1: STREAM
         * * 2: EMBEDDED_APPLICATION
         * @typedef {number} TargetType
         * @see {@link https://discord.com/developers/docs/resources/invite#invite-object-invite-target-types}
         */
        /**
         * The target type
         * @type {?TargetType}
         */
        this.targetType = (_g = data.target_type) !== null && _g !== void 0 ? _g : null;
        /**
         * The channel the invite is for
         * @type {Channel}
         */
        this.channel = this.client.channels._add(data.channel, this.guild, { cache: false });
        /**
         * The timestamp the invite was created at
         * @type {?number}
         */
        this.createdTimestamp = 'created_at' in data ? new Date(data.created_at).getTime() : null;
        this._expiresTimestamp = 'expires_at' in data ? new Date(data.expires_at).getTime() : null;
        /**
         * The stage instance data if there is a public {@link StageInstance} in the stage channel this invite is for
         * @type {?InviteStageInstance}
         */
        this.stageInstance =
            'stage_instance' in data
                ? new InviteStageInstance(this.client, data.stage_instance, this.channel.id, this.guild.id)
                : null;
    }
    /**
     * The time the invite was created at
     * @type {?Date}
     * @readonly
     */
    get createdAt() {
        return this.createdTimestamp ? new Date(this.createdTimestamp) : null;
    }
    /**
     * Whether the invite is deletable by the client user
     * @type {boolean}
     * @readonly
     */
    get deletable() {
        const guild = this.guild;
        if (!guild || !this.client.guilds.cache.has(guild.id))
            return false;
        if (!guild.me)
            throw new Error('GUILD_UNCACHED_ME');
        return (this.channel.permissionsFor(this.client.user).has(Permissions.FLAGS.MANAGE_CHANNELS, false) ||
            guild.me.permissions.has(Permissions.FLAGS.MANAGE_GUILD));
    }
    /**
     * The timestamp the invite will expire at
     * @type {?number}
     * @readonly
     */
    get expiresTimestamp() {
        var _a;
        return ((_a = this._expiresTimestamp) !== null && _a !== void 0 ? _a : (this.createdTimestamp && this.maxAge ? this.createdTimestamp + this.maxAge * 1000 : null));
    }
    /**
     * The time the invite will expire at
     * @type {?Date}
     * @readonly
     */
    get expiresAt() {
        const { expiresTimestamp } = this;
        return expiresTimestamp ? new Date(expiresTimestamp) : null;
    }
    /**
     * The URL to the invite
     * @type {string}
     * @readonly
     */
    get url() {
        return Endpoints.invite(this.client.options.http.invite, this.code);
    }
    /**
     * Deletes this invite.
     * @param {string} [reason] Reason for deleting this invite
     * @returns {Promise<Invite>}
     */
    delete(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.api.invites[this.code].delete({ reason });
            return this;
        });
    }
    /**
     * When concatenated with a string, this automatically concatenates the invite's URL instead of the object.
     * @returns {string}
     * @example
     * // Logs: Invite: https://discord.gg/A1b2C3
     * console.log(`Invite: ${invite}`);
     */
    toString() {
        return this.url;
    }
    toJSON() {
        return super.toJSON({
            url: true,
            expiresTimestamp: true,
            presenceCount: false,
            memberCount: false,
            uses: false,
            channel: 'channelId',
            inviter: 'inviterId',
            guild: 'guildId',
        });
    }
    valueOf() {
        return this.code;
    }
}
/**
 * Regular expression that globally matches Discord invite links
 * @type {RegExp}
 */
// TODO: fix https://stackoverflow.com/questions/51568821/works-in-chrome-but-breaks-in-safari-invalid-regular-expression-invalid-group
// Invite.INVITES_PATTERN = /discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/gi;
module.exports = Invite;
