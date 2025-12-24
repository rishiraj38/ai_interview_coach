"use client";

import React, { useEffect, useState, useRef } from 'react';
import { generateFeedback, saveInterviewCoding, saveInterviewFeedback } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function FeedbackPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [progress, setProgress] = useState('Analyzing your interview...');
  const hasStartedFetch = useRef(false);

  useEffect(() => {
    if (hasStartedFetch.current) return;
    hasStartedFetch.current = true;
    
    // Check if feedback already exists in localStorage
    const cachedFeedback = localStorage.getItem('generatedFeedback');
    if (cachedFeedback) {
      try {
        const parsed = JSON.parse(cachedFeedback);
        setFeedback(parsed);
        setLoading(false);
        setSaved(true);
        return;
      } catch (e) {
        // Invalid cache, continue to generate
      }
    }
    
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const interviewId = localStorage.getItem('interviewId');
      const interviewQuestions = JSON.parse(localStorage.getItem('interviewQuestions') || '[]');
      const interviewAnswers = JSON.parse(localStorage.getItem('interviewAnswers') || '[]');
      
      const interviewData = {
          questions: interviewQuestions,
          answers: interviewAnswers
      };
      
      const codingChallenge = JSON.parse(localStorage.getItem('codingChallenge') || '{}');
      const codingResult = JSON.parse(localStorage.getItem('codingResult') || '{}');
      const codingCode = localStorage.getItem('codingCode') || "";
      
      const codingData = {
          challenge: codingChallenge,
          code: codingCode,
          result: codingResult
      };
      
      setProgress('Generating AI feedback (this may take 15-30 seconds)...');
      
      // Generate feedback from AI
      const data = await generateFeedback(interviewData, codingData);
      setFeedback(data);
      
      // Cache the feedback
      localStorage.setItem('generatedFeedback', JSON.stringify(data));
      
      setProgress('Saving to database...');
      
      // Save to database if authenticated
      if (isAuthenticated() && interviewId) {
        const id = parseInt(interviewId);
        
        try {
          await saveInterviewCoding(id, codingChallenge, codingCode, codingResult, codingResult?.skipped || false);
          await saveInterviewFeedback(id, data);
          
          setSaved(true);
          toast.success('Interview saved to your history!');
        } catch (saveError) {
          console.error('Failed to save to database:', saveError);
          toast.error('Failed to save interview to database');
        }
      }
    } catch (error) {
      console.error("Failed to generate feedback", error);
      toast.error('Failed to generate feedback');
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    // Clear interview session data
    localStorage.removeItem('interviewQuestions');
    localStorage.removeItem('interviewAnswers');
    localStorage.removeItem('codingChallenge');
    localStorage.removeItem('codingResult');
    localStorage.removeItem('codingCode');
    localStorage.removeItem('resumeURL');
    localStorage.removeItem('interviewId');
    localStorage.removeItem('generatedFeedback');
    
    router.push('/');
  };

  const startNewInterview = () => {
    localStorage.removeItem('interviewQuestions');
    localStorage.removeItem('interviewAnswers');
    localStorage.removeItem('codingChallenge');
    localStorage.removeItem('codingResult');
    localStorage.removeItem('codingCode');
    localStorage.removeItem('resumeURL');
    localStorage.removeItem('interviewId');
    localStorage.removeItem('generatedFeedback');
    
    router.push('/interview/create');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-base sm:text-lg font-medium">Generating Comprehensive Report...</p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md">{progress}</p>
        
        <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg max-w-sm">
          <p className="text-xs text-amber-600 dark:text-amber-400">
            ⚠️ <strong>Please wait.</strong> Leaving this page will cancel the save. 
            Your score will be ready in a moment!
          </p>
        </div>
      </div>
    );
  }
  
  if (!feedback) return <div className="p-10 text-center text-red-500">Failed to load feedback.</div>;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold">Interview Report</h1>
          <div className="text-xl sm:text-2xl font-semibold text-primary">
              Overall Score: {feedback.totalScore}/100
          </div>
          <div className="text-base sm:text-xl font-medium px-4 py-2 bg-muted rounded-full inline-block">
              Recommendation: {feedback.hiringRecommendation}
          </div>
          
          {saved && (
            <div className="text-sm text-green-600">
              ✓ Interview saved to your history
            </div>
          )}
          
          {!isAuthenticated() && (
            <div className="text-sm text-amber-600">
              ⚠️ Sign in to save this to your history
            </div>
          )}
        </div>

        {/* Scores Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          <div className="p-4 sm:p-6 border rounded-xl bg-card">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Interview Performance</h3>
              <div className="text-3xl sm:text-4xl font-bold mb-2">{feedback.interviewScore}/100</div>
              <p className="text-sm text-muted-foreground">Based on Q&A session.</p>
          </div>
          <div className="p-4 sm:p-6 border rounded-xl bg-card">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Coding Performance</h3>
              <div className="text-3xl sm:text-4xl font-bold mb-2">{feedback.codingScore}/100</div>
              <p className="text-sm text-muted-foreground">Based on code correctness and quality.</p>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
           <div className="p-4 sm:p-0">
               <h3 className="text-base sm:text-lg font-bold text-green-600 mb-2">Strengths</h3>
               <ul className="list-disc list-inside space-y-1 text-sm">
                   {feedback.strengths?.map((s:string, i:number) => <li key={i}>{s}</li>)}
               </ul>
           </div>
           <div className="p-4 sm:p-0">
               <h3 className="text-base sm:text-lg font-bold text-red-600 mb-2">Areas for Improvement</h3>
               <ul className="list-disc list-inside space-y-1 text-sm">
                   {feedback.weaknesses?.map((w:string, i:number) => <li key={i}>{w}</li>)}
               </ul>
           </div>
        </div>

        {/* Detailed Feedback */}
        <div className="p-4 sm:p-6 border rounded-xl bg-muted/30">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Detailed Feedback</h3>
            <p className="leading-relaxed whitespace-pre-wrap text-sm sm:text-base">{feedback.detailedFeedback}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4 sm:pt-8">
            <Button onClick={goHome} size="lg" variant="outline" className="cursor-pointer w-full sm:w-auto">
              🏠 Back to Home
            </Button>
            <Button onClick={startNewInterview} size="lg" className="cursor-pointer w-full sm:w-auto">
              🔄 Start New Interview
            </Button>
            {isAuthenticated() && (
              <Button asChild size="lg" variant="secondary" className="cursor-pointer w-full sm:w-auto">
                <Link href="/interview/history">📊 View History</Link>
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}
