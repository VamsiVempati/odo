// Generated by CoffeeScript 1.6.3
(function() {
  define(['knockout', 'jquery'], function(ko, $) {
    return {
      init: function(requirejs, config) {
        if (config.dialog) {
          requirejs(['plugins/dialog', 'plugins/router'], function(dialog, router) {
            return dialog.addContext('OdoDialog', {
              compositionComplete: function(child, parent, context) {
                var $child, $host, options, theDialog;
                $child = $(child);
                options = {
                  backdrop: 'static'
                };
                theDialog = dialog.getDialog(context.model);
                $host = $(theDialog.host);
                $host.modal(options);
                $host.one('shown.bs.modal', function() {
                  return $child.find('[autofocus],.autofocus').first().focus();
                });
                if ($child.hasClass('autoclose')) {
                  return $host.one('shown.bs.modal', function() {
                    return $host.one('click.dismiss.modal', function() {
                      return theDialog.close();
                    });
                  });
                }
              },
              addHost: function(theDialog) {
                var body, host;
                body = $('body');
                host = $('<div class="modal fade" id="odo-modal" tabindex="-1" role="dialog" aria-hidden="true">').appendTo(body);
                theDialog.host = host.get(0);
                if (config.router) {
                  return router.disable();
                }
              },
              removeHost: function(theDialog) {
                return $(theDialog.host).one('hidden.bs.modal', function() {
                  ko.removeNode(theDialog.host);
                  if (config.router) {
                    return router.enable();
                  }
                }).modal('hide');
              }
            });
          });
        }
        if (config.validation) {
          requirejs(['knockout', 'ko.validation'], function() {
            return ko.validation.configure({
              registerExtenders: true,
              parseInputAttributes: true,
              insertMessages: false,
              errorMessageClass: 'help-block',
              errorElementClass: 'has-error'
            });
          });
        }
        if (config.mousetrap) {
          requirejs(['mousetrap'], function(Mousetrap) {
            Mousetrap = (function(Mousetrap) {
              var _originalBind;
              _originalBind = Mousetrap.bind;
              Mousetrap.bind = function(keys, originalCallback, action) {
                var callback, handle, isBound;
                isBound = true;
                handle = {
                  unbind: function() {
                    return isBound = false;
                  },
                  bind: function() {
                    return isBound = true;
                  }
                };
                callback = function() {
                  if (!isBound) {
                    return;
                  }
                  return originalCallback.apply(this, arguments);
                };
                _originalBind(keys, callback, action);
                return handle;
              };
              return Mousetrap;
            })(Mousetrap);
            Mousetrap.stopCallback = function(e, element, combo) {
              var $element;
              $element = $(element);
              if ($element.hasClass('mousetrap-yes')) {
                return false;
              }
              if ($element.hasClass('mousetrap-yes-' + combo)) {
                return false;
              }
              return element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA' || (element.contentEditable && element.contentEditable === 'true');
            };
            return ko.bindingHandlers.shortcuts = {
              init: function(element, valueAccessor) {
                var handler, handles, key, shortcuts, wrap;
                wrap = function(handler, key) {
                  return function() {
                    handler(key);
                    return false;
                  };
                };
                shortcuts = ko.unwrap(valueAccessor());
                handles = [];
                for (key in shortcuts) {
                  handler = shortcuts[key];
                  handles.push(Mousetrap.bind(key, wrap(handler, key)));
                }
                return ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                  var handle, _i, _len, _results;
                  _results = [];
                  for (_i = 0, _len = handles.length; _i < _len; _i++) {
                    handle = handles[_i];
                    _results.push(handle.unbind());
                  }
                  return _results;
                });
              }
            };
          });
        }
        if (config.q) {
          requirejs(['durandal/system', 'q'], function(system, Q) {
            var originalDefine, originalSetModuleId;
            system.defer = function(action) {
              var deferred, promise;
              deferred = Q.defer();
              action.call(deferred, deferred);
              promise = deferred.promise;
              deferred.promise = function() {
                return promise;
              };
              return deferred;
            };
            window.requireQ = function(deps) {
              var dfd;
              dfd = Q.defer();
              requirejs(deps, function() {
                return dfd.resolve(arguments);
              });
              return dfd.promise;
            };
            originalDefine = window.define;
            window.defineQ = function(name, deps, callback) {
              var args, method;
              method = function(cb) {
                return function() {
                  var args, dfd, that;
                  that = this;
                  dfd = Q.defer();
                  args = Array.prototype.slice.call(arguments, 0);
                  Q.all(args).then(function(resolved) {
                    return dfd.resolve(cb.apply(that, resolved));
                  });
                  return dfd.promise;
                };
              };
              if (typeof name !== 'string') {
                if (system.isArray(name)) {
                  args = [name, method(deps)];
                } else {
                  args = [method(name)];
                }
              } else if (!system.isArray(deps)) {
                args = [name, method(deps)];
              } else {
                args = [name, deps, method(callback)];
              }
              return originalDefine.apply(this, args);
            };
            system.acquire = function() {
              var arrayRequest, deps, first;
              deps = void 0;
              first = arguments[0];
              arrayRequest = false;
              if (system.isArray(first)) {
                deps = first;
                arrayRequest = true;
              } else {
                deps = Array.prototype.slice.call(arguments, 0);
              }
              return this.defer(function(dfd) {
                return requireQ(deps).spread(function() {
                  var args;
                  args = arguments;
                  return setTimeout((function() {
                    if (args.length > 1 || arrayRequest) {
                      return dfd.resolve(Array.prototype.slice.call(args, 0));
                    } else {
                      return dfd.resolve(args[0]);
                    }
                  }), 1);
                }).fail(function(err) {
                  return dfd.reject(err);
                });
              }).promise();
            };
            originalSetModuleId = system.setModuleId;
            return system.setModuleId = function(obj, id) {
              if (system.isPromise(obj)) {
                obj.then(function(newObj) {
                  return originalSetModuleId(newObj, id);
                });
                return;
              }
              return originalSetModuleId(obj, id);
            };
          });
        }
        if (config.bootstrap) {
          ko.bindingHandlers.popover = {
            init: function(element, valueAccessor) {
              var options;
              options = ko.unwrap(valueAccessor());
              return $(element).popover(options);
            }
          };
        }
        if (config.marked) {
          requirejs(['marked'], function(marked) {
            return ko.bindingHandlers.marked = {
              init: function() {
                return {
                  'controlsDescendantBindings': true
                };
              },
              update: function(element, valueAccessor) {
                return ko.utils.setHtml(element, marked(ko.utils.unwrapObservable(valueAccessor())));
              }
            };
          });
        }
        if (config.router) {
          return requirejs(['plugins/router', 'durandal/app'], function(router, app) {
            var isRouterEnabled, previousInstruction, subscription;
            subscription = null;
            router.updateDocumentTitle = function(instance, instruction) {
              var update;
              if (subscription != null) {
                subscription.dispose();
                subscription = null;
              }
              update = function() {
                var parts;
                parts = [];
                if (instance.title != null) {
                  parts.push(ko.unwrap(instance.title));
                }
                if (instruction.config.title != null) {
                  parts.push(instruction.config.title);
                }
                if (app.title != null) {
                  parts.push(app.title);
                }
                parts = parts.filter(function(part) {
                  return part !== '';
                });
                return document.title = parts.join(' - ');
              };
              update();
              if ((instance.title != null) && ko.isObservable(instance.title)) {
                return subscription = instance.title.subscribe(function() {
                  return update();
                });
              }
            };
            isRouterEnabled = true;
            router.disable = function() {
              return isRouterEnabled = false;
            };
            router.enable = function() {
              return isRouterEnabled = true;
            };
            previousInstruction = null;
            return router.guardRoute = function(instance, instruction) {
              if ((previousInstruction != null) && !isRouterEnabled) {
                return previousInstruction.fragment;
              }
              previousInstruction = instruction;
              return true;
            };
          });
        }
      }
    };
  });

}).call(this);
