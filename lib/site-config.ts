/**
 * Single source of truth for personal/marketing copy across the public
 * site. Edit this file to personalize the portfolio -- no need to hunt
 * through individual page components for name, bio, or links.
 */

const githubUsername = process.env.GITHUB_USERNAME || "your-github-username";

export const siteConfig = {
  name: "Shreyas R S",
  title: "AI/ML Engineer & Builder",
  tagline:
    "I learn by building. Passionate about solving real-world problems with AI — from healthcare automation to intelligent systems.",
  email: "buildathon111@gmail.com",
  linkedinUrl: "https://linkedin.com/in/shreyasrs", // TODO: Update with actual LinkedIn
  githubUrl: `https://github.com/${githubUsername}`,
  githubUsername,
  youtubeUrl: "https://youtube.com/@srbuilds", // TODO: Update with actual YouTube channel
  resumeUrl: "/resume.pdf",

  bio: [
    "I'm a 3rd-year AI/ML Engineering student at Adichunchanagiri Institute of Technology, Karnataka. I believe in learning by building — whenever I pick up a technology, I create something practical with it.",
    "I'm passionate about leveraging AI to solve real-world problems, particularly in healthcare, data science, and full-stack development. Beyond engineering, I've spent 8 years learning Indian Classical and Western Music, which has shaped my creativity, discipline, and problem-solving approach.",
    "My personality is a blend of Engineer + Artist + Builder + Lifelong Learner. This portfolio showcases projects I've built, hackathons I've won, and my journey in AI/ML.",
  ],

  education: {
    school: "Adichunchanagiri Institute of Technology, Karnataka",
    degree: "B.Tech in Artificial Intelligence and Machine Learning",
    period: "2023 -- 2027 (expected)",
  },

  skills: [
    {
      category: "AI/ML",
      items: ["Deep Learning", "Natural Language Processing", "Computer Vision", "Generative AI", "Data Science", "PyTorch", "TensorFlow", "scikit-learn", "Hugging Face"],
    },
    {
      category: "Languages & Frameworks",
      items: ["Python", "TypeScript", "JavaScript", "React", "Next.js", "SQL", "C++"],
    },
    {
      category: "Specializations",
      items: ["Full Stack Development", "Healthcare AI", "OCR & Document Processing", "Cybersecurity", "Robotics", "IoT"],
    },
    {
      category: "Tools & Platforms",
      items: ["MongoDB", "Docker", "Git", "AWS", "GCP", "ROS", "Pandas", "NumPy"],
    },
  ],

  highlights: [
    {
      title: "Won Buildathon 2026",
      date: "2026",
      description:
        "Secured 1st place in a competitive 36+ hour hackathon. Built an innovative solution combining AI and full-stack development.",
    },
    {
      title: "Arogya Manthan 2K26 — Certificate of Appreciation",
      date: "2026",
      description:
        "State-level hackathon organized by ME-RIISE Foundation. Led development of an AI-powered healthcare insurance automation platform with OCR, document understanding, and intelligent claim processing.",
    },
    {
      title: "Krishimanthan 2026",
      date: "2026",
      description: "Participated in a 36-hour hackathon, exploring AI applications in agriculture.",
    },
    {
      title: "IoT Robotics ROS Workshop — IISc",
      date: "2026",
      description:
        "Completed a hands-on 2-day workshop at the Indian Institute of Science on robotics and ROS (Robot Operating System).",
    },
  ],
} as const;
