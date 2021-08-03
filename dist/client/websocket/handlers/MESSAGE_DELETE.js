// @ts-nocheck
'use strict';
module.exports = (client, packet) => {
    client.actions.MessageDelete.handle(packet.d);
};
