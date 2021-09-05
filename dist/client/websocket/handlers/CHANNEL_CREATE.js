// @ts-nocheck
'use strict';
module.exports = (client, packet) => {
    client.actions.ChannelCreate.handle(packet.d);
};
