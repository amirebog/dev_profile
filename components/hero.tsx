'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { socialLinks } from '@/lib/portfolio-data'

export function Hero() {
  return <section className="hero" aria-labelledby="intro-title">
    <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .4 }}> /home/amir</motion.p>
    <div className="hero-main">
      <div>
        <motion.h1 id="intro-title" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, delay: .08 }}>AMIR</motion.h1>
        <motion.p className="hero-role" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4, delay: .16 }}>Full-Stack Developer</motion.p>
        <motion.p className="hero-copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .4, delay: .24 }}>I design and build thoughtful digital products,<br className="desktop-only" /> interfaces and developer-focused experiences.</motion.p>
        <div className="hero-actions"><a className="button button-solid" href="#work">View Projects <ArrowUpRight /></a><a className="button" href="#contact">Contact Me</a></div>
      </div>
      <div>
        <div className="sketch-hero" aria-hidden="true">
          <span className="sketch-note">SYSTEM / HUMAN</span>
          <svg viewBox="0 0 260 180" role="img" aria-label="Hand-drawn technical diagram">
            <rect x="32" y="36" width="142" height="92" rx="2" transform="rotate(-4 32 36)" />
            <path d="M43 57h105M47 76h70M47 94h84M47 112h45" />
            <path d="M185 65c29 2 37 14 42 30M219 95l8 1-5 7" />
            <circle cx="198" cy="55" r="14" /><path d="M191 55l5 5 10-12" />
            <path d="M24 148c53 8 120 5 202 0" />
          </svg>
        </div>
        <motion.div className="profile-lockup" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .45, delay: .2 }}>
        <div className="profile-image"><Image src="/placeholder-user.jpg" alt="Amir, full-stack developer" fill sizes="72px" /></div><div><strong>AMIR</strong><span>Full-Stack Developer</span><small><i /> Available</small></div>
        </motion.div>
      </div>
    </div>
    <div className="social-row" aria-label="Social links">{socialLinks.map((link) => <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{link.label} <ArrowUpRight /></a>)}</div>
  </section>
}
