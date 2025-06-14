import type { Question, AnswerOption } from '@/types/quiz';

const NUM_OPTIONS = 4;
const NUM_QUESTIONS = 10;
const MAX_MULTIPLIER = 12;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateDistractors(correctAnswer: number, table: number, multiplier: number): number[] {
  const distractors: Set<number> = new Set();

  // Try variations of the multiplier
  for (let offset of [-2, -1, 1, 2]) {
    if (multiplier + offset > 0 && multiplier + offset <= MAX_MULTIPLIER) {
      distractors.add(table * (multiplier + offset));
    }
  }

  // Try variations of the table number (less common but can add variety)
  // for (let offset of [-2, -1, 1, 2]) {
  //   if (table + offset > 0) {
  //     distractors.add((table + offset) * multiplier);
  //   }
  // }
  
  // Add/subtract small numbers
  distractors.add(correctAnswer + 1);
  distractors.add(correctAnswer - 1);
  distractors.add(correctAnswer + table);
  distractors.add(correctAnswer - table);


  // Add some random values close to the correct answer
  for (let i = 0; i < 5; i++) {
     const randomOffset = Math.floor(Math.random() * (table > 5 ? 10: 5)) + 1;
     distractors.add(correctAnswer + (Math.random() > 0.5 ? randomOffset : -randomOffset) );
  }

  // Filter out the correct answer and non-positive values
  const validDistractors = Array.from(distractors).filter(
    (d) => d !== correctAnswer && d > 0
  );
  
  return shuffleArray(validDistractors).slice(0, NUM_OPTIONS - 1);
}


export function generateQuizQuestions(selectedTables: number[]): Question[] {
  const questions: Question[] = [];
  if (selectedTables.length === 0) return [];

  for (let i = 0; i < NUM_QUESTIONS; i++) {
    const table = selectedTables[Math.floor(Math.random() * selectedTables.length)];
    const multiplier = Math.floor(Math.random() * MAX_MULTIPLIER) + 1;
    const correctAnswer = table * multiplier;

    const distractors = generateDistractors(correctAnswer, table, multiplier);
    
    const options: AnswerOption[] = [{ value: correctAnswer, isCorrect: true }];
    
    let finalDistractors = distractors;
    // Ensure enough unique distractors
    let attempts = 0;
    while(finalDistractors.length < NUM_OPTIONS -1 && attempts < 10){
        const newDistractorsSet = new Set([...finalDistractors, correctAnswer + (Math.floor(Math.random()*20)-10 * (attempts +1)) ]);
        finalDistractors = Array.from(newDistractorsSet).filter(d => d !== correctAnswer && d > 0);
        attempts++;
    }
     // If still not enough, fill with simple offsets
    let emergencyDistractorOffset = 1;
    while (finalDistractors.length < NUM_OPTIONS - 1) {
      let potentialDistractor = correctAnswer + emergencyDistractorOffset;
      if (potentialDistractor > 0 && !finalDistractors.includes(potentialDistractor) && potentialDistractor !== correctAnswer) {
        finalDistractors.push(potentialDistractor);
      }
      potentialDistractor = correctAnswer - emergencyDistractorOffset;
       if (potentialDistractor > 0 && !finalDistractors.includes(potentialDistractor) && potentialDistractor !== correctAnswer) {
        finalDistractors.push(potentialDistractor);
      }
      emergencyDistractorOffset++;
      if (emergencyDistractorOffset > correctAnswer + 10) break; // Avoid infinite loop
    }


    finalDistractors.slice(0, NUM_OPTIONS - 1).forEach(d => options.push({ value: d, isCorrect: false }));
    
    questions.push({
      id: `q-${i}`,
      text: `${table} × ${multiplier} = ?`,
      options: shuffleArray(options),
      correctAnswer: correctAnswer,
    });
  }
  return questions;
}

export { NUM_QUESTIONS };
