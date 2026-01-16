import fetch from 'node-fetch';
import { EventEmitter } from 'events';

/**
 * Main MineAI SDK Client
 */
export class MineAI {
    /**
     * @param {string} apiKey - Your MineAI API Key
     * @param {Object} options - Configuration options
     * @param {string} [options.baseUrl="https://studio.getmineai.site"] - Base API URL
     */
    constructor(apiKey, options = {}) {
        if (!apiKey) {
            throw new Error("MineAI API Key is required");
        }
        this.apiKey = apiKey;
        this.baseUrl = options.baseUrl || "https://studio.getmineai.site";
    }

    /**
     * Chat completions API
     */
    get chat() {
        return {
            completions: {
                create: this._createChatCompletion.bind(this)
            }
        };
    }

    /**
     * Internal method to create chat completion
     * @param {Object} params
     * @param {string} params.model - Model ID (e.g., 'mine:r3-rt-y')
     * @param {Array} params.messages - Array of message objects
     * @param {boolean} [params.stream=false] - Whether to stream the response
     * @param {boolean} [params.memory=false] - Whether to enable memory
     */
    async _createChatCompletion({ model, messages, stream = false, memory = false }) {
        if (!model) throw new Error("Model is required");
        if (!messages || !Array.isArray(messages)) throw new Error("Messages array is required");

        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };

        if (memory) {
            headers['Memory'] = 'true';
        }

        const body = JSON.stringify({
            model,
            messages: memory ? [messages[messages.length - 1]] : messages,
            stream
        });

        const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
            method: 'POST',
            headers,
            body
        });

        if (!response.ok) {
            await this._handleError(response);
        }

        if (stream) {
            return this._handleStream(response);
        } else {
            return await response.json();
        }
    }

    /**
     * Handle API errors
     * @param {Response} response 
     */
    async _handleError(response) {
        let errorBody;
        try {
            errorBody = await response.json();
        } catch (e) {
            errorBody = { message: response.statusText };
        }

        const errorMessage = errorBody.message || errorBody.error || "Unknown error";

        switch (response.status) {
            case 400:
                throw new Error(`[400] Bad Request: ${errorMessage}`);
            case 401:
                throw new Error(`[401] Unauthorized: ${errorMessage} (Check your API Key)`);
            case 402:
                throw new Error(`[402] Payment Required: ${errorMessage} (Insufficient credits)`);
            case 500:
                throw new Error(`[500] Internal Server Error: ${errorMessage}`);
            default:
                throw new Error(`[${response.status}] API Error: ${errorMessage}`);
        }
    }

    /**
     * Handle streaming response
     * @param {Response} response 
     * @returns {EventEmitter}
     */
    _handleStream(response) {
        // In Node.js environment with node-fetch, response.body is a Node.js Readable stream
        return response.body;
    }
}
