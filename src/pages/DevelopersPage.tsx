import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Github,
  Linkedin,
  Mail,
  Code,
  Heart,
  Users,
  Star,
  GitBranch,
  Calendar,
  ExternalLink,
} from 'lucide-react';

const DevelopersPage = () => {
  const contributors = [
    {
      id: 1,
      name: 'Shalvi Atul Surve',
      role: 'Full Stack Developer',
      avatar: '👩‍💻',
      bio: 'Passionate about creating innovative language learning solutions with modern web technologies.',
      skills: ['React', 'TypeScript', 'AWS', 'Node.js', 'Python'],
      github: 'https://github.com/Shalvi-Surve/',
      linkedin: 'https://www.linkedin.com/in/shalvi-surve-0b572728a/',
      email: 'shalviatul.surve2023@vitstudent.ac.in',
      contributions: 156,
    },
    {
      id: 2,
      name: 'Swagata Banerjee',
      role: 'Frontend Developer',
      avatar: '👩‍💻',
      bio: 'UI/UX enthusiast with a love for creating beautiful and intuitive user experiences.',
      skills: ['React', 'TailwindCSS', 'Figma', 'JavaScript', 'CSS'],
      github: 'https://github.com/swagata',
      linkedin: 'https://linkedin.com/in/swagata',
      email: 'swagata@lingosphere.com',
      contributions: 124,
    },
    {
      id: 3,
      name: 'Pari',
      role: 'Backend Developer',
      avatar: '👩‍💻',
      bio: 'Focused on building scalable and secure backend infrastructure with modern tools.',
      skills: ['Node.js', 'Express', 'MongoDB', 'API Design', 'AWS Lambda'],
      github: 'https://github.com/pari',
      linkedin: 'https://linkedin.com/in/pari',
      email: 'pari@lingosphere.com',
      contributions: 89,
    },
  ];

  const projectStats = {
    totalContributors: contributors.length,
    totalCommits: contributors.reduce((sum, c) => sum + c.contributions, 0),
    languages: ['TypeScript', 'JavaScript', 'Python', 'CSS', 'YAML'],
    startDate: '2024-01-01',
  };

  const technologies = [
    { name: 'React', category: 'Frontend', description: 'Modern UI library for building interactive user interfaces' },
    { name: 'TypeScript', category: 'Language', description: 'Type-safe JavaScript for better development experience' },
    { name: 'TailwindCSS', category: 'Styling', description: 'Utility-first CSS framework for rapid UI development' },
    { name: 'AWS Cognito', category: 'Authentication', description: 'Secure user authentication and authorization' },
    { name: 'AWS DynamoDB', category: 'Database', description: 'NoSQL database for storing user progress and data' },
    { name: 'AWS Lambda', category: 'Backend', description: 'Serverless functions for API endpoints' },
    { name: 'Vite', category: 'Build Tool', description: 'Fast build tool and development server' },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Meet the Developers</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            The passionate team behind LingoSphere, working together to create the future of language learning.
          </p>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="lingo-card text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{projectStats.totalContributors}</div>
            <div className="text-sm text-muted-foreground">Contributors</div>
          </Card>
          <Card className="lingo-card text-center">
            <GitBranch className="w-8 h-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold">{projectStats.totalCommits}</div>
            <div className="text-sm text-muted-foreground">Total Commits</div>
          </Card>
          <Card className="lingo-card text-center">
            <Code className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">{projectStats.languages.length}</div>
            <div className="text-sm text-muted-foreground">Languages</div>
          </Card>
          <Card className="lingo-card text-center">
            <Calendar className="w-8 h-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold">20</div>
            <div className="text-sm text-muted-foreground">Days Active</div>
          </Card>
        </div>

        {/* Contributors Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contributors.map((contributor) => (
              <Card key={contributor.id} className="lingo-card group">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{contributor.avatar}</div>
                  <h3 className="text-xl font-bold mb-1">{contributor.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{contributor.role}</p>
                </div>

                <p className="text-sm text-muted-foreground mb-4 text-center">
                  {contributor.bio}
                </p>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {contributor.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Contributions:</span>
                    <span className="font-medium">{contributor.contributions}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                  </div>
                  <div className="flex justify-between text-xs">
                  </div>
                </div>

                <div className="flex justify-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(contributor.github, '_blank')}
                    className="flex items-center space-x-1"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(contributor.linkedin, '_blank')}
                    className="flex items-center space-x-1"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`mailto:${contributor.email}`, '_blank')}
                    className="flex items-center space-x-1"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Technologies Used */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Technologies We Use</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((tech) => (
              <Card key={tech.name} className="lingo-card group cursor-pointer">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{tech.name}</h3>
                  <Badge variant="outline" className="text-xs mb-2">
                    {tech.category}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{tech.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Open Source Section */}
        <Card className="lingo-card text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-4xl mb-4">🌟</div>
            <h2 className="text-2xl font-bold mb-4">Open Source & Community</h2>
            <p className="text-muted-foreground mb-6">
              LingoSphere is built with open source technologies and we believe in giving back to the community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.open('https://github.com/lingosphere', '_blank')}
                className="flex items-center space-x-2"
              >
                <Github className="w-4 h-4" />
                <span>View on GitHub</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('https://github.com/lingosphere/issues', '_blank')}
                className="flex items-center space-x-2"
              >
                <Star className="w-4 h-4" />
                <span>Contribute</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-border">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-error" />
            <span>by the LingoSphere team</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            © 2024 LingoSphere. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevelopersPage;
