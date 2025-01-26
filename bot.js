require('dotenv').config(); // Load environment variables

const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const cors = require('cors');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // Required to read message content
  ],
});

const app = express();
const port = 3000;

// Enable CORS for your domain
app.use(cors({
  origin: 'https://idkstudios.org', // Replace with your domain
}));

// Discord channel configuration
const specificChannelId = '1313175322245595177'; // Replace with your channel ID

let messages = []; // Store messages from the specific channel
const userColors = {}; // Map to store random colors for each user

// Generate a random color
function getRandomColor() {
  const colors = [
    '#FF5733', '#1b7d2d', '#3357FF', '#F32598', '#F39C12',
    '#9B59B6', '#E74C3C', '#1ABC9C', '#34495E', '#82D407',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Assign a color to a username
function getColorForUser(username) {
  if (!userColors[username]) {
    userColors[username] = getRandomColor();
  }
  return userColors[username];
}

// Map attachments to include their URLs
function getAttachments(message) {
  return message.attachments.map((attachment) => attachment.url);
}

// Listen for new messages
client.on('messageCreate', (message) => {
  if (message.channel.id === specificChannelId && !message.author.bot) {
    messages.unshift({
      content: message.content,
      author: message.author.username,
      color: getColorForUser(message.author.username),
      attachments: getAttachments(message),
      timestamp: message.createdAt,
    }).reverse();

    // Keep only the latest 25 messages
    if (messages.length > 25) {
      messages.pop();
    }
  }
});

// Fetch the last 25 messages
async function fetchLastMessages(channelId) {
  try {
    const channel = await client.channels.fetch(channelId);
    const fetchedMessages = await channel.messages.fetch({ limit: 25 });

    // Store the messages in the correct order
    messages = fetchedMessages.map((msg) => ({
      content: msg.content,
      author: msg.author.username,
      color: getColorForUser(msg.author.username),
      attachments: getAttachments(msg),
      timestamp: msg.createdAt,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
}

// Start the bot
client.once('ready', async () => {
  console.log(`Bot logged in as ${client.user.tag}`);
  await fetchLastMessages(specificChannelId);
});

// API endpoint to serve messages
app.get('/messages', (req, res) => {
  res.json(messages);
});

// Start the Express server
app.listen(port, () => {
  console.log(`API is running on http://localhost:${port}`);
});

// Log in to Discord
client.login(process.env.DISCORD_BOT_TOKEN);
