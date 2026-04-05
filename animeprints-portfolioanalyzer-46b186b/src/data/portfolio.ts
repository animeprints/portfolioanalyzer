export const portfolioData = {
  name: "animeprints",
  title: "Creative Developer",
  tagline: "Building immersive web experiences with code and creativity",
  bio: `I'm a passionate developer who loves creating unique, interactive web experiences.
  With expertise in modern JavaScript frameworks and 3D graphics, I bring ideas to life
  through smooth animations and stunning visual effects. My work focuses on pushing the
  boundaries of what's possible in a browser.`,
  profileImage: null, // Use 3D element instead
  social: {
    github: "animeprints",
    email: "drajeevreddy15@gmail.com",
    phone: "+91 9738588092",
    linkedin: "animeprints",
    twitter: "animeprints",
  },
  skills: [
    {
      category: "Frontend",
      items: [
        { name: "React", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "Three.js / R3F", level: 85 },
        { name: "Framer Motion", level: 90 },
        { name: "Tailwind CSS", level: 95 },
        { name: "Vue.js", level: 75 },
      ],
    },
    {
      category: "Backend",
      items: [
        { name: "Node.js", level: 80 },
        { name: "PHP", level: 85 },
        { name: "MySQL", level: 75 },
        { name: "PostgreSQL", level: 70 },
        { name: "REST APIs", level: 90 },
      ],
    },
    {
      category: "Creative",
      items: [
        { name: "UI/UX Design", level: 80 },
        { name: "Motion Design", level: 85 },
        { name: "Blender 3D", level: 70 },
        { name: "After Effects", level: 75 },
        { name: "Figma", level: 85 },
      ],
    },
    {
      category: "DevOps",
      items: [
        { name: "Docker", level: 75 },
        { name: "CI/CD", level: 80 },
        { name: "AWS", level: 70 },
        { name: "Linux", level: 85 },
        { name: "Nginx", level: 75 },
      ],
    },
  ],
  techStack: [
    "React", "TypeScript", "Three.js", "Framer Motion", "Tailwind CSS",
    "Node.js", "PostgreSQL", "Docker", "AWS", "GraphQL", "WebGL", "GLSL",
    "Vue.js", "Python", "Redis", "Kubernetes", "Firebase", "Vite"
  ],
  projects: [
    {
      id: 1,
      title: "Immersive 3D Product Configurator",
      description: "A real-time 3D product customization platform allowing users to configure products with instant visual feedback. Built with Three.js and React Three Fiber, featuring over 500 configurable options.",
      image: null, // Use gradient placeholder
      tags: ["React", "Three.js", "WebGL", "R3F"],
      github: "https://github.com/animeprints/3d-configurator",
      live: "https://configurator.animeprints.dev",
      featured: true,
      color: "from-cyan-500 to-blue-600",
    },
    {
      id: 2,
      title: "AI-Powered Analytics Dashboard",
      description: "A comprehensive analytics platform with AI-driven insights, real-time data visualization, and predictive modeling. Handles millions of data points with sub-second response times.",
      image: null,
      tags: ["React", "Node.js", "PostgreSQL", "Machine Learning"],
      github: "https://github.com/animeprints/analytics-dash",
      live: "https://analytics.animeprints.dev",
      featured: true,
      color: "from-purple-500 to-pink-600",
    },
    {
      id: 3,
      title: "Motion Design Library",
      description: "An open-source animation library providing reusable, performant motion components for React applications. Over 2,000 GitHub stars and used in production by dozens of companies.",
      image: null,
      tags: ["React", "Framer Motion", "TypeScript", "Open Source"],
      github: "https://github.com/animeprints/motion-lib",
      live: "https://motion.animeprints.dev",
      featured: false,
      color: "from-green-500 to-emerald-600",
    },
    {
      id: 4,
      title: "E-Commerce Platform",
      description: "A fully custom e-commerce solution with advanced inventory management, payment processing, and marketing automation. Supports multi-currency and international shipping.",
      image: null,
      tags: ["Vue.js", "Node.js", "Stripe", "MySQL"],
      github: "https://github.com/animeprints/ecommerce",
      live: "https://shop.animeprints.dev",
      featured: false,
      color: "from-orange-500 to-red-600",
    },
    {
      id: 5,
      title: "Collaborative Design Tool",
      description: "A Figma-like collaborative design application with real-time cursors, vector editing, and team workspaces. Built for performance with WebSocket-based sync.",
      image: null,
      tags: ["React", "Canvas", "WebSocket", "CRDT"],
      github: "https://github.com/animeprints/design-tool",
      live: null,
      featured: false,
      color: "from-pink-500 to-rose-600",
    },
    {
      id: 6,
      title: "Personal Finance Tracker",
      description: "A beautiful, privacy-focused personal finance app with bank sync, budgeting, and investment tracking. All data stored locally with optional encrypted cloud backup.",
      image: null,
      tags: ["React Native", "Expo", "SQLite", " Encryption"],
      github: "https://github.com/animeprints/finance-tracker",
      live: null,
      featured: false,
      color: "from-indigo-500 to-purple-600",
    },
  ],
  experience: [
    {
      role: "Senior Frontend Engineer",
      company: "Tech Innovators Inc.",
      period: "2023 - Present",
      description: "Leading frontend development for flagship products. Mentoring junior developers and establishing best practices for performance and accessibility.",
    },
    {
      role: "Creative Developer",
      company: "Digital Agency X",
      period: "2021 - 2023",
      description: "Developed award-winning interactive experiences for major brands. Specialized in 3D web graphics and motion design.",
    },
    {
      role: "Full Stack Developer",
      company: "Startup Hub",
      period: "2019 - 2021",
      description: " Built multiple MVPs for startups across various industries. Wore many hats from design to deployment.",
    },
  ],
  education: [
    {
      degree: "B.Tech in Computer Science",
      institution: "University of Technology",
      period: "2015 - 2019",
      description: "Graduated with honors. Focus on algorithms, graphics, and human-computer interaction.",
    },
  ],
  stats: [
    { value: 50, label: "Projects Completed", suffix: "+" },
    { value: 8, label: "Years Experience", suffix: "" },
    { value: 1000, label: "GitHub Stars", suffix: "+" },
    { value: 30, label: "Happy Clients", suffix: "+" },
  ],
};
