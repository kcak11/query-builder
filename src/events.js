import * as $ from 'jquery';

import {QueryBuilder} from './core';

$.extend(QueryBuilder.prototype, /** @lends QueryBuilder.prototype */ {
    /**
     * Triggers an event on the builder container
     * @param {string} type
     * @returns {$.Event}
     */
    trigger: function (type) {
        var event = new $.Event(this._tojQueryEvent(type), {
            builder: this
        });

        this.$el.triggerHandler(event, Array.prototype.slice.call(arguments, 1));

        return event;
    },

    /**
     * Triggers an event on the builder container and returns the modified value
     * @param {string} type
     * @param {*} value
     * @returns {*}
     */
    change: function (type, value) {
        var event = new $.Event(this._tojQueryEvent(type, true), {
            builder: this,
            value  : value
        });

        this.$el.triggerHandler(event, Array.prototype.slice.call(arguments, 2));

        return event.value;
    },

    /**
     * Attaches an event listener on the builder container
     * @param {string} type
     * @param {function} cb
     * @returns {QueryBuilder}
     */
    on: function (type, cb) {
        this.$el.on(this._tojQueryEvent(type), cb);
        return this;
    },

    /**
     * Removes an event listener from the builder container
     * @param {string} type
     * @param {function} [cb]
     * @returns {QueryBuilder}
     */
    off: function (type, cb) {
        this.$el.off(this._tojQueryEvent(type), cb);
        return this;
    },

    /**
     * Attaches an event listener called once on the builder container
     * @param {string} type
     * @param {function} cb
     * @returns {QueryBuilder}
     */
    once: function (type, cb) {
        this.$el.one(this._tojQueryEvent(type), cb);
        return this;
    },

    /**
     * Appends `.queryBuilder` and optionally `.filter` to the events names
     * @param {string} name
     * @param {boolean} [filter=false]
     * @returns {string}
     * @private
     */
    _tojQueryEvent: function (name, filter) {
        return name.split(' ').map(function (type) {
            return type + '.queryBuilder' + (filter ? '.filter' : '');
        }).join(' ');
    }
});
