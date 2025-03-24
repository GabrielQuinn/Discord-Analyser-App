import 'dotenv/config';
import express from 'express';
import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { getRandomEmoji, DiscordRequest, GetMessages, ExtractJSONValues } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';
import { spawn } from 'child_process';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// To keep track of our active games
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  // Interaction id, type and data
  const { id, type, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `hello world ${getRandomEmoji()}`,
        },
      });
    }

    // "id" command
    if (name === 'id') {

      // LOOK AT THE FUNCTION IN CHALLENGE COMMAND AND ADD SOMETHING SIMILAR SO U CAN SEE WHAT THE INPUT IS. 
      // AFTER THAT, WRITE A FUNCTION TO FIND USER AND RETURN THEIR ID!!! THEN ADD THE ID TO
      // THE CONTENT KEY BELOW!!!!!!

      const input = req.body.data.options[0].value;

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `${input}'s ID: ${getRandomEmoji()}`,
        },
      });
    }

    // "sentiment" command
    if (name === 'sentiment') {
      console.log("Sentiment command triggered!");

      const channel_id = req.body.channel_id;
      const messages = await GetMessages(channel_id, 10);
      const filteredMessages = ExtractJSONValues(messages);

      const input = req.body.data.options[0].value;
      const user_id = req.body.member.user.id;
      const command = name;

      // run python program here
      const python_process = spawn("python", ["main.py"]);

      console.log(filteredMessages);
      console.log(JSON.stringify(filteredMessages));
      python_process.stdin.write(JSON.stringify(filteredMessages));
      python_process.stdin.end();

      python_process.stdout.on("data", (data) => {
        console.log(`data received as "${data.toString().trim()}"`); // receive data here
      });

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `get all messages here ${getRandomEmoji()}`, // GET MESSAGES HERE!!!!!!
        },
      });
    }

    // "challenge" command
    if (name === 'challenge' && id) {
      // Interaction context
      const context = req.body.context;
      // User ID is in user field for (G)DMs, and member for servers
      const userId = context === 0 ? req.body.member.user.id : req.body.user.id;
      // User's object choice
      const objectName = req.body.data.options[0].value;

      // Create active game using message ID as the game ID
      activeGames[id] = {
          id: userId,
          objectName,
      };

      return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
          content: `Rock papers scissors challenge from <@${userId}>`,
          components: [
          {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
              {
                  type: MessageComponentTypes.BUTTON,
                  // Append the game ID to use later on
                  custom_id: `accept_button_${req.body.id}`,
                  label: 'Accept',
                  style: ButtonStyleTypes.PRIMARY,
              },
              ],
          },
          ],
      },
      });
    }


    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
