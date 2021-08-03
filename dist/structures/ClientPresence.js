// @ts-nocheck
'use strict';
const { Presence } = require('./Presence');
const { TypeError } = require('../errors');
const { ActivityTypes, Opcodes } = require('../util/Constants');
class ClientPresence extends Presence {
    /**
     * @param {Client} client The instantiating client
     * @param {APIPresence} [data={}] The data for the client presence
     */
    constructor(client, data = {}) {
        var _a;
        super(client, Object.assign(data, { status: (_a = data.status) !== null && _a !== void 0 ? _a : 'online', user: { id: null } }));
    }
    set(presence) {
        const packet = this._parse(presence);
        this._patch(packet);
        if (typeof presence.shardId === 'undefined') {
            this.client.ws.broadcast({ op: Opcodes.STATUS_UPDATE, d: packet });
        }
        else if (Array.isArray(presence.shardId)) {
            for (const shardId of presence.shardId) {
                this.client.ws.shards.get(shardId).send({ op: Opcodes.STATUS_UPDATE, d: packet });
            }
        }
        else {
            this.client.ws.shards.get(presence.shardId).send({ op: Opcodes.STATUS_UPDATE, d: packet });
        }
        return this;
    }
    _parse({ status, since, afk, activities }) {
        const data = {
            activities: [],
            afk: typeof afk === 'boolean' ? afk : false,
            since: typeof since === 'number' && !Number.isNaN(since) ? since : null,
            status: status !== null && status !== void 0 ? status : this.status,
        };
        if (activities === null || activities === void 0 ? void 0 : activities.length) {
            for (const [i, activity] of activities.entries()) {
                if (typeof activity.name !== 'string')
                    throw new TypeError('INVALID_TYPE', `activities[${i}].name`, 'string');
                if (!activity.type)
                    activity.type = 0;
                data.activities.push({
                    type: typeof activity.type === 'number' ? activity.type : ActivityTypes[activity.type],
                    name: activity.name,
                    url: activity.url,
                });
            }
        }
        else if (!activities && (status || afk || since) && this.activities.length) {
            data.activities.push(...this.activities.map(a => {
                var _a;
                return ({
                    name: a.name,
                    type: ActivityTypes[a.type],
                    url: (_a = a.url) !== null && _a !== void 0 ? _a : undefined,
                });
            }));
        }
        return data;
    }
}
module.exports = ClientPresence;
