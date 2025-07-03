import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useMantineColorScheme } from "@mantine/core";
import styled, { ThemeProvider } from "styled-components";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { darkTheme, lightTheme } from "../constants/theme";
import { BottomBar } from "../features/editor/BottomBar";
import { Toolbar } from "../features/editor/Toolbar";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";
import useConfig from "../store/useConfig";
import useFile from "../store/useFile";

const TextEditor = dynamic(() => import("../features/editor/TextEditor"), {
  ssr: false,
});

const LiveEditor = dynamic(() => import("../features/editor/LiveEditor"), {
  ssr: false,
});

export const StyledPageWrapper = styled.div`
  height: calc(100vh - 27px);
  width: 100%;

  @media only screen and (max-width: 320px) {
    height: 100vh;
  }
`;

export const StyledEditorWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const StyledEditor = styled(Allotment)`
  position: relative !important;
  display: flex;
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
  height: calc(100vh - 67px);

  @media only screen and (max-width: 320px) {
    height: 100vh;
  }
`;

const EditorPage = () => {
  const { setColorScheme } = useMantineColorScheme();
  const checkEditorSession = useFile(state => state.checkEditorSession);
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);
  const fullscreen = useGraph(state => state.fullscreen);

  useEffect(() => {
    checkEditorSession();
  }, [checkEditorSession]);

  useEffect(() => {
    setColorScheme(darkmodeEnabled ? "dark" : "light");
  }, [darkmodeEnabled, setColorScheme]);

  return (
    <ThemeProvider theme={darkmodeEnabled ? darkTheme : lightTheme}>
      <StyledEditorWrapper>
        <StyledPageWrapper>
          <Toolbar />
          <StyledEditorWrapper>
            <StyledEditor proportionalLayout={false}>
              <Allotment.Pane
                preferredSize={450}
                minSize={fullscreen ? 0 : 300}
                maxSize={800}
                visible={!fullscreen}
              >
                <TextEditor />
              </Allotment.Pane>
              <Allotment.Pane minSize={0}>
                <LiveEditor />
              </Allotment.Pane>
            </StyledEditor>
          </StyledEditorWrapper>
        </StyledPageWrapper>
        <BottomBar />
      </StyledEditorWrapper>
    </ThemeProvider>
  );
};

export default EditorPage;