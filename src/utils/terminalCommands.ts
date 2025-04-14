export interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => string;
}

export const commands: { [key: string]: Command } = {
  help: {
    name: 'help',
    description: 'Show available commands',
    execute: () => {
      return Object.values(commands)
        .map(cmd => `${cmd.name}: ${cmd.description}`)
        .join('\n');
    },
  },
  about: {
    name: 'about',
    description: 'Display information about me',
    execute: () => {
      return `
Name: Akarsh Kudrimoti
Location: Atlanta, GA
Email: akudrimoti1@gmail.com
Phone: (404)-426-6523
LinkedIn: linkedin.com/in/akudrimoti
GitHub: github.com/akarshkudrimoti

Education:
- Innovation Academy (Expected May 2025)
  Computer Science, GPA: 4.17
  Threads: Intelligence & Info Internetworks
  Minor: Mathematics (Statistics)
  ACT: 35
  Highest Honors, Zell Miller Scholar

Current Role:
- SWE Lead @ Stride Labs
  Working on AI-powered orthotics startup
  Developing scan-to-insole technology
  Implementing secure authentication systems

Skills:
- Technical: React.js, Node.js, Express.js, Java, C++, Python, Mailchimp, GCloud, MATLAB, MuJoCo, TensorFlow, Docker, AWS
- Academic Interests: Competitive Programming, Frontend/Backend Development, HCI/BME/GenAI, Quant Trading
- Interests: Startups, Pickleball/Tennis, Traveling, Silicon Valley, Video/Beat Making, Violin/Piano, Pencil Drawing, Jazz, Bollywood
      `.trim();
    },
  },
  experience: {
    name: 'experience',
    description: 'Show work experience',
    execute: () => {
      return `
Work Experience:

1. SWE Lead @ Stride Labs (Jan 2025 - Present)
   - Evolved 3D printed insole supply chain
   - Secured ML orthotic pipeline with Firebase Auth
   - Enabled real-time STL to insole rendering

2. GAIT Energy Optimization Research @ GT (May 2024 - Aug 2024)
   - Spearheaded prosthetic leg design innovation
   - Conducted 534 MuJoCo simulations
   - Used TensorFlow for reinforcement learning

3. AI Prostate Cancer Detection System @ Emory (Mar 2024 - Aug 2024)
   - Advanced early PC detection using AI
   - Analyzed 314 untrained MRI results
   - Achieved 94.2% detection accuracy with CNNs

4. Marketing/AI Intern @ PeerBase AI (Aug 2023 - Dec 2023)
   - Attracted 1,850 website visitors
   - Added 1,500 high-quality leads
   - Achieved 250 new customers through A/B testing
      `.trim();
    },
  },
  awards: {
    name: 'awards',
    description: 'List achievements and awards',
    execute: () => {
      return `
Awards & Achievements:

1. Georgia Tech InVenture Prize (Top 6)
   - Stride Labs: AI custom orthotics
   - Earned cash, patent support, and accelerator access

2. Peter Thiel Fellowship
   - Selected for 2-year program
   - $100K award for orthotics breakthrough
   - Acceptance rate < 1%

3. USACO Gold
   - Top 500 programmers nationally
   - Solved 500+ competitive programming problems
      `.trim();
    },
  },
  clear: {
    name: 'clear',
    description: 'Clear the terminal',
    execute: () => {
      return '\x1Bc';
    },
  },
  contact: {
    name: 'contact',
    description: 'Show contact information',
    execute: () => {
      return `
Contact Information:
- Email: akudrimoti1@gmail.com
- Phone: (404)-426-6523
- LinkedIn: linkedin.com/in/akudrimoti
- GitHub: github.com/akarshkudrimoti
- Location: Atlanta, GA
      `.trim();
    },
  },
}; 