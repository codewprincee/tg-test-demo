/**
 * API Client for TouchBase IO Backend
 * Handles communication with the Express backend server
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://demoapi.trytouchbase.io';

export interface StreamResponse {
  text?: string;
  error?: string;
}

/**
 * Generate streaming AI response from backend
 */
export async function* generateAIStreamFromBackend(
  userQuery: string,
  context?: string
): AsyncGenerator<string> {
  try {
    const response = await fetch(`${API_URL}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: userQuery,
        context: context,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No reader available');
    }

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6); // Remove 'data: ' prefix

          if (data === '[DONE]') {
            return;
          }

          try {
            const parsed: StreamResponse = JSON.parse(data);

            if (parsed.error) {
              console.error('Stream error:', parsed.error);
              yield '';
            } else if (parsed.text) {
              yield parsed.text;
            }
          } catch (e) {
            // Skip malformed JSON
            console.warn('Malformed JSON in stream:', data);
          }
        }
      }
    }
  } catch (error) {
    console.error('Backend API Error:', error);
    yield '';
  }
}

/**
 * Generate non-streaming AI response from backend (fallback)
 */
export async function generateAIResponseFromBackend(
  userQuery: string,
  context?: string
): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: userQuery,
        context: context,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('Backend API Error:', error);
    return '';
  }
}

/**
 * Check backend API health
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}
