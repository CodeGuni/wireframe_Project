import React from "react";
import { TabId } from "../../types";

export interface RibbonPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export interface RibbonButtonProps {
  icon?: React.ElementType;
  label?: string;
  onClick?: () => void;
  isActive?: boolean;
  content?: React.ReactNode;
}

export interface RibbonTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export interface RibbonButtonConfig {
  icon?: React.ElementType;
  label?: string;
  onClick?: () => void;
  isActive?: boolean;
  content?: React.ReactNode; // Add this line
}

export type RibbonPanelConfig = {
  title: string;
  buttons: RibbonButtonProps[];
};

export type RibbonConfiguration = {
  [key in TabId]: RibbonPanelConfig[];
};
