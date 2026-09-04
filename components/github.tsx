import { ArrowUpRight } from "lucide-react"

import { getGitHubContributions } from "@/lib/github"
import { GithubContributionGraph } from "@/components/github-contribution-graph"

export async function Github() {
  const github = await getGitHubContributions()

  return (
    <section
      className="section github-section"
      aria-labelledby="github-title"
    >
      {/* Header */}

      <div className="section-heading">
        <span>GitHub</span>

        <span className="section-index">
          @{github.username}
        </span>
      </div>

      {/* Hero */}

      <div className="github-top">
        <div>
          <h2 id="github-title">
            Open source, in public.
          </h2>

          <a
            className="inline-link"
            href={`https://github.com/${github.username}`}
            target="_blank"
            rel="noreferrer"
          >
            View GitHub

            <ArrowUpRight
              aria-hidden="true"
              size={16}
            />
          </a>
        </div>

        {/* GitHub mark */}

        <svg
          className="github-mark"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="currentColor"
        >
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.01c-3.2.7-3.87-1.54-3.87-1.54-.53-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.67 1.25 3.32.96.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.77 1.04.77 2.1v3.11c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
        </svg>
      </div>

      {/* Stats */}

      <div className="github-stats">
        <div>
          <strong>
            {github.totalContributions.toLocaleString()}
          </strong>

          <span>Contributions</span>
        </div>

        <div>
          <strong>
            {github.repositories.toLocaleString()}
          </strong>

          <span>Repositories</span>
        </div>

        <div>
          <strong>
            {github.followers.toLocaleString()}
          </strong>

          <span>Followers</span>
        </div>
      </div>

      {/* Real GitHub contribution graph */}

      <GithubContributionGraph data={github} />
    </section>
  )
}