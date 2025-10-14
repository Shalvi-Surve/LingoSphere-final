import { Play, BookOpen, Clock, Award, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockCourses } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext.simple";
import { useProgress } from "@/contexts/ProgressContext.simple";
import LoadingSpinner from "@/components/LoadingSpinner";
import AuthModal from "@/components/AuthModal";

const CoursesPage = () => {
  const { isAuthenticated } = useAuth();
  const { progress, isLoading } = useProgress();
  const navigate = useNavigate();

  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Merge mock courses with user progress
  const coursesWithProgress = mockCourses.map((course) => {
    const userCourse = progress?.courses.find((c) => c.courseId === course.id);
    return {
      ...course,
      progress: userCourse?.progress || 0,
      completedLessons: userCourse?.completedLessons || 0,
      xp: userCourse?.xp || 0,
    };
  });

  const handleOpenCourseIntro = (course: any) => {
    setSelectedCourse(course);
  };

  const handleStartCourse = () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
    } else {
      navigate(`/lesson/${selectedCourse.id}`);
      setSelectedCourse(null);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold">Choose Your Language</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select from our comprehensive collection of language courses designed
            to take you from beginner to fluent.
          </p>
        </div>

        {/* Progress Overview */}
        {isAuthenticated && (
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="lingo-card text-center">
              <div className="lingo-xp-badge mb-2 text-foreground">
                <Award className="w-4 h-4 mr-1" />
                {isLoading ? <LoadingSpinner size="sm" /> : `${progress?.totalXP || 0} XP`}
              </div>
              <p className="text-sm text-muted-foreground">Total Experience</p>
            </Card>
            <Card className="lingo-card text-center">
              <div className="text-2xl font-bold text-warning mb-1">
                🔥 {isLoading ? <LoadingSpinner size="sm" /> : progress?.currentStreak || 0}
              </div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </Card>
            <Card className="lingo-card text-center">
              <div className="text-2xl font-bold text-success mb-1">
                {isLoading
                  ? <LoadingSpinner size="sm" />
                  : progress?.courses.reduce((sum, c) => sum + c.completedLessons, 0) || 0}
              </div>
              <p className="text-sm text-muted-foreground">Lessons Completed</p>
            </Card>
            <Card className="lingo-card text-center">
              <div className="text-2xl font-bold text-secondary mb-1">
                {isLoading
                  ? <LoadingSpinner size="sm" />
                  : progress?.badges.filter((b) => b.earned).length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Badges Earned</p>
            </Card>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coursesWithProgress.map((course) => (
            <Card key={course.id} className="lingo-course-card group">
              <div className="p-6 space-y-4">
                {/* Course Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{course.flag}</div>
                    <div>
                      <h3 className="text-xl font-bold">{course.name}</h3>
                      <p className="text-muted-foreground">{course.language}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {course.level}
                  </Badge>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="lingo-progress-bar">
                    <div
                      className="lingo-progress-fill"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center text-primary mb-1">
                      <Award className="w-4 h-4 mr-1" />
                      {course.xp}
                    </div>
                    <p className="text-xs text-muted-foreground">XP Earned</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center text-secondary mb-1">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {course.completedLessons}/{course.totalLessons}
                    </div>
                    <p className="text-xs text-muted-foreground">Lessons</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center text-accent mb-1">
                      <Clock className="w-4 h-4 mr-1" />
                      ~2h
                    </div>
                    <p className="text-xs text-muted-foreground">Time Left</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{course.description}</p>

                {/* Open Intro Modal */}
                <Button className="w-full group" onClick={() => handleOpenCourseIntro(course)}>
                  <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  {course.progress > 0 ? "Continue Learning" : "Start Course"}
                </Button>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </Card>
          ))}
        </div>
      </div>

      {/* Course Intro Modal */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl">
          {selectedCourse && (
            <>
              <DialogHeader className="flex justify-between items-center">
                <DialogTitle className="text-2xl font-bold">{selectedCourse.name}</DialogTitle>
                <Button variant="ghost" onClick={() => setSelectedCourse(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-muted-foreground">{selectedCourse.description}</p>

                <div>
                  <h4 className="text-lg font-semibold mb-2">Modules in this course:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedCourse.modules?.map((mod: string, index: number) => (
                      <li key={index}>{mod}</li>
                    )) || <li>Module details coming soon...</li>}
                  </ul>
                </div>

                <div className="pt-6">
                  {!isAuthenticated ? (
                    <div className="text-center space-y-4">
                      <p className="text-muted-foreground">
                        Please log in or sign up to start learning this course.
                      </p>
                      <Button onClick={handleStartCourse} className="w-full">
                        Log In / Sign Up
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={handleStartCourse}>
                      Start Learning
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default CoursesPage;
