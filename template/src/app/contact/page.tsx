"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Clock, MessageSquare, Headphones, Users, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email within 24 hours",
    contact: "support@yourapp.com",
    action: "Send Email"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak with our support team",
    contact: "+1 (555) 123-4567",
    action: "Call Now"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with us in real-time",
    contact: "Available 9 AM - 6 PM EST",
    action: "Start Chat"
  },
  {
    icon: Headphones,
    title: "Enterprise Support",
    description: "Dedicated support for enterprise customers",
    contact: "enterprise@yourapp.com",
    action: "Contact Sales"
  }
]

const supportTopics = [
  {
    icon: Users,
    title: "Account & Billing",
    description: "Questions about your account, billing, or subscription"
  },
  {
    icon: Zap,
    title: "Technical Support",
    description: "Help with technical issues, bugs, or feature requests"
  },
  {
    icon: MessageSquare,
    title: "General Inquiry",
    description: "General questions, feedback, or partnership opportunities"
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    topic: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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
            <Mail className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're here to help! Reach out to our support team for assistance, 
            or get in touch for business inquiries and partnerships.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-8">Get in Touch</h2>
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <method.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{method.title}</CardTitle>
                          <CardDescription>{method.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{method.contact}</p>
                      <Button variant="outline" className="w-full">
                        {method.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="topic">Topic</Label>
                    <select
                      id="topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select a topic</option>
                      <option value="account">Account & Billing</option>
                      <option value="technical">Technical Support</option>
                      <option value="general">General Inquiry</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Support Topics */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            What can we help you with?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {supportTopics.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="mx-auto p-3 bg-primary/10 rounded-lg w-fit mb-4">
                      <topic.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                    <CardDescription>{topic.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Office Information */}
        <motion.div
          className="bg-muted/50 rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Office Location</h3>
              <p className="text-muted-foreground">
                123 Business Street<br />
                San Francisco, CA 94105<br />
                United States
              </p>
            </div>
            <div>
              <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Business Hours</h3>
              <p className="text-muted-foreground">
                Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                Saturday: 10:00 AM - 4:00 PM EST<br />
                Sunday: Closed
              </p>
            </div>
            <div>
              <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Emergency Support</h3>
              <p className="text-muted-foreground">
                24/7 Emergency Support<br />
                Available for Enterprise customers<br />
                +1 (555) 911-SUPPORT
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
