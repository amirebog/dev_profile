import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  FileText,
  GitFork,
  Star,
} from "lucide-react"

import {
  getGitHubRepositoryDetails,
  getGitHubRepositories,
} from "@/lib/github"

import { GitHubFileBrowser } from "@/components/github-file-browser"

type ProjectPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const repositories = await getGitHubRepositories()

  return repositories.map((repository) => ({
    slug: repository.name,
  }))
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

function getLanguageColor(language: string) {
  const colors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    CSS: "#663399",
    HTML: "#e34c26",
    Python: "#3572A5",
    Java: "#b07219",
    Go: "#00ADD8",
    Rust: "#dea584",
    C: "#555555",
    "C++": "#f34b7d",
    PHP: "#4F5D95",
    Vue: "#41b883",
    Shell: "#89e051",
    Dockerfile: "#384d54",
  }

  return colors[language] ?? "currentColor"
}

function calculateLanguagePercentages(
  languages: Array<{
    name: string
    bytes: number
  }>,
) {
  const total = languages.reduce(
    (sum, language) => sum + language.bytes,
    0,
  )

  if (!total) {
    return []
  }

  return languages
    .map((language) => ({
      ...language,
      percentage:
        (language.bytes / total) * 100,
    }))
    .sort((a, b) => b.bytes - a.bytes)
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params

  const repositoryName = decodeURIComponent(slug)

  const project =
    await getGitHubRepositoryDetails(repositoryName)

  if (!project) {
    return (
      <main className="github-page">
        <Link
          href="/#work"
          className="github-back"
        >
          <ArrowLeft size={15} />
          Back to projects
        </Link>

        <div className="github-empty">
          Repository not found.
        </div>
      </main>
    )
  }

  const repositoryUrl =
    `https://github.com/${project.owner}/${project.name}`

  const languages =
    calculateLanguagePercentages(
      project.languages,
    )

  return (
    <main className="github-page">
      {/* Back */}
      <Link
        href="/#work"
        className="github-back"
      >
        <ArrowLeft size={15} />
        Back to projects
      </Link>

      {/* Repository Header */}
      <header className="github-header">
        <h1 className="github-repository-title">
          <span className="github-breadcrumb">
            <span className="github-owner">
              {project.owner}
            </span>

            <span className="github-slash">
              /
            </span>

            <span className="github-repo-name">
              {project.name}
            </span>
          </span>

          <span className="github-public">
            Public
          </span>
        </h1>

        {project.description && (
          <p className="github-description">
            {project.description}
          </p>
        )}

        <div className="github-header-actions">
          <a
            href={repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="github-external"
          >
            <ExternalLink size={14} />
            Open on GitHub
          </a>

          {project.homepageUrl && (
            <a
              href={project.homepageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="github-external"
            >
              <ArrowUpRight size={14} />
              Live Demo
            </a>
          )}
        </div>
      </header>

      {/* Repository Tabs */}
      <nav
        className="github-tabs"
        aria-label="Repository navigation"
      >
        <a
          href={repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="active"
        >
          <FileText size={14} />
          Code
        </a>

        <a
          href={`${repositoryUrl}/issues`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Issues
        </a>

        <a
          href={`${repositoryUrl}/pulls`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Pull requests
        </a>

        <a
          href={`${repositoryUrl}/actions`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Actions
        </a>
      </nav>

      {/* Repository */}
      <div className="github-layout">
        <section className="github-main">
          {/* Toolbar */}
          <div className="github-toolbar">
            <div className="github-toolbar-left">
              <div className="github-branch">
                {project.defaultBranch}
              </div>
            </div>

            <div className="github-toolbar-right">
              <div className="github-stats">
                <a
                  href={`${repositoryUrl}/stargazers`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-stat"
                >
                  <Star size={14} />

                  <strong>
                    {project.stars}
                  </strong>

                  <span>
                    stars
                  </span>
                </a>

                <a
                  href={`${repositoryUrl}/network/members`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-stat"
                >
                  <GitFork size={14} />

                  <strong>
                    {project.forks}
                  </strong>

                  <span>
                    forks
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Real File Browser */}
          <GitHubFileBrowser
            files={project.files}
            repositoryUrl={repositoryUrl}
            branch={project.defaultBranch}
          />

          {/* README */}
          {project.readme && (
            <article className="github-readme">
              <div className="github-readme-header">
                <FileText size={15} />
                <span>
                  README.md
                </span>
              </div>

              <div className="github-readme-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                >
                  {project.readme}
                </ReactMarkdown>
              </div>
            </article>
          )}
        </section>

        {/* Sidebar */}
        <aside className="github-sidebar">
          {/* About */}
          <section className="github-side-section">
            <h2 className="github-side-title">
              About
            </h2>

            <p className="github-side-description">
              {project.description ??
                "An open-source project built with care."}
            </p>

            <a
              href={repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="github-side-link"
            >
              <ExternalLink size={14} />

              github.com/
              {project.owner}/
              {project.name}
            </a>

            {project.homepageUrl && (
              <a
                href={project.homepageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="github-side-link"
              >
                <ArrowUpRight size={14} />
                Live website
              </a>
            )}
          </section>

          {/* Topics */}
          {project.topics.length > 0 && (
            <section className="github-side-section">
              <h2 className="github-side-title">
                Topics
              </h2>

              <div className="github-topics">
                {project.topics.map((topic) => (
                  <span
                    key={topic}
                    className="github-topic"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section className="github-side-section">
              <h2 className="github-side-title">
                Languages
              </h2>

              <div className="github-language-bar">
                {languages.map((language) => (
                  <span
                    key={language.name}
                    title={`${language.name} ${language.percentage.toFixed(1)}%`}
                    style={{
                      width: `${language.percentage}%`,
                      backgroundColor:
                        getLanguageColor(
                          language.name,
                        ),
                    }}
                  />
                ))}
              </div>

              {languages.map((language) => (
                <div
                  key={language.name}
                  className="github-language"
                >
                  <span className="github-language-name">
                    <span
                      className="github-language-dot"
                      style={{
                        color:
                          getLanguageColor(
                            language.name,
                          ),
                      }}
                    />

                    {language.name}
                  </span>

                  <span>
                    {language.percentage.toFixed(
                      1,
                    )}
                    %
                  </span>
                </div>
              ))}
            </section>
          )}

          {/* Repository Stats */}
          <section className="github-side-section">
            <h2 className="github-side-title">
              Repository
            </h2>

            <div className="github-side-stat">
              <span>
                Stars
              </span>

              <strong>
                {project.stars}
              </strong>
            </div>

            <div className="github-side-stat">
              <span>
                Forks
              </span>

              <strong>
                {project.forks}
              </strong>
            </div>

            <div className="github-side-stat">
              <span>
                Files
              </span>

              <strong>
                {project.files.length}
              </strong>
            </div>

            <div className="github-side-stat">
              <span>
                Created
              </span>

              <strong>
                {formatDate(
                  project.createdAt,
                )}
              </strong>
            </div>

            <div className="github-side-stat">
              <span>
                Updated
              </span>

              <strong>
                {formatDate(
                  project.updatedAt,
                )}
              </strong>
            </div>
          </section>

          {/* Timeline */}
          <section className="github-side-section">
            <h2 className="github-side-title">
              Timeline
            </h2>

            <div className="github-side-timeline">
              <div className="github-timeline-item">
                <strong>
                  Repository created
                </strong>

                {formatDate(
                  project.createdAt,
                )}
              </div>

              <div className="github-timeline-item">
                <strong>
                  Last updated
                </strong>

                {formatDate(
                  project.updatedAt,
                )}
              </div>
            </div>
          </section>

          {/* Built With */}
          <section className="github-side-section">
            <h2 className="github-side-title">
              Built with
            </h2>

            <div className="github-built-with">
              {project.language && (
                <span>
                  {project.language}
                </span>
              )}

              {project.topics
                .slice(0, 6)
                .map((topic) => (
                  <span key={topic}>
                    {topic}
                  </span>
                ))}
            </div>
          </section>

          {/* GitHub Link */}
          <section className="github-side-section">
            <a
              href={repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="github-side-link"
            >
              <ArrowUpRight size={14} />

              View full repository on GitHub
            </a>
          </section>
        </aside>
      </div>
    </main>
  )
}