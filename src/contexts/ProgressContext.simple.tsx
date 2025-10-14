/*
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext.simple';
import { toast } from 'sonner';

// Types
interface UserProgress {
  userId: string;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  courses: CourseProgress[];
  badges: Badge[];
  lastActiveDate: string;
}

interface CourseProgress {
  courseId: string;
  courseName: string;
  language: string;
  level: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  xp: number;
  lastLessonDate?: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

interface ProgressContextType {
  progress: UserProgress | null;
  isLoading: boolean;
  updateProgress: (courseId: string, lessonCompleted: boolean, xpEarned: number) => Promise<void>;
  updateStreak: () => Promise<void>;
  earnBadge: (badgeId: string) => Promise<void>;
  refreshProgress: () => Promise<void>;
}

// Create Context
const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Simple Progress Provider Component (without AWS for now)
export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load user progress when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadProgress();
    } else {
      setProgress(null);
    }
  }, [isAuthenticated, user]);

  const loadProgress = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Check localStorage for saved progress
      const savedProgress = localStorage.getItem(`lingoProgress_${user.id}`);
      
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      } else {
        // Initialize new user progress
        const newProgress: UserProgress = {
          userId: user.id,
          totalXP: 0,
          currentStreak: 0,
          longestStreak: 0,
          courses: [],
          badges: getDefaultBadges(),
          lastActiveDate: new Date().toISOString(),
        };
        
        await saveProgress(newProgress);
        setProgress(newProgress);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
      toast.error('Failed to load your progress');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async (progressData: UserProgress) => {
    try {
      localStorage.setItem(`lingoProgress_${progressData.userId}`, JSON.stringify(progressData));
    } catch (error) {
      console.error('Failed to save progress:', error);
      throw error;
    }
  };

  const updateProgress = async (courseId: string, lessonCompleted: boolean, xpEarned: number) => {
    if (!progress || !user) return;

    try {
      setIsLoading(true);
      
      const updatedProgress = { ...progress };
      
      // Update total XP
      updatedProgress.totalXP += xpEarned;
      
      // Update course progress
      const courseIndex = updatedProgress.courses.findIndex(c => c.courseId === courseId);
      
      if (courseIndex >= 0) {
        // Update existing course
        const course = updatedProgress.courses[courseIndex];
        if (lessonCompleted) {
          course.completedLessons += 1;
          course.xp += xpEarned;
          course.lastLessonDate = new Date().toISOString();
        }
        course.progress = Math.round((course.completedLessons / course.totalLessons) * 100);
        updatedProgress.courses[courseIndex] = course;
      } else {
        // Add new course (this would typically come from course data)
        const newCourse: CourseProgress = {
          courseId,
          courseName: 'New Course', // This should come from course data
          language: 'Unknown',
          level: 'Beginner',
          progress: lessonCompleted ? Math.round((1 / 10) * 100) : 0, // Assuming 10 lessons total
          completedLessons: lessonCompleted ? 1 : 0,
          totalLessons: 10,
          xp: xpEarned,
          lastLessonDate: lessonCompleted ? new Date().toISOString() : undefined,
        };
        updatedProgress.courses.push(newCourse);
      }
      
      // Update last active date
      updatedProgress.lastActiveDate = new Date().toISOString();
      
      // Check for badge achievements
      checkBadgeAchievements(updatedProgress);
      
      await saveProgress(updatedProgress);
      setProgress(updatedProgress);
      
      if (lessonCompleted) {
        toast.success(`Lesson completed! +${xpEarned} XP`);
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
      toast.error('Failed to save progress');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStreak = async () => {
    if (!progress || !user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const lastActive = progress.lastActiveDate.split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const updatedProgress = { ...progress };

      if (lastActive === yesterdayStr) {
        // Continue streak
        updatedProgress.currentStreak += 1;
        if (updatedProgress.currentStreak > updatedProgress.longestStreak) {
          updatedProgress.longestStreak = updatedProgress.currentStreak;
        }
      } else if (lastActive !== today) {
        // Reset streak
        updatedProgress.currentStreak = 1;
      }

      updatedProgress.lastActiveDate = new Date().toISOString();
      
      await saveProgress(updatedProgress);
      setProgress(updatedProgress);
    } catch (error) {
      console.error('Failed to update streak:', error);
    }
  };

  const earnBadge = async (badgeId: string) => {
    if (!progress || !user) return;

    try {
      const updatedProgress = { ...progress };
      const badgeIndex = updatedProgress.badges.findIndex(b => b.id === badgeId);
      
      if (badgeIndex >= 0 && !updatedProgress.badges[badgeIndex].earned) {
        updatedProgress.badges[badgeIndex].earned = true;
        updatedProgress.badges[badgeIndex].earnedDate = new Date().toISOString();
        
        await saveProgress(updatedProgress);
        setProgress(updatedProgress);
        
        toast.success(`Badge earned: ${updatedProgress.badges[badgeIndex].name}!`);
      }
    } catch (error) {
      console.error('Failed to earn badge:', error);
    }
  };

  const checkBadgeAchievements = (progressData: UserProgress) => {
    // Check for various badge achievements
    const badges = progressData.badges;
    
    // First Lesson Badge
    if (progressData.totalXP > 0 && !badges.find(b => b.id === 'first-lesson')?.earned) {
      const firstLessonBadge = badges.find(b => b.id === 'first-lesson');
      if (firstLessonBadge) {
        firstLessonBadge.earned = true;
        firstLessonBadge.earnedDate = new Date().toISOString();
      }
    }
    
    // Streak Badges
    if (progressData.currentStreak >= 7 && !badges.find(b => b.id === 'week-streak')?.earned) {
      const weekStreakBadge = badges.find(b => b.id === 'week-streak');
      if (weekStreakBadge) {
        weekStreakBadge.earned = true;
        weekStreakBadge.earnedDate = new Date().toISOString();
      }
    }
    
    // XP Badges
    if (progressData.totalXP >= 1000 && !badges.find(b => b.id === 'xp-master')?.earned) {
      const xpMasterBadge = badges.find(b => b.id === 'xp-master');
      if (xpMasterBadge) {
        xpMasterBadge.earned = true;
        xpMasterBadge.earnedDate = new Date().toISOString();
      }
    }
  };

  const getDefaultBadges = (): Badge[] => [
    {
      id: 'first-lesson',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      earned: false,
    },
    {
      id: 'week-streak',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      earned: false,
    },
    {
      id: 'xp-master',
      name: 'XP Master',
      description: 'Earn 1000 XP',
      icon: '⭐',
      earned: false,
    },
    {
      id: 'polyglot',
      name: 'Polyglot',
      description: 'Complete 5 different language courses',
      icon: '🌍',
      earned: false,
    },
  ];

  const refreshProgress = async () => {
    await loadProgress();
  };

  const value: ProgressContextType = {
    progress,
    isLoading,
    updateProgress,
    updateStreak,
    earnBadge,
    refreshProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

// Custom hook to use progress context
export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
*/

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext.simple';
import { toast } from 'sonner';
import { mockCourses } from '@/data/mockData';

// Types
interface UserProgress {
  userId: string;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  courses: CourseProgress[];
  badges: Badge[];
  lastActiveDate: string;
}

interface CourseProgress {
  courseId: string;
  courseName: string;
  level: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  xp: number;
  lastLessonDate?: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

interface ProgressContextType {
  progress: UserProgress | null;
  isLoading: boolean;
  updateProgress: (courseId: string, lessonCompleted: boolean, xpEarned: number) => Promise<void>;
  updateStreak: () => Promise<void>;
  earnBadge: (badgeId: string) => Promise<void>;
  refreshProgress: () => Promise<void>;
}

// Create Context
const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Provider
export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProgress();
    } else {
      setProgress(null);
    }
  }, [isAuthenticated, user]);

  const loadProgress = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const savedProgress = localStorage.getItem(`lingoProgress_${user.id}`);

      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      } else {
        const newProgress: UserProgress = {
          userId: user.id,
          totalXP: 0,
          currentStreak: 0,
          longestStreak: 0,
          courses: [],
          badges: getDefaultBadges(),
          lastActiveDate: new Date().toISOString(),
        };
        await saveProgress(newProgress);
        setProgress(newProgress);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
      toast.error('Failed to load your progress');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async (progressData: UserProgress) => {
    try {
      localStorage.setItem(`lingoProgress_${progressData.userId}`, JSON.stringify(progressData));
    } catch (error) {
      console.error('Failed to save progress:', error);
      throw error;
    }
  };

  const updateProgress = async (courseId: string, lessonCompleted: boolean, xpEarned: number) => {
    if (!progress || !user) return;

    try {
      setIsLoading(true);
      const updatedProgress = { ...progress };

      // Update XP
      updatedProgress.totalXP += xpEarned;

      // Find existing course OR add a new one
      const courseIndex = updatedProgress.courses.findIndex(c => c.courseId === courseId);
      const courseMeta = mockCourses.find(c => c.id === courseId);

      if (courseIndex >= 0) {
        const course = updatedProgress.courses[courseIndex];
        if (lessonCompleted) {
          course.completedLessons += 1;
          course.lastLessonDate = new Date().toISOString();
        }
        course.xp += xpEarned;
        course.progress = Math.round((course.completedLessons / course.totalLessons) * 100);
        updatedProgress.courses[courseIndex] = course;
      } else {
        updatedProgress.courses.push({
          courseId,
          courseName: courseMeta?.name || 'Unknown Course',
          level: courseMeta?.level || 'Beginner',
          progress: lessonCompleted ? Math.round((1 / (courseMeta?.totalLessons || 10)) * 100) : 0,
          completedLessons: lessonCompleted ? 1 : 0,
          totalLessons: courseMeta?.totalLessons || 10,
          xp: xpEarned,
          lastLessonDate: lessonCompleted ? new Date().toISOString() : undefined,
        });
      }

      updatedProgress.lastActiveDate = new Date().toISOString();
      checkBadgeAchievements(updatedProgress);

      await saveProgress(updatedProgress);
      setProgress(updatedProgress);

      if (lessonCompleted) toast.success(`Lesson completed! +${xpEarned} XP`);
    } catch (error) {
      console.error('Failed to update progress:', error);
      toast.error('Failed to save progress');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStreak = async () => {
    if (!progress || !user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const lastActive = progress.lastActiveDate.split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const updatedProgress = { ...progress };

      if (lastActive === yesterdayStr) {
        updatedProgress.currentStreak += 1;
        updatedProgress.longestStreak = Math.max(
          updatedProgress.longestStreak,
          updatedProgress.currentStreak
        );
      } else if (lastActive !== today) {
        updatedProgress.currentStreak = 1;
      }

      updatedProgress.lastActiveDate = new Date().toISOString();

      await saveProgress(updatedProgress);
      setProgress(updatedProgress);
    } catch (error) {
      console.error('Failed to update streak:', error);
    }
  };

  const earnBadge = async (badgeId: string) => {
    if (!progress || !user) return;
    try {
      const updatedProgress = { ...progress };
      const badge = updatedProgress.badges.find(b => b.id === badgeId);
      if (badge && !badge.earned) {
        badge.earned = true;
        badge.earnedDate = new Date().toISOString();
        await saveProgress(updatedProgress);
        setProgress(updatedProgress);
        toast.success(`Badge earned: ${badge.name}`);
      }
    } catch (error) {
      console.error('Failed to earn badge:', error);
    }
  };

  const checkBadgeAchievements = (progressData: UserProgress) => {
    const badges = progressData.badges;
    if (progressData.totalXP > 0 && !badges.find(b => b.id === 'first-lesson')?.earned) {
      const first = badges.find(b => b.id === 'first-lesson');
      if (first) {
        first.earned = true;
        first.earnedDate = new Date().toISOString();
      }
    }
    if (progressData.currentStreak >= 7 && !badges.find(b => b.id === 'week-streak')?.earned) {
      const week = badges.find(b => b.id === 'week-streak');
      if (week) {
        week.earned = true;
        week.earnedDate = new Date().toISOString();
      }
    }
    if (progressData.totalXP >= 1000 && !badges.find(b => b.id === 'xp-master')?.earned) {
      const xp = badges.find(b => b.id === 'xp-master');
      if (xp) {
        xp.earned = true;
        xp.earnedDate = new Date().toISOString();
      }
    }
  };

  const getDefaultBadges = (): Badge[] => [
    { id: 'first-lesson', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', earned: false },
    { id: 'week-streak', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', earned: false },
    { id: 'xp-master', name: 'XP Master', description: 'Earn 1000 XP', icon: '⭐', earned: false },
    { id: 'polyglot', name: 'Polyglot', description: 'Complete 5 different language courses', icon: '🌍', earned: false },
  ];

  const refreshProgress = async () => await loadProgress();

  const value: ProgressContextType = { progress, isLoading, updateProgress, updateStreak, earnBadge, refreshProgress };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

// Hook
export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within a ProgressProvider');
  return context;
};


