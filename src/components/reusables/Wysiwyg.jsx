import React, { useCallback, useMemo } from "react";
import {
  createEditor,
  Editor,
  Transforms,
  Element as SlateElement,
} from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { Toggle } from "../ui/toggle";
import { Bold, Italic, List, ListOrdered, Underline } from "lucide-react";
import { cn } from "@/lib/utils";

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const Wysiwyg = React.forwardRef((props, ref) => {
  const initialValue = [
    {
      type: "paragraph",
      children: [
        {
          text: "",
        },
      ],
    },
  ];
  const editor = useMemo(() => withReact(createEditor()), []);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const { selection } = editor;
      if (selection) {
        const [listItem] = Editor.nodes(editor, {
          match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type === "list-item",
        });

        if (listItem) {
          Transforms.insertNodes(editor, {
            type: listItem[0].type,
            children: [{ text: "" }],
          });
        } else {
          Transforms.insertNodes(editor, {
            type: "paragraph",
            children: [{ text: "" }],
          });
        }
      }
    }
  };
  const PARSED_VALUE = JSON.parse(props.value || JSON.stringify(initialValue));
  if (props?.value) {
    editor.children = PARSED_VALUE;
  }
  return (
    <>
      <Slate
        editor={editor}
        initialValue={props?.value ? PARSED_VALUE : initialValue}
        onChange={(e) => props?.onChange(JSON.stringify(e))}
      >
        <div className={cn("border rounded-md bg-white", props.className)}>
          {!props.readOnly && (
            <div className="flex flex-row justify-start items-center">
              <MarkButton format="bold">
                <Bold size={16} strokeWidth={1} absoluteStrokeWidth />
              </MarkButton>
              <MarkButton format="italic">
                <Italic size={16} strokeWidth={1} absoluteStrokeWidth />
              </MarkButton>
              <MarkButton format="underline">
                <Underline size={16} strokeWidth={1} absoluteStrokeWidth />
              </MarkButton>
              <BlockButton format="bulleted-list">
                <List size={16} strokeWidth={1} absoluteStrokeWidth />
              </BlockButton>
              <BlockButton format="numbered-list">
                <ListOrdered size={16} strokeWidth={1} absoluteStrokeWidth />
              </BlockButton>
            </div>
          )}

          <Editable
            {...props}
            className={cn(
              "border-t min-h-[174px] px-3 py-2",
              props.editableclassname
            )}
            onKeyDown={handleKeyDown}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            value={PARSED_VALUE}
            readOnly={props.readOnly}
          />
        </div>
      </Slate>
    </>
  );
});

const MarkButton = ({ format, children }) => {
  const editor = useSlate();
  return (
    <Toggle
      pressed={isMarkActive(editor, format)}
      onClick={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {children}
    </Toggle>
  );
};

const BlockButton = ({ format, children }) => {
  const editor = useSlate();
  return (
    <Toggle
      pressed={isBlockActive(editor, format)}
      onClick={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {children}
    </Toggle>
  );
};

// Helper functions
function isMarkActive(editor, format) {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

function isBlockActive(editor, format, blockType = "type") {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  );

  return !!match;
}

function toggleBlock(editor, format) {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  });

  let newProperties;

  if (isActive) {
    newProperties = {
      type: "paragraph",
    };
  } else if (isList) {
    newProperties = {
      type: "list-item",
    };
  } else {
    newProperties = {
      type: format,
    };
  }

  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

function toggleMark(editor, format) {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "bulleted-list":
      return (
        <ul className="list-disc list-inside" {...attributes}>
          {children}
        </ul>
      );
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return (
        <ol className="list-decimal list-inside" {...attributes}>
          {children}
        </ol>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

export default Wysiwyg;
