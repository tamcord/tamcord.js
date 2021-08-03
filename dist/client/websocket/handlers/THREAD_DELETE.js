// @ts-nocheck
'use strict';
module.exports = (client, packet) => {
    client.actions.ThreadDelete.handle(packet.d);
};
