import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Get ID command
const GET_ID_COMMAND = {
  name: 'id',
  description: 'Return the ID of a user',
  options: [
    {
      type: 3,
      name: 'global_name',
      description: 'Enter User Global Name',
      required: true,
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

// Sentiment command
const SENTIMENT_COMMAND = {
  name: 'sentiment',
  description: 'Sentiment analysis on server channel or user',
  options: [
    {
      type: 3,
      name: 'message_source',
      description: 'Choose target',
      required: true,
      choices: 
      [
        { name: "Channel ID", value: "channel"},
        { name: "User ID", value: "user"}
      ],
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

// Command containing options
const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

const ALL_COMMANDS = [
  TEST_COMMAND, 
  CHALLENGE_COMMAND, 
  SENTIMENT_COMMAND,
  GET_ID_COMMAND
];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
