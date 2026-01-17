# MineAI Node.js SDK

The official Node.js SDK from [MineAI-Studio](https://studio.getmineai.site).

Powered by [http://getmineai.site/](http://getmineai.site/)

- [Github](https://github.com/OfficalMinecore/mineai-sdk)
- [Discord Server](https://discord.gg/fbfdwpHctb) – Join the server for Support.

## Installation

```bash
npm install mineai-sdk
```

## Usage

### Basic Chat Completion

```javascript
import MineAI, { Models } from 'mineai-sdk';

const client = new MineAI('YOUR_API_KEY');

async function main() {
  try {
    const response = await client.chat.completions.create({
      model: Models.R3_RT_Y, // or 'mine:r3-rt-y'
      messages: [
        { role: 'user', content: 'Hello, how are you?' }
      ]
    });

    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

### Streaming Responses

The SDK supports streaming responses using standard Node.js streams.

```javascript
import MineAI, { Models } from 'mineai-sdk';

const client = new MineAI('YOUR_API_KEY');

async function streamChat() {
  try {
    const stream = await client.chat.completions.create({
      model: Models.O1_FREE,
      messages: [
        { role: 'user', content: 'Tell me a long story.' }
      ],
      stream: true
    });

    // stream is a Node.js Readable stream
    stream.on('data', (chunk) => {
      // Chunks are raw buffers, you might need to parse SSE format if the API returns SSE
      const text = chunk.toString();
      console.log(text); 
    });

    stream.on('end', () => {
      console.log('\nStream finished.');
    });

  } catch (error) {
    console.error('Stream Error:', error.message);
  }
}

streamChat();
```

### Using Memory

Enable memory to persist conversation context automatically. This feature allows the AI to remember previous interactions within a session without you needing to manage the history manually.

```javascript
import MineAI, { Models } from 'mineai-sdk';

const client = new MineAI('YOUR_API_KEY');

async function chatWithMemory() {
  try {
    // First interaction: AI learns your name
    console.log("Sending first message...");
    await client.chat.completions.create({
      model: Models.R3_RT_Z,
      messages: [{ role: 'user', content: 'My name is Alice.' }],
      memory: true
    });

    // Second interaction: AI remembers your name
    console.log("Sending second message...");
    const response = await client.chat.completions.create({
      model: Models.R3_RT_Z,
      messages: [{ role: 'user', content: 'What is my name?' }],
      memory: true
    });

    console.log('AI Response:', response.choices[0].message.content); // Should mention "Alice"
  } catch (error) {
    console.error('Memory Chat Error:', error.message);
  }
}

chatWithMemory();
```

> [!TIP]
> Memories stored in the database are automatically removed after 3 days.

## Configuration

You can configure the base URL if needed (e.g., for testing or proxies).

```javascript
const client = new MineAI('YOUR_API_KEY', {
  baseUrl: 'https://custom-api.example.com'
});
```

## Supported Models

- `mine:r3-rt-y` (Models.R3_RT_Y)
- `mine:r3-rt-z` (Models.R3_RT_Z)
- `mine:o1-free` (Models.O1_FREE)

## Requirements

- Node.js >= 12.0.0

## Troubleshooting

### Issues
- In older versions, memory functionality was limited or broken.
- Older versions may trigger ESLint or code quality warnings.
- Legacy versions are no longer supported and may contain bugs.
- **1.2.3** is also stable version for your.
- **Latest Version** is highly recommended for stability and new features.

### Integrations:

- Go To [MineAI-Studio](https://studio.getmineai.site/) 
- Select SDK
- Click On Discord Bot
- Copy the code and paste it in your file.
