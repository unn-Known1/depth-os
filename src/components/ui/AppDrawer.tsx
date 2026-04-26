import { useState, useMemo } from 'react';
import { X, Search, Star, Grid, Code, Briefcase, Gamepad2, Wrench } from 'lucide-react';
import { useDepthOSStore } from '../../stores/depthOSStore';
import type { MarketplaceApp } from '../../types';

const categoryIcons: Record<string, React.ReactNode> = {
  productivity: <Briefcase size={14} />,
  development: <Code size={14} />,
  entertainment: <Gamepad2 size={14} />,
  communication: <Briefcase size={14} />,
  utilities: <Wrench size={14} />,
};

export const AppDrawer: React.FC = () => {
  const { appDrawerOpen, closeAppDrawer, marketplaceApps, addAppFromMarketplace, workspaces, activeWorkspaceId } = useDepthOSStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const workspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const existingAppNames = workspace?.apps.map((a) => a.name) || [];

  const filteredApps = useMemo(() => {
    return marketplaceApps.filter((app) => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !activeCategory || app.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [marketplaceApps, searchQuery, activeCategory]);

  const categories = ['productivity', 'development', 'entertainment', 'communication', 'utilities'];

  if (!appDrawerOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center">
      <div className="bg-gray-900/95 rounded-2xl border border-white/10 w-[600px] max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Grid size={20} className="text-indigo-400" />
              App Drawer
            </h2>
            <button
              onClick={closeAppDrawer}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                !activeCategory ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex items-center gap-1 ${
                  activeCategory === cat ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {categoryIcons[cat]}
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Apps Grid */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-4 gap-3">
            {filteredApps.map((app) => {
              const isInstalled = existingAppNames.includes(app.name);
              return (
                <button
                  key={app.id}
                  onClick={() => !isInstalled && addAppFromMarketplace(app)}
                  disabled={isInstalled}
                  className={`p-4 rounded-xl border transition-all ${
                    isInstalled
                      ? 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-500/50 hover:scale-105'
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-2 mx-auto"
                    style={{ backgroundColor: app.color + '20' }}
                  >
                    {app.icon}
                  </div>
                  <p className="text-sm text-white text-center truncate">{app.name}</p>
                  {isInstalled && (
                    <p className="text-xs text-gray-400 text-center mt-1 flex items-center justify-center gap-1">
                      <Star size={10} /> Installed
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {filteredApps.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No apps found matching your search.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-black/20">
          <p className="text-xs text-gray-400 text-center">
            {marketplaceApps.length} apps available • Click to add to workspace
          </p>
        </div>
      </div>
    </div>
  );
};
