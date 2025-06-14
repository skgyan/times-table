"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { generateQuizQuestions, NUM_QUESTIONS } from '@/lib/quizUtils';
import type { Question, AnswerOption } from '@/types/quiz';
import { cn } from '@/lib/utils';
import { Check, X, ChevronsRight, Trophy } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

function QuizAreaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tablesQuery = searchParams.get('tables');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tablesQuery) {
      router.push('/');
      return;
    }
    const selectedTables = tablesQuery.split(',').map(Number);
    if (selectedTables.length === 0 || selectedTables.some(isNaN)) {
        router.push('/');
        return;
    }
    
    setQuestions(generateQuizQuestions(selectedTables));
    setIsLoading(false);
  }, [tablesQuery, router]);

  const handleAnswer = (option: AnswerOption) => {
    if (feedback) return; // Prevent answering again

    setSelectedAnswer(option.value);
    if (option.isCorrect) {
      setFeedback('correct');
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setFeedback('incorrect');
      setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < NUM_QUESTIONS - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setFeedback(null);
    } else {
      router.push(`/score?correct=${score.correct}&total=${NUM_QUESTIONS}&tables=${tablesQuery}`);
    }
  };

  if (isLoading || questions.length === 0) {
    return (
        <Card className="w-full max-w-2xl mx-auto shadow-xl">
            <CardHeader>
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-1/2 mx-auto mt-2" />
            </CardHeader>
            <CardContent className="space-y-8">
                <Skeleton className="h-12 w-1/2 mx-auto" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-lg" />
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Skeleton className="h-12 w-full" />
            </CardFooter>
        </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressValue = ((currentQuestionIndex +1) / NUM_QUESTIONS) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl font-headline text-center">
          Question {currentQuestionIndex + 1} of {NUM_QUESTIONS}
        </CardTitle>
        <Progress value={progressValue} className="w-full mt-2 h-3" />
        <CardDescription className="text-center text-muted-foreground mt-1">
            Correct: {score.correct} | Incorrect: {score.incorrect}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <p className="text-3xl sm:text-4xl font-bold text-center py-6 bg-primary/10 rounded-lg select-none">
          {currentQuestion.text}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option.value;
            const isCorrectOption = option.isCorrect;
            
            let buttonClass = "bg-card hover:bg-secondary/70";
            let animationClass = "";

            if (feedback && isSelected) {
              if (feedback === 'correct') {
                buttonClass = "bg-green-500 hover:bg-green-600 text-white";
                animationClass = "animate-pulseCorrect";
              } else {
                buttonClass = "bg-red-500 hover:bg-red-600 text-white";
                animationClass = "animate-shake";
              }
            } else if (feedback && isCorrectOption) {
                // Highlight correct answer if wrong one was chosen
                buttonClass = "bg-green-500/70 text-white opacity-80";
            }


            return (
              <Button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={!!feedback}
                variant="outline"
                className={cn(
                  "h-24 sm:h-28 text-2xl sm:text-3xl font-bold rounded-lg shadow-md transition-all duration-300 ease-in-out transform focus:scale-105 focus:ring-2 focus:ring-primary/80",
                  buttonClass,
                  animationClass,
                  feedback && !isSelected && !isCorrectOption ? "opacity-60" : "",
                )}
                aria-live="polite"
              >
                {option.value}
                {feedback && isSelected && (
                    feedback === 'correct' ? <Check className="ml-2 h-8 w-8" /> : <X className="ml-2 h-8 w-8" />
                )}
                 {feedback && !isSelected && isCorrectOption && <Check className="ml-2 h-8 w-8 opacity-70" />}
              </Button>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        {feedback && (
          <Button onClick={handleNext} className="w-full text-lg py-6" autoFocus>
            {currentQuestionIndex < NUM_QUESTIONS - 1 ? (
              <>Next Question <ChevronsRight className="ml-2 h-5 w-5" /></>
            ) : (
              <>View Score <Trophy className="ml-2 h-5 w-5" /></>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}


export default function QuizArea() {
    return (
      <Suspense fallback={
        <Card className="w-full max-w-2xl mx-auto shadow-xl">
            <CardHeader>
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-1/2 mx-auto mt-2" />
            </CardHeader>
            <CardContent className="space-y-8">
                <Skeleton className="h-12 w-1/2 mx-auto" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-lg" />
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Skeleton className="h-12 w-full" />
            </CardFooter>
        </Card>
      }>
        <QuizAreaContent />
      </Suspense>
    );
}
