'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link?: string;
  github?: string;
}

const projects: Project[] = [
  {
    id: 'fraction-dash',
    title: 'Fraction Dash',
    description: 'A gamified educational platform that combines typing speed with fraction math problems. Students race against time to solve fraction problems while improving their typing skills. The game features multiple difficulty levels, progress tracking, and a competitive leaderboard to motivate learning.',
    technologies: ['React', 'TypeScript', 'Firebase', 'Tailwind CSS', 'Framer Motion'],
    image: '/images/fraction-dash.jpg',
    link: 'https://fraction-dash.vercel.app',
    github: 'https://github.com/akarshkudrimoti/fraction-dash'
  },
  {
    id: 'snake-ai',
    title: 'Snake AI',
    description: 'An implementation of the classic Snake game with an AI agent trained using reinforcement learning. The AI learns to play the game optimally by maximizing the score while avoiding collisions. The project includes visualization of the AI\'s decision-making process and performance metrics.',
    technologies: ['Python', 'TensorFlow', 'Reinforcement Learning', 'Pygame', 'NumPy'],
    image: '/images/snake-ai.jpg',
    github: 'https://github.com/akarshkudrimoti/snake-ai'
  },
  {
    id: 'robotics-frc',
    title: 'STORM Robotics FRC',
    description: 'Led the computer science team for STORM Robotics, a competitive FIRST Robotics Competition team. Developed robot control systems using Java and the WPI Library, implementing autonomous navigation, vision processing, and game-specific strategies. Contributed to the team\'s success in qualifying for the World Championship.',
    technologies: ['Java', 'WPI Library', 'Computer Vision', 'PID Control', 'Git'],
    image: '/images/robotics-frc.jpg',
    github: 'https://github.com/akarshkudrimoti/storm-robotics'
  }
];

export default function Projects() {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  const toggleProject = (id: string) => {
    setActiveProject(activeProject === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">PROJECTS</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="border border-green-500 rounded-lg overflow-hidden bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <div 
                className="relative h-48 cursor-pointer"
                onClick={() => toggleProject(project.id)}
              >
                <div className="absolute inset-0 bg-green-500/20 z-10 flex items-center justify-center">
                  <span className="text-2xl font-bold">Click to {activeProject === project.id ? 'collapse' : 'expand'}</span>
                </div>
                <div className="w-full h-full relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{project.title}</h2>
                
                {activeProject === project.id ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="mb-4 text-sm">{project.description}</p>
                    
                    <div className="mb-4">
                      <h3 className="font-bold mb-1">Technologies:</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span 
                            key={tech} 
                            className="px-2 py-1 bg-green-500/20 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-green-500 text-black rounded hover:bg-green-600 transition-colors text-sm"
                        >
                          View Project
                        </a>
                      )}
                      {project.github && (
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 py-1 border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-black transition-colors text-sm"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <p className="text-sm line-clamp-2">{project.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 