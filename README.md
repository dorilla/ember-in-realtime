# Ember-in-Realtime

This is a prototype project to aid in presenting at a Meetup for Ember.js DC. This project provides a crude implementation of socket.io with Ember.js.

NOTE: This is not to be used in a production environment. No security measures are used in the implementation.

Files in question:
`app/controllers/index.js`
`app/routes/index.js`
`app/views/index.js`

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`
* `cd socket-server`
* `npm install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

* `cd socket-server`
* `node server.js`
