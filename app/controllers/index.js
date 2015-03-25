/**
 * @author Dan Maglasang
 */
import Ember from 'ember';

export default Ember.ArrayController.extend({
  socket:       null,
  username:     null,
  signedIn:     false,
  currMessage:  '',
  currMessageDebouncer: null,

  // set sort properties for arrangedContent
  sortProperties: ['createdAtUnix'],
  sortAscending: false,

  /**
   * @description observes the current message in order to tell if the user is typing
   */
  currMessageObserver: function() {
    // cancel any running debouncers avoid multiple calls
    if (this.get('currMessageDebouncer'))
      Ember.run.cancel(this.get('currMessageDebouncer'));

    // delay emit to the server for 200ms
    // also only emit if currMessage is not an empty string
    this.set('currMessageDebouncer', Ember.run.debounce(this, function() {
      if (this.get('currMessage').length > 0)
        this.get('socket').emit('typing');

      this.set('currMessageDebouncer', null); // clear out debouncer
    }, 200) );
  }.observes('currMessage'),

  /**
   * @description handles socket connections
   */
  connectSocket: function() {
    // only if signedIn
    if (this.get('signedIn')) {
      // connect to the socket
      this.set('socket', io.connect('http://10.0.1.228:1337', {
        query: { username: this.get('username') } // send in the entered username
      }));

      // on connect event
      this.get('socket').on('connect', Ember.run.bind(this, function(data) {
        Ember.Logger.info('Connected to socket');
      }));

      // after connect, socket should send back a list of present users
      this.get('socket').on('present users', Ember.run.bind(this, function(data) {
        // data is a list of current users that have open socket connections
        data.forEach(Ember.run.bind(this, function(rawUser) {
          var user = this.createOrUpdateUser(rawUser.id, rawUser.username);
          // if user is not the current user
          if (user.get('id') !== this.get('socket').id)
            user.get('isTypingPointText').content = user.get('username') + ' is up in here.';
        }));
      }));

      // when a new user shows up
      this.get('socket').on('user connected', Ember.run.bind(this, function(id, username) {
        var user = this.createOrUpdateUser(id, username);
        // if user is not the current user
        // TODO test this -- this event should never occur if the user connected is the current user
        if (user.get('id') !== this.get('socket').id)
          user.get('isTypingPointText').content = user.get('username') + ' is up in here.';
      }));

      // when a message comes through
      this.get('socket').on('message', Ember.run.bind(this, function(id, from, timestamp, message) {
        Ember.Logger.info('Message coming in from ' + from + ': ' + message);

        var user = this.createOrUpdateUser(id, from);
        user.get('isTypingPointText').content = user.get('username') + ' is up in here.';

        var storedMessage = this.get('store').push('message', {
          id:           Math.random()*9999999|0,
          fromUsername: from,
          createdAt:    timestamp,
          message:      message
        });
      }));

      // when a user is typing
      this.get('socket').on('typing', Ember.run.bind(this, function(id, username) {
        Ember.Logger.info('User is typing : ' + id + '-' + username);
        var user = this.createOrUpdateUser(id, username);
        this.send('userIsTyping', user);
      }));

      // when a user disconnects, remove from canvas
      this.get('socket').on('user disconnected', Ember.run.bind(this, function(id) {
        var user = this.get('store').getById('user', id);
        if (user !== null) {
          user.get('isTypingPointText').content = user.get('username') + ' go bye-bye.';
          // after 5 seconds, remove the PointText
          Ember.run.later(function() {
            user.get('isTypingPointText').remove();
          }, 5000);
        }
      }));
    }
  }.observes('signedIn'),

  /**
   * @description Creates or updates a user
   * @param {string} id of user
   * @param {string} username of user
   */
  createOrUpdateUser: function(id, username) {
    var data = {
      id: id,
      username: username,
      isTyping: true
    };

    // if the user doesn't exist yet, add its position
    if (this.get('store').getById('user', id) === null) {
      data.pointX = Math.floor(50 + Math.random() * ((this.get('boundX') - 100) + 1 - 50))
      data.pointY = Math.floor(50 + Math.random() * ((this.get('boundY') - 100) + 1 - 50))
    }

    // store the data
    var user = this.get('store').push('user', data);

    // if it hasn't been placed into the canvas AND the id isn't the current user's id
    if (user.get('placedInCanvas') !== true && user.get('id') !== this.get('socket').id) {
      // place the text into the canvas
      var paper = this.get('paper');
      var text = new paper.PointText(new paper.Point(user.get('pointX'), user.get('pointY')));
      text.fontSize = 16;
      text.fontFamily = "'Avenir Next', Helvetica";
      user.set('isTypingPointText', text);

      user.set('placedInCanvas', true);
    }

    return user;
  },

  actions: {
    /**
     * @description action when the user sets a username
     */
    enterUsername: function() {
      this.set('signedIn', true);
    },

    /**
     * @description action when a message is submitted
     */
    submitMessage: function() {
      // make sure there is a message entered
      if (this.get('currMessage').length > 0) {
        var timeNow = moment();

        // send a message through the socket
        this.get('socket').emit('message', timeNow, this.get('currMessage'));

        // push the message into the store immediately
        var storedMessage = this.get('store').push('message', {
          id:           Math.random()*9999999|0,
          fromUsername: this.get('username'),
          createdAt:    timeNow.format(),
          message:      this.get('currMessage')
        });
      }

      this.set('currMessage', '');
    },

    /**
     * @description when a user is typing, this action is fired
     * @param {model} model of the user in the store
     */
    userIsTyping: function(user) {
      // first indicate the user is typing
      user.get('isTypingPointText').content = user.get('username') + ' is typing...';

      // cancel debounces to indicate the user was typing, but did not enter
      if (user.get('typingDebouncer')) Ember.run.cancel(user.get('typingDebouncer'));

      user.set('typingDebouncer', Ember.run.debounce(this, function() {
        // after 5 seconds after the last socket signal that user is typing,
        //   signify that the user is present, but not typing anymore
        user.get('isTypingPointText').content = user.get('username') + ' is up in here.';

        user.set('typingDebouncer', null);
      }, 5000) );
    },
  }
});
