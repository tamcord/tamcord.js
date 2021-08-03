'use strict';
const Interaction = require('./Interaction');
const InteractionWebhook = require('./InteractionWebhook');
const InteractionResponses = require('./interfaces/InteractionResponses');
const { MessageComponentTypes } = require('../util/Constants');
/**
 * Represents a message component interaction.
 * @extends {Interaction}
 * @implements {InteractionResponses}
 */
class MessageComponentInteraction extends Interaction {
    constructor(client, data) {
        var _a, _b;
        super(client, data);
        /**
         * The message to which the component was attached
         * @type {?(Message|APIMessageRaw)}
         */
        this.message = data.message ? (_b = (_a = this.channel) === null || _a === void 0 ? void 0 : _a.messages.add(data.message)) !== null && _b !== void 0 ? _b : data.message : null;
        /**
         * The custom ID of the component which was interacted with
         * @type {string}
         */
        this.customID = data.data.custom_id;
        /**
         * The type of component which was interacted with
         * @type {string}
         */
        this.componentType = MessageComponentInteraction.resolveType(data.data.component_type);
        /**
         * Whether the reply to this interaction has been deferred
         * @type {boolean}
         */
        this.deferred = false;
        /**
         * Whether the reply to this interaction is ephemeral
         * @type {?boolean}
         */
        this.ephemeral = null;
        /**
         * Whether this interaction has already been replied to
         * @type {boolean}
         */
        this.replied = false;
        /**
         * An associated interaction webhook, can be used to further interact with this interaction
         * @type {InteractionWebhook}
         */
        this.webhook = new InteractionWebhook(this.client, this.applicationID, this.token);
    }
    /**
     * The component which was interacted with
     * @type {?(MessageActionRowComponent|Object)}
     * @readonly
     */
    get component() {
        var _a;
        return ((_a = this.message.components
            .flatMap(row => row.components)
            .find(component => { var _a; return ((_a = component.customID) !== null && _a !== void 0 ? _a : component.custom_id) === this.customID; })) !== null && _a !== void 0 ? _a : null);
    }
    /**
     * Resolves the type of a MessageComponent
     * @param {MessageComponentTypeResolvable} type The type to resolve
     * @returns {MessageComponentType}
     * @private
     */
    static resolveType(type) {
        return typeof type === 'string' ? type : MessageComponentTypes[type];
    }
    // These are here only for documentation purposes - they are implemented by InteractionResponses
    /* eslint-disable no-empty-function */
    defer() { }
    reply() { }
    fetchReply() { }
    editReply() { }
    deleteReply() { }
    followUp() { }
    deferUpdate() { }
    update() { }
}
InteractionResponses.applyToClass(MessageComponentInteraction);
module.exports = MessageComponentInteraction;
