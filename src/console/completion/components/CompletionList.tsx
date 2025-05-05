import React from "react";
import { CompletionItem } from "./CompletionItem";
import { CompletionTitle } from "./CompletionTitle";

interface Item {
  icon?: string;
  primary?: string;
  secondary?: string;
}

interface Group {
  name: string;
  items: Item[];
}

interface Props {
  select: number;
  size: number;
  completions: Group[];
}

export const CompletionList: React.FC<Props> = ({
  select,
  size,
  completions,
}) => {
  const [viewOffset, setViewOffset] = React.useState(0);
  const [prevSelect, setPrevSelect] = React.useState(-1);

  React.useEffect(() => {
    if (select === prevSelect) {
      return;
    }

    const viewSelect = (() => {
      let index = 0;
      for (let i = 0; i < completions.length; ++i) {
        ++index;
        const g = completions[i];
        if (select + i + 1 < index + g.items.length) {
          return select + i + 1;
        }
        index += g.items.length;
      }
      return -1;
    })();

    const nextViewOffset = (() => {
      if (prevSelect < select) {
        return Math.max(viewOffset, viewSelect - size + 1);
      } else if (prevSelect > select) {
        return Math.min(viewOffset, viewSelect);
      }
      return 0;
    })();

    setPrevSelect(select);
    setViewOffset(nextViewOffset);
  }, [select]);

  let itemIndex = 0;
  let viewIndex = 0;
  const groups: Array<React.ReactNode> = [];

  completions.forEach((group, groupIndex) => {
    if (group.items.length === 0) {
      return;
    }

    const items = [];
    const title = (
      <CompletionTitle
        id={`title-${groupIndex}`}
        key={`group-${groupIndex}`}
        shown={viewOffset <= viewIndex && viewIndex < viewOffset + size}
        title={group.name}
      />
    );
    ++viewIndex;
    for (const item of group.items) {
      items.push(
        <CompletionItem
          shown={viewOffset <= viewIndex && viewIndex < viewOffset + size}
          key={`item-${itemIndex}`}
          icon={item.icon}
          primary={item.primary}
          secondary={item.secondary}
          highlight={itemIndex === select}
        />,
      );
      ++viewIndex;
      ++itemIndex;
    }
    groups.push(
      <li
        key={`group-${groupIndex}`}
        role="group"
        aria-labelledby={`title-${groupIndex}`}
      >
        <ul role="menu">
          {title} {items}
        </ul>
      </li>,
    );
  });

  return <ul role="menu">{groups}</ul>;
};
