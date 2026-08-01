/**
 * Single source of truth for personal/marketing copy across the public
 * site. Edit this file to personalize the portfolio -- no need to hunt
 * through individual page components for name, bio, or links.
 */

const githubUsername = process.env.GITHUB_USERNAME || "your-github-username";

export const siteConfig = {
  name: "Shreyas R S",
  profileImageUrl: "/media/profile_pic.png",
  title: "AI/ML Engineer & Builder",
  tagline:
    "I build intelligent AI systems, full-stack applications, and automation tools that solve real-world problems — from healthcare automation to developer productivity.",
  email: "buildathon111@gmail.com",
  whatsappNumber: "919019990664",
  linkedinUrl: "https://www.linkedin.com/in/shreyas-r-s-394347386",
  githubUrl: `https://github.com/${githubUsername}`,
  githubUsername,
  youtubeUrl: "https://www.youtube.com/@shreyasrangadhol",
  resumeUrl: "/resume.pdf",

  srBuilds: {
    name: "SR Builds",
    tagline: "Engineering, documented.",
    description:
      "SR Builds is where I build in public -- project breakdowns, tutorials, and behind-the-scenes look at how ideas turn into working software. Software isn't just something I ship; it's something I teach.",
  },

  bio: [
    "I'm a 3rd-year AI/ML Engineering student at Adichunchanagiri Institute of Technology, Karnataka. I believe in learning by building — whenever I pick up a technology, I create something practical with it.",
    "I'm passionate about leveraging AI to solve real-world problems, particularly in healthcare, data science, and full-stack development. Beyond engineering, I've spent 8 years learning Indian Classical and Western Music (Keyboard, Flute, Pakhwaj, Ghatam), which has shaped my creativity, discipline, and problem-solving approach.",
    "My personality is a blend of Engineer + Artist + Builder + Lifelong Learner. I believe projects teach more than tutorials, and consistency and curiosity matter more than talent.",
  ],

  education: {
    school: "Adichunchanagiri Institute of Technology, Karnataka",
    degree: "B.Tech in Artificial Intelligence and Machine Learning",
    period: "2024 -- 2028 (expected)",
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
