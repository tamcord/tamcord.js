// @ts-nocheck
'use strict';
const Action = require('./Action');
const { Events } = require('../../util/Constants');
class PresenceUpdateAction extends Action {
    handle(data) {
        var _a, _b, _c, _d;
        let user = this.client.users.cache.get(data.user.id);
        if (!user && ((_a = data.user) === null || _a === void 0 ? void 0 : _a.username))
            user = this.client.users._add(data.user);
        if (!user)
            return;
        if ((_b = data.user) === null || _b === void 0 ? void 0 : _b.username) {
            if (!user.equals(data.user))
                this.client.actions.UserUpdate.handle(data.user);
        }
        const guild = this.client.guilds.cache.get(data.guild_id);
        if (!guild)
            return;
        const oldPresence = (_d = (_c = guild.presences.cache.get(user.id)) === null || _c === void 0 ? void 0 : _c._clone()) !== null && _d !== void 0 ? _d : null;
        let member = guild.members.cache.get(user.id);
        if (!member && data.status !== 'offline') {
            member = guild.members._add({
                user,
                deaf: false,
                mute: false,
            });
            this.client.emit(Events.GUILD_MEMBER_AVAILABLE, member);
        }
        const newPresence = guild.presences._add(Object.assign(data, { guild }));
        if (this.client.listenerCount(Events.PRESENCE_UPDATE) && !newPresence.equals(oldPresence)) {
            /**
             * Emitted whenever a guild member's presence (e.g. status, activity) is changed.
             * @event Client#presenceUpdate
             * @param {?Presence} oldPresence The presence before the update, if one at all
             * @param {Presence} newPresence The presence after the update
             */
            this.client.emit(Events.PRESENCE_UPDATE, oldPresence, newPresence);
        }
    }
}
module.exports = PresenceUpdateAction;
