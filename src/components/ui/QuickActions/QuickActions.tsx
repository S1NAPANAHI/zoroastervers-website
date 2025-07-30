'use client';

export default function QuickActions() {
  const actions = [
    { label: "Add Character", icon: "👤", color: "neon-button-blue" },
    { label: "New Location", icon: "🏰", color: "neon-button-green" },
    { label: "Timeline Event", icon: "⏰", color: "neon-button" },
    { label: "Plot Note", icon: "📝", color: "neon-button-purple" }
  ];

  return (
    <div className="glass-dark p-6 glow-card">
      <h3 className="text-xl font-semibold text-[#dcddde] mb-4">
        ⚡ Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`${action.color} flex flex-col items-center space-y-1 text-sm`}
          >
            <span className="text-lg">{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
