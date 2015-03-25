/**
 * @author Dan Maglasang
 */
import Ember from 'ember';

export default Ember.View.extend({
  /**
   * @description setup the sidebar element
   */
  _setup: function() {
    this.$('.sidebar').height(Ember.$(window).height() - 20)
  }.on('willInsertElement'),

  /**
   * @description after index renders, set up the canvas, define the bounds
   */
  didInsertElement: function() {
    // normalize the canvas to the current browser's pixel ratio
    var PIXEL_RATIO = (function () {
      var ctx = document.createElement("canvas").getContext("2d"),
          dpr = window.devicePixelRatio || 1,
          bsr = ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;

      return dpr / bsr;
    })();

    var ratio   = PIXEL_RATIO,
        width   = Ember.$(window).width() - this.$('.sidebar').width() - 22,
        height  = Ember.$(window).height() - this.$('#chat-canvas').offset().top - 10,
        canvas  = document.getElementById('chat-canvas');

    // setup the canvas boundaries
    canvas.width        = width * ratio;
    canvas.height       = height * ratio;
    canvas.style.width  = width + "px";
    canvas.style.height = height + "px";

    // transform the canvas to browser's pixel ratio
    canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);

    // place into DOM
    paper.setup(canvas);
    paper.view.draw();

    // set controller properties
    this.set('controller.boundX', width);
    this.set('controller.boundY', height);
    this.set('controller.paper', paper);
  },
});
