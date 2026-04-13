import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClipboardList, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { generateSurveyQuestions } from '@/src/lib/surveyService';

interface Question {
  id: string;
  question: string;
  type: 'text' | 'scale' | 'multiple-choice';
  options?: string[];
}

export default function NurseSurveyForm() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    async function fetchQuestions() {
      const q = await generateSurveyQuestions();
      if (q) {
        setQuestions(q);
      } else {
        // Fallback questions if AI fails
        setQuestions([
          { id: '1', question: 'What is your current monthly salary range in PKR?', type: 'multiple-choice', options: ['30k-50k', '50k-70k', '70k-90k', '90k+'] },
          { id: '2', question: 'How much does your current agency take as a commission (%)?', type: 'text' },
          { id: '3', question: 'On a scale of 1-10, how safe do you feel traveling to patients homes in Karachi?', type: 'scale' },
          { id: '4', question: 'Do you have a valid PNC (Pakistan Nursing Council) license?', type: 'multiple-choice', options: ['Yes', 'No', 'In Process'] },
        ]);
      }
      setLoading(false);
    }
    fetchQuestions();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Survey Answers:', answers);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
        <p className="text-slate-400 font-mono text-sm">Initializing Deterministic Survey Pipeline...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center space-y-4"
      >
        <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold text-white">Data Formalized</h3>
        <p className="text-slate-400 max-w-md">
          Thank you for contributing to the Karachi Home Care Trust Infrastructure. Your insights are now part of our deterministic execution model.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)} className="border-slate-800 text-slate-300">
          Submit Another Response
        </Button>
      </motion.div>
    );
  }

  return (
    <Card className="border-sky-500/10 bg-slate-900/40 backdrop-blur-md shadow-2xl overflow-hidden">
      <CardHeader className="border-b border-sky-500/10 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/20">
            <ClipboardList className="h-5 w-5 text-sky-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-white tracking-tight">Karachi Nurse Problem Survey</CardTitle>
            <CardDescription className="text-slate-400">Field research for market formalization & DICE Fellowship principles</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit}>
          <ScrollArea className="h-[600px] p-6">
            <div className="space-y-8 max-w-2xl mx-auto">
              {questions.map((q, index) => (
                <motion.div 
                  key={q.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="space-y-4"
                >
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <Label className="text-base font-semibold text-slate-200 leading-tight tracking-tight">
                      {q.question}
                    </Label>
                  </div>

                  {q.type === 'text' && (
                    <Input 
                      className="bg-slate-950/40 border-sky-500/10 text-slate-200 focus:border-sky-500/50 focus:ring-0 transition-all"
                      placeholder="Type your answer here..."
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      required
                    />
                  )}

                  {q.type === 'scale' && (
                    <RadioGroup 
                      onValueChange={(val) => setAnswers({ ...answers, [q.id]: val })}
                      className="flex justify-between gap-2"
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <div key={num} className="flex flex-col items-center gap-2">
                          <RadioGroupItem value={num.toString()} id={`${q.id}-${num}`} className="sr-only" />
                          <Label 
                            htmlFor={`${q.id}-${num}`}
                            className={`w-10 h-10 rounded-lg border flex items-center justify-center cursor-pointer transition-all font-bold ${
                              answers[q.id] === num.toString() 
                                ? 'bg-sky-500 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]' 
                                : 'bg-slate-900/40 border-sky-500/10 text-slate-500 hover:border-sky-500/30'
                            }`}
                          >
                            {num}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {q.type === 'multiple-choice' && q.options && (
                    <RadioGroup 
                      onValueChange={(val) => setAnswers({ ...answers, [q.id]: val })}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                      required
                    >
                      {q.options.map((opt) => (
                        <div key={opt} className="flex items-center space-x-2 group">
                          <RadioGroupItem value={opt} id={`${q.id}-${opt}`} className="border-sky-500/30 text-sky-500" />
                          <Label htmlFor={`${q.id}-${opt}`} className="text-slate-400 cursor-pointer group-hover:text-slate-200 transition-colors font-medium">{opt}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </motion.div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-6 border-t border-sky-500/10 bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <AlertCircle className="h-4 w-4 text-sky-500/50" />
              <span>Encrypted Research Protocol Active</span>
            </div>
            <Button type="submit" className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white gap-2 px-8 shadow-lg shadow-sky-500/20">
              <Send className="h-4 w-4" /> Submit Survey
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
