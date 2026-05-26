import React from 'react';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab?: string;
  onChangeTab?: (id: string) => void;
  variant?: 'underline' | 'pills';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChangeTab,
  variant = 'underline',
}) => {
  const [localActiveTab, setLocalActiveTab] = React.useState(tabs[0]?.id);
  const currentTab = activeTab || localActiveTab;

  const handleTabClick = (id: string) => {
    if (onChangeTab) {
      onChangeTab(id);
    } else {
      setLocalActiveTab(id);
    }
  };

  const activeContent = tabs.find((t) => t.id === currentTab)?.content;

  return (
    <div className="tabs-container">
      {/* Tab headers */}
      <div className={`tab-header-list variant-${variant}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === currentTab;
          return (
            <button
              key={tab.id}
              className={`tab-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab panel */}
      <div className="tab-panel-content animate-fade-in-quick">
        {activeContent}
      </div>

      <style>{`
        .tabs-container {
          width: 100%;
        }
        .tab-header-list {
          display: flex;
          gap: 16px;
          margin-bottom: var(--space-lg);
          border-bottom: 1px solid var(--border-color);
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
        }
        .tab-header-list::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }

        .tab-btn {
          background: transparent;
          border: none;
          padding: 8px 4px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          position: relative;
          cursor: pointer;
          transition: color var(--transition-fast);
          white-space: nowrap;
          border-radius: 0;
        }

        .tab-btn:hover {
          color: var(--text-primary);
        }

        /* Underline variation styling */
        .variant-underline .tab-btn.is-active {
          color: var(--accent-primary);
        }
        .variant-underline .tab-btn.is-active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--accent-primary);
        }

        /* Pills variation styling */
        .variant-pills {
          border-bottom: none;
          background-color: var(--bg-tertiary);
          padding: 4px;
          border-radius: var(--radius-md);
          display: inline-flex;
          gap: 4px;
        }
        .variant-pills .tab-btn {
          padding: 6px 16px;
          border-radius: var(--radius-sm);
        }
        .variant-pills .tab-btn.is-active {
          background-color: var(--bg-secondary);
          color: var(--accent-primary);
          box-shadow: var(--shadow-sm);
        }
        .variant-pills .tab-btn.is-active::after {
          display: none;
        }

        .tab-panel-content {
          animation: fade-in-quick 0.15s ease-out;
        }
        @keyframes fade-in-quick {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
