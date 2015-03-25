/**
 * @author Dan Maglasang
 */
import DS from 'ember-data';

export default DS.Model.extend({
  username: DS.attr('string'),
  isTyping: DS.attr('date'),
  placedInCanvas: DS.attr('boolean'),
  pointX: DS.attr('number'),
  pointY: DS.attr('number')
});
