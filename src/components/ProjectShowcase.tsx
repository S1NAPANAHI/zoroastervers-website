'use client';

export default function ProjectShowcase() {
  const projects = [
    { 
      title: "Book 4: Cosmic Reckoning", 
      description: "The next chapter in the saga where heroes face their ultimate destiny...", 
      progress: 75, 
      image: "/project1.jpg",
      status: "In Progress",
      expectedRelease: "Summer 2025"
    },
    { 
      title: "Worldbuilding Companion", 
      description: "An interactive guide to the universe with maps, lore, and character backstories...", 
      progress: 45, 
      image: "/project2.jpg",
      status: "Planning",
      expectedRelease: "Fall 2025"
    },
    { 
      title: "Audio Drama Series", 
      description: "A podcast series bringing the world to life with voice actors and sound design...", 
      progress: 20, 
      image: "/project3.jpg",
      status: "Concept",
      expectedRelease: "2026"
    }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return 'from-green-500 to-emerald-600';
    if (progress >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-blue-500 to-purple-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'text-green-400';
      case 'Planning': return 'text-yellow-400';
      case 'Concept': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="glass-dark p-6 glow-card">
      <h2 className="text-3xl font-bold mb-6 text-[#dcddde] flex items-center">
        🚀 Ongoing Projects
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="glass p-6 glow-card hover:scale-105 transition-all duration-300">
            {/* Project Image Placeholder */}
            <div className="w-full h-40 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl">📖</span>
            </div>
            
            {/* Project Info */}
            <h3 className="text-xl font-bold text-[#dcddde] mb-2">{project.title}</h3>
            <p className="text-[#b3b3b3] text-sm mb-4">{project.description}</p>
            
            {/* Status and Progress */}
            <div className="flex justify-between items-center mb-3">
              <span className={`text-sm font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <span className="text-[#a855f7] font-bold">{project.progress}%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(project.progress)} transition-all duration-500`}
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            
            {/* Expected Release */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#b3b3b3]">Expected: {project.expectedRelease}</span>
              <button className="neon-button-purple text-xs px-3 py-1">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
