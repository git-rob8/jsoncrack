import React from "react";
import { Box, LoadingOverlay, useComputedColorScheme } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import styled from "styled-components";
import debounce from "lodash.debounce";
import { Space } from "react-zoomable-ui";
import { Canvas } from "reaflow";
import type { ElkRoot } from "reaflow/dist/layout/useLayout";
import { useLongPress } from "use-long-press";
import useConfig from "../../../../store/useConfig";
import { CustomEdge } from "./CustomEdge";
import { CustomNode } from "./CustomNode";
import { ZoomControl } from "./ZoomControl";
import useGraph from "./stores/useGraph";

const StyledEditorWrapper = styled.div<{ $showRulers: boolean }>`
  position: absolute;
  width: 100%;
  height: calc(100vh - 67px);

  --bg-color: ${({ theme }) => theme.GRID_BG_COLOR};
  --line-color-1: ${({ theme }) => theme.GRID_COLOR_PRIMARY};
  --line-color-2: ${({ theme }) => theme.GRID_COLOR_SECONDARY};

  background-color: var(--bg-color);
  ${({ $showRulers }) =>
    $showRulers &&
    `
    background-image: linear-gradient(var(--line-color-1) 1.5px, transparent 1.5px),
      linear-gradient(90deg, var(--line-color-1) 1.5px, transparent 1.5px),
      linear-gradient(var(--line-color-2) 1px, transparent 1px),
      linear-gradient(90deg, var(--line-color-2) 1px, transparent 1px);
    background-position:
      -1.5px -1.5px,
      -1.5px -1.5px,
      -1px -1px,
      -1px -1px;
    background-size:
      100px 100px,
      100px 100px,
      20px 20px,
      20px 20px;
  `};

  .jsoncrack-space {
    cursor: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K"), auto;
  }

  :active {
    cursor: move;
  }

  .dragging,
  .dragging button {
    pointer-events: none;
  }

  rect {
    fill: ${({ theme }) => theme.BACKGROUND_NODE};
  }

  @media only screen and (max-width: 320px) {
    height: 100vh;
  }
`;

const layoutOptions = {
  "elk.layered.compaction.postCompaction.strategy": "EDGE_LENGTH",
  "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
};

const GraphCanvas = () => {
  const setLoading = useGraph(state => state.setLoading);
  const centerView = useGraph(state => state.centerView);
  const direction = useGraph(state => state.direction);
  const nodes = useGraph(state => state.nodes);
  const colorScheme = useComputedColorScheme();
  const edges = useGraph(state => state.edges);
  const [paneWidth, setPaneWidth] = React.useState(2000);
  const [paneHeight, setPaneHeight] = React.useState(2000);

  const onLayoutChange = React.useCallback(
    (layout: ElkRoot) => {
      if (layout.width && layout.height) {
        const areaSize = layout.width * layout.height;
        const changeRatio = Math.abs((areaSize * 100) / (paneWidth * paneHeight) - 100);

        setPaneWidth(layout.width + 50);
        setPaneHeight((layout.height as number) + 50);

        setTimeout(() => {
          window.requestAnimationFrame(() => {
            if (changeRatio > 70) centerView();
            setLoading(false);
          });
        });
      }
    },
    [paneHeight, paneWidth, centerView, setLoading]
  );

  return (
    <Canvas
      className="jsoncrack-canvas"
      onLayoutChange={onLayoutChange}
      node={p => <CustomNode {...p} />}
      edge={p => <CustomEdge {...p} />}
      nodes={nodes}
      edges={edges}
      arrow={null}
      maxHeight={paneHeight}
      maxWidth={paneWidth}
      height={paneHeight}
      width={paneWidth}
      direction={direction}
      layoutOptions={layoutOptions}
      key={[direction, colorScheme].join("-")}
      pannable={false}
      zoomable={false}
      animated={false}
      readonly={true}
      dragEdge={null}
      dragNode={null}
      fit={true}
    />
  );
};

export const GraphView = () => {
  const setViewPort = useGraph(state => state.setViewPort);
  const viewPort = useGraph(state => state.viewPort);
  const loading = useGraph(state => state.loading);
  const gesturesEnabled = useConfig(state => state.gesturesEnabled);
  const rulersEnabled = useConfig(state => state.rulersEnabled);
  const [debouncedLoading] = useDebouncedValue(loading, 300);

  const callback = React.useCallback(() => {
    const canvas = document.querySelector(".jsoncrack-canvas") as HTMLDivElement | null;
    canvas?.classList.add("dragging");
  }, []);

  const bindLongPress = useLongPress(callback, {
    threshold: 150,
    onFinish: () => {
      const canvas = document.querySelector(".jsoncrack-canvas") as HTMLDivElement | null;
      canvas?.classList.remove("dragging");
    },
  });

  const blurOnClick = React.useCallback(() => {
    if ("activeElement" in document) (document.activeElement as HTMLElement)?.blur();
  }, []);

  const debouncedOnZoomChangeHandler = debounce(() => {
    setViewPort(viewPort!);
  }, 300);

  return (
    <Box pos="relative" h="100%" w="100%">
      <LoadingOverlay visible={debouncedLoading} />
      <ZoomControl />
      <StyledEditorWrapper
        onContextMenu={e => e.preventDefault()}
        onClick={blurOnClick}
        key={String(gesturesEnabled)}
        $showRulers={rulersEnabled}
        {...bindLongPress()}
      >
        <Space
          onUpdated={() => debouncedOnZoomChangeHandler()}
          onCreate={setViewPort}
          onContextMenu={e => e.preventDefault()}
          treatTwoFingerTrackPadGesturesLikeTouch={gesturesEnabled}
          pollForElementResizing
          className="jsoncrack-space"
        >
          <GraphCanvas />
        </Space>
      </StyledEditorWrapper>
    </Box>
  );
};