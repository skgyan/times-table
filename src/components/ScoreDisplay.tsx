"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowPathIcon } from '@heroicons/react/24/outline'; // Using Heroicons for variety
import { Award, RotateCcw, Home } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

function ScoreDisplayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const correctAnswers = parseInt(searchParams.get('correct') || '0');
  const totalQuestions = parseInt(searchParams.get('total') || '0');
  const tablesQuery = searchParams.get('tables') || '';

  if (isNaN(correctAnswers) || isNaN(totalQuestions) || totalQuestions === 0) {
     // Invalid parameters, redirect home or show error
     // For now, let's show a basic message and redirect option
    return (
        <Card className="w-full max-w-md mx-auto text-center shadow-xl">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Could not load score. Invalid parameters.</p>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
                <Button onClick={() => router.push('/')} className="w-full">
                    <Home className="mr-2 h-5 w-5" /> Go Home
                </Button>
            </CardFooter>
        </Card>
    );
  }


  const incorrectAnswers = totalQuestions - correctAnswers;
  const scorePercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  let message = "Keep practicing!";
  if (scorePercentage === 100) {
    message = "Amazing! You're a Times Table Ace!";
  } else if (scorePercentage >= 80) {
    message = "Great job! Almost perfect!";
  } else if (scorePercentage >= 50) {
    message = "Good effort! Keep it up!";
  }

  const handlePracticeAgain = () => {
    if (tablesQuery) {
      router.push(`/practice?tables=${tablesQuery}`);
    } else {
      router.push('/'); // Fallback if tables info is missing
    }
  };

  const handleNewPractice = () => {
    router.push('/');
  };

  return (
    <Card className="w-full max-w-md mx-auto text-center shadow-xl">
      <CardHeader>
        <Award className="mx-auto h-16 w-16 text-accent" />
        <CardTitle className="text-3xl font-headline mt-2">Quiz Completed!</CardTitle>
        <CardDescription className="text-lg mt-1">{message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl">
          <p>Correct Answers: <span className="font-bold text-green-600">{correctAnswers}</span></p>
          <p>Incorrect Answers: <span className="font-bold text-red-600">{incorrectAnswers}</span></p>
          <p>Total Questions: <span className="font-bold">{totalQuestions}</span></p>
        </div>
        <div>
          <p className="text-xl font-semibold">Your Score: {scorePercentage.toFixed(0)}%</p>
          <Progress value={scorePercentage} className="w-full mt-2 h-4" />
        </div>
      </CardContent>
      <CardFooter className="flex-col space-y-2">
        {tablesQuery && (
            <Button onClick={handlePracticeAgain} className="w-full text-md py-5">
                <RotateCcw className="mr-2 h-5 w-5" /> Practice Same Tables Again
            </Button>
        )}
        <Button onClick={handleNewPractice} variant="outline" className="w-full text-md py-5">
          <Home className="mr-2 h-5 w-5" /> Start New Practice
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function ScoreDisplay() {
    return (
        <Suspense fallback={
            <Card className="w-full max-w-md mx-auto text-center shadow-xl">
                <CardHeader>
                    <Skeleton className="h-16 w-16 mx-auto rounded-full" />
                    <Skeleton className="h-8 w-3/4 mx-auto mt-2" />
                    <Skeleton className="h-6 w-1/2 mx-auto mt-1" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <div className="mt-4">
                        <Skeleton className="h-6 w-3/4 mx-auto" />
                        <Skeleton className="h-4 w-full mt-2" />
                    </div>
                </CardContent>
                <CardFooter className="flex-col space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </CardFooter>
            </Card>
        }>
            <ScoreDisplayContent />
        </Suspense>
    );
}

