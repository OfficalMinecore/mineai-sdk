# MineAI Node.js SDK

The official Node.js SDK from [MineAI](https://studio.minecloud.site).

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

Enable memory to persist conversation context automatically.

```javascript
import MineAI, { Models } from 'mineai-sdk';

const client = new MineAI('YOUR_API_KEY');

async function chatWithMemory() {
  const response = await client.chat.completions.create({
    model: Models.R3_RT_Z,
    messages: [
      { role: 'user', content: 'My name is Alice.' }
    ],
    memory: true // Enables server-side memory
  });

  console.log(response.choices[0].message.content);
}
```

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
