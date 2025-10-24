"use client"

import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ArrowRight } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { PricingTiersComponent } from "@/components/pricing-tiers"

export default function PricingPage() {
  const faqRef = useRef(null)
  const faqInView = useInView(faqRef, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely through Stripe."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start your trial."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment in full."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period."
    },
    {
      question: "Do you offer custom pricing?",
      answer: "Yes, we offer custom pricing for large organizations with specific needs. Contact our sales team to discuss your requirements."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <PricingTiersComponent />

      <motion.section 
        ref={faqRef}
        className="py-20 px-4 bg-muted/30"
        initial="hidden"
        animate={faqInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="container mx-auto max-w-4xl">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about our pricing and plans.
            </p>
          </motion.div>

          <Accordion
            type="single"
            collapsible
            className="w-full"
          >
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-background rounded-lg border border-border p-6"
              >
                <AccordionItem value={`item-${idx + 1}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </motion.section>

      <motion.section 
        className="py-20 px-4 bg-primary/5 relative overflow-hidden"
        initial="hidden"
        animate={faqInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="container mx-auto text-center max-w-3xl relative">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-foreground mb-6"
            variants={itemVariants}
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground mb-8"
            variants={itemVariants}
          >
            Join thousands of businesses that trust our platform to power their growth.
          </motion.p>
          <motion.div variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 shadow-lg">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
          <motion.p 
            className="text-sm text-muted-foreground mt-4"
            variants={itemVariants}
          >
            No credit card required • 14-day free trial • Cancel anytime
          </motion.p>
        </div>
      </motion.section>
    </div>
  )
}
