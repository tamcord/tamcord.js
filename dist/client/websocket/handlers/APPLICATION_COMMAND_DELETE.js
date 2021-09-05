// @ts-nocheck
'use strict';
const { Events } = require('../../../util/Constants');
module.exports = (client, { d: data }) => {
    var _a;
    const commandManager = data.guild_id ? (_a = client.guilds.cache.get(data.guild_id)) === null || _a === void 0 ? void 0 : _a.commands : client.application.commands;
    if (!commandManager)
        return;
    const isOwn = data.application_id === client.application.id;
    const command = commandManager._add(data, isOwn);
    if (isOwn)
        commandManager.cache.delete(data.id);
    /**
     * Emitted when a guild application command is deleted.
     * @event Client#applicationCommandDelete
     * @param {ApplicationCommand} command The command which was deleted
     */
    client.emit(Events.APPLICATION_COMMAND_DELETE, command);
};
