import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { useAuth } from './AuthContext';
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

// AWS DynamoDB Configuration
const dynamoClient = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);
const TABLE_NAME = 'LingoSphere-UserProgress';

// Create Context
const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Progress Provider Component
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
      
      const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { userId: user.id },
      });

      const response = await docClient.send(command);
      
      if (response.Item) {
        setProgress(response.Item as UserProgress);
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
      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: progressData,
      });

      await docClient.send(command);
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

