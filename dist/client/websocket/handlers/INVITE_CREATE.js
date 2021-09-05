// @ts-nocheck
'use strict';
module.exports = (client, packet) => {
    client.actions.InviteCreate.handle(packet.d);
};
