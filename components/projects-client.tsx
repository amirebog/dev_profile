"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"

import type { GitHubRepository } from "@/lib/github"

type ProjectsClientProps = {
  projects: GitHubRepository[]
}

export function ProjectsClient({
  projects,
}: ProjectsClientProps) {
  return (
    <section
      id="work"
      className="section"
      aria-labelledby="work-title"
    >
      <div className="section-heading">
        <span>02 / Selected Work</span>

        <span className="section-index">
          01 — {String(projects.length).padStart(2, "0")}
        </span>
      </div>

      <h2 id="work-title">
        A curated archive of things I've built.
      </h2>

      <div className="project-list">
        {projects.map((project, index) => (
          <motion.article
            className="project-row"
            key={project.name}
            initial={{
              opacity: 0,
              y: 10,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              margin: "-40px",
            }}
            transition={{
              duration: 0.35,
              delay: index * 0.06,
            }}
          >
            <span className="project-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="project-info">
              <Link
                className="project-name"
                href={`/work/${project.name}`}
              >
                {project.name}
                <ArrowUpRight />
              </Link>

              <p>
                {project.description ??
                  "An open-source project built with care."}
              </p>

              <div className="tags">
                {project.language && (
                  <span>{project.language}</span>
                )}

                {project.topics
                  .slice(0, 4)
                  .map((topic) => (
                    <span key={topic}>
                      {topic}
                    </span>
                  ))}
              </div>
            </div>

            <div className="project-links">
              <Link
                href={`/work/${project.name}`}
              >
                View Project
                <ArrowUpRight />
              </Link>

              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} on GitHub`}
              >
                <ArrowUpRight />
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}