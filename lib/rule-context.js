/**
 * @fileoverview RuleContext object's class definition - this object is what we pass to every rule being executed
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

var jsUtils = require ('./utils/js-utils');

var INHERITABLE_METHODS = [
	'getSourceCode',
	'on'
];

/**
 * context object Constructor to set read-only properties and provide additional functionality to the rules using it
 * @param {String} ruleName Name of the rule the object is for
 * @param {Object} ruleMeta Meta data of the rule the object is for
 * @param {Object} Solium Main Solium object from which to inherit functionality to provide to the rules
 */
function RuleContext (ruleName, ruleMeta, Solium) {
	var contextObject = this;

	//set read-only properties of the context object
	Object.defineProperties (contextObject, {

		name: {
			value: ruleName,
			writable: false	//though the default is false anyway, I think its better to express your intention clearly
		},
		
		meta: {
			value: ruleMeta,
			writable: false
		}

	});

	//inherit all Solium methods which are of relevance to the rule
	INHERITABLE_METHODS.forEach (function (methodName) {
		contextObject [methodName] = function (s, z, a, b, o) {	//every method will receive 5 arguments tops
			return Solium [methodName].call (Solium, s, z, a, b, o);
		};
	});

	/**
	 * wrapper around Solium.report () which adds some additional information to the error object
	 * @param {Object} error An object describing the lint error, sent by the rule currently running
	 */
	contextObject.report = function (error) {

		if (!jsUtils.isStrictlyObject (error)) {
			throw new Error (JSON.stringify (error) + ' is an invalid Error object');
		}

		Object.assign (error, {
			ruleName: ruleName,
			type: contextObject.meta.type
		});
		
		Solium.report (error);

	};
}


RuleContext.prototype = {

	constructor: RuleContext,

};

module.exports = RuleContext;