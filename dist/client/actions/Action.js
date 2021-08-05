// @ts-nocheck
'use strict';
const { PartialTypes } = require('../../util/Constants');
/*

ABOUT ACTIONS

Actions are similar to WebSocket Packet Handlers, but since introducing
the REST API methods, in order to prevent rewriting code to handle data,
"actions" have been introduced. They're basically what Packet Handlers
used to be but they're strictly for manipulating data and making sure
that WebSocket events don't clash with REST methods.

*/
class GenericAction {
    constructor(client) {
        this.client = client;
    }
    handle(data) {
        return data;
    }
    getPayload(data, manager, id, partialType, cache) {
        const existing = manager.cache.get(id);
        if (!existing && this.client.options.partials.includes(partialType)) {
            return manager._add(data, cache);
        }
        return existing;
    }
    getChannel(data) {
        var _a, _b, _c, _d;
        const id = (_a = data.channel_id) !== null && _a !== void 0 ? _a : data.id;
        return ((_b = data.channel) !== null && _b !== void 0 ? _b : this.getPayload({
            id,
            guild_id: data.guild_id,
            recipients: [(_d = (_c = data.author) !== null && _c !== void 0 ? _c : data.user) !== null && _d !== void 0 ? _d : { id: data.user_id }],
        }, this.client.channels, id, PartialTypes.CHANNEL));
    }
    getMessage(data, channel, cache) {
        var _a, _b, _c, _d;
        const id = (_a = data.message_id) !== null && _a !== void 0 ? _a : data.id;
        return ((_b = data.message) !== null && _b !== void 0 ? _b : this.getPayload({
            id,
            channel_id: channel.id,
            guild_id: (_c = data.guild_id) !== null && _c !== void 0 ? _c : (_d = channel.guild) === null || _d === void 0 ? void 0 : _d.id,
        }, channel.messages, id, PartialTypes.MESSAGE, cache));
    }
    getReaction(data, message, user) {
        var _a;
        const id = (_a = data.emoji.id) !== null && _a !== void 0 ? _a : decodeURIComponent(data.emoji.name);
        return this.getPayload({
            emoji: data.emoji,
            count: message.partial ? null : 0,
            me: (user === null || user === void 0 ? void 0 : user.id) === this.client.user.id,
        }, message.reactions, id, PartialTypes.REACTION);
    }
    getMember(data, guild) {
        return this.getPayload(data, guild.members, data.user.id, PartialTypes.GUILD_MEMBER);
    }
    getUser(data) {
        var _a;
        const id = data.user_id;
        return (_a = data.user) !== null && _a !== void 0 ? _a : this.getPayload({ id }, this.client.users, id, PartialTypes.USER);
    }
    getUserFromMember(data) {
        var _a;
        if (data.guild_id && ((_a = data.member) === null || _a === void 0 ? void 0 : _a.user)) {
            const guild = this.client.guilds.cache.get(data.guild_id);
            if (guild) {
                return guild.members._add(data.member).user;
            }
            else {
                return this.client.users._add(data.member.user);
            }
        }
        return this.getUser(data);
    }
}
module.exports = GenericAction;
