'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Error } = require('../../errors');
const { InteractionResponseTypes } = require('../../util/Constants');
const MessageFlags = require('../../util/MessageFlags');
const APIMessage = require('../APIMessage');
/**
 * Interface for classes that support shared interaction response types.
 * @interface
 */
class InteractionResponses {
    /**
     * Options for deferring the reply to an {@link Interaction}.
     * @typedef {Object} InteractionDeferOptions
     * @property {boolean} [ephemeral] Whether the reply should be ephemeral
     */
    /**
     * Options for a reply to an {@link Interaction}.
     * @typedef {BaseMessageOptions} InteractionReplyOptions
     * @property {boolean} [ephemeral] Whether the reply should be ephemeral
     */
    /**
     * Defers the reply to this interaction.
     * @param {InteractionDeferOptions} [options] Options for deferring the reply to this interaction
     * @returns {Promise<void>}
     * @example
     * // Defer the reply to this interaction
     * interaction.defer()
     *   .then(console.log)
     *   .catch(console.error)
     * @example
     * // Defer to send an ephemeral reply later
     * interaction.defer({ ephemeral: true })
     *   .then(console.log)
     *   .catch(console.error);
     */
    defer({ ephemeral } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.deferred || this.replied)
                throw new Error('INTERACTION_ALREADY_REPLIED');
            this.ephemeral = ephemeral !== null && ephemeral !== void 0 ? ephemeral : false;
            yield this.client.api.interactions(this.id, this.token).callback.post({
                data: {
                    type: InteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        flags: ephemeral ? MessageFlags.FLAGS.EPHEMERAL : undefined,
                    },
                },
            });
            this.deferred = true;
        });
    }
    /**
     * Creates a reply to this interaction.
     * @param {string|APIMessage|InteractionReplyOptions} options The options for the reply
     * @returns {Promise<void>}
     * @example
     * // Reply to the interaction with an embed
     * const embed = new MessageEmbed().setDescription('Pong!');
     *
     * interaction.reply(embed)
     *   .then(console.log)
     *   .catch(console.error);
     * @example
     * // Create an ephemeral reply
     * interaction.reply({ content: 'Pong!', ephemeral: true })
     *   .then(console.log)
     *   .catch(console.error);
     */
    reply(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.deferred || this.replied)
                throw new Error('INTERACTION_ALREADY_REPLIED');
            this.ephemeral = (_a = options.ephemeral) !== null && _a !== void 0 ? _a : false;
            let apiMessage;
            if (options instanceof APIMessage)
                apiMessage = options;
            else
                apiMessage = APIMessage.create(this, options);
            const { data, files } = yield apiMessage.resolveData().resolveFiles();
            yield this.client.api.interactions(this.id, this.token).callback.post({
                data: {
                    type: InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
                    data,
                },
                files,
            });
            this.replied = true;
        });
    }
    /**
     * Fetches the initial reply to this interaction.
     * @see Webhook#fetchMessage
     * @returns {Promise<Message|APIMessageRaw>}
     * @example
     * // Fetch the reply to this interaction
     * interaction.fetchReply()
     *   .then(reply => console.log(`Replied with ${reply.content}`))
     *   .catch(console.error);
     */
    fetchReply() {
        if (this.ephemeral)
            throw new Error('INTERACTION_EPHEMERAL_REPLIED');
        return this.webhook.fetchMessage('@original');
    }
    /**
     * Edits the initial reply to this interaction.
     * @see Webhook#editMessage
     * @param {string|APIMessage|WebhookEditMessageOptions} options The new options for the message
     * @returns {Promise<Message|APIMessageRaw>}
     * @example
     * // Edit the reply to this interaction
     * interaction.editReply('New content')
     *   .then(console.log)
     *   .catch(console.error);
     */
    editReply(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.deferred && !this.replied)
                throw new Error('INTERACTION_NOT_REPLIED');
            const message = yield this.webhook.editMessage('@original', options);
            this.replied = true;
            return message;
        });
    }
    /**
     * Deletes the initial reply to this interaction.
     * @see Webhook#deleteMessage
     * @returns {Promise<void>}
     * @example
     * // Delete the reply to this interaction
     * interaction.deleteReply()
     *   .then(console.log)
     *   .catch(console.error);
     */
    deleteReply() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ephemeral)
                throw new Error('INTERACTION_EPHEMERAL_REPLIED');
            yield this.webhook.deleteMessage('@original');
        });
    }
    /**
     * Send a follow-up message to this interaction.
     * @param {string|APIMessage|InteractionReplyOptions} options The options for the reply
     * @returns {Promise<Message|APIMessageRaw>}
     */
    followUp(options) {
        return this.webhook.send(options);
    }
    /**
     * Defers an update to the message to which the component was attached
     * @returns {Promise<void>}
     * @example
     * // Defer updating and reset the component's loading state
     * interaction.deferUpdate()
     *   .then(console.log)
     *   .catch(console.error);
     */
    deferUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.deferred || this.replied)
                throw new Error('INTERACTION_ALREADY_REPLIED');
            yield this.client.api.interactions(this.id, this.token).callback.post({
                data: {
                    type: InteractionResponseTypes.DEFERRED_MESSAGE_UPDATE,
                },
            });
            this.deferred = true;
        });
    }
    /**
     * Updates the original message whose button was pressed
     * @param {string|APIMessage|WebhookEditMessageOptions} options The options for the reply
     * @returns {Promise<void>}
     * @example
     * // Remove the components from the message
     * interaction.update({
     *   content: "A button was clicked",
     *   components: []
     * })
     *   .then(console.log)
     *   .catch(console.error);
     */
    update(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.deferred || this.replied)
                throw new Error('INTERACTION_ALREADY_REPLIED');
            let apiMessage;
            if (options instanceof APIMessage)
                apiMessage = options;
            else
                apiMessage = APIMessage.create(this, options);
            const { data, files } = yield apiMessage.resolveData().resolveFiles();
            yield this.client.api.interactions(this.id, this.token).callback.post({
                data: {
                    type: InteractionResponseTypes.UPDATE_MESSAGE,
                    data,
                },
                files,
            });
            this.replied = true;
        });
    }
    static applyToClass(structure, ignore = []) {
        const props = ['defer', 'reply', 'fetchReply', 'editReply', 'deleteReply', 'followUp', 'deferUpdate', 'update'];
        for (const prop of props) {
            if (ignore.includes(prop))
                continue;
            Object.defineProperty(structure.prototype, prop, Object.getOwnPropertyDescriptor(InteractionResponses.prototype, prop));
        }
    }
}
module.exports = InteractionResponses;
