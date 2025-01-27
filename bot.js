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
const specificChannelId = '1333203561206644888'; // Replace with your channel ID

let messages = []; // Store messages from the specific channel
const userColors = {}; // Map to store random colors for each user

// Generate a random color
function getRandomColor() {
  const colors = [
    '#004fff', '#3f1a63', '#2ec4b6', '#e574bc', '#f41515',
    '#004f2d', '#99011d', '#ff9505', '#5ab349', '#b21fff', '#62a2bf',
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
client.on('messageCreate', async (message) => {
  if (message.channel.id === specificChannelId && !message.author.bot) {
    const member = await message.guild.members.fetch(message.author.id); // Fetch member to get nickname
    messages.push({
      content: message.content,
      author: member.nickname || message.author.username, // Use nickname if available
      color: getColorForUser(message.author.username),
      attachments: getAttachments(message),
      timestamp: message.createdAt,
    });

    // Keep only the latest 25 messages
    if (messages.length > 25) {
      messages.shift();
    }
  }
});


// Fetch the last 25 messages
async function fetchLastMessages(channelId) {
  try {
    const channel = await client.channels.fetch(channelId);
    const fetchedMessages = await channel.messages.fetch({ limit: 25 });

    // Resolve all messages and then reverse the array
    const resolvedMessages = await Promise.all(
      fetchedMessages.map(async (msg) => {
        const member = await msg.guild.members.fetch(msg.author.id); // Fetch member to get nickname
        return {
          content: msg.content,
          author: member.nickname || msg.author.username, // Use nickname if available
          color: getColorForUser(msg.author.username),
          attachments: getAttachments(msg),
          timestamp: msg.createdAt,
        };
      })
    );

    // Reverse the resolved messages array (newest messages at the top)
    messages = resolvedMessages.reverse();
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
