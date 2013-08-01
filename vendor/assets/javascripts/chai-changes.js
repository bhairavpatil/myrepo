// Generated by CoffeeScript 1.6.3
(function() {
    (function(chaiChanges) {
        if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
            return module.exports = chaiChanges;
        } else if (typeof define === "function" && define.amd) {
            return define(function() {
                return chaiChanges;
            });
        } else {
            return chai.use(chaiChanges);
        }
    })(function(chai, utils) {
        var byAtLeast, byAtMost, changeBy, changeByAssert, changeFrom, changeFromAssert, changeFromBeginAssert, changeTo, changeToAssert, changeToBeginAssert, clone, flag, formatFunction, inspect, noChangeAssert;
        inspect = utils.inspect;
        flag = utils.flag;
        chai.Assertion.addMethod('when', function(val, options) {
            var action, definedActions, done, isPromise, newPromise, object, promiseCallback, result, _i, _j, _len, _len1,
                _this = this;
            if (options == null) {
                options = {};
            }
            definedActions = flag(this, 'whenActions') || [];
            object = flag(this, 'object');
            flag(this, 'whenObject', object);
            for (_i = 0, _len = definedActions.length; _i < _len; _i++) {
                action = definedActions[_i];
                if (typeof action.before === "function") {
                    action.before(this);
                }
            }
            result = val();
            isPromise = (typeof result === 'object') && (typeof result.then === 'function');
            if (isPromise) {
                done = options != null ? options.notify : void 0;
                if (done == null) {
                    done = function() {};
                }
                promiseCallback = function() {
                    var error, _j, _len1;
                    try {
                        for (_j = 0, _len1 = definedActions.length; _j < _len1; _j++) {
                            action = definedActions[_j];
                            if (typeof action.after === "function") {
                                action.after(_this);
                            }
                        }
                        return done();
                    } catch (_error) {
                        error = _error;
                        done(error);
                        throw error;
                    }
                };
                newPromise = result.then(promiseCallback, promiseCallback);
                return newPromise;
            } else {
                for (_j = 0, _len1 = definedActions.length; _j < _len1; _j++) {
                    action = definedActions[_j];
                    if (typeof action.after === "function") {
                        action.after(this);
                    }
                }
            }
            return this;
        });
        noChangeAssert = function(context) {
            var endValue, negate, object, relevant, result, startValue;
            relevant = flag(context, 'no-change');
            if (!relevant) {
                return;
            }
            negate = flag(context, 'negate');
            flag(context, 'negate', this.negate);
            object = flag(context, 'whenObject');
            startValue = flag(context, 'changeStart');
            endValue = object();
            result = !utils.eql(endValue, startValue);
            context.assert(result, "expected `" + (formatFunction(object)) + "` to change, but it stayed " + (utils.inspect(startValue)), "expected `" + (formatFunction(object)) + "` not to change, but it changed from " + (utils.inspect(startValue)) + " to " + (utils.inspect(endValue)));
            return flag(context, 'negate', negate);
        };
        changeByAssert = function(context) {
            var actualDelta, endValue, negate, object, startValue;
            negate = flag(context, 'negate');
            flag(context, 'negate', this.negate);
            object = flag(context, 'whenObject');
            startValue = flag(context, 'changeStart');
            endValue = object();
            actualDelta = endValue - startValue;
            context.assert(this.expectedDelta === actualDelta, "expected `" + (formatFunction(object)) + "` to change by " + this.expectedDelta + ", but it changed by " + actualDelta, "expected `" + (formatFunction(object)) + "` not to change by " + this.expectedDelta + ", but it did");
            return flag(context, 'negate', negate);
        };
        clone = function(obj) {
            var key, result, value;
            if (obj !== Object(obj)) {
                return obj;
            }
            if (Array.isArray(obj)) {
                return obj.slice();
            }
            result = {};
            for (key in obj) {
                value = obj[key];
                result[key] = value;
            }
            return result;
        };
        changeToBeginAssert = function(context) {
            var negate, object, result, startValue;
            negate = flag(context, 'negate');
            flag(context, 'negate', this.negate);
            object = flag(context, 'whenObject');
            startValue = object();
            flag(context, 'changeToStart', clone(startValue));
            result = !utils.eql(startValue, this.expectedEndValue);
            if (negate) {
                result = !result;
            }
            context.assert(result, "expected `" + (formatFunction(object)) + "` to change to " + (utils.inspect(this.expectedEndValue)) + ", but it was already " + (utils.inspect(startValue)), "not supported");
            return flag(context, 'negate', negate);
        };
        changeToAssert = function(context) {
            var changed, endValue, negate, object, result, startValue;
            negate = flag(context, 'negate');
            flag(context, 'negate', this.negate);
            object = flag(context, 'whenObject');
            startValue = flag(context, 'changeToStart');
            endValue = object();
            if (!negate) {
                changed = !utils.eql(startValue, endValue);
                context.assert(changed, "expected `" + (formatFunction(object)) + "` to change to " + (utils.inspect(this.expectedEndValue)) + ", but it did not change from " + (utils.inspect(startValue)), "not supported");
            }
            result = utils.eql(endValue, this.expectedEndValue);
            context.assert(result, "expected `" + (formatFunction(object)) + "` to change to " + (utils.inspect(this.expectedEndValue)) + ", but it changed to " + (utils.inspect(endValue)), "expected `" + (formatFunction(object)) + "` not to change to " + (utils.inspect(this.expectedEndValue)) + ", but it did");
            return flag(context, 'negate', negate);
        };
        changeFromBeginAssert = function(context) {
            var negate, object, result, startValue;
            negate = flag(context, 'negate');
            flag(context, 'negate', this.negate);
            object = flag(context, 'whenObject');
            startValue = object();
            result = utils.eql(startValue, this.expectedStartValue);
            context.assert(result, "expected the change of `" + (formatFunction(object)) + "` to start from " + (utils.inspect(this.expectedStartValue)) + ", but it started from " + (utils.inspect(startValue)), "expected the change of `" + (formatFunction(object)) + "` not to start from " + (utils.inspect(this.expectedStartValue)) + ", but it did");
            return flag(context, 'negate', negate);
        };
        changeFromAssert = function(context) {
            var endValue, negate, object, result, startValue;
            negate = flag(context, 'negate');
            flag(context, 'negate', this.negate);
            object = flag(context, 'whenObject');
            startValue = flag(context, 'changeStart');
            endValue = object();
            result = !utils.eql(startValue, endValue);
            if (negate) {
                result = !result;
            }
            context.assert(result, "expected `" + (formatFunction(object)) + "` to change from " + (utils.inspect(this.expectedStartValue)) + ", but it did not change", "not supported");
            return flag(context, 'negate', negate);
        };
        chai.Assertion.addProperty('change', function() {
            var definedActions;
            flag(this, 'no-change', true);
            definedActions = flag(this, 'whenActions') || [];
            definedActions.push({
                negate: flag(this, 'negate'),
                before: function(context) {
                    var startValue;
                    startValue = flag(context, 'whenObject')();
                    return flag(context, 'changeStart', startValue);
                },
                after: noChangeAssert
            });
            return flag(this, 'whenActions', definedActions);
        });
        chai.Assertion.addProperty('increase', function() {
            var definedActions;
            definedActions = flag(this, 'whenActions') || [];
            definedActions.push({
                negate: flag(this, 'negate'),
                before: function(context) {
                    var startValue;
                    startValue = flag(context, 'whenObject')();
                    return flag(context, 'increaseStart', startValue);
                },
                after: function(context) {
                    var endValue, negate, object, startValue;
                    object = flag(context, 'whenObject');
                    endValue = object();
                    startValue = flag(context, 'increaseStart');
                    negate = flag(context, 'negate');
                    flag(context, 'negate', this.negate);
                    if (!negate) {
                        context.assert(startValue !== endValue, "expected `" + (formatFunction(object)) + "` to increase, but it did not change", "not supported");
                    }
                    context.assert(startValue < endValue, "expected `" + (formatFunction(object)) + "` to increase, but it decreased by " + (startValue - endValue), "expected `" + (formatFunction(object)) + "` not to increase, but it increased by " + (endValue - startValue));
                    return flag(context, 'negate', negate);
                }
            });
            return flag(this, 'whenActions', definedActions);
        });
        chai.Assertion.addProperty('decrease', function() {
            var definedActions;
            definedActions = flag(this, 'whenActions') || [];
            definedActions.push({
                negate: flag(this, 'negate'),
                before: function(context) {
                    var startValue;
                    startValue = flag(context, 'whenObject')();
                    return flag(context, 'decreaseStart', startValue);
                },
                after: function(context) {
                    var endValue, negate, object, startValue;
                    object = flag(context, 'whenObject');
                    endValue = object();
                    startValue = flag(context, 'decreaseStart');
                    negate = flag(context, 'negate');
                    flag(context, 'negate', this.negate);
                    if (!negate) {
                        context.assert(startValue !== endValue, "expected `" + (formatFunction(object)) + "` to decrease, but it did not change", "not supported");
                    }
                    context.assert(startValue > endValue, "expected `" + (formatFunction(object)) + "` to decrease, but it increased by " + (endValue - startValue), "expected `" + (formatFunction(object)) + "` not to decrease, but it decreased by " + (startValue - endValue));
                    return flag(context, 'negate', negate);
                }
            });
            return flag(this, 'whenActions', definedActions);
        });
        byAtLeast = function(amount) {
            var definedActions;
            definedActions = flag(this, 'whenActions') || [];
            definedActions.push({
                negate: flag(this, 'negate'),
                before: function(context) {
                    var startValue;
                    startValue = flag(context, 'whenObject')();
                    return flag(context, 'atLeastStart', startValue);
                },
                after: function(context) {
                    var difference, endValue, negate, object, startValue;
                    object = flag(context, 'whenObject');
                    endValue = object();
                    startValue = flag(context, 'atLeastStart');
                    negate = flag(context, 'negate');
                    flag(context, 'negate', this.negate);
                    difference = Math.abs(endValue - startValue);
                    context.assert(difference >= amount, "expected `" + (formatFunction(object)) + "` to change by at least " + amount + ", but changed by " + difference, "not supported");
                    return flag(context, 'negate', negate);
                }
            });
            return flag(this, 'whenActions', definedActions);
        };
        chai.Assertion.addChainableMethod('atLeast', byAtLeast, function() {
            return this;
        });
        byAtMost = function(amount) {
            var definedActions;
            definedActions = flag(this, 'whenActions') || [];
            definedActions.push({
                negate: flag(this, 'negate'),
                before: function(context) {
                    var startValue;
                    startValue = flag(context, 'whenObject')();
                    return flag(context, 'atMostStart', startValue);
                },
                after: function(context) {
                    var difference, endValue, negate, object, startValue;
                    object = flag(context, 'whenObject');
                    endValue = object();
                    startValue = flag(context, 'atMostStart');
                    negate = flag(context, 'negate');
                    flag(context, 'negate', this.negate);
                    difference = Math.abs(endValue - startValue);
                    context.assert(difference <= amount, "expected `" + (formatFunction(object)) + "` to change by at most " + amount + ", but changed by " + difference, "not supported");
                    return flag(context, 'negate', negate);
                }
            });
            return flag(this, 'whenActions', definedActions);
        };
        chai.Assertion.addChainableMethod('atMost', byAtMost, function() {
            return this;
        });
        formatFunction = function(func) {
            return func.toString().replace(/^\s*function \(\) {\s*/, '').replace(/\s+}$/, '').replace(/\s*return\s*/, '');
        };
        changeBy = function(delta) {
            var definedActions;
            flag(this, 'no-change', false);
            definedActions = flag(this, 'whenActions') || [];
            definedActions.push({
                negate: flag(this, 'negate'),
                expectedDelta: delta,
                after: changeByAssert
            });
            return flag(this, 'whenActions', definedActions);
        };
        chai.Assertion.addChainableMethod('by', changeBy, function() {
            return this;
        });
        changeTo = function(endValue) {
            var definedActions;
            flag(this, 'no-change', false);
            definedActions = flag(this, 'whenActions') || [];
            definedActions.push({
                negate: flag(this, 'negate'),
                expectedEndValue: endValue,
                before: changeToBeginAssert,
                after: changeToAssert
            });
            return flag(this, 'whenActions', definedActions);
        };
        chai.Assertion.addChainableMethod('to', changeTo, function() {
            return this;
        });
        changeFrom = function(startValue) {
            var definedActions;
            flag(this, 'no-change', false);
            definedActions = flag(this, 'whenActions') || [];
            definedActions.push({
                negate: flag(this, 'negate'),
                expectedStartValue: startValue,
                before: changeFromBeginAssert,
                after: changeFromAssert
            });
            return flag(this, 'whenActions', definedActions);
        };
        return chai.Assertion.addChainableMethod('from', changeFrom, function() {
            return this;
        });
    });

}).call(this);