"use client"

import { motion } from "framer-motion"
import { Users, Target, Award, Heart, Globe, Lightbulb, Shield, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const values = [
  {
    icon: Users,
    title: "User-Centric",
    description: "We put our users at the center of everything we do, constantly listening to feedback and evolving our platform to meet their needs."
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We embrace cutting-edge technology and creative solutions to solve complex problems and drive meaningful change."
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "We maintain the highest standards of security and privacy, ensuring our users can trust us with their most important data."
  },
  {
    icon: Heart,
    title: "Accessibility",
    description: "We believe technology should be accessible to everyone, regardless of ability, background, or technical expertise."
  }
]

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Co-Founder",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    description: "Former product manager at Google with 10+ years of experience building user-centric platforms."
  },
  {
    name: "Michael Chen",
    role: "CTO & Co-Founder",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    description: "Ex-Microsoft engineer passionate about scalable architecture and developer experience."
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Design",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    description: "Award-winning designer with expertise in creating intuitive and beautiful user experiences."
  },
  {
    name: "David Kim",
    role: "Head of Engineering",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    description: "Full-stack engineer with a passion for building robust, scalable systems that just work."
  }
]

const stats = [
  { number: "50K+", label: "Active Users" },
  { number: "99.9%", label: "Uptime" },
  { number: "150+", label: "Countries" },
  { number: "24/7", label: "Support" }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Users className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            About Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're a team of passionate innovators dedicated to building tools that empower 
            businesses and individuals to achieve their goals through technology.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              To democratize access to powerful business tools and make advanced technology 
              accessible to everyone, regardless of their technical background or company size. 
              We believe that great ideas shouldn't be limited by complex software or high costs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2">
                <Target className="w-4 h-4 mr-2" />
                Mission-Driven
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Globe className="w-4 h-4 mr-2" />
                Global Impact
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Innovation First
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Values Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto"
                      />
                    </div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="font-medium text-primary">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {member.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Story Section */}
        <motion.div
          className="bg-muted/50 rounded-2xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Founded in 2020 by a team of former tech industry veterans, YourApp was born 
              out of frustration with the complexity and cost of existing business tools. 
              We saw too many great ideas fail not because they weren't good, but because 
              the tools to bring them to life were either too expensive or too complicated.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Today, we're proud to serve over 50,000 users worldwide, from solo entrepreneurs 
              to Fortune 500 companies. Our platform has processed millions of transactions, 
              helped launch thousands of businesses, and continues to evolve based on the 
              feedback and needs of our amazing community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button>
                Join Our Team
              </Button>
              <Button variant="outline">
                Read Our Blog
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
