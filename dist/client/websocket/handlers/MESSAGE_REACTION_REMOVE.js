// @ts-nocheck
'use strict';
module.exports = (client, packet) => {
    client.actions.MessageReactionRemove.handle(packet.d);
};
