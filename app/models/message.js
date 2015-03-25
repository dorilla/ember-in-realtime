/**
 * @author Dan Maglasang
 */
import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  fromUsername: DS.attr('string'),
  createdAt:    DS.attr('date'),
  message:      DS.attr('string'),

  /**
   * @description setup when model is ready
   */
  _onReady: function(){
    // update the rendered x ago text every 1 minute
    setInterval(Ember.run.bind(this, this.updateCreatedAtFromNow), 1*60*1000);
  }.on('ready'),

  /**
   * @description computed property for createdAtFromNow
   */
  createdAtFromNow: function() {
    return moment(this.get('createdAt')).fromNow();
  }.property('createdAt'),

  /**
   * @description createdAt represented in UNIX milliseconds
   */
  createdAtUnix: function() {
    return moment(this.get('createdAt')).format('x');
  }.property('createdAt'),

  /**
   * @description updated createdAt text
   */
  updateCreatedAtFromNow: function() {
    Ember.run.next(this, function() {
      this.set('createdAtFromNow', moment(this.get('createdAt')).fromNow());
    });
  },
});
