"use client";

import Navbar from "@/components/Navbar";
import { Plus, Minus, MessageCircleQuestion } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    q: "How does the AI Agent make decisions?",
    a: "The AI agent uses a deep neural network trained on over 3 years of historical DeFi yield, liquidity, and slippage data. It continuously monitors the state of whitelisted protocols (like Aave, Uniswap V4, Curve) and computes a risk-adjusted expected yield. When a better allocation is found, it generates a strategy payload and a Zero-Knowledge proof."
  },
  {
    q: "What prevents the AI from losing all my money?",
    a: "The Guardian Smart Contract. Unlike traditional algorithmic trading where the bot has full control over the funds, NexusVault's AI only PROPOSES trades. The Guardian contract intercepts every proposal. If the trade violates your personal risk tolerance, stop-loss limits, or maximum protocol concentration, the transaction mathematically cannot execute and is reverted on-chain."
  },
  {
    q: "Why use 0G Network for Data Availability?",
    a: "AI models require large amounts of data to infer decisions. Storing this inference data directly on an EVM chain is prohibitively expensive. 0G Network provides an ultra-fast, decentralized storage layer (Data Availability). We store the heavy AI payloads on 0G and only put the cryptographic hash on the mainnet, ensuring verifiable transparency without the massive gas costs."
  },
  {
    q: "Can I withdraw my funds at any time?",
    a: "Yes. NexusVault adheres to the ERC-4626 Tokenized Vault standard. You receive 'nvUSDC' shares when you deposit. You can redeem these shares for the underlying USDC at any time. In the event of a total system failure, the Emergency Exit Invariance allows you to bypass the AI completely and withdraw directly from the base protocols."
  },
  {
    q: "What is an ERC-7857 iNFT?",
    a: "ERC-7857 is a proposed standard for Agentic Non-Fungible Tokens (iNFTs). It allows us to give the AI agent a persistent on-chain identity, reputation score, and ownership mechanics. This means the AI isn't just a script on a server—it is a recognized on-chain entity whose performance history is permanently recorded and immutable."
  },
  {
    q: "Are there any performance fees?",
    a: "Yes, the protocol charges a standard 10% performance fee on the YIELD generated, not on the principal amount. This fee is automatically deducted during the auto-compounding process and is used to incentivize verifier nodes, pay for 0G storage, and fund future model training."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#191919] font-sans">
      <Navbar />
      <div className="container-page pt-28 pb-24">
        
        {/* Header */}
        <div className="mb-16 max-w-3xl text-center mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#F4F3F3] flex items-center justify-center mx-auto mb-6 border border-gray-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <MessageCircleQuestion className="w-8 h-8 text-[#191919]/60" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-normal tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-[#191919]/50 text-lg leading-relaxed">
            Everything you need to know about NexusVault, DeFAI, and our security model.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className={`nx-card transition-all duration-300 overflow-hidden ${
                  isOpen ? "border-gray-300 shadow-sm" : "border-gray-200/80 hover:border-gray-300 shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-semibold text-lg text-[#191919] pr-8">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isOpen ? "bg-[#191919] text-white" : "bg-[#F4F3F3] text-[#191919]/50"
                  }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-[#191919]/60 leading-relaxed text-sm">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Contact block */}
        <div className="mt-16 max-w-3xl mx-auto text-center bg-white border border-gray-200/80 rounded-2xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <h3 className="font-display text-2xl font-semibold mb-2">Still have questions?</h3>
          <p className="text-sm text-[#191919]/50 mb-6">Read the full technical breakdown in our whitepaper or connect with our community.</p>
          <Link href="/whitepaper">
            <button className="nx-btn-primary px-6 py-3">
              Read the Whitepaper
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
