this.patchMarionette = (function(agent) {

  var assignClassNames = function(Backbone, Marionette) {
    Marionette.ItemView.prototype._className = 'ItemView';
    Marionette.CollectionView.prototype._className = 'CollectionView';
    Marionette.CompositeView.prototype._className = 'CompositeView';
    Marionette.View.prototype._className = 'Marionette View';
    Backbone.View.prototype._className = 'Backbone View';

    if (Marionette.LayoutView) {
      Marionette.LayoutView.prototype._className = 'Layout View';
    } else {
      Marionette.Layout.prototype._className = 'Layout View';
    }
  }


  return function(Backbone, Marionette) {

    if (this.patchedMarionette) {
      debug.log('Backbone was detected again');
      return;
    }

    var Marionette = this.patchedMarionette = Marionette;
    debug.log("Marionette detected: ", Marionette);

    assignClassNames(Backbone, Marionette);
    this.patchMarionetteApplication(Marionette.Application);
  }

}(this));
