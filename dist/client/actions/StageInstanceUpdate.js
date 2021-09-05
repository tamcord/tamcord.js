// @ts-nocheck
'use strict';
const Action = require('./Action');
const { Events } = require('../../util/Constants');
class StageInstanceUpdateAction extends Action {
    handle(data) {
        var _a, _b;
        const client = this.client;
        const channel = this.getChannel(data);
        if (channel) {
            const oldStageInstance = (_b = (_a = channel.guild.stageInstances.cache.get(data.id)) === null || _a === void 0 ? void 0 : _a._clone()) !== null && _b !== void 0 ? _b : null;
            const newStageInstance = channel.guild.stageInstances._add(data);
            /**
             * Emitted whenever a stage instance gets updated - e.g. change in topic or privacy level
             * @event Client#stageInstanceUpdate
             * @param {?StageInstance} oldStageInstance The stage instance before the update
             * @param {StageInstance} newStageInstance The stage instance after the update
             */
            client.emit(Events.STAGE_INSTANCE_UPDATE, oldStageInstance, newStageInstance);
            return { oldStageInstance, newStageInstance };
        }
        return {};
    }
}
module.exports = StageInstanceUpdateAction;
