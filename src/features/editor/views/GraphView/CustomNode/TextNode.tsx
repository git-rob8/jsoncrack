import React from "react";
import type { CustomNodeProps } from ".";
import { TextRenderer } from "./TextRenderer";
import * as Styled from "./styles";

const Node = ({ node, x, y }: CustomNodeProps) => {
  const {
    id,
    text,
    width,
    height,
    data: { isParent, childrenCount, type },
  } = node;
  const value = JSON.stringify(text).replaceAll('"', "");

  return (
    <Styled.StyledForeignObject
      data-id={`node-${node.id}`}
      width={width}
      height={height}
      x={0}
      y={0}
    >
      <Styled.StyledTextNodeWrapper
        data-x={x}
        data-y={y}
        data-key={JSON.stringify(text)}
        $hasCollapse={false}
        $isParent={isParent}
      >
        <Styled.StyledKey $value={value} $parent={isParent} $type={type}>
          <TextRenderer>{value}</TextRenderer>
        </Styled.StyledKey>
        {isParent && childrenCount > 0 && (
          <Styled.StyledChildrenCount>
            {type === "object" ? `{${childrenCount}}` : `[${childrenCount}]`}
          </Styled.StyledChildrenCount>
        )}
      </Styled.StyledTextNodeWrapper>
    </Styled.StyledForeignObject>
  );
};

function propsAreEqual(prev: CustomNodeProps, next: CustomNodeProps) {
  return (
    prev.node.text === next.node.text &&
    prev.node.width === next.node.width &&
    prev.node.data.childrenCount === next.node.data.childrenCount
  );
}

export const TextNode = React.memo(Node, propsAreEqual);