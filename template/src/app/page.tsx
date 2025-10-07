import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, FileText, Sparkles, Users, ArrowRight, Star } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">

      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6 bg-accent/10 text-accent border-accent/20 text-primary">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Job Applications
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 text-foreground">
            Land Your Dream Job with <span className="text-primary">Personalized</span> Cover Letters
          </h1>
          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
            Stop sending generic applications. Our AI creates tailored cover letters and responses that showcase your
            unique strengths for every job opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
              Start Writing for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 bg-transparent">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything You Need to Stand Out</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI understands what employers want and helps you craft the perfect application every time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">AI-Powered Personalization</CardTitle>
                <CardDescription>
                  Our advanced AI analyzes job descriptions and tailors your cover letter to match exactly what
                  employers are looking for.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">Professional Templates</CardTitle>
                <CardDescription>
                  Choose from industry-specific templates designed by career experts to make the best first impression.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">Instant Generation</CardTitle>
                <CardDescription>
                  Generate compelling cover letters in seconds, not hours. Spend more time applying and less time
                  writing.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">How It Works</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Paste the Job Description</h4>
                    <p className="text-muted-foreground">Simply copy and paste the job posting you're interested in.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Add Your Information</h4>
                    <p className="text-muted-foreground">Tell us about your experience, skills, and achievements.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Get Your Perfect Cover Letter</h4>
                    <p className="text-muted-foreground">
                      Receive a personalized, professional cover letter ready to send.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Land Your Dream Job?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students who've transformed their job search with personalized, AI-powered cover letters.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
            Get Started Free Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">No credit card required • Generate 3 cover letters free</p>
        </div>
      </section>
    </div>
  )
}

