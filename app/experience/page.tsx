import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Experience } from '@/components/experience'

export default function ExperiencePage() {
  return <><Navbar /><main className="page-shell"><Link className="back-link" href="/"><ArrowLeft /> Back home</Link><Experience /></main></>
}
