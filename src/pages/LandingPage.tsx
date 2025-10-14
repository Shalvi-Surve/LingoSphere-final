import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Zap, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-image.jpg";

const LandingPage = () => {
  const blob1 = useRef<HTMLDivElement>(null);
  const blob2 = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Parallax blobs movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;

      if (blob1.current) blob1.current.style.transform = `translate(${x}px, ${y}px)`;
      if (blob2.current) blob2.current.style.transform = `translate(${-x}px, ${-y}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animated floating particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number }[] = [];
    const particleCount = 50;

    // Generate random particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "hsla(270, 70%, 70%, 0.3)";

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x > window.innerWidth) p.x = 0;
        if (p.x < 0) p.x = window.innerWidth;
        if (p.y > window.innerHeight) p.y = 0;
        if (p.y < 0) p.y = window.innerHeight;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const features = [
    { icon: Globe, title: "Multiple Languages", description: "Learn Spanish, French, Hindi, and German with engaging, interactive lessons." },
    { icon: Zap, title: "Gamified Learning", description: "Earn XP, maintain streaks, and unlock badges as you progress through your journey." },
    { icon: Trophy, title: "Track Progress", description: "Monitor your learning with detailed analytics and achievement tracking." },
    { icon: Users, title: "AI Assistant", description: "Get help from our multilingual AI chatbot available 24/7 in any language." }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Particle Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" />

      {/* Floating Blobs */}
      <div
        ref={blob1}
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/20 blur-3xl animate-gradient"
        style={{ transition: "transform 0.3s ease-out" }}
      />
      <div
        ref={blob2}
        className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-secondary/30 to-accent/20 blur-3xl animate-gradient"
        style={{ transition: "transform 0.3s ease-out" }}
      />

      {/* Hero Section */}
      <section className="relative z-10 lingo-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Master Any{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Language
                </span>{" "}
                with LingoSphere
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Join thousands of learners worldwide in an interactive, gamified experience. 
                Make language learning fun, engaging, and rewarding!
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses">
                  <Button className="lingo-button-hero group">
                    Start Learning
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-2">
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">500K+</div>
                  <div className="text-sm text-muted-foreground">Active Learners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">15+</div>
                  <div className="text-sm text-muted-foreground">Languages</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">98%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <img src={heroImage} alt="Language learning" className="w-full rounded-3xl shadow-2xl" />
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30 relative z-10 lingo-slide-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Why Choose LingoSphere?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of language learning with our innovative platform designed for modern learners.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="lingo-card group cursor-pointer hover:shadow-glow transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10 lingo-scale-in">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="lingo-card">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of successful language learners who have transformed their communication skills with LingoSphere.
            </p>
            <Link to="/courses">
              <Button className="lingo-button-hero group">
                Get Started for Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;