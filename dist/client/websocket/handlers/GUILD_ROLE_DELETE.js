// @ts-nocheck
'use strict';
module.exports = (client, packet) => {
    client.actions.GuildRoleDelete.handle(packet.d);
};
