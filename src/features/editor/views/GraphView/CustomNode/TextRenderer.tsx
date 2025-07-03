import React from "react";

interface TextRendererProps {
  children: string;
}

export const TextRenderer = ({ children }: TextRendererProps) => {
  return <>{children}</>;
};