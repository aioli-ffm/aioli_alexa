/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict'

const Alexa = require('alexa-sdk')
var Speech = require('ssml-builder')

const APP_ID = process.env.APP_ID; // TODO replace with your app ID (OPTIONAL). const APP_ID = process.env.APP_ID

function buildSpeechletResponse (title, output, repromptText, shouldEndSession) {
  return {
    outputSpeech: {
      type: 'PlainText',
      text: output
    },
    card: {
      type: 'Simple',
      title: `SessionSpeechlet - ${title}`,
      content: `SessionSpeechlet - ${output}`
    },
    reprompt: {
      outputSpeech: {
        type: 'PlainText',
        text: repromptText
      }
    },
  shouldEndSession}
}

function buildResponse (sessionAttributes, speechletResponse) {
  return {
    version: '1.0',
    sessionAttributes,
    response: speechletResponse
  }
}

const languageStrings = {
  'en-US': {
    translation: {
      SKILL_NAME: 'Aioli skill',
      HELP_MESSAGE: 'You can ask for the next aioli event: „ask aioli for the next event“.',
      HELP_REPROMPT: 'What can I help you with?',
      STOP_MESSAGE: 'Goodbye!'
    }
  },
  'de-DE': {
    translation: {
      SKILL_NAME: 'Aioli skill',
      HELP_MESSAGE: 'Du kannst nach dem naechsten aioli event fragen.',
      HELP_REPROMPT: 'Wie kann ich dir helfen?',
      STOP_MESSAGE: 'Auf Wiedersehen!'
    }
  }
}

const onError = function (callback) {
  console.error('callbackOnError')
  const speechOutput = callback.t('HELP_MESSAGE')
  const reprompt = callback.t('HELP_REPROMPT')
  callback.emit(':ask', speechOutput, reprompt)
}

const GetNextEvent = function (callback) {
  var name = 'Aioli events'
  var description = 'Events are on wednesdays.'
  var speech = new Speech()
  speech.say('The next event is next week or this week.')
  speech.pause('800ms')
  speech.say('Trust me!')

  var speechOutput = speech.ssml(true)
  callback.emit(':tellWithCard', speechOutput, name, description)
}

const IsEventOn = function (date, callback) {
  var name = 'Aioli events'
  var description = 'Events are on wednesdays.'
  var speech = new Speech()
  speech.say('There is no aioli event on' + date)

  var speechOutput = speech.ssml(true)
  callback.emit(':tellWithCard', speechOutput, name, description)
}

const onLaunchRequest = function (callback) {
  var name = 'Aioli events'
  var description = 'We offer a platform for interesting talks, discussions, ' +
    'presentations and hands-on-workshops about anything related to Artificial Intelligence' +
    ' and Machine Learning in Frankfurt am Main. Meetings are on a bi-weekly basis and open to any interested student.'
  var speech = new Speech()
  speech.say(description)

  var speechOutput = speech.ssml(true)
  callback.emit(':tellWithCard', speechOutput, name, description)
}

const handlers = {
  'LaunchRequest': function () {
    onLaunchRequest(this)
  },
  'GetNextEventIntent': function () {
    GetNextEvent(this)
  },
  'IsEventAtIntent': function () {
    var date = this.event.request.intent.slots.Date.value
    IsEventOn(date, this)
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = this.t('HELP_MESSAGE')
    const reprompt = this.t('HELP_REPROMPT')
    this.emit(':ask', speechOutput, reprompt)
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'))
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'))
  },
  'SessionEndedRequest': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'))
  },
  'Unhandled': function () {
    const speechOutput = this.t('HELP_MESSAGE')
    const reprompt = this.t('HELP_REPROMPT')
    this.emit(':ask', speechOutput, reprompt)
  }
}

exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context)
  alexa.APP_ID = APP_ID
  // To enable string internationalization (i18n) features, set a resources object.
  alexa.resources = languageStrings
  alexa.registerHandlers(handlers)
  alexa.execute()
}
