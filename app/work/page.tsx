import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Projects } from '@/components/projects'

export default function WorkPage() {
  return (
    <div id="top">
      <Navbar />
      <main className="page-shell">
        <Link className="back-link" href="/"> <ArrowLeft /> Back home</Link>
        <Projects />
      </main>
    </div>
  )
}
