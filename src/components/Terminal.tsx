'use client';

import { useEffect, useRef, useState } from 'react';
import { Terminal, ITheme, ITerminalOptions } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import React from 'react';

interface TerminalComponentProps {
  onClose: () => void;
}

interface Project {
  id: number;
  name: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
}

export default function TerminalComponent({ onClose }: TerminalComponentProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<InstanceType<typeof FitAddon> | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showProject, setShowProject] = useState<Project | null>(null);
  const [showGoogleScreen, setShowGoogleScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState('guest');
  const [currentHost, setCurrentHost] = useState('matrix');
  const [currentPath, setCurrentPath] = useState('~');
  const [animationPlayed, setAnimationPlayed] = useState(false);

  const projects: Project[] = [
    {
      id: 1,
      name: "Fraction Dash",
      shortDescription: "A gamified educational platform that combines typing speed with fraction math problems.",
      fullDescription: "This is the project Fraction Dash. Before this, I already had a lot of experience with fractions and a solid foundation in web development, including JavaScript and its frameworks, so transitioning into Flutter was both challenging and exciting. To build the project, I relied mainly on the Flutter documentation and YouTube tutorials, which were incredibly helpful as I navigated new concepts and tools. I also implemented waypoints as a key part of the game logic, which helped structure the car's movement across the track and made the animations feel smooth and responsive. I would definitely use Flutter again because I found it intuitive to script with and ideal for building clean, interactive apps. Along the way, I discovered that I really enjoy animating objects—something that requires logical thinking and algorithmic planning, which made the process both technical and creative. I've improved a lot in building mobile-friendly user interfaces and breaking down abstract game logic into digestible pieces for young players. My proudest achievement is seeing kids engage with the game enthusiastically—watching their cars move forward with each correct answer and realizing that they were learning without even noticing was incredibly rewarding. Fraction Dash makes an impact by turning math practice into something exciting, helping middle school students build confidence with fractions in a way that's accessible and entertaining. If I could revisit the project, I'd add a difficulty progression system, a multiplayer race mode, and tools for teachers to track student progress. I would absolutely love to continue working on Fraction Dash and expand it into a full suite of educational games, covering more math topics and creating an even deeper classroom impact.",
      imageUrl: "/images/fraction-dash.jpg"
    },
    {
      id: 2,
      name: "Snake AI",
      shortDescription: "An implementation of the classic Snake game with an AI agent trained using reinforcement learning.",
      fullDescription: "Snake AI is a fascinating project that combines classic gaming with cutting-edge AI. I built this project to explore reinforcement learning algorithms and their application in game development. The AI agent learns to play the classic Snake game by maximizing its score while avoiding collisions with walls and its own tail. I implemented various reinforcement learning techniques, including Q-learning and deep Q-networks, to train the agent. The project involved creating a custom environment for the Snake game, implementing the reward function, and fine-tuning the hyperparameters to achieve optimal performance. I also added a visualization component that shows the AI's decision-making process in real-time, which helps understand how the agent learns and improves over time. The most challenging part was balancing the exploration-exploitation trade-off to ensure the agent could discover effective strategies without getting stuck in local optima. Through this project, I gained valuable experience in machine learning, game development, and data visualization. The AI agent eventually learned to play the game at a superhuman level, achieving scores that would be difficult for most human players to match. This project demonstrates the power of reinforcement learning in solving complex problems and has inspired me to explore more applications of AI in gaming and beyond.",
      imageUrl: "/images/snake-ai.jpg"
    },
    {
      id: 3,
      name: "STORM Robotics FRC",
      shortDescription: "Led the computer science team for STORM Robotics, a competitive FIRST Robotics Competition team.",
      fullDescription: "As the leader of the computer science team for STORM Robotics, I had the opportunity to work on cutting-edge robotics technology in a competitive environment. Our team participated in the FIRST Robotics Competition (FRC), which challenges high school students to design, build, and program robots to complete specific tasks on a playing field. My role involved developing the robot's control systems, implementing autonomous navigation algorithms, and creating a user interface for the drivers. I worked closely with mechanical and electrical teams to ensure seamless integration of hardware and software components. The project required a deep understanding of control theory, computer vision, and real-time systems. We used Java with the WPI Library framework, which is specifically designed for FRC robots. One of the most challenging aspects was implementing reliable autonomous navigation that could work consistently in the unpredictable environment of a competition. I developed a PID control system for precise movement and implemented computer vision algorithms to detect game elements and navigate the field. The project taught me valuable lessons in teamwork, problem-solving, and project management. Our team's robot performed exceptionally well at competitions, and the experience has inspired me to continue exploring the intersection of software and robotics. The skills I gained from this project have been invaluable in my subsequent work in software development and AI research.",
      imageUrl: "/images/storm-robotics.jpg"
    }
  ];

  const writePrompt = () => {
    const term = terminalInstanceRef.current;
    if (!term) return;
    term.write(`\x1b[1;32m${currentUser}@${currentHost}\x1b[0m:\x1b[1;34m${currentPath}\x1b[0m$ `);
  };

  const typeText = (text: string, callback?: () => void) => {
    const term = terminalInstanceRef.current;
    if (!term) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        term.write(text[index]);
        index++;
      } else {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 30);
  };

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize terminal with minimal options
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#000000',
        foreground: '#00ff00',
        cursor: '#00ff00',
        selection: '#00ff00',
        black: '#000000',
        red: '#ff0000',
        green: '#00ff00',
        yellow: '#ffff00',
        blue: '#0000ff',
        magenta: '#ff00ff',
        cyan: '#00ffff',
        white: '#ffffff',
        brightBlack: '#808080',
        brightRed: '#ff0000',
        brightGreen: '#00ff00',
        brightYellow: '#ffff00',
        brightBlue: '#0000ff',
        brightMagenta: '#ff00ff',
        brightCyan: '#00ffff',
        brightWhite: '#ffffff',
      } as ITheme,
      rows: 30,
      cols: 100,
      allowProposedApi: true
    } as ITerminalOptions);

    // Initialize addon
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    // Store references
    terminalInstanceRef.current = term;
    fitAddonRef.current = fitAddon;

    // Open terminal in the container
    const terminalElement = terminalRef.current;
    if (terminalElement) {
      term.open(terminalElement);
      
      // Set mounted state after a short delay to ensure DOM is ready
      setTimeout(() => {
        setIsMounted(true);
        
        // Fit the terminal to its container
        fitAddon.fit();
        
        // Only play animation if it hasn't been played before
        if (!animationPlayed) {
          // Cool loading animation
          const loadingChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
          let loadingIndex = 0;
          const loadingInterval = setInterval(() => {
            term.write('\x1b[H'); // Move cursor to home position
            term.write('\x1b[2J'); // Clear screen
            term.write(`\x1b[1;32m${loadingChars[loadingIndex]} Initializing Matrix Terminal...\x1b[0m\r\n`);
            term.write(`\x1b[1;33m${loadingChars[loadingIndex]} Loading system modules...\x1b[0m\r\n`);
            term.write(`\x1b[1;36m${loadingChars[loadingIndex]} Establishing secure connection...\x1b[0m\r\n`);
            term.write(`\x1b[1;35m${loadingChars[loadingIndex]} Authenticating user...\x1b[0m\r\n`);
            term.write(`\x1b[1;31m${loadingChars[loadingIndex]} Accessing mainframe...\x1b[0m\r\n`);
            
            loadingIndex = (loadingIndex + 1) % loadingChars.length;
          }, 100);
          
          // After loading animation, show welcome message
          setTimeout(() => {
            clearInterval(loadingInterval);
            term.write('\x1b[H'); // Move cursor to home position
            term.write('\x1b[2J'); // Clear screen
            
            typeText('\x1b[1;32mWelcome to the Matrix Terminal\x1b[0m\r\n', () => {
              typeText('\x1b[1;33mWelcome guest!\x1b[0m\r\n', () => {
                typeText('\x1b[1;33mType \x1b[1;36mhelp\x1b[1;33m to see available commands\x1b[0m\r\n', () => {
                  typeText('\r\n', () => {
                    setIsLoading(false);
                    setAnimationPlayed(true);
                    writePrompt();
                  });
                });
              });
            });
          }, 2000);
        } else {
          // If animation has already played, just show the prompt
          term.write('\x1b[H'); // Move cursor to home position
          term.write('\x1b[2J'); // Clear screen
          term.write('\x1b[1;32mWelcome to the Matrix Terminal\x1b[0m\r\n');
          term.write('\x1b[1;33mWelcome guest!\x1b[0m\r\n');
          term.write('\x1b[1;33mType \x1b[1;36mhelp\x1b[1;33m to see available commands\x1b[0m\r\n');
          term.write('\r\n');
          setIsLoading(false);
          writePrompt();
        }
      }, 100);
    }

    // Handle window resize
    const handleResize = () => {
      if (fitAddon && isMounted) {
        fitAddon.fit();
      }
    };
    window.addEventListener('resize', handleResize);

    // Handle user input
    let currentInput = '';
    term.onKey(({ key, domEvent }) => {
      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

      if (domEvent.keyCode === 13) { // Enter
        term.write('\r\n');
        if (currentInput.trim()) {
          // Process the command
          const command = currentInput.trim().toLowerCase();
          
          // Handle project selection
          if (command === '1' || command === '2' || command === '3') {
            const projectId = parseInt(command);
            const project = projects.find(p => p.id === projectId);
            if (project) {
              setShowProject(project);
              setShowGoogleScreen(true);
              term.writeln(`\x1b[1;32mOpening ${project.name} in browser...\x1b[0m`);
              writePrompt();
              currentInput = '';
              return;
            }
          }
          
          switch (command) {
            case 'help':
              term.writeln('\x1b[1;32mAvailable commands:\x1b[0m');
              term.writeln('  \x1b[1;33mhelp\x1b[0m     - Show this help message');
              term.writeln('  \x1b[1;33mabout\x1b[0m    - Learn about me');
              term.writeln('  \x1b[1;33mskills\x1b[0m   - View my technical skills');
              term.writeln('  \x1b[1;33mprojects\x1b[0m - View my projects');
              term.writeln('  \x1b[1;33mcontact\x1b[0m  - Get my contact information');
              term.writeln('  \x1b[1;33mclear\x1b[0m    - Clear the terminal');
              term.writeln('  \x1b[1;33mexit\x1b[0m     - Close the terminal');
              term.writeln('  \x1b[1;33mls\x1b[0m       - List directory contents');
              term.writeln('  \x1b[1;33mpwd\x1b[0m      - Print working directory');
              term.writeln('  \x1b[1;33mwhoami\x1b[0m   - Display current user');
              term.writeln('  \x1b[1;33mneofetch\x1b[0m - Display system information');
              break;
            case 'about':
              term.writeln('\x1b[1;32mAbout Me:\x1b[0m');
              term.writeln('I love solving problems. Brain teasers, algorithms, random logic puzzles—I do them every day, just for fun.');
              term.writeln('There\'s something addicting about breaking something complex down, finding the best solution, and knowing I cracked the code.');
              break;
            case 'skills':
              term.writeln('\x1b[1;32mTechnical Skills:\x1b[0m');
              term.writeln('  \x1b[1;33mFrontend:\x1b[0m React.js, Next.js, TypeScript, Tailwind CSS, Framer Motion');
              term.writeln('  \x1b[1;33mBackend:\x1b[0m Node.js, Express.js, Python, Java');
              term.writeln('  \x1b[1;33mDatabase:\x1b[0m MongoDB, PostgreSQL, Firebase');
              break;
            case 'projects':
              term.writeln('\x1b[1;32mFeatured Projects:\x1b[0m');
              term.writeln('');
              term.writeln('  \x1b[1;33m1. Fraction Dash\x1b[0m');
              term.writeln('     A gamified educational platform that combines typing speed with fraction math problems.');
              term.writeln('');
              term.writeln('  \x1b[1;33m2. Snake AI\x1b[0m');
              term.writeln('     An implementation of the classic Snake game with an AI agent trained using reinforcement learning.');
              term.writeln('');
              term.writeln('  \x1b[1;33m3. STORM Robotics FRC\x1b[0m');
              term.writeln('     Led the computer science team for STORM Robotics, a competitive FIRST Robotics Competition team.');
              term.writeln('');
              term.writeln('\x1b[1;32mSelect a project to view details (1-3):\x1b[0m');
              break;
            case 'contact':
              term.writeln('\x1b[1;32mContact Information:\x1b[0m');
              term.writeln('  Email: \x1b[1;33makudrimoti1@gmail.com\x1b[0m');
              term.writeln('  Phone: \x1b[1;33m(404)-426-6523\x1b[0m');
              term.writeln('  LinkedIn: \x1b[1;33mlinkedin.com/in/akudrimoti\x1b[0m');
              term.writeln('  GitHub: \x1b[1;33mgithub.com/akarshkudrimoti\x1b[0m');
              break;
            case 'clear':
              term.write('\x1b[2J\x1b[H');
              term.write('\x1b[1;32mWelcome to the Matrix Terminal\x1b[0m\r\n');
              term.write('Type \x1b[1;33mhelp\x1b[0m to see available commands\r\n');
              term.write('\r\n');
              writePrompt();
              break;
            case 'exit':
              onClose();
              return;
            case 'ls':
              term.writeln('\x1b[1;34mDocuments\x1b[0m  \x1b[1;32mProjects\x1b[0m  \x1b[1;33mDownloads\x1b[0m  \x1b[1;35mPictures\x1b[0m');
              break;
            case 'pwd':
              term.writeln(`/${currentUser}/${currentPath}`);
              break;
            case 'whoami':
              term.writeln(currentUser);
              break;
            case 'neofetch':
              term.writeln('\x1b[1;32m       _\x1b[0m');
              term.writeln('\x1b[1;32m      / \\\x1b[0m');
              term.writeln('\x1b[1;32m     /   \\\x1b[0m');
              term.writeln('\x1b[1;32m    /     \\\x1b[0m');
              term.writeln('\x1b[1;32m   /       \\\x1b[0m');
              term.writeln('\x1b[1;32m  /         \\\x1b[0m');
              term.writeln('\x1b[1;32m /           \\\x1b[0m');
              term.writeln('\x1b[1;32m/_____________\\\x1b[0m');
              term.writeln('');
              term.writeln(`\x1b[1;33mOS:\x1b[0m MatrixOS v1.0`);
              term.writeln(`\x1b[1;33mHost:\x1b[0m ${currentHost}`);
              term.writeln(`\x1b[1;33mKernel:\x1b[0m 5.15.0-matrix`);
              term.writeln(`\x1b[1;33mUptime:\x1b[0m 42 days, 7 hours`);
              term.writeln(`\x1b[1;33mPackages:\x1b[0m 1337`);
              term.writeln(`\x1b[1;33mShell:\x1b[0m zsh 5.8`);
              term.writeln(`\x1b[1;33mTerminal:\x1b[0m xterm-256color`);
              term.writeln(`\x1b[1;33mCPU:\x1b[0m Quantum Processor`);
              term.writeln(`\x1b[1;33mMemory:\x1b[0m 16GB / 32GB`);
              break;
            default:
              term.writeln(`\x1b[1;31mCommand not found: ${currentInput}\x1b[0m`);
              term.writeln('Type \x1b[1;33mhelp\x1b[0m to see available commands.');
          }
        }
        writePrompt();
        currentInput = '';
      } else if (domEvent.keyCode === 8) { // Backspace
        if (currentInput.length > 0) {
          currentInput = currentInput.slice(0, -1);
          term.write('\b \b');
        }
      } else if (printable) {
        currentInput += key;
        term.write(key);
      }
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      setIsMounted(false);
      if (terminalRef.current) {
        if (terminalInstanceRef.current) {
          terminalInstanceRef.current.dispose();
        }
      }
      term.dispose();
    };
  }, [onClose, projects, currentUser, currentHost, currentPath, animationPlayed]);

  return (
    <>
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'black', 
        zIndex: 50,
        border: '2px solid #00ff00'
      }}>
        <div style={{ 
          height: '32px', 
          borderBottom: '1px solid #00ff00', 
          backgroundColor: 'black',
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px'
        }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff0000', marginRight: '8px' }}></div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffff00', marginRight: '8px' }}></div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#00ff00', marginRight: '8px' }}></div>
          <span style={{ color: '#00ff00', fontSize: '14px', marginLeft: '8px' }}>{currentUser}@{currentHost}:~$</span>
        </div>
        <div 
          ref={terminalRef} 
          style={{ 
            visibility: isMounted ? 'visible' : 'hidden',
            height: 'calc(100% - 32px)',
            width: '100%'
          }}
        />
      </div>

      {showGoogleScreen && showProject && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: '1000px',
          height: '80%',
          maxHeight: '800px',
          backgroundColor: 'white',
          zIndex: 100,
          borderRadius: '8px',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Chrome-like header */}
          <div style={{
            height: '40px',
            backgroundColor: '#f1f3f4',
            borderBottom: '1px solid #dadce0',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            cursor: 'move'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div 
                style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  backgroundColor: '#ff5f57', 
                  marginRight: '8px',
                  cursor: 'pointer'
                }} 
                onClick={() => setShowGoogleScreen(false)}
              ></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e', marginRight: '8px' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#28c940' }}></div>
            </div>
            <div style={{ 
              flex: 1, 
              margin: '0 16px', 
              height: '24px', 
              backgroundColor: 'white', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              fontSize: '14px',
              color: '#5f6368',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <span style={{ marginRight: '8px' }}>🔒</span>
              akarsh-matrix/{showProject.name.toLowerCase().replace(/\s+/g, '-')}
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: 'auto', padding: '20px', backgroundColor: '#f8f9fa' }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <h1 style={{ 
                color: '#1a0dab', 
                fontSize: '28px', 
                marginBottom: '16px',
                fontWeight: '500'
              }}>{showProject.name}</h1>
              <div style={{ marginBottom: '24px' }}>
                <img 
                  src={showProject.imageUrl} 
                  alt={showProject.name} 
                  style={{ 
                    width: '100%', 
                    maxHeight: '400px', 
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }} 
                />
              </div>
              <div style={{ 
                whiteSpace: 'pre-wrap', 
                lineHeight: '1.8', 
                color: '#333',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif'
              }}>
                {showProject.fullDescription}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 