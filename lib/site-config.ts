/**
 * Single source of truth for personal/marketing copy across the public
 * site. Edit this file to personalize the portfolio -- no need to hunt
 * through individual page components for name, bio, or links.
 */

const githubUsername = process.env.GITHUB_USERNAME || "your-github-username";

export const siteConfig = {
  name: "Your Name",
  title: "AI/ML Engineering Student",
  tagline:
    "I build practical machine learning systems -- from data pipelines to deployed models -- and document the process along the way.",
  email: "you@example.com",
  linkedinUrl: "https://linkedin.com/in/your-profile",
  githubUrl: `https://github.com/${githubUsername}`,
  githubUsername,
  youtubeUrl: "https://youtube.com/@your-channel",
  resumeUrl: "/resume.pdf",

  bio: [
    "I'm a third-year engineering student studying Artificial Intelligence and Machine Learning. I like taking models from a notebook to something people can actually use -- APIs, small products, and side projects that force me to learn the unglamorous parts of shipping software.",
    "Outside of coursework, I build and document projects on this site and on my YouTube channel, SR Builds, where I walk through what I learned (and got wrong) along the way.",
  ],

  education: {
    school: "Your University",
    degree: "B.Tech in Artificial Intelligence and Machine Learning",
    period: "2023 -- 2027 (expected)",
  },

  skills: [
    {
      category: "Languages",
      items: ["Python", "TypeScript", "SQL", "C++"],
    },
    {
      category: "ML / AI",
      items: ["PyTorch", "scikit-learn", "Pandas", "NumPy", "Hugging Face"],
    },
    {
      category: "Web & Tools",
      items: ["Next.js", "React", "MongoDB", "Docker", "Git"],
    },
  ],

  highlights: [
    {
      title: "Started this portfolio",
      date: "2026",
      description:
        "Built a full-stack Next.js + MongoDB portfolio to track and showcase projects as they ship.",
    },
  ],
} as const;
