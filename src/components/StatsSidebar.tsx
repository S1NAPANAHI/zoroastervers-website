export default function StatsSidebar() {
  const stats = [
    { label: "Books", value: "3", icon: "📚" },
    { label: "Characters", value: "12", icon: "👥" },
    { label: "Locations", value: "8", icon: "🗺️" },
    { label: "Timeline Events", value: "24", icon: "📅" }
  ];

  const recentUpdates = [
    { item: "Hero McHeroface", type: "Character", time: "2h ago" },
    { item: "Dragon's Lair", type: "Location", time: "5h ago" },
    { item: "The Great War", type: "Event", time: "1d ago" }
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Card */}
      <div className="glass-dark p-6 glow-card">
        <h3 className="text-xl font-semibold text-[#dcddde] mb-4">
          📃 World Statistics
        </h3>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{stat.icon}</span>
                <span className="text-[#b3b3b3]">{stat.label}</span>
              </div>
              <span className="text-[#a855f7] font-bold text-lg">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Updates Card */}
      <div className="glass-dark p-6 glow-card">
        <h3 className="text-xl font-semibold text-[#dcddde] mb-4">
          🕒 Recent Updates
        </h3>
        <div className="space-y-3">
          {recentUpdates.map((update, index) => (
            <div key={index} className="border-l-2 border-[#a855f7] pl-3">
              <div className="text-[#dcddde] font-medium">{update.item}</div>
              <div className="text-[#b3b3b3] text-sm">{update.type} • {update.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
