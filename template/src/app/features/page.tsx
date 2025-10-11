"use client"

import { motion } from "framer-motion"
import { Zap, Shield, Users, BarChart3, Globe, Smartphone, Lock, Clock, CheckCircle, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Performance",
    description: "Experience blazing-fast load times and smooth interactions with our optimized infrastructure.",
    benefits: [
      "Sub-second page load times",
      "Optimized database queries",
      "CDN-powered content delivery",
      "Real-time data synchronization"
    ],
    category: "Performance"
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description: "Your data is protected with military-grade encryption and industry-leading security measures.",
    benefits: [
      "End-to-end encryption",
      "SOC 2 Type II compliance",
      "Regular security audits",
      "Two-factor authentication"
    ],
    category: "Security"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work seamlessly with your team using powerful collaboration tools and real-time features.",
    benefits: [
      "Real-time collaborative editing",
      "Team workspaces",
      "Role-based permissions",
      "Activity tracking and notifications"
    ],
    category: "Collaboration"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Make data-driven decisions with comprehensive analytics and reporting tools.",
    benefits: [
      "Custom dashboards",
      "Real-time metrics",
      "Export capabilities",
      "Predictive insights"
    ],
    category: "Analytics"
  },
  {
    icon: Globe,
    title: "Global Accessibility",
    description: "Access your data from anywhere in the world with our globally distributed infrastructure.",
    benefits: [
      "Multi-region deployment",
      "99.9% uptime guarantee",
      "Local data centers",
      "Automatic failover"
    ],
    category: "Reliability"
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Native mobile apps and responsive web design ensure you're productive on any device.",
    benefits: [
      "Native iOS and Android apps",
      "Responsive web interface",
      "Offline capabilities",
      "Push notifications"
    ],
    category: "Mobile"
  },
  {
    icon: Lock,
    title: "Data Privacy & Compliance",
    description: "Full compliance with GDPR, CCPA, and other privacy regulations to protect your data.",
    benefits: [
      "GDPR compliance",
      "CCPA compliance",
      "Data residency options",
      "Privacy by design"
    ],
    category: "Compliance"
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock support from our expert team to help you succeed.",
    benefits: [
      "24/7 customer support",
      "Dedicated account managers",
      "Priority support channels",
      "Comprehensive documentation"
    ],
    category: "Support"
  }
]

const categories = ["All", "Performance", "Security", "Collaboration", "Analytics", "Reliability", "Mobile", "Compliance", "Support"]

export default function FeaturesPage() {
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
            <Zap className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Powerful Features
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the comprehensive suite of features designed to help you build, 
            scale, and grow your business with confidence.
          </p>
        </motion.div>

        {/* Feature Categories */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge 
                variant={category === "All" ? "default" : "secondary"}
                className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Badge>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {feature.category}
                      </Badge>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-muted-foreground">Uptime</div>
          </motion.div>
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">&lt;100ms</div>
            <div className="text-muted-foreground">Response Time</div>
          </motion.div>
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">256-bit</div>
            <div className="text-muted-foreground">Encryption</div>
          </motion.div>
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground">Support</div>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="bg-muted/50 rounded-2xl p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust YourApp to power their operations. 
            Start your free trial today and see the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Schedule Demo
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>4.9/5 rating from 10,000+ customers</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
