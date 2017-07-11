import Node from './Node';
import {defineModelProperties} from '../utils';

/**
 * Group object
 * @constructor
 * @extends Node
 * @param {Group} [parent]
 * @param {jQuery} $el
 */
export default function Group (parent, $el) {
    if (!(this instanceof Group)) {
        return new Group(parent, $el);
    }

    Node.call(this, parent, $el);

    /**
     * @member {object[]}
     * @readonly
     */
    this.rules = [];

    /**
     * @name condition
     * @member {string}
     * @memberof Group
     * @instance
     */
    this.__.condition = null;
};

Group.prototype = Object.create(Node.prototype);
Group.prototype.constructor = Group;

defineModelProperties(Group, ['condition']);

/**
 * Removes group's content
 */
Group.prototype.empty = function () {
    this.each('reverse', function (rule) {
        rule.drop();
    }, function (group) {
        group.drop();
    });
};

/**
 * Deletes self
 */
Group.prototype.drop = function () {
    this.empty();
    Node.prototype.drop.call(this);
};

/**
 * Returns the number of children
 * @returns {int}
 */
Group.prototype.length = function () {
    return this.rules.length;
};

/**
 * Adds a Node at specified index
 * @param {Node} node
 * @param {int} [index=end]
 * @param {boolean} [trigger=false] - fire 'add' event
 * @returns {Node} the inserted node
 * @fires Model.model:add
 */
Group.prototype.insertNode = function (node, index, trigger) {
    if (index === undefined) {
        index = this.length();
    }

    this.rules.splice(index, 0, node);
    node.parent = this;

    if (trigger && this.model !== null) {
        /**
         * After a node of the model has been added
         * @event model:add
         * @memberof Model
         * @param {Node} parent
         * @param {Node} node
         * @param {int} index
         */
        this.model.trigger('add', this, node, index);
    }

    return node;
};

/**
 * Adds a new Group at specified index
 * @param {jQuery} $el
 * @param {int} [index=end]
 * @returns {Group}
 * @fires Model.model:add
 */
Group.prototype.addGroup = function ($el, index) {
    return this.insertNode(new Group(this, $el), index, true);
};

/**
 * Adds a new Rule at specified index
 * @param {jQuery} $el
 * @param {int} [index=end]
 * @returns {Rule}
 * @fires Model.model:add
 */
Group.prototype.addRule = function ($el, index) {
    return this.insertNode(new Rule(this, $el), index, true);
};

/**
 * Deletes a specific Node
 * @param {Node} node
 */
Group.prototype.removeNode = function (node) {
    var index = this.getNodePos(node);
    if (index !== -1) {
        node.parent = null;
        this.rules.splice(index, 1);
    }
};

/**
 * Returns the position of a child Node
 * @param {Node} node
 * @returns {int}
 */
Group.prototype.getNodePos = function (node) {
    return this.rules.indexOf(node);
};

/**
 * @callback Model#GroupIteratee
 * @param {Node} node
 * @returns {boolean} stop the iteration
 */

/**
 * Iterate over all Nodes
 * @param {boolean} [reverse=false] - iterate in reverse order, required if you delete nodes
 * @param {Model#GroupIteratee} cbRule - callback for Rules (can be `null` but not omitted)
 * @param {Model#GroupIteratee} [cbGroup] - callback for Groups
 * @param {object} [context] - context for callbacks
 * @returns {boolean} if the iteration has been stopped by a callback
 */
Group.prototype.each = function (reverse, cbRule, cbGroup, context) {
    if (typeof reverse !== 'boolean' && typeof reverse !== 'string') {
        context = cbGroup;
        cbGroup = cbRule;
        cbRule = reverse;
        reverse = false;
    }
    context = context === undefined ? null : context;

    var i = reverse ? this.rules.length - 1 : 0;
    var l = reverse ? 0 : this.rules.length - 1;
    var c = reverse ? -1 : 1;
    var next = function () {
        return reverse ? i >= l : i <= l;
    };
    var stop = false;

    for (; next(); i += c) {
        if (this.rules[i] instanceof Group) {
            if (!!cbGroup) {
                stop = cbGroup.call(context, this.rules[i]) === false;
            }
        }
        else if (!!cbRule) {
            stop = cbRule.call(context, this.rules[i]) === false;
        }

        if (stop) {
            break;
        }
    }

    return !stop;
};

/**
 * Checks if the group contains a particular Node
 * @param {Node} node
 * @param {boolean} [recursive=false]
 * @returns {boolean}
 */
Group.prototype.contains = function (node, recursive) {
    if (this.getNodePos(node) !== -1) {
        return true;
    }
    else if (!recursive) {
        return false;
    }
    else {
        // the loop will return with false as soon as the Node is found
        return !this.each(function () {
            return true;
        }, function (group) {
            return !group.contains(node, true);
        });
    }
};
