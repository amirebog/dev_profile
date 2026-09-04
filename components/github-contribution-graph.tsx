"use client"

import { useState } from "react"

import type { GitHubData } from "@/lib/github"

type Props = {
  data: GitHubData
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`))
}

function getRepositoryActivityTotal(repo: {
  commits: number
  issues: number
  pullRequests: number
}) {
  return (
    repo.commits +
    repo.issues +
    repo.pullRequests
  )
}

export function GithubContributionGraph({
  data,
}: Props) {
  const [selectedDate, setSelectedDate] =
    useState<string | null>(null)

  const selectedRepositories = selectedDate
    ? data.dayRepositories[selectedDate] ?? []
    : []

  const selectedDay = selectedDate
    ? data.weeks
        .flatMap((week) => week.contributionDays)
        .find((day) => day.date === selectedDate)
    : null

  return (
    <div className="contribution-wrap">

      {/* ================================
          CONTRIBUTION CALENDAR
          ================================ */}

      <div className="contribution-scroll">
        <div className="contribution-calendar">

          {/* MONTH LABELS */}

          <div className="contribution-months">
            <div className="contribution-month-spacer" />

            <div
              className="contribution-month-grid"
              style={{
                gridTemplateColumns: `repeat(${data.weeks.length}, 12px)`,
              }}
            >
              {data.weeks.map((week, index) => {
                const month = data.months.find(
                  (item) =>
                    item.firstDay === week.firstDay,
                )

                return (
                  <span
                    key={`${week.firstDay}-${index}`}
                    className="contribution-month"
                  >
                    {month?.name}
                  </span>
                )
              })}
            </div>
          </div>

          {/* GRAPH */}

          <div className="contribution-main">

            {/* Weekday labels */}

            <div className="contribution-weekdays">
              <span />
              <span>Mon</span>
              <span />
              <span>Wed</span>
              <span />
              <span>Fri</span>
              <span />
            </div>

            {/* Weeks */}

            <div className="contribution-grid">

              {data.weeks.map(
                (week, weekIndex) => (
                  <div
                    className="contribution-week"
                    key={`${week.firstDay}-${weekIndex}`}
                  >
                    {week.contributionDays.map(
                      (day) => {
                        const isSelected =
                          selectedDate === day.date

                        return (
                          <button
                            key={day.date}
                            type="button"
                            className={`contribution-day ${
                              isSelected
                                ? "is-selected"
                                : ""
                            }`}
                            style={{
                              backgroundColor:
                                day.color,
                            }}
                            aria-label={`${day.contributionCount} contributions on ${formatDate(day.date)}`}
                            aria-pressed={
                              isSelected
                            }
                            onClick={() =>
                              setSelectedDate(
                                isSelected
                                  ? null
                                  : day.date,
                              )
                            }
                          >
                            <span className="contribution-tooltip">

                              <strong>
                                {day.contributionCount}{" "}
                                {day.contributionCount ===
                                1
                                  ? "contribution"
                                  : "contributions"}
                              </strong>

                              <small>
                                {formatDate(
                                  day.date,
                                )}
                              </small>

                              {day.contributionCount >
                                0 && (
                                <small>
                                  Click to view
                                  activity
                                </small>
                              )}

                            </span>
                          </button>
                        )
                      },
                    )}
                  </div>
                ),
              )}

            </div>
          </div>

          {/* LEGEND */}

          <div className="contribution-legend">
            <span>Less</span>

            {data.colors.map((color) => (
              <i
                key={color}
                style={{
                  backgroundColor: color,
                }}
                aria-hidden="true"
              />
            ))}

            <span>More</span>
          </div>
        </div>
      </div>

      {/* ================================
          SELECTED DAY
          ================================ */}

      {selectedDate && (
        <div className="github-day-details">

          {/* Header */}

          <div className="github-day-header">

            <div>
              <span className="github-day-kicker">
                Daily activity
              </span>

              <h3>
                {formatDate(selectedDate)}
              </h3>
            </div>

            <div className="github-day-count">
              <strong>
                {selectedDay?.contributionCount ??
                  0}
              </strong>

              <span>contributions</span>
            </div>

          </div>

          {/* Repositories */}

          {selectedRepositories.length > 0 ? (
            <div className="github-repositories">

              {selectedRepositories
                .slice()
                .sort(
                  (a, b) =>
                    getRepositoryActivityTotal(
                      b,
                    ) -
                    getRepositoryActivityTotal(
                      a,
                    ),
                )
                .map((repo) => (
                  <a
                    key={`${repo.owner}/${repo.name}`}
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="github-repository"
                  >

                    <div className="github-repository-main">

                      {/* Repository name */}

                      <div className="github-repository-title">

                        <span className="github-repository-owner">
                          {repo.owner}/
                        </span>

                        <strong>
                          {repo.name}
                        </strong>

                      </div>

                      {/* Description */}

                      {repo.description && (
                        <p>
                          {repo.description}
                        </p>
                      )}

                      {/* Metadata */}

                      <div className="github-repository-meta">

                        {repo.language && (
                          <span>
                            <i
                              style={{
                                backgroundColor:
                                  repo.languageColor ??
                                  "currentColor",
                              }}
                            />

                            {repo.language}
                          </span>
                        )}

                        <span>
                          ★{" "}
                          {repo.stars.toLocaleString()}
                        </span>

                        {repo.commits > 0 && (
                          <span>
                            {repo.commits}{" "}
                            {repo.commits === 1
                              ? "commit"
                              : "commits"}
                          </span>
                        )}

                        {repo.issues > 0 && (
                          <span>
                            {repo.issues}{" "}
                            {repo.issues === 1
                              ? "issue"
                              : "issues"}
                          </span>
                        )}

                        {repo.pullRequests > 0 && (
                          <span>
                            {repo.pullRequests}{" "}
                            {repo.pullRequests === 1
                              ? "PR"
                              : "PRs"}
                          </span>
                        )}

                      </div>
                    </div>

                    {/* Arrow */}

                    <span
                      className="github-repository-arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>

                  </a>
                ))}

            </div>
          ) : (
            <div className="github-no-activity">

              <span>—</span>

              <div>
                <p>
                  No public repository activity
                  could be associated with this
                  contribution.
                </p>

                <small>
                  This can happen with private or
                  restricted contributions.
                </small>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  )
}