import React from "react";
import { Flex, Group, Select, Button } from "@mantine/core";
import styled from "styled-components";
import toast from "react-hot-toast";
import { AiOutlineFullscreen } from "react-icons/ai";
import { type FileFormat, formats } from "../../../enums/file.enum";
import useFile from "../../../store/useFile";
import { ViewMenu } from "./ViewMenu";
import { StyledToolElement } from "./styles";

const StyledTools = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 4px;
  justify-content: space-between;
  height: 40px;
  padding: 4px 8px;
  background: ${({ theme }) => theme.TOOLBAR_BG};
  color: ${({ theme }) => theme.SILVER};
  z-index: 36;
  border-bottom: 1px solid ${({ theme }) => theme.SILVER_DARK};

  @media only screen and (max-width: 320px) {
    display: none;
  }
`;

function fullscreenBrowser() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {
      toast.error("Unable to enter fullscreen mode.");
    });
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

export const Toolbar = () => {
  const setFormat = useFile(state => state.setFormat);
  const format = useFile(state => state.format);

  return (
    <StyledTools>
      <Group gap="xs" justify="left" w="100%" style={{ flexWrap: "nowrap" }}>
        <StyledToolElement title="JSON Editor">
          <Flex gap="xs" align="center" justify="center">
            JSON Editor
          </Flex>
        </StyledToolElement>
        <Select
          defaultValue="json"
          size="xs"
          value={format}
          onChange={e => setFormat(e as FileFormat)}
          miw={80}
          w={120}
          data={formats}
          allowDeselect={false}
        />

        <ViewMenu />
      </Group>
      <Group gap="xs" justify="right" w="100%" style={{ flexWrap: "nowrap" }}>
        <StyledToolElement title="Fullscreen" onClick={fullscreenBrowser}>
          <AiOutlineFullscreen size="18" />
        </StyledToolElement>
      </Group>
    </StyledTools>
  );
};