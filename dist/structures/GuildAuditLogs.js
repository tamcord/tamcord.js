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
const Integration = require('./Integration');
const StageInstance = require('./StageInstance');
const Sticker = require('./Sticker');
const Webhook = require('./Webhook');
const { OverwriteTypes, PartialTypes } = require('../util/Constants');
const Permissions = require('../util/Permissions');
const SnowflakeUtil = require('../util/SnowflakeUtil');
const Util = require('../util/Util');
/**
 * The target type of an entry. Here are the available types:
 * * GUILD
 * * CHANNEL
 * * USER
 * * ROLE
 * * INVITE
 * * WEBHOOK
 * * EMOJI
 * * MESSAGE
 * * INTEGRATION
 * * STAGE_INSTANCE
 * * STICKER
 * * THREAD
 * @typedef {string} AuditLogTargetType
 */
/**
 * Key mirror of all available audit log targets.
 * @name GuildAuditLogs.Targets
 * @type {Object<string, string>}
 */
const Targets = {
    ALL: 'ALL',
    GUILD: 'GUILD',
    CHANNEL: 'CHANNEL',
    USER: 'USER',
    ROLE: 'ROLE',
    INVITE: 'INVITE',
    WEBHOOK: 'WEBHOOK',
    EMOJI: 'EMOJI',
    MESSAGE: 'MESSAGE',
    INTEGRATION: 'INTEGRATION',
    STAGE_INSTANCE: 'STAGE_INSTANCE',
    STICKER: 'STICKER',
    THREAD: 'THREAD',
    UNKNOWN: 'UNKNOWN',
};
/**
 * The action of an entry. Here are the available actions:
 * * ALL: null
 * * GUILD_UPDATE: 1
 * * CHANNEL_CREATE: 10
 * * CHANNEL_UPDATE: 11
 * * CHANNEL_DELETE: 12
 * * CHANNEL_OVERWRITE_CREATE: 13
 * * CHANNEL_OVERWRITE_UPDATE: 14
 * * CHANNEL_OVERWRITE_DELETE: 15
 * * MEMBER_KICK: 20
 * * MEMBER_PRUNE: 21
 * * MEMBER_BAN_ADD: 22
 * * MEMBER_BAN_REMOVE: 23
 * * MEMBER_UPDATE: 24
 * * MEMBER_ROLE_UPDATE: 25
 * * MEMBER_MOVE: 26
 * * MEMBER_DISCONNECT: 27
 * * BOT_ADD: 28,
 * * ROLE_CREATE: 30
 * * ROLE_UPDATE: 31
 * * ROLE_DELETE: 32
 * * INVITE_CREATE: 40
 * * INVITE_UPDATE: 41
 * * INVITE_DELETE: 42
 * * WEBHOOK_CREATE: 50
 * * WEBHOOK_UPDATE: 51
 * * WEBHOOK_DELETE: 52
 * * EMOJI_CREATE: 60
 * * EMOJI_UPDATE: 61
 * * EMOJI_DELETE: 62
 * * MESSAGE_DELETE: 72
 * * MESSAGE_BULK_DELETE: 73
 * * MESSAGE_PIN: 74
 * * MESSAGE_UNPIN: 75
 * * INTEGRATION_CREATE: 80
 * * INTEGRATION_UPDATE: 81
 * * INTEGRATION_DELETE: 82
 * * STAGE_INSTANCE_CREATE: 83
 * * STAGE_INSTANCE_UPDATE: 84
 * * STAGE_INSTANCE_DELETE: 85
 * * STICKER_CREATE: 90
 * * STICKER_UPDATE: 91
 * * STICKER_DELETE: 92
 * * THREAD_CREATE: 110
 * * THREAD_UPDATE: 111
 * * THREAD_DELETE: 112
 * @typedef {?(number|string)} AuditLogAction
 * @see {@link https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-audit-log-events}
 */
/**
 * All available actions keyed under their names to their numeric values.
 * @name GuildAuditLogs.Actions
 * @type {Object<string, number>}
 */
const Actions = {
    ALL: null,
    GUILD_UPDATE: 1,
    CHANNEL_CREATE: 10,
    CHANNEL_UPDATE: 11,
    CHANNEL_DELETE: 12,
    CHANNEL_OVERWRITE_CREATE: 13,
    CHANNEL_OVERWRITE_UPDATE: 14,
    CHANNEL_OVERWRITE_DELETE: 15,
    MEMBER_KICK: 20,
    MEMBER_PRUNE: 21,
    MEMBER_BAN_ADD: 22,
    MEMBER_BAN_REMOVE: 23,
    MEMBER_UPDATE: 24,
    MEMBER_ROLE_UPDATE: 25,
    MEMBER_MOVE: 26,
    MEMBER_DISCONNECT: 27,
    BOT_ADD: 28,
    ROLE_CREATE: 30,
    ROLE_UPDATE: 31,
    ROLE_DELETE: 32,
    INVITE_CREATE: 40,
    INVITE_UPDATE: 41,
    INVITE_DELETE: 42,
    WEBHOOK_CREATE: 50,
    WEBHOOK_UPDATE: 51,
    WEBHOOK_DELETE: 52,
    EMOJI_CREATE: 60,
    EMOJI_UPDATE: 61,
    EMOJI_DELETE: 62,
    MESSAGE_DELETE: 72,
    MESSAGE_BULK_DELETE: 73,
    MESSAGE_PIN: 74,
    MESSAGE_UNPIN: 75,
    INTEGRATION_CREATE: 80,
    INTEGRATION_UPDATE: 81,
    INTEGRATION_DELETE: 82,
    STAGE_INSTANCE_CREATE: 83,
    STAGE_INSTANCE_UPDATE: 84,
    STAGE_INSTANCE_DELETE: 85,
    STICKER_CREATE: 90,
    STICKER_UPDATE: 91,
    STICKER_DELETE: 92,
    THREAD_CREATE: 110,
    THREAD_UPDATE: 111,
    THREAD_DELETE: 112,
};
/**
 * Audit logs entries are held in this class.
 */
class GuildAuditLogs {
    constructor(guild, data) {
        if (data.users)
            for (const user of data.users)
                guild.client.users._add(user);
        if (data.threads)
            for (const thread of data.threads)
                guild.client.channels._add(thread, guild);
        /**
         * Cached webhooks
         * @type {Collection<Snowflake, Webhook>}
         * @private
         */
        this.webhooks = new Collection();
        if (data.webhooks) {
            for (const hook of data.webhooks) {
                this.webhooks.set(hook.id, new Webhook(guild.client, hook));
            }
        }
        /**
         * Cached integrations
         * @type {Collection<Snowflake, Integration>}
         * @private
         */
        this.integrations = new Collection();
        if (data.integrations) {
            for (const integration of data.integrations) {
                this.integrations.set(integration.id, new Integration(guild.client, integration, guild));
            }
        }
        /**
         * The entries for this guild's audit logs
         * @type {Collection<Snowflake, GuildAuditLogsEntry>}
         */
        this.entries = new Collection();
        for (const item of data.audit_log_entries) {
            const entry = new GuildAuditLogsEntry(this, guild, item);
            this.entries.set(entry.id, entry);
        }
    }
    /**
     * Handles possible promises for entry targets.
     * @returns {Promise<GuildAuditLogs>}
     */
    static build(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const logs = new GuildAuditLogs(...args);
            yield Promise.all(logs.entries.map(e => e.target));
            return logs;
        });
    }
    /**
     * The target of an entry. It can be one of:
     * * A guild
     * * A channel
     * * A user
     * * A role
     * * An invite
     * * A webhook
     * * An emoji
     * * A message
     * * An integration
     * * A stage instance
     * * A sticker
     * * A thread
     * * An object with an id key if target was deleted
     * * An object where the keys represent either the new value or the old value
     * @typedef {?(Object|Guild|Channel|User|Role|Invite|Webhook|GuildEmoji|Message|Integration|StageInstance|Sticker)}
     * AuditLogEntryTarget
     */
    /**
     * Finds the target type from the entry action.
     * @param {AuditLogAction} target The action target
     * @returns {AuditLogTargetType}
     */
    static targetType(target) {
        if (target < 10)
            return Targets.GUILD;
        if (target < 20)
            return Targets.CHANNEL;
        if (target < 30)
            return Targets.USER;
        if (target < 40)
            return Targets.ROLE;
        if (target < 50)
            return Targets.INVITE;
        if (target < 60)
            return Targets.WEBHOOK;
        if (target < 70)
            return Targets.EMOJI;
        if (target < 80)
            return Targets.MESSAGE;
        if (target < 83)
            return Targets.INTEGRATION;
        if (target < 86)
            return Targets.STAGE_INSTANCE;
        if (target < 100)
            return Targets.STICKER;
        if (target < 110)
            return Targets.UNKNOWN;
        if (target < 120)
            return Targets.THREAD;
        return Targets.UNKNOWN;
    }
    /**
     * The action type of an entry, e.g. `CREATE`. Here are the available types:
     * * CREATE
     * * DELETE
     * * UPDATE
     * * ALL
     * @typedef {string} AuditLogActionType
     */
    /**
     * Finds the action type from the entry action.
     * @param {AuditLogAction} action The action target
     * @returns {AuditLogActionType}
     */
    static actionType(action) {
        if ([
            Actions.CHANNEL_CREATE,
            Actions.CHANNEL_OVERWRITE_CREATE,
            Actions.MEMBER_BAN_REMOVE,
            Actions.BOT_ADD,
            Actions.ROLE_CREATE,
            Actions.INVITE_CREATE,
            Actions.WEBHOOK_CREATE,
            Actions.EMOJI_CREATE,
            Actions.MESSAGE_PIN,
            Actions.INTEGRATION_CREATE,
            Actions.STAGE_INSTANCE_CREATE,
            Actions.STICKER_CREATE,
            Actions.THREAD_CREATE,
        ].includes(action)) {
            return 'CREATE';
        }
        if ([
            Actions.CHANNEL_DELETE,
            Actions.CHANNEL_OVERWRITE_DELETE,
            Actions.MEMBER_KICK,
            Actions.MEMBER_PRUNE,
            Actions.MEMBER_BAN_ADD,
            Actions.MEMBER_DISCONNECT,
            Actions.ROLE_DELETE,
            Actions.INVITE_DELETE,
            Actions.WEBHOOK_DELETE,
            Actions.EMOJI_DELETE,
            Actions.MESSAGE_DELETE,
            Actions.MESSAGE_BULK_DELETE,
            Actions.MESSAGE_UNPIN,
            Actions.INTEGRATION_DELETE,
            Actions.STAGE_INSTANCE_DELETE,
            Actions.STICKER_DELETE,
            Actions.THREAD_DELETE,
        ].includes(action)) {
            return 'DELETE';
        }
        if ([
            Actions.GUILD_UPDATE,
            Actions.CHANNEL_UPDATE,
            Actions.CHANNEL_OVERWRITE_UPDATE,
            Actions.MEMBER_UPDATE,
            Actions.MEMBER_ROLE_UPDATE,
            Actions.MEMBER_MOVE,
            Actions.ROLE_UPDATE,
            Actions.INVITE_UPDATE,
            Actions.WEBHOOK_UPDATE,
            Actions.EMOJI_UPDATE,
            Actions.INTEGRATION_UPDATE,
            Actions.STAGE_INSTANCE_UPDATE,
            Actions.STICKER_UPDATE,
            Actions.THREAD_UPDATE,
        ].includes(action)) {
            return 'UPDATE';
        }
        return 'ALL';
    }
    toJSON() {
        return Util.flatten(this);
    }
}
/**
 * Audit logs entry.
 */
class GuildAuditLogsEntry {
    constructor(logs, guild, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        const targetType = GuildAuditLogs.targetType(data.action_type);
        /**
         * The target type of this entry
         * @type {AuditLogTargetType}
         */
        this.targetType = targetType;
        /**
         * The action type of this entry
         * @type {AuditLogActionType}
         */
        this.actionType = GuildAuditLogs.actionType(data.action_type);
        /**
         * Specific action type of this entry in its string presentation
         * @type {AuditLogAction}
         */
        this.action = Object.keys(Actions).find(k => Actions[k] === data.action_type);
        /**
         * The reason of this entry
         * @type {?string}
         */
        this.reason = (_a = data.reason) !== null && _a !== void 0 ? _a : null;
        /**
         * The user that executed this entry
         * @type {?User}
         */
        this.executor = data.user_id
            ? guild.client.options.partials.includes(PartialTypes.USER)
                ? guild.client.users._add({ id: data.user_id })
                : guild.client.users.cache.get(data.user_id)
            : null;
        /**
         * An entry in the audit log representing a specific change.
         * @typedef {Object} AuditLogChange
         * @property {string} key The property that was changed, e.g. `nick` for nickname changes
         * @property {*} [old] The old value of the change, e.g. for nicknames, the old nickname
         * @property {*} [new] The new value of the change, e.g. for nicknames, the new nickname
         */
        /**
         * Specific property changes
         * @type {?AuditLogChange[]}
         */
        this.changes = (_c = (_b = data.changes) === null || _b === void 0 ? void 0 : _b.map(c => ({ key: c.key, old: c.old_value, new: c.new_value }))) !== null && _c !== void 0 ? _c : null;
        /**
         * The entry's id
         * @type {Snowflake}
         */
        this.id = data.id;
        /**
         * Any extra data from the entry
         * @type {?(Object|Role|GuildMember)}
         */
        this.extra = null;
        switch (data.action_type) {
            case Actions.MEMBER_PRUNE:
                this.extra = {
                    removed: Number(data.options.members_removed),
                    days: Number(data.options.delete_member_days),
                };
                break;
            case Actions.MEMBER_MOVE:
            case Actions.MESSAGE_DELETE:
            case Actions.MESSAGE_BULK_DELETE:
                this.extra = {
                    channel: (_d = guild.channels.cache.get(data.options.channel_id)) !== null && _d !== void 0 ? _d : { id: data.options.channel_id },
                    count: Number(data.options.count),
                };
                break;
            case Actions.MESSAGE_PIN:
            case Actions.MESSAGE_UNPIN:
                this.extra = {
                    channel: (_e = guild.client.channels.cache.get(data.options.channel_id)) !== null && _e !== void 0 ? _e : { id: data.options.channel_id },
                    messageId: data.options.message_id,
                };
                break;
            case Actions.MEMBER_DISCONNECT:
                this.extra = {
                    count: Number(data.options.count),
                };
                break;
            case Actions.CHANNEL_OVERWRITE_CREATE:
            case Actions.CHANNEL_OVERWRITE_UPDATE:
            case Actions.CHANNEL_OVERWRITE_DELETE:
                switch (Number(data.options.type)) {
                    case OverwriteTypes.role:
                        this.extra = (_f = guild.roles.cache.get(data.options.id)) !== null && _f !== void 0 ? _f : {
                            id: data.options.id,
                            name: data.options.role_name,
                            type: OverwriteTypes[OverwriteTypes.role],
                        };
                        break;
                    case OverwriteTypes.member:
                        this.extra = (_g = guild.members.cache.get(data.options.id)) !== null && _g !== void 0 ? _g : {
                            id: data.options.id,
                            type: OverwriteTypes[OverwriteTypes.member],
                        };
                        break;
                    default:
                        break;
                }
                break;
            case Actions.STAGE_INSTANCE_CREATE:
            case Actions.STAGE_INSTANCE_DELETE:
            case Actions.STAGE_INSTANCE_UPDATE:
                this.extra = {
                    channel: (_j = guild.client.channels.cache.get((_h = data.options) === null || _h === void 0 ? void 0 : _h.channel_id)) !== null && _j !== void 0 ? _j : { id: (_k = data.options) === null || _k === void 0 ? void 0 : _k.channel_id },
                };
                break;
            default:
                break;
        }
        /**
         * The target of this entry
         * @type {?AuditLogEntryTarget}
         */
        this.target = null;
        if (targetType === Targets.UNKNOWN) {
            this.target = this.changes.reduce((o, c) => {
                var _a;
                o[c.key] = (_a = c.new) !== null && _a !== void 0 ? _a : c.old;
                return o;
            }, {});
            this.target.id = data.target_id;
            // MEMBER_DISCONNECT and similar types do not provide a target_id.
        }
        else if (targetType === Targets.USER && data.target_id) {
            this.target = guild.client.options.partials.includes(PartialTypes.USER)
                ? guild.client.users._add({ id: data.target_id })
                : guild.client.users.cache.get(data.target_id);
        }
        else if (targetType === Targets.GUILD) {
            this.target = guild.client.guilds.cache.get(data.target_id);
        }
        else if (targetType === Targets.WEBHOOK) {
            this.target =
                (_l = logs.webhooks.get(data.target_id)) !== null && _l !== void 0 ? _l : new Webhook(guild.client, this.changes.reduce((o, c) => {
                    var _a;
                    o[c.key] = (_a = c.new) !== null && _a !== void 0 ? _a : c.old;
                    return o;
                }, {
                    id: data.target_id,
                    guild_id: guild.id,
                }));
        }
        else if (targetType === Targets.INVITE) {
            this.target = guild.members.fetch(guild.client.user.id).then((me) => __awaiter(this, void 0, void 0, function* () {
                var _v, _w;
                if (me.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                    let change = this.changes.find(c => c.key === 'code');
                    change = (_v = change.new) !== null && _v !== void 0 ? _v : change.old;
                    const invites = yield guild.invites.fetch();
                    this.target = (_w = invites.find(i => i.code === change)) !== null && _w !== void 0 ? _w : null;
                }
                else {
                    this.target = this.changes.reduce((o, c) => {
                        var _a;
                        o[c.key] = (_a = c.new) !== null && _a !== void 0 ? _a : c.old;
                        return o;
                    }, {});
                }
            }));
        }
        else if (targetType === Targets.MESSAGE) {
            // Discord sends a channel id for the MESSAGE_BULK_DELETE action type.
            this.target =
                data.action_type === Actions.MESSAGE_BULK_DELETE
                    ? (_m = guild.channels.cache.get(data.target_id)) !== null && _m !== void 0 ? _m : { id: data.target_id }
                    : guild.client.users.cache.get(data.target_id);
        }
        else if (targetType === Targets.INTEGRATION) {
            this.target =
                (_o = logs.integrations.get(data.target_id)) !== null && _o !== void 0 ? _o : new Integration(guild.client, this.changes.reduce((o, c) => {
                    var _a;
                    o[c.key] = (_a = c.new) !== null && _a !== void 0 ? _a : c.old;
                    return o;
                }, { id: data.target_id }), guild);
        }
        else if (targetType === Targets.CHANNEL || targetType === Targets.THREAD) {
            this.target =
                (_p = guild.channels.cache.get(data.target_id)) !== null && _p !== void 0 ? _p : this.changes.reduce((o, c) => {
                    var _a;
                    o[c.key] = (_a = c.new) !== null && _a !== void 0 ? _a : c.old;
                    return o;
                }, { id: data.target_id });
        }
        else if (targetType === Targets.STAGE_INSTANCE) {
            this.target =
                (_q = guild.stageInstances.cache.get(data.target_id)) !== null && _q !== void 0 ? _q : new StageInstance(guild.client, this.changes.reduce((o, c) => {
                    var _a;
                    o[c.key] = (_a = c.new) !== null && _a !== void 0 ? _a : c.old;
                    return o;
                }, {
                    id: data.target_id,
                    channel_id: (_r = data.options) === null || _r === void 0 ? void 0 : _r.channel_id,
                    guild_id: guild.id,
                }));
        }
        else if (targetType === Targets.STICKER) {
            this.target =
                (_s = guild.stickers.cache.get(data.target_id)) !== null && _s !== void 0 ? _s : new Sticker(guild.client, this.changes.reduce((o, c) => {
                    var _a;
                    o[c.key] = (_a = c.new) !== null && _a !== void 0 ? _a : c.old;
                    return o;
                }, { id: data.target_id }));
        }
        else if (data.target_id) {
            this.target = (_u = (_t = guild[`${targetType.toLowerCase()}s`]) === null || _t === void 0 ? void 0 : _t.cache.get(data.target_id)) !== null && _u !== void 0 ? _u : { id: data.target_id };
        }
    }
    /**
     * The timestamp this entry was created at
     * @type {number}
     * @readonly
     */
    get createdTimestamp() {
        return SnowflakeUtil.deconstruct(this.id).timestamp;
    }
    /**
     * The time this entry was created at
     * @type {Date}
     * @readonly
     */
    get createdAt() {
        return new Date(this.createdTimestamp);
    }
    toJSON() {
        return Util.flatten(this, { createdTimestamp: true });
    }
}
GuildAuditLogs.Actions = Actions;
GuildAuditLogs.Targets = Targets;
GuildAuditLogs.Entry = GuildAuditLogsEntry;
module.exports = GuildAuditLogs;
