function CharacterHub() {
  const characters = [
    { name: "Hero McHeroface", role: "Protagonist", description: "The brave hero of our story", emoji: "🛡️" },
    { name: "Villain McBadguy", role: "Antagonist", description: "The mysterious villain", emoji: "⚔️" },
    { name: "Wise Old Mentor", role: "Guide", description: "Provides wisdom and guidance", emoji: "🧙‍♂️" }
  ];

  return (
    <div className="glass-dark p-6 glow-card mt-4">
      <h2 className="text-2xl font-bold mb-4 text-[#dcddde] flex items-center">
        👥 Characters
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {characters.map((character, index) => (
          <div key={index} className="glass p-4 hover:border-[#a855f7] transition-all duration-200 glow-card">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">{character.emoji}</span>
              <h3 className="font-bold text-lg text-[#dcddde]">{character.name}</h3>
            </div>
            <p className="text-[#a855f7] font-medium mb-2">{character.role}</p>
            <p className="text-[#b3b3b3] text-sm">{character.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CharacterHub;
