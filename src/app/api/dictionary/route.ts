import { generateObject } from 'ai';
import { chatModel } from '@/lib/ai';
import { DictionarySchema } from '@/features/dictionary/schemas/dictionary.schema';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { word } = await req.json();

    if (!word || typeof word !== 'string' || word.trim().length === 0) {
      return Response.json({ error: 'No word provided to look up.' }, { status: 400 });
    }

    const normalizedWord = word.trim().toLowerCase();

    // ── 1. Check DB cache first ──────────────────────────────────────────────
    const cached = await prisma.dictionaryEntry.findUnique({
      where: { word: normalizedWord },
    });

    if (cached) {
      // Increment lookup count (fire-and-forget)
      prisma.dictionaryEntry.update({
        where: { word: normalizedWord },
        data: { lookupCount: { increment: 1 } },
      }).catch(() => {});

      return Response.json({
        word: cached.word,
        phonetic: cached.phonetic,
        meaning: cached.meaning,
        example: cached.example,
        grammar_notes: cached.grammarNotes,
        level: cached.level,
        fromCache: true,
      });
    }

    // ── 2. Not in DB → call AI ───────────────────────────────────────────────
    const result = await generateObject({
      model: chatModel,
      schema: DictionarySchema,
      prompt: `You are a fun and witty English dictionary called "Miss Lanh". You are famous for explaining vocabulary in a humorous, slightly sarcastic, but always accurate and helpful way — like a cool teacher who makes learning genuinely enjoyable.

Analyze the word "${word.trim()}" and return the data in the exact JSON format required.

IMPORTANT: All fields MUST be written in 100% English. Do NOT use any Vietnamese or other language.

Field instructions:
- word: The original English word (as given).
- phonetic: IPA pronunciation, e.g. /lɜːrn/.
- meaning: Explain the meaning in English using Miss Lanh's witty, funny style. Use analogies, comparisons, or playful commentary to make it memorable.
- example: A funny, slightly sarcastic but grammatically correct example sentence using the word.
- grammar_notes: List 2–4 genuinely useful grammar tips about this word (e.g. irregular forms, collocations, common mistakes, usage patterns). All in English.
- level: Rate the difficulty objectively as one of: "Easy", "Intermediate", or "Hard".

If "${word.trim()}" is not a real English word, still do your best to analyze it but mention it clearly in the meaning field.`,
    });

    const obj = result.object;

    // ── 3. Save to DB ────────────────────────────────────────────────────────
    await prisma.dictionaryEntry.create({
      data: {
        word: normalizedWord,
        phonetic: obj.phonetic,
        meaning: obj.meaning,
        example: obj.example,
        grammarNotes: obj.grammar_notes,
        level: obj.level,
      },
    });

    return Response.json({ ...obj, fromCache: false });
  } catch (error) {
    console.error('[Dictionary API Error]', error);
    return Response.json(
      { error: "Miss Lanh is temporarily unavailable. Please try again! 😅" },
      { status: 500 }
    );
  }
}
