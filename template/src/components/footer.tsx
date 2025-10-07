import { FileText } from "lucide-react"

export function Footer() {
    return (
      <footer className="bg-sidebar border-t border-sidebar-border py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-sidebar-foreground">CoverCraft</span>
              </div>
              <p className="text-sidebar-foreground/70">
                Helping students land their dream jobs with AI-powered personalized cover letters.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sidebar-foreground/70">
                <li>
                  <a href="#" className="hover:text-sidebar-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sidebar-foreground transition-colors">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sidebar-foreground transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sidebar-foreground/70">
                <li>
                  <a href="#" className="hover:text-sidebar-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sidebar-foreground transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sidebar-foreground transition-colors">
                    Career Tips
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sidebar-foreground/70">
                <li>
                  <a href="#" className="hover:text-sidebar-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sidebar-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sidebar-foreground transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-sidebar-border mt-8 pt-8 text-center text-sidebar-foreground/70">
            <p>&copy; {new Date().getFullYear()} CoverCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
}