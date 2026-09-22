import React, { useEffect } from 'react'
import { SITE } from './site.js'

function Page({ title, children }) {
  useEffect(() => {
    document.title = `${title} | ${SITE.name}`
    const robots = document.querySelector('meta[name="robots"]')
    if (robots) robots.setAttribute('content', 'index,follow')
  }, [title])

  return (
    <div className="legal-page">
      <header className="nav wrap">
        <a href="/" className="brand" aria-label={`${SITE.name} home`}><span className="brand-mark">S</span> {SITE.name.toUpperCase()}</a>
        <a className="watch-link" href="/">Back to webinar</a>
      </header>
      <article className="wrap legal-copy">
        <p className="section-label">{SITE.name}</p>
        <h1>{title}</h1>
        <p className="legal-updated">Last updated: 18 September 2026</p>
        {children}
      </article>
    </div>
  )
}

export function Privacy() {
  return (
    <Page title="Privacy Policy">
      <p>{SITE.name} (“we”) operates {SITE.url} and the live educational webinar {SITE.course}. This policy explains what we collect when you visit or register.</p>
      <h2>Information we collect</h2>
      <p>When you register, we collect your name, email address, and mobile number to create a Razorpay order, send webinar access, and respond to support. Razorpay processes payment details. We do not store card or UPI credentials on our servers.</p>
      <h2>How we use it</h2>
      <p>We use your details to complete checkout, verify payment, grant course access (including the private WhatsApp group), send transactional email, and improve the service. We do not sell your personal information.</p>
      <h2>Legal bases</h2>
      <p>We process data to perform the course purchase contract and for legitimate interests such as fraud prevention and support. If we run ads analytics, we only do so with tags you configure on this site.</p>
      <h2>Sharing</h2>
      <p>We share data with Razorpay (payments), Gmail/SMTP (transactional mail), and hosting providers (Vercel). WhatsApp is used only after you choose to join the group.</p>
      <h2>Retention</h2>
      <p>Purchase records are kept as needed for accounting, dispute handling, and access support.</p>
      <h2>Your rights</h2>
      <p>You may request access, correction, or deletion of your personal data by emailing <a href={`mailto:${SITE.email}`}>{SITE.email}</a>, subject to legal record-keeping requirements.</p>
      <h2>Contact</h2>
      <p>{SITE.name}, India. Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Phone: <a href={SITE.phoneHref}>{SITE.phone}</a>.</p>
    </Page>
  )
}

export function Terms() {
  return (
    <Page title="Terms of Use">
      <p>By using this website or registering for {SITE.course}, you agree to these terms.</p>
      <h2>The product</h2>
      <p>{SITE.course} is a live educational webinar on blockchain, crypto markets, trading concepts, risk management, and psychology. It is sold as a one-time registration. Access is delivered after Razorpay verifies payment.</p>
      <h2>Eligibility</h2>
      <p>You must be 18 or older and legally able to enter this contract in India. The course is for personal learning, not for resale.</p>
      <h2>Payments</h2>
      <p>Prices are shown in INR. Checkout is processed by Razorpay (UPI, cards, net banking, and wallets where available). An order is complete only after server-side payment verification.</p>
      <h2>Refunds</h2>
      <p>Because this is digital content unlocked immediately after payment, fees are generally non-refundable once access is granted. If checkout is charged but access fails, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with your Razorpay payment ID and we will help restore access or review the charge.</p>
      <h2>Conduct</h2>
      <p>Do not share paid materials or group invites publicly. We may remove access for abuse, spam, or illegal activity.</p>
      <h2>Liability</h2>
      <p>The course is provided as-is for education. We are not liable for trading losses, missed profits, or decisions you make using the material. See the Disclaimer.</p>
      <h2>Contact</h2>
      <p><a href={`mailto:${SITE.email}`}>{SITE.email}</a> · <a href={SITE.phoneHref}>{SITE.phone}</a></p>
    </Page>
  )
}

export function Disclaimer() {
  return (
    <Page title="Important Disclaimer">
      <h2>Educational Content Only</h2>
      <p>This webinar and all materials provided during or after the webinar are for educational and informational purposes only. They are intended to help participants understand blockchain technology, crypto markets, trading concepts, market mechanics, risk management, and related topics. They do not constitute investment advice, financial advice, trading advice, a recommendation, an offer, or a solicitation to buy, sell, or hold any cryptocurrency, security, derivative, or other financial product.</p>
      <h2>No Guaranteed Results</h2>
      <p>There are no guarantees of profit, returns, accuracy, or future performance. Market outcomes are uncertain.</p>
      <h2>Trading &amp; Investment Risk</h2>
      <p>Cryptocurrency and leveraged trading can involve substantial risk, including the possible loss of some or all of the capital committed.</p>
      <h2>Do Your Own Research</h2>
      <p>Participants should conduct their own research and, where appropriate, seek advice from a qualified financial professional before making financial decisions.</p>
      <h2>No Personalized Advice</h2>
      <p>The webinar is general education and does not take into account an individual participant’s financial situation, goals, risk tolerance, or circumstances.</p>
      <h2>Examples Are Illustrative</h2>
      <p>Market examples, charts, scenarios, and case studies are for educational purposes and should not be treated as predictions or instructions to trade.</p>
      <h2>Regulatory &amp; Tax Considerations</h2>
      <p>Rules, taxes, and restrictions relating to crypto and financial products may vary by jurisdiction and can change. Participants are responsible for understanding the rules that apply to them.</p>
      <h2>Participant Responsibility</h2>
      <p>Any decision to trade, invest, use leverage, or otherwise act on information discussed in the webinar is made solely by the participant at their own risk and responsibility.</p>
      <p>By registering for or attending the webinar, participants acknowledge that they understand and accept the educational nature of the webinar.</p>
      <p>Questions: <a href={`mailto:${SITE.email}`}>{SITE.email}</a> · <a href={SITE.phoneHref}>{SITE.phone}</a></p>
    </Page>
  )
}
