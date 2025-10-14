/*
import { Calendar, Award, Flame, TrendingUp, BookOpen, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockUser, mockCourses } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext.simple';
import { useProgress } from '@/contexts/ProgressContext.simple';
import LoadingPage from '@/components/LoadingPage';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { progress, isLoading: progressLoading } = useProgress();

  // Show loading while checking authentication
  if (authLoading) {
    return <LoadingPage message="Loading your profile..." />;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Use real progress data if available, otherwise fallback to mock data
  const userProgress = progress || {
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    courses: [],
    badges: []
  };

  const totalLessons = userProgress.courses.reduce((sum, course) => sum + course.completedLessons, 0);
  const totalTimeStudied = Math.round(totalLessons * 2.5); // ~2.5 hours per lesson

  const stats = [
    {
      icon: Award,
      label: 'Total XP',
      value: userProgress.totalXP.toLocaleString(),
      color: 'text-warning'
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${userProgress.currentStreak} days`,
      color: 'text-error'
    },
    {
      icon: BookOpen,
      label: 'Lessons Completed',
      value: totalLessons.toString(),
      color: 'text-success'
    },
    {
      icon: Clock,
      label: 'Time Studied',
      value: `${totalTimeStudied}h`,
      color: 'text-secondary'
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        // {  Header   }
        <div className="text-center mb-12">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4 text-4xl">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h1 className="text-3xl font-bold mb-2">{user?.name || 'User'}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
          <div className="mt-4">
            <span className="lingo-xp-badge text-lg">
              <Award className="w-4 h-4 mr-1" />
              Level {Math.floor(userProgress.totalXP / 500) + 1}
            </span>
          </div>
        </div>

        // {  Stats Grid   }
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="lingo-card text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 mb-4 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {  Course Progress   }
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-primary" />
              Course Progress
            </h2>
            
            <div className="space-y-4">
              {userProgress.courses.length > 0 ? userProgress.courses.map((course) => (
                <Card key={course.courseId} className="lingo-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">🌍</div>
                      <div>
                        <h3 className="font-semibold">{course.courseName}</h3>
                        <p className="text-sm text-muted-foreground">{course.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="lingo-xp-badge text-sm">
                        <Award className="w-3 h-3 mr-1" />
                        {course.xp} XP
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <div className="lingo-progress-bar">
                      <div 
                        className="lingo-progress-fill"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </Card>
              )) : (
                <Card className="lingo-card text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses started yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your language learning journey by exploring our courses!
                  </p>
                  <Button asChild>
                    <a href="/courses">Browse Courses</a>
                  </Button>
                </Card>
              )}
            </div>
          </div>

          // {  Achievements & Streak   }
          <div className="space-y-6">
            {  Streak Card   }
            <Card className="lingo-card">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Flame className="w-5 h-5 mr-2 text-error" />
                Streak Stats
              </h3>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-error/10 to-warning/10 rounded-xl">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-2xl font-bold text-error">{userProgress.currentStreak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Longest Streak</span>
                  <span className="font-semibold">{userProgress.longestStreak} days</span>
                </div>
                
                <Button className="w-full" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
              </div>
            </Card>

            // {  Badges   }
            <Card className="lingo-card">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-warning" />
                Achievements
              </h3>
              
              <div className="space-y-3">
                {userProgress.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      badge.earned 
                        ? 'bg-gradient-to-r from-success/10 to-success/5 border border-success/20' 
                        : 'bg-muted/50 opacity-60'
                    }`}
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium">{badge.name}</div>
                      <div className="text-xs text-muted-foreground">{badge.description}</div>
                    </div>
                    {badge.earned && (
                      <Badge variant="secondary" className="text-xs">
                        Earned
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                View All Badges
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
*/

import {
  Calendar,
  Award,
  Flame,
  TrendingUp,
  BookOpen,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext.simple";
import { useProgress } from "@/contexts/ProgressContext.simple";
import LoadingPage from "@/components/LoadingPage";

/** Shape we expect from progress.courses items */
type ProgressCourse = {
  courseId: string;
  courseName: string;
  level: string;
  xp: number;
  totalLessons: number;
  completedLessons: number;
  progress: number; // 0..100
};

/** Shape we expect from progress object */
type ProgressState = {
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  courses: ProgressCourse[];
  badges: { id: string; name: string; description: string; icon: string; earned: boolean; earnedDate?: string }[];
};

const EMPTY_PROGRESS: ProgressState = {
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  courses: [],
  badges: [],
};

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { progress, isLoading: progressLoading } = useProgress();

  // Loading states (auth or progress)
  if (authLoading || progressLoading) {
    return <LoadingPage message="Loading your profile..." />;
  }

  // Fallbacks so UI never blanks for guests
  const effectiveUser = isAuthenticated
    ? user
    : { name: "Guest User", email: "" };

  const userProgress: ProgressState = (progress as ProgressState) || EMPTY_PROGRESS;

  // Safely compute totals
  const courses: ProgressCourse[] = Array.isArray(userProgress.courses)
    ? userProgress.courses
    : [];

  const totalLessons = courses.reduce<number>(
    (sum, course) => sum + (course.completedLessons ?? 0),
    0
  );

  // ~2.5h per lesson (demo estimate)
  const totalTimeStudied = Math.round(totalLessons * 2.5);

  const stats = [
    {
      icon: Award,
      label: "Total XP",
      value: (userProgress.totalXP ?? 0).toLocaleString(),
      color: "text-warning",
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${userProgress.currentStreak ?? 0} days`,
      color: "text-error",
    },
    {
      icon: BookOpen,
      label: "Lessons Completed",
      value: String(totalLessons),
      color: "text-success",
    },
    {
      icon: Clock,
      label: "Time Studied",
      value: `${totalTimeStudied}h`,
      color: "text-secondary",
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Guest banner */}
        {!isAuthenticated && (
          <div className="mb-6 text-center p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground text-sm">
              You are viewing the profile as a guest.{" "}
              <a
                href="/login"
                className="text-primary underline hover:opacity-80"
              >
                Sign in
              </a>{" "}
              to save your progress!
            </p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4 text-4xl">
            {effectiveUser?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {effectiveUser?.name || "User"}
          </h1>
          <p className="text-muted-foreground">{effectiveUser?.email}</p>
          <div className="mt-4">
            <span className="lingo-xp-badge text-lg">
              <Award className="w-4 h-4 mr-1" />
              Level {Math.floor((userProgress.totalXP ?? 0) / 500) + 1}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="lingo-card text-center">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 mb-4 ${stat.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Progress */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-primary" />
              Course Progress
            </h2>

            <div className="space-y-4">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <Card key={course.courseId} className="lingo-card">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">🌍</div>
                        <div>
                          <h3 className="font-semibold">{course.courseName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {course.level}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="lingo-xp-badge text-sm">
                          <Award className="w-3 h-3 mr-1" />
                          {course.xp} XP
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          {course.completedLessons}/{course.totalLessons} lessons
                        </span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <div className="lingo-progress-bar">
                        <div
                          className="lingo-progress-fill"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="lingo-card text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No courses started yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start your language learning journey by exploring our
                    courses!
                  </p>
                  <Button asChild>
                    <a href="/courses">Browse Courses</a>
                  </Button>
                </Card>
              )}
            </div>
          </div>

          {/* Achievements & Streak */}
          <div className="space-y-6">
            {/* Streak Card */}
            <Card className="lingo-card">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Flame className="w-5 h-5 mr-2 text-error" />
                Streak Stats
              </h3>

              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-error/10 to-warning/10 rounded-xl">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-2xl font-bold text-error">
                    {userProgress.currentStreak ?? 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>

                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Longest Streak</span>
                  <span className="font-semibold">
                    {userProgress.longestStreak ?? 0} days
                  </span>
                </div>

                <Button className="w-full" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
              </div>
            </Card>

            {/* Badges */}
            <Card className="lingo-card">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-warning" />
                Achievements
              </h3>

              <div className="space-y-3">
                {(userProgress.badges ?? []).length > 0 ? (
                  userProgress.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                        badge.earned
                          ? "bg-gradient-to-r from-success/10 to-success/5 border border-success/20"
                          : "bg-muted/50 opacity-60"
                      }`}
                    >
                      <div className="text-2xl">{badge.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium">{badge.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {badge.description}
                        </div>
                      </div>
                      {badge.earned && (
                        <BadgeUI variant="secondary" className="text-xs">
                          Earned
                        </BadgeUI>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    No badges earned yet.
                  </p>
                )}
              </div>

              <Button className="w-full mt-4" variant="outline">
                View All Badges
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
