import { useState } from 'react';
import { X, Plus, Trash2, Copy, Palette, Layers, Clock } from 'lucide-react';
import { useDepthOSStore } from '../../stores/depthOSStore';
import { themeConfigs } from '../../utils/themes';

export const WorkspaceSwitcher: React.FC = () => {
  const {
    workspaces,
    activeWorkspaceId,
    setActiveWorkspace,
    createWorkspace,
    deleteWorkspace,
    duplicateWorkspace,
    renameWorkspace,
    setTheme,
  } = useDepthOSStore();

  const [isOpen, setIsOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim()) {
      createWorkspace(newWorkspaceName.trim());
      setNewWorkspaceName('');
    }
  };

  const handleRename = (id: string) => {
    if (editName.trim()) {
      renameWorkspace(id, editName.trim());
      setEditingId(null);
      setEditName('');
    }
  };

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
      >
        <Layers size={16} className="text-indigo-400" />
        <span className="text-white text-sm font-medium">
          {workspaces.find((w) => w.id === activeWorkspaceId)?.name || 'Workspace'}
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900/95 rounded-2xl border border-white/10 w-[500px] max-h-[80vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Layers size={20} className="text-indigo-400" />
                Workspaces
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Workspace List */}
            <div className="p-4 space-y-2 max-h-[50vh] overflow-y-auto">
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className={`p-3 rounded-xl border transition-all ${
                    workspace.id === activeWorkspaceId
                      ? 'bg-indigo-500/20 border-indigo-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {workspace.id === activeWorkspaceId && (
                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      )}
                      {editingId === workspace.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onBlur={() => handleRename(workspace.id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRename(workspace.id)}
                          className="bg-transparent border-b border-indigo-500 text-white outline-none flex-1"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => setActiveWorkspace(workspace.id)}
                          className="flex-1 text-left"
                        >
                          <p className="text-white font-medium">{workspace.name}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <Clock size={10} />
                            {new Date(workspace.modifiedAt).toLocaleDateString()}
                          </p>
                        </button>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEditing(workspace.id, workspace.name)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Rename"
                      >
                        <Palette size={14} />
                      </button>
                      <button
                        onClick={() => duplicateWorkspace(workspace.id)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Duplicate"
                      >
                        <Copy size={14} />
                      </button>
                      {workspace.id !== 'default' && (
                        <button
                          onClick={() => deleteWorkspace(workspace.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Theme selector */}
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Theme:</p>
                    <div className="flex gap-2">
                      {Object.values(themeConfigs).map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            setTheme(theme.id);
                            if (workspace.id === activeWorkspaceId) {
                              setIsOpen(false);
                            }
                          }}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
                            workspace.environmentId === theme.id
                              ? 'bg-indigo-500/30 text-indigo-300'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: theme.uiColors.primary }}
                          />
                          {theme.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Create New */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New workspace name..."
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateWorkspace()}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleCreateWorkspace}
                  disabled={!newWorkspaceName.trim()}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
