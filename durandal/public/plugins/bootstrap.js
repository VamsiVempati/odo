// Generated by CoffeeScript 1.6.3
(function() {
  define(['knockout', 'jquery'], function(ko, $) {
    return ko.bindingHandlers.popover = {
      init: function(element, valueAccessor) {
        var options;
        options = ko.unwrap(valueAccessor());
        return $(element).popover(options);
      }
    };
  });

}).call(this);
