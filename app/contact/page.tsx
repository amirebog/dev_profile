import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'

export default function ContactPage() {
  return <><Navbar /><main className="page-shell"><Link className="back-link" href="/"><ArrowLeft /> Back home</Link><section className="contact-section" aria-labelledby="contact-title"><p className="eyebrow">07 / Contact</p><h1 id="contact-title">Have a project<br />in <em>mind?</em></h1><p className="contact-subtitle">Let&apos;s build something useful.</p><div className="contact-links"><a className="button button-solid" href="mailto:hello@amir.dev">Email Me <ArrowUpRight /></a><a className="button" href="https://github.com">GitHub <ArrowUpRight /></a><a className="button" href="https://linkedin.com">LinkedIn <ArrowUpRight /></a></div></section></main></>
}
