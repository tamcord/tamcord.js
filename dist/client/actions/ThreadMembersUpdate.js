// @ts-nocheck
'use strict';
const Action = require('./Action');
const { Events } = require('../../util/Constants');
class ThreadMembersUpdateAction extends Action {
    handle(data) {
        var _a, _b;
        const client = this.client;
        const thread = client.channels.cache.get(data.id);
        if (thread) {
            const old = thread.members.cache.clone();
            thread.memberCount = data.member_count;
            (_a = data.added_members) === null || _a === void 0 ? void 0 : _a.forEach(rawMember => {
                thread.members._add(rawMember);
            });
            (_b = data.removed_member_ids) === null || _b === void 0 ? void 0 : _b.forEach(memberId => {
                thread.members.cache.delete(memberId);
            });
            /**
             * Emitted whenever members are added or removed from a thread. Requires `GUILD_MEMBERS` privileged intent
             * @event Client#threadMembersUpdate
             * @param {Collection<Snowflake, ThreadMember>} oldMembers The members before the update
             * @param {Collection<Snowflake, ThreadMember>} newMembers The members after the update
             */
            client.emit(Events.THREAD_MEMBERS_UPDATE, old, thread.members.cache);
        }
        return {};
    }
}
module.exports = ThreadMembersUpdateAction;
