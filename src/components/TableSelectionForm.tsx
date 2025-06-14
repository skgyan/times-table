"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle } from 'lucide-react';

const AVAILABLE_TABLES = Array.from({ length: 20 }, (_, i) => i + 1);

export default function TableSelectionForm() {
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const handleTableSelection = (table: number) => {
    setSelectedTables((prev) =>
      prev.includes(table) ? prev.filter((t) => t !== table) : [...prev, table]
    );
  };

  const handleSubmit = () => {
    if (selectedTables.length === 0) {
      toast({
        title: "No Tables Selected",
        description: "Please select at least one times table to practice.",
        variant: "destructive",
        action: <AlertCircle className="text-destructive-foreground" />,
      });
      return;
    }
    router.push(`/practice?tables=${selectedTables.join(',')}`);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline">Times Table Ace</CardTitle>
        <CardDescription className="text-lg">
          Select the times tables you want to practice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
          {AVAILABLE_TABLES.map((table) => (
            <div key={table} className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary/50 transition-colors">
              <Checkbox
                id={`table-${table}`}
                checked={selectedTables.includes(table)}
                onCheckedChange={() => handleTableSelection(table)}
                aria-label={`Select table ${table}`}
              />
              <Label htmlFor={`table-${table}`} className="text-lg cursor-pointer">
                {table}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full text-lg py-6" disabled={selectedTables.length === 0}>
          <CheckCircle className="mr-2 h-5 w-5" /> Start Practice
        </Button>
      </CardFooter>
    </Card>
  );
}
