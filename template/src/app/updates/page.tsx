"use client"

import { motion } from "framer-motion"
import { Bell, Sparkles, Bug, Shield, Zap, Users, Calendar, Tag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const updates = [
  {
    version: "v2.4.0",
    date: "2024-01-15",
    type: "feature",
    title: "Advanced Analytics Dashboard",
    description: "New comprehensive analytics dashboard with real-time insights, custom reports, and data visualization tools.",
    features: [
      "Real-time performance metrics",
      "Custom report builder",
      "Interactive data visualizations",
      "Export capabilities"
    ]
  },
  {
    version: "v2.3.2",
    date: "2024-01-08",
    type: "improvement",
    title: "Enhanced Security Features",
    description: "Improved security measures including two-factor authentication, advanced encryption, and audit logs.",
    features: [
      "Two-factor authentication",
      "Advanced encryption protocols",
      "Comprehensive audit logs",
      "Security notifications"
    ]
  },
  {
    version: "v2.3.1",
    date: "2024-01-02",
    type: "fix",
    title: "Bug Fixes and Performance Improvements",
    description: "Various bug fixes and performance optimizations to improve overall user experience.",
    features: [
      "Fixed login issues on mobile devices",
      "Improved page load times",
      "Resolved data synchronization problems",
      "Enhanced error handling"
    ]
  },
  {
    version: "v2.3.0",
    date: "2023-12-20",
    type: "feature",
    title: "Team Collaboration Tools",
    description: "New collaboration features including real-time editing, team workspaces, and communication tools.",
    features: [
      "Real-time collaborative editing",
      "Team workspaces",
      "In-app messaging",
      "Project sharing capabilities"
    ]
  },
  {
    version: "v2.2.1",
    date: "2023-12-10",
    type: "improvement",
    title: "Mobile App Enhancements",
    description: "Significant improvements to the mobile application with better performance and new features.",
    features: [
      "Improved mobile performance",
      "New mobile-specific features",
      "Better offline capabilities",
      "Enhanced touch interactions"
    ]
  },
  {
    version: "v2.2.0",
    date: "2023-11-28",
    type: "feature",
    title: "API v2 Release",
    description: "Complete API overhaul with new endpoints, improved documentation, and enhanced developer experience.",
    features: [
      "New REST API endpoints",
      "GraphQL support",
      "Enhanced API documentation",
      "Developer SDKs"
    ]
  }
]

function UpdateCard({ update, index }: { update: typeof updates[0]; index: number }) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "feature":
        return <Sparkles className="w-5 h-5" />
      case "improvement":
        return <Zap className="w-5 h-5" />
      case "fix":
        return <Bug className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "feature":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "improvement":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "fix":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="mb-6 hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge className={getTypeColor(update.type)}>
                  <div className="flex items-center gap-1">
                    {getTypeIcon(update.type)}
                    {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                  </div>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {update.version}
                </Badge>
              </div>
              <CardTitle className="text-xl mb-2">{update.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(update.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base mb-4">
            {update.description}
          </CardDescription>
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-foreground">What's included:</h4>
            <ul className="space-y-1">
              {update.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function UpdatesPage() {
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
            <Bell className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Product Updates
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay up to date with the latest features, improvements, and fixes. 
            We're constantly working to make YourApp better for you.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {updates.map((update, index) => (
            <UpdateCard key={index} update={update} index={index} />
          ))}
        </div>

        <motion.div
          className="bg-muted/50 rounded-2xl p-8 text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Stay in the loop
          </h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter to get notified about new updates and features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button>
              Subscribe
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
