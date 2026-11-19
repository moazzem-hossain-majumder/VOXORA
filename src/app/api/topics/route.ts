import { NextRequest, NextResponse } from 'next/server';

const CURATED_TOPICS = {
  easy: [
    'Describe the favorite room in your house and why you like it.',
    'What is your go-to comfort food when you are stressed?',
    'Tell me about an interesting person in your neighborhood or school.',
    'What was the best gift you ever gave or received?',
    'What do you usually do on a rainy Sunday afternoon?'
  ],
  intermediate: [
    'If you were given $10,000 that you had to spend in 24 hours, what would you buy?',
    'Describe a skill or hobby you abandoned, and whether you would restart it.',
    'Should employees be forbidden from answering work emails on weekends?',
    'What is one cultural custom from your country that foreigners find surprising?',
    'Is it better to live in a buzzing metropolis or a tranquil rural town?'
  ],
  advanced: [
    'Does the rise of generative AI reduce human creative agency or elevate it?',
    'How does language shape the way we perceive time and emotional nuance?',
    'Should governments prioritize economic growth or environmental regeneration?',
    'Are modern social media algorithms subtly polarising societal discourse?',
    'If immortality were invented tomorrow, what ethical dilemmas would emerge?'
  ],
  funny: [
    'If animals could suddenly speak fluent English, which species would be the rudest?',
    'What is the absolute weirdest food combination that you secretly love?',
    'Defend a ridiculous conspiracy theory with complete seriousness for 60 seconds.',
    'If you had to survive a zombie apocalypse with only two items in your room, what are they?'
  ],
  roleplay: [
    'You are at a Michelin-star restaurant and your soup has an unexpected insect.',
    'You are negotiating a 20% salary increase with your corporate manager.',
    'Your luggage did not arrive at Heathrow Airport and you have an interview in 2 hours.'
  ]
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = (searchParams.get('category') || 'intermediate') as keyof typeof CURATED_TOPICS;
  
  const pool = CURATED_TOPICS[category] || CURATED_TOPICS.intermediate;
  const randomIndex = Math.floor(Math.random() * pool.length);
  const selectedTopic = pool[randomIndex];

  return NextResponse.json({
    topic: selectedTopic,
    category,
    allCategories: Object.keys(CURATED_TOPICS),
  });
}
