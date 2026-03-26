export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

export interface ChatConfig {
  maxMessages: number;
  model: string;
}
