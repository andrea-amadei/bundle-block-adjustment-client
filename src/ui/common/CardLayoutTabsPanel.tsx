import React from "react";
import "./CardLayoutTabsPanel.scss";

interface PropType {
  activeTabId: string | null | undefined;
  tabHeaderList: Array<{
    tabId: string;
    label: any;
    onClick?: (() => void) | null | undefined;
  }>;
  content: any;
  className: string;
}

export const CardLayoutTabsPanel: React.FC<PropType> = (props) => {

  const {tabHeaderList, content, className, activeTabId} = props;

  let activeTab = activeTabId;
  if(activeTab == null)
    activeTab = tabHeaderList[0].tabId;

  return (
    <div className={`card-layout-tabs-panel ${className}`}>
      <div className="tab-selection-header">
        {tabHeaderList.map((tabHeader) => (
          <div
            className={`tab-header ${tabHeader.tabId === activeTab ? "active" : ""}`}
            onClick={tabHeader.onClick}>
            {tabHeader.label}
          </div>
        ))}
      </div>
      <div className="tab-content">
        {content}
      </div>
    </div>
  );
};