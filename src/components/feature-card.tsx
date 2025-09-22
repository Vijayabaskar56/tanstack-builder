import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "What is Brillance and who is it for?",
    answer:
      "Brillance is a comprehensive billing automation platform designed for businesses that need custom contract management. It's perfect for SaaS companies, service providers, and enterprises looking to streamline their billing processes.",
  },
  {
    question: "How does the custom contract billing work?",
    answer:
      "Our platform automatically processes your custom contracts, calculates billing amounts based on your specific terms, and generates invoices. You can set up complex pricing structures, usage-based billing, and custom billing cycles.",
  },
  {
    question: "Can I integrate Brillance with my existing tools?",
    answer:
      "Yes! Brillance integrates seamlessly with popular CRM systems, accounting software, and payment processors. We support APIs and webhooks for custom integrations with your existing workflow.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "We offer 24/7 customer support, dedicated account managers for enterprise clients, comprehensive documentation, and onboarding assistance to help you get started quickly.",
  },
  {
    question: "Is my data secure with Brillance?",
    answer:
      "Absolutely. We use enterprise-grade security measures including end-to-end encryption, SOC 2 compliance, and regular security audits. Your data is stored in secure, redundant data centers.",
  },
  {
    question: "How do I get started with Brillance?",
    answer:
      "Getting started is simple! Sign up for our free trial, connect your existing systems, and our onboarding team will help you set up your first custom billing workflow within 24 hours.",
  },
]

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Chevron Down"
    >
      <title>Chevron Down</title>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="w-full flex justify-center items-start">
      <div className="flex-1 px-4 md:px-12 py-16 md:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
        {/* Left Column - Header */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-start gap-4 lg:py-5">
          <div className="w-full flex flex-col justify-center text-foreground font-semibold leading-tight md:leading-[44px] font-sans text-4xl tracking-tight">
            Frequently Asked Questions
          </div>
          <div className="w-full text-muted-foreground text-base font-normal leading-7 font-sans">
            Explore your data, build your dashboard,
            <br className="hidden md:block" />
            bring your team together.
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col">
            {faqData.map((item, index) => {
              const isOpen = openItems.includes(index)

              return (
                <div key={index} className="w-full border-b border-border overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-5 py-[18px] flex justify-between items-center gap-5 text-left hover:bg-muted/20 transition-colors duration-200"
                    type="button"
                    aria-expanded={isOpen}
                  >
                    <div className="flex-1 text-foreground text-base font-medium leading-6 font-sans">
                      {item.question}
                    </div>
                    <div className="flex justify-center items-center">
                      <ChevronDownIcon
                        className={`w-6 h-6 text-muted-foreground transition-transform duration-300 ease-in-out ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-[18px] text-muted-foreground text-sm font-normal leading-6 font-sans">
                      {item.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
