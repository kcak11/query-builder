/**
 * Main object storing data model and emitting model events
 * @constructor
 */
export default function Model() {
    /**
     * @member {Group}
     * @readonly
     */
    this.root = null;

    /**
     * Base for event emitting
     * @member {jQuery}
     * @readonly
     * @private
     */
    this.$ = $(this);
}

$.extend(Model.prototype, /** @lends Model.prototype */ {
    /**
     * Triggers an event on the model
     * @param {string} type
     * @returns {$.Event}
     */
    trigger: function (type) {
        var event = new $.Event(type);
        this.$.triggerHandler(event, Array.prototype.slice.call(arguments, 1));
        return event;
    },

    /**
     * Attaches an event listener on the model
     * @param {string} type
     * @param {function} cb
     * @returns {Model}
     */
    on: function () {
        this.$.on.apply(this.$, Array.prototype.slice.call(arguments));
        return this;
    },

    /**
     * Removes an event listener from the model
     * @param {string} type
     * @param {function} [cb]
     * @returns {Model}
     */
    off: function () {
        this.$.off.apply(this.$, Array.prototype.slice.call(arguments));
        return this;
    },

    /**
     * Attaches an event listener called once on the model
     * @param {string} type
     * @param {function} cb
     * @returns {Model}
     */
    once: function () {
        this.$.one.apply(this.$, Array.prototype.slice.call(arguments));
        return this;
    }
});
