/*
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, X, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { mockQuestions, mockCourses } from '@/data/mockData';
import { cn } from '@/lib/utils';

const LessonPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(mockQuestions.length).fill(false)
  );

  const course = mockCourses.find(c => c.id === courseId);
  const question = mockQuestions[currentQuestion];
  const progress = ((currentQuestion + (showResult ? 1 : 0)) / mockQuestions.length) * 100;
  const isLastQuestion = currentQuestion === mockQuestions.length - 1;

  useEffect(() => {
    if (!course) {
      navigate('/courses');
    }
  }, [course, navigate]);

  if (!course) {
    return null;
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    
    if (selectedAnswer === question.correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = true;
    setAnsweredQuestions(newAnsweredQuestions);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Lesson complete
      navigate('/courses', { 
        state: { 
          lessonComplete: true, 
          score: score + (selectedAnswer === question.correctAnswer ? 1 : 0),
          total: mockQuestions.length 
        }
      });
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        // { Header}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/courses')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              {course.flag} {course.name}
            </div>
            <div className="lingo-xp-badge">
              <Award className="w-3 h-3 mr-1" />
              +50 XP
            </div>
          </div>
        </div>

        // {Progress Bar }
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Lesson Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        // {Question Card}
        <Card className="lingo-card mb-8">
          <div className="space-y-6">
            //  {Question}
            <div className="text-center space-y-4">
              <div className="text-sm text-muted-foreground font-medium">
                Question {currentQuestion + 1} of {mockQuestions.length}
              </div>
              <h2 className="text-2xl font-bold leading-relaxed">
                {question.question}
              </h2>
            </div>

            // {Answer Options}
            <div className="grid gap-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={cn(
                    "lingo-lesson-choice text-left",
                    selectedAnswer === index && !showResult && "border-primary bg-primary/5",
                    showResult && selectedAnswer === index && isCorrect && "correct",
                    showResult && selectedAnswer === index && !isCorrect && "incorrect",
                    showResult && index === question.correctAnswer && "correct"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold",
                      selectedAnswer === index && !showResult && "border-primary text-primary",
                      showResult && index === question.correctAnswer && "border-success bg-success text-success-foreground",
                      showResult && selectedAnswer === index && !isCorrect && "border-error bg-error text-error-foreground"
                    )}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium">{option}</span>
                    {showResult && index === question.correctAnswer && (
                      <Check className="w-5 h-5 text-success ml-auto" />
                    )}
                    {showResult && selectedAnswer === index && !isCorrect && (
                      <X className="w-5 h-5 text-error ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            // { Explanation}
            {showResult && (
              <div className={cn(
                "p-4 rounded-xl border-l-4",
                isCorrect 
                  ? "bg-success/10 border-success text-success-foreground" 
                  : "bg-error/10 border-error text-error-foreground"
              )}>
                <div className="flex items-center space-x-2 mb-2">
                  {isCorrect ? (
                    <Check className="w-5 h-5 text-success" />
                  ) : (
                    <X className="w-5 h-5 text-error" />
                  )}
                  <span className="font-semibold">
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-sm opacity-90">{question.explanation}</p>
              </div>
            )}
          </div>
        </Card>

        // { Action Buttons }
        <div className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Score: {score}/{answeredQuestions.filter(Boolean).length}
          </div>
          
          <div className="space-x-3">
            {!showResult ? (
              <Button
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null}
                className="px-8"
              >
                Check Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="px-8 group"
              >
                {isLastQuestion ? (
                  <>
                    Complete Lesson
                    <Award className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        { Question Navigation  }
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {mockQuestions.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-200",
                  index === currentQuestion ? "bg-primary scale-125" :
                  answeredQuestions[index] ? "bg-success" :
                  "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
*/


/*
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, X, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockQuestions, mockCourses } from "@/data/mockData";
import { cn } from "@/lib/utils";

const LessonPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Find the course from mock data
  const course = mockCourses.find((c) => c.id === courseId);

  // Determine which set of questions to load
  const selectedQuestions =
    course && mockQuestions[course.name.toLowerCase()]
      ? mockQuestions[course.name.toLowerCase()]
      : [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(selectedQuestions.length).fill(false)
  );

  useEffect(() => {
    if (!course) {
      navigate("/courses");
    }
  }, [course, navigate]);

  if (!course) return null;
  if (!selectedQuestions.length)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">{course.flag} {course.name}</h2>
          <p className="text-muted-foreground">
            No questions available for this course yet.
          </p>
          <Button onClick={() => navigate("/courses")}>Back to Courses</Button>
        </div>
      </div>
    );

  const question = selectedQuestions[currentQuestion];
  const progress =
    ((currentQuestion + (showResult ? 1 : 0)) / selectedQuestions.length) * 100;
  const isLastQuestion = currentQuestion === selectedQuestions.length - 1;
  const isCorrect = selectedAnswer === question?.correctAnswer;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;

    setShowResult(true);

    if (selectedAnswer === question.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = true;
    setAnsweredQuestions(newAnsweredQuestions);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      navigate("/courses", {
        state: {
          lessonComplete: true,
          score: score + (selectedAnswer === question.correctAnswer ? 1 : 0),
          total: selectedQuestions.length,
        },
      });
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        // { Header }
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/courses")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              {course.flag} {course.name}
            </div>
            <div className="lingo-xp-badge">
              <Award className="w-3 h-3 mr-1" />
              +50 XP
            </div>
          </div>
        </div>

        // { Progress Bar }
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Lesson Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        // { Question Card }
        <Card className="lingo-card mb-8">
          <div className="space-y-6">
            // { Question }
            <div className="text-center space-y-4">
              <div className="text-sm text-muted-foreground font-medium">
                Question {currentQuestion + 1} of {selectedQuestions.length}
              </div>
              <h2 className="text-2xl font-bold leading-relaxed">
                {question.question}
              </h2>
            </div>

            // { Answer Options }
            <div className="grid gap-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={cn(
                    "lingo-lesson-choice text-left",
                    selectedAnswer === index && !showResult && "border-primary bg-primary/5",
                    showResult && selectedAnswer === index && isCorrect && "correct",
                    showResult && selectedAnswer === index && !isCorrect && "incorrect",
                    showResult && index === question.correctAnswer && "correct"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold",
                        selectedAnswer === index &&
                          !showResult &&
                          "border-primary text-primary",
                        showResult &&
                          index === question.correctAnswer &&
                          "border-success bg-success text-success-foreground",
                        showResult &&
                          selectedAnswer === index &&
                          !isCorrect &&
                          "border-error bg-error text-error-foreground"
                      )}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium">{option}</span>
                    {showResult && index === question.correctAnswer && (
                      <Check className="w-5 h-5 text-success ml-auto" />
                    )}
                    {showResult && selectedAnswer === index && !isCorrect && (
                      <X className="w-5 h-5 text-error ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            // { Explanation }
            {showResult && (
              <div
                className={cn(
                  "p-4 rounded-xl border-l-4",
                  isCorrect
                    ? "bg-success/10 border-success text-success-foreground"
                    : "bg-error/10 border-error text-error-foreground"
                )}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {isCorrect ? (
                    <Check className="w-5 h-5 text-success" />
                  ) : (
                    <X className="w-5 h-5 text-error" />
                  )}
                  <span className="font-semibold">
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </span>
                </div>
                <p className="text-sm opacity-90">{question.explanation}</p>
              </div>
            )}
          </div>
        </Card>

        // { Action Buttons }
        <div className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Score: {score}/{answeredQuestions.filter(Boolean).length}
          </div>

          <div className="space-x-3">
            {!showResult ? (
              <Button
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null}
                className="px-8"
              >
                Check Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="px-8 group">
                {isLastQuestion ? (
                  <>
                    Complete Lesson
                    <Award className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        // { Question Navigation }
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {selectedQuestions.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-200",
                  index === currentQuestion
                    ? "bg-primary scale-125"
                    : answeredQuestions[index]
                    ? "bg-success"
                    : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
*/


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, X, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockQuestions, mockCourses } from "@/data/mockData";
import { useProgress } from "@/contexts/ProgressContext.simple";
import { cn } from "@/lib/utils";

const LessonPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { updateProgress } = useProgress();

  // Find the course from mock data
  const course = mockCourses.find((c) => c.id === courseId);

  // Determine which set of questions to load
  const selectedQuestions =
    course && mockQuestions[course.name.toLowerCase()]
      ? mockQuestions[course.name.toLowerCase()]
      : [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(selectedQuestions.length).fill(false)
  );

  useEffect(() => {
    if (!course) {
      navigate("/courses");
    }
  }, [course, navigate]);

  if (!course) return null;

  if (!selectedQuestions.length)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">
            {course.flag} {course.name}
          </h2>
          <p className="text-muted-foreground">
            No questions available for this course yet.
          </p>
          <Button onClick={() => navigate("/courses")}>Back to Courses</Button>
        </div>
      </div>
    );

  const question = selectedQuestions[currentQuestion];
  const progress =
    ((currentQuestion + (showResult ? 1 : 0)) / selectedQuestions.length) * 100;
  const isLastQuestion = currentQuestion === selectedQuestions.length - 1;
  const isCorrect = selectedAnswer === question?.correctAnswer;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleCheckAnswer = async () => {
    if (selectedAnswer === null) return;

    setShowResult(true);

    // Award XP only if correct
    if (selectedAnswer === question.correctAnswer) {
      setScore((prev) => prev + 1);

      // Update XP + progress in global context
      await updateProgress(course.id, false, 10); // Award 10 XP per correct answer
    }

    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = true;
    setAnsweredQuestions(newAnsweredQuestions);
  };

  const handleNextQuestion = async () => {
    if (isLastQuestion) {
      // Mark lesson complete in progress context
      await updateProgress(course.id, true, 20); // Award extra XP for lesson completion

      navigate("/courses", {
        state: {
          lessonComplete: true,
          score: score + (selectedAnswer === question.correctAnswer ? 1 : 0),
          total: selectedQuestions.length,
        },
      });
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/courses")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              {course.flag} {course.name}
            </div>
            <div className="lingo-xp-badge">
              <Award className="w-3 h-3 mr-1" />
              +10 XP per correct answer
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Lesson Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Question Card */}
        <Card className="lingo-card mb-8">
          <div className="space-y-6">
            {/* Question */}
            <div className="text-center space-y-4">
              <div className="text-sm text-muted-foreground font-medium">
                Question {currentQuestion + 1} of {selectedQuestions.length}
              </div>
              <h2 className="text-2xl font-bold leading-relaxed">
                {question.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid gap-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={cn(
                    "lingo-lesson-choice text-left",
                    selectedAnswer === index &&
                      !showResult &&
                      "border-primary bg-primary/5",
                    showResult &&
                      selectedAnswer === index &&
                      isCorrect &&
                      "correct",
                    showResult &&
                      selectedAnswer === index &&
                      !isCorrect &&
                      "incorrect",
                    showResult && index === question.correctAnswer && "correct"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold",
                        selectedAnswer === index &&
                          !showResult &&
                          "border-primary text-primary",
                        showResult &&
                          index === question.correctAnswer &&
                          "border-success bg-success text-success-foreground",
                        showResult &&
                          selectedAnswer === index &&
                          !isCorrect &&
                          "border-error bg-error text-error-foreground"
                      )}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium">{option}</span>
                    {showResult && index === question.correctAnswer && (
                      <Check className="w-5 h-5 text-success ml-auto" />
                    )}
                    {showResult &&
                      selectedAnswer === index &&
                      !isCorrect && (
                        <X className="w-5 h-5 text-error ml-auto" />
                      )}
                  </div>
                </button>
              ))}
            </div>

            {/* Explanation */}
            {showResult && (
              <div
                className={cn(
                  "p-4 rounded-xl border-l-4",
                  isCorrect
                    ? "bg-success/10 border-success text-success-foreground"
                    : "bg-error/10 border-error text-error-foreground"
                )}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {isCorrect ? (
                    <Check className="w-5 h-5 text-success" />
                  ) : (
                    <X className="w-5 h-5 text-error" />
                  )}
                  <span className="font-semibold">
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </span>
                </div>
                <p className="text-sm opacity-90">{question.explanation}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Score: {score}/{answeredQuestions.filter(Boolean).length}
          </div>

          <div className="space-x-3">
            {!showResult ? (
              <Button
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null}
                className="px-8"
              >
                Check Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="px-8 group">
                {isLastQuestion ? (
                  <>
                    Complete Lesson
                    <Award className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigation */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {selectedQuestions.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-200",
                  index === currentQuestion
                    ? "bg-primary scale-125"
                    : answeredQuestions[index]
                    ? "bg-success"
                    : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
