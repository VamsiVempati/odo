// Generated by IcedCoffeeScript 1.6.3-g
(function() {


  define(['durandal/system', './animate.css'], function(system, Animate) {
    return function(context) {
      system.extend(context, {
        inAnimation: 'slideInRight',
        outAnimation: 'slideOutLeft'
      });
      return new Animate().create(context);
    };
  });

}).call(this);