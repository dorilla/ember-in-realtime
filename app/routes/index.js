/**
 * @author Dan Maglasang
 */
import Ember from 'ember';

export default Ember.Route.extend({
  /**
   * @description define the model of index
   */
  model: function() {
    return this.store.all('message');
  },
});
