import ScoreDisplay from '@/components/ScoreDisplay';

export default function ScorePage() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-background to-secondary/30">
        <ScoreDisplay />
    </main>
  );
}
