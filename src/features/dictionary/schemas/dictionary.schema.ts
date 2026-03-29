import { z } from 'zod';

export const DictionarySchema = z.object({
  word: z.string().describe('The original English word'),
  phonetic: z.string().describe('IPA pronunciation, e.g. /lɜːrn/'),
  meaning: z.string().describe('English meaning explained in Miss Lanh\'s witty, humorous style'),
  example: z.string().describe('A funny, slightly sarcastic but grammatically correct example sentence'),
  grammar_notes: z
    .array(z.string())
    .describe('List of 2-4 useful grammar tips about this word, all in English'),
  level: z
    .enum(['Easy', 'Intermediate', 'Hard'])
    .describe('Difficulty level of the word'),
});

export type DictionaryResult = z.infer<typeof DictionarySchema>;
