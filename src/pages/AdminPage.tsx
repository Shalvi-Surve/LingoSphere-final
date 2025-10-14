import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.simple';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  BarChart3,
  Calendar,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';

// Types
interface AdminUser {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  totalXP: number;
  currentStreak: number;
  coursesCompleted: number;
  joinDate: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'suspended';
}

interface AdminCourse {
  id: string;
  name: string;
  language: string;
  level: string;
  totalLessons: number;
  totalUsers: number;
  averageProgress: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  totalLessons: number;
  averageXP: number;
  totalXP: number;
}

const AdminPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in production, this would come from API calls
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: '1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      isAdmin: false,
      totalXP: 2450,
      currentStreak: 12,
      coursesCompleted: 3,
      joinDate: '2024-01-15',
      lastActive: '2024-01-20',
      status: 'active'
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      isAdmin: false,
      totalXP: 1890,
      currentStreak: 8,
      coursesCompleted: 2,
      joinDate: '2024-01-10',
      lastActive: '2024-01-19',
      status: 'active'
    },
    {
      id: '3',
      email: 'mike.wilson@example.com',
      name: 'Mike Wilson',
      isAdmin: false,
      totalXP: 3200,
      currentStreak: 0,
      coursesCompleted: 5,
      joinDate: '2024-01-05',
      lastActive: '2024-01-18',
      status: 'inactive'
    }
  ]);

  const [courses, setCourses] = useState<AdminCourse[]>([
    {
      id: '1',
      name: 'Spanish for Beginners',
      language: 'Spanish',
      level: 'Beginner',
      totalLessons: 20,
      totalUsers: 150,
      averageProgress: 65,
      status: 'active',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'French Intermediate',
      language: 'French',
      level: 'Intermediate',
      totalLessons: 25,
      totalUsers: 89,
      averageProgress: 42,
      status: 'active',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-18'
    },
    {
      id: '3',
      name: 'German Advanced',
      language: 'German',
      level: 'Advanced',
      totalLessons: 30,
      totalUsers: 45,
      averageProgress: 78,
      status: 'draft',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-20'
    }
  ]);

  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1250,
    activeUsers: 890,
    totalCourses: 12,
    totalLessons: 280,
    averageXP: 1850,
    totalXP: 2312500
  });

  // Redirect if not admin
  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleUserStatusChange = (userId: string, newStatus: AdminUser['status']) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    toast.success(`User status updated to ${newStatus}`);
  };

  const handleCourseStatusChange = (courseId: string, newStatus: AdminCourse['status']) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId ? { ...course, status: newStatus } : course
    ));
    toast.success(`Course status updated to ${newStatus}`);
  };

  const exportData = (type: 'users' | 'courses') => {
    // In production, this would generate and download a CSV/Excel file
    toast.success(`${type} data exported successfully`);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, courses, and platform analytics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="lingo-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-success">
                +{stats.activeUsers} active
              </span>
            </div>
          </Card>

          <Card className="lingo-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">{stats.totalCourses}</p>
              </div>
              <BookOpen className="h-8 w-8 text-secondary" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-muted-foreground">
                {stats.totalLessons} lessons
              </span>
            </div>
          </Card>

          <Card className="lingo-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total XP</p>
                <p className="text-2xl font-bold">{stats.totalXP.toLocaleString()}</p>
              </div>
              <Award className="h-8 w-8 text-warning" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-muted-foreground">
                Avg: {stats.averageXP} XP
              </span>
            </div>
          </Card>

          <Card className="lingo-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-success">
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total
              </span>
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="lingo-card">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New user registered</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Course completed</p>
                      <p className="text-xs text-muted-foreground">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-warning rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New lesson added</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="lingo-card">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Course
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Invite Users
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Platform Settings
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => exportData('users')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            <Card className="lingo-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>XP</TableHead>
                    <TableHead>Streak</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{user.totalXP.toLocaleString()}</TableCell>
                      <TableCell>{user.currentStreak} days</TableCell>
                      <TableCell>{user.coursesCompleted}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.status === 'active' ? 'default' : 
                                  user.status === 'inactive' ? 'secondary' : 'destructive'}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Select 
                            value={user.status} 
                            onValueChange={(value: AdminUser['status']) => 
                              handleUserStatusChange(user.id, value)
                            }
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="suspended">Suspend</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                <Input
                  placeholder="Search courses..."
                  className="w-64"
                />
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => exportData('courses')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="lingo-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">🌍</div>
                      <div>
                        <h3 className="font-semibold">{course.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {course.language} • {course.level}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={course.status === 'active' ? 'default' : 
                              course.status === 'draft' ? 'secondary' : 'outline'}
                    >
                      {course.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.averageProgress}%</span>
                    </div>
                    <div className="lingo-progress-bar">
                      <div 
                        className="lingo-progress-fill"
                        style={{ width: `${course.averageProgress}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="font-semibold">{course.totalLessons}</div>
                        <div className="text-xs text-muted-foreground">Lessons</div>
                      </div>
                      <div>
                        <div className="font-semibold">{course.totalUsers}</div>
                        <div className="text-xs text-muted-foreground">Users</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Select 
                        value={course.status} 
                        onValueChange={(value: AdminCourse['status']) => 
                          handleCourseStatusChange(course.id, value)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="archived">Archive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="lingo-card">
                <h3 className="text-lg font-semibold mb-4">User Growth</h3>
                <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Chart would be rendered here</p>
                  </div>
                </div>
              </Card>

              <Card className="lingo-card">
                <h3 className="text-lg font-semibold mb-4">Course Popularity</h3>
                <div className="space-y-3">
                  {courses.slice(0, 5).map((course, index) => (
                    <div key={course.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{index + 1}
                        </span>
                        <span className="text-sm">{course.name}</span>
                      </div>
                      <div className="text-sm font-medium">
                        {course.totalUsers} users
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="lingo-card">
                <h3 className="text-lg font-semibold mb-4">XP Distribution</h3>
                <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <Award className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Chart would be rendered here</p>
                  </div>
                </div>
              </Card>

              <Card className="lingo-card">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Peak usage time</p>
                      <p className="text-xs text-muted-foreground">7-9 PM daily</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Globe className="w-4 h-4 text-secondary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Top language</p>
                      <p className="text-xs text-muted-foreground">Spanish (35% of users)</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Completion rate</p>
                      <p className="text-xs text-muted-foreground">78% average</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
