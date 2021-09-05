// @ts-nocheck
'use strict';
const BitField = require('./BitField');
/**
 * Data structure that makes it easy to interact with a permission bitfield. All {@link GuildMember}s have a set of
 * permissions in their guild, and each channel in the guild may also have {@link PermissionOverwrites} for the member
 * that override their default permissions.
 * @extends {BitField}
 */
class Permissions extends BitField {
    /**
     * Bitfield of the packed bits
     * @type {bigint}
     * @name Permissions#bitfield
     */
    /**
     * Data that can be resolved to give a permission number. This can be:
     * * A string (see {@link Permissions.FLAGS})
     * * A permission number
     * * An instance of Permissions
     * * An Array of PermissionResolvable
     * @typedef {string|bigint|Permissions|PermissionResolvable[]} PermissionResolvable
     */
    /**
     * Gets all given bits that are missing from the bitfield.
     * @param {BitFieldResolvable} bits Bit(s) to check for
     * @param {boolean} [checkAdmin=true] Whether to allow the administrator permission to override
     * @returns {string[]}
     */
    missing(bits, checkAdmin = true) {
        return checkAdmin && this.has(this.constructor.FLAGS.ADMINISTRATOR) ? [] : super.missing(bits, checkAdmin);
    }
    /**
     * Checks whether the bitfield has a permission, or any of multiple permissions.
     * @param {PermissionResolvable} permission Permission(s) to check for
     * @param {boolean} [checkAdmin=true] Whether to allow the administrator permission to override
     * @returns {boolean}
     */
    any(permission, checkAdmin = true) {
        return (checkAdmin && super.has(this.constructor.FLAGS.ADMINISTRATOR)) || super.any(permission);
    }
    /**
     * Checks whether the bitfield has a permission, or multiple permissions.
     * @param {PermissionResolvable} permission Permission(s) to check for
     * @param {boolean} [checkAdmin=true] Whether to allow the administrator permission to override
     * @returns {boolean}
     */
    has(permission, checkAdmin = true) {
        return (checkAdmin && super.has(this.constructor.FLAGS.ADMINISTRATOR)) || super.has(permission);
    }
}
/**
 * Numeric permission flags. All available properties:
 * * `CREATE_INSTANT_INVITE` (create invitations to the guild)
 * * `KICK_MEMBERS`
 * * `BAN_MEMBERS`
 * * `ADMINISTRATOR` (implicitly has *all* permissions, and bypasses all channel overwrites)
 * * `MANAGE_CHANNELS` (edit and reorder channels)
 * * `MANAGE_GUILD` (edit the guild information, region, etc.)
 * * `ADD_REACTIONS` (add new reactions to messages)
 * * `VIEW_AUDIT_LOG`
 * * `PRIORITY_SPEAKER`
 * * `STREAM`
 * * `VIEW_CHANNEL`
 * * `SEND_MESSAGES`
 * * `SEND_TTS_MESSAGES`
 * * `MANAGE_MESSAGES` (delete messages and reactions)
 * * `EMBED_LINKS` (links posted will have a preview embedded)
 * * `ATTACH_FILES`
 * * `READ_MESSAGE_HISTORY` (view messages that were posted prior to opening Discord)
 * * `MENTION_EVERYONE`
 * * `USE_EXTERNAL_EMOJIS` (use emojis from different guilds)
 * * `VIEW_GUILD_INSIGHTS`
 * * `CONNECT` (connect to a voice channel)
 * * `SPEAK` (speak in a voice channel)
 * * `MUTE_MEMBERS` (mute members across all voice channels)
 * * `DEAFEN_MEMBERS` (deafen members across all voice channels)
 * * `MOVE_MEMBERS` (move members between voice channels)
 * * `USE_VAD` (use voice activity detection)
 * * `CHANGE_NICKNAME`
 * * `MANAGE_NICKNAMES` (change other members' nicknames)
 * * `MANAGE_ROLES`
 * * `MANAGE_WEBHOOKS`
 * * `MANAGE_EMOJIS_AND_STICKERS`
 * * `USE_APPLICATION_COMMANDS`
 * * `REQUEST_TO_SPEAK`
 * * `MANAGE_THREADS`
 * * `USE_PUBLIC_THREADS`
 * * `USE_PRIVATE_THREADS`
 * * `USE_EXTERNAL_STICKERS` (use stickers from different guilds)
 * @type {Object<string, bigint>}
 * @see {@link https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags}
 */
Permissions.FLAGS = {
    CREATE_INSTANT_INVITE: BigInt(1) << BigInt(0),
    KICK_MEMBERS: BigInt(1) << BigInt(1),
    BAN_MEMBERS: BigInt(1) << BigInt(2),
    ADMINISTRATOR: BigInt(1) << BigInt(3),
    MANAGE_CHANNELS: BigInt(1) << BigInt(4),
    MANAGE_GUILD: BigInt(1) << BigInt(5),
    ADD_REACTIONS: BigInt(1) << BigInt(6),
    VIEW_AUDIT_LOG: BigInt(1) << BigInt(7),
    PRIORITY_SPEAKER: BigInt(1) << BigInt(8),
    STREAM: BigInt(1) << BigInt(9),
    VIEW_CHANNEL: BigInt(1) << BigInt(10),
    SEND_MESSAGES: BigInt(1) << BigInt(11),
    SEND_TTS_MESSAGES: BigInt(1) << BigInt(12),
    MANAGE_MESSAGES: BigInt(1) << BigInt(13),
    EMBED_LINKS: BigInt(1) << BigInt(14),
    ATTACH_FILES: BigInt(1) << BigInt(15),
    READ_MESSAGE_HISTORY: BigInt(1) << BigInt(16),
    MENTION_EVERYONE: BigInt(1) << BigInt(17),
    USE_EXTERNAL_EMOJIS: BigInt(1) << BigInt(18),
    VIEW_GUILD_INSIGHTS: BigInt(1) << BigInt(19),
    CONNECT: BigInt(1) << BigInt(20),
    SPEAK: BigInt(1) << BigInt(21),
    MUTE_MEMBERS: BigInt(1) << BigInt(22),
    DEAFEN_MEMBERS: BigInt(1) << BigInt(23),
    MOVE_MEMBERS: BigInt(1) << BigInt(24),
    USE_VAD: BigInt(1) << BigInt(25),
    CHANGE_NICKNAME: BigInt(1) << BigInt(26),
    MANAGE_NICKNAMES: BigInt(1) << BigInt(27),
    MANAGE_ROLES: BigInt(1) << BigInt(28),
    MANAGE_WEBHOOKS: BigInt(1) << BigInt(29),
    MANAGE_EMOJIS_AND_STICKERS: BigInt(1) << BigInt(30),
    USE_APPLICATION_COMMANDS: BigInt(1) << BigInt(31),
    REQUEST_TO_SPEAK: BigInt(1) << BigInt(32),
    MANAGE_THREADS: BigInt(1) << BigInt(34),
    USE_PUBLIC_THREADS: BigInt(1) << BigInt(35),
    USE_PRIVATE_THREADS: BigInt(1) << BigInt(36),
    USE_EXTERNAL_STICKERS: BigInt(1) << BigInt(37),
};
/**
 * Bitfield representing every permission combined
 * @type {bigint}
 */
Permissions.ALL = Object.values(Permissions.FLAGS).reduce((all, p) => all | p, BigInt(0));
/**
 * Bitfield representing the default permissions for users
 * @type {bigint}
 */
Permissions.DEFAULT = BigInt(104324673);
/**
 * Bitfield representing the permissions required for moderators of stage channels
 * @type {bigint}
 */
Permissions.STAGE_MODERATOR =
    Permissions.FLAGS.MANAGE_CHANNELS | Permissions.FLAGS.MUTE_MEMBERS | Permissions.FLAGS.MOVE_MEMBERS;
Permissions.defaultBit = BigInt(0);
module.exports = Permissions;
