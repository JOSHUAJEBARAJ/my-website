# Joshua Jebaraj’s website

A Hugo portfolio for Joshua Jebaraj, focused on cloud engineering, cloud security, and DevOps.

## Run locally

Install Hugo Extended 0.147.2 or newer, then run:

```sh
hugo server
```

The site is available at `http://localhost:1313/`.

## Build

```sh
hugo --minify --cleanDestinationDir
```

The generated site goes to `dist/`. Netlify uses the same build command through `netlify.toml`.

## Edit content

- `content/posts/<slug>/index.md`: articles and their page bundle images. The existing article URLs remain `/posts/<slug>/`.
- `content/about.md`, `content/projects.md`, `content/experiences.md`: page metadata and the about introduction.
- `data/projects.toml`, `data/experience.toml`: project cards and the experience timeline. Projects with `featured = true` appear in “Featured projects” on the homepage and Projects page; other projects appear under “More work”.
- `static/images/resume.pdf`: the linked résumé used to align the portfolio’s experience, skills, and career highlights. Featured cloud security projects were checked against public GitHub repository pages; star counts are omitted because they change over time.
- `layouts/`: Hugo page templates and shared components.
- `static/css/site.css`: visual styles.
- `layouts/partials/github-activity.html`, `static/js/github-activity.js`: homepage contribution calendar, using the configured GitHub profile. Live data comes from the public [GitHub Contributions API](https://github.com/grubersjoe/github-contributions-api), with a profile link available if the service cannot be reached. Visitors can switch between the last year and five calendar years.

The old `public/` directory is a tracked legacy build. The new site does not use it; `dist/` is the deploy output.

## Design and themes

The portfolio uses warm paper and charcoal palettes, editorial serif headings, and a responsive layout across the homepage, projects, experience, about, and writing pages. It uses system fonts and has no frontend build dependencies.

The theme follows the device preference until the visitor selects light or dark mode. Their choice is stored locally and applied before the page renders. Keyboard focus styles, a skip link, and reduced-motion support are included.
