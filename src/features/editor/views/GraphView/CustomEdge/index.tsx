import React from "react";
import { useComputedColorScheme } from "@mantine/core";
import type { EdgeProps } from "reaflow";
import { Edge } from "reaflow";

const CustomEdgeWrapper = (props: EdgeProps) => {
  const colorScheme = useComputedColorScheme();
  const [hovered, setHovered] = React.useState(false);

  return (
    <Edge
      containerClassName={`edge-${props.id}`}
      onEnter={() => setHovered(true)}
      onLeave={() => setHovered(false)}
      style={{
        stroke: colorScheme === "dark" ? "#444444" : "#BCBEC0",
        ...(hovered && { stroke: "#3B82F6" }),
        strokeWidth: 1.5,
      }}
      {...props}
    />
  );
};

export const CustomEdge = React.memo(CustomEdgeWrapper);