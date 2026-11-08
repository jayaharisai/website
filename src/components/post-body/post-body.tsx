import type { ReactNode } from "react";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { DataTable } from "@/components/data-table";
import { ImageFigure } from "@/components/image-figure";
import { InlineText } from "@/components/inline-text";
import { LinkCard } from "@/components/link-card";
import { PullQuote } from "@/components/pull-quote";
import { TodoList } from "@/components/todo-list";
import { ToggleBlock } from "@/components/toggle-block";
import { VideoEmbed } from "@/components/video-embed";
import { assignHeadingIds, type Block, type ListItem } from "@/lib/content";
import "./post-body.css";

type HeadingIds = ReturnType<typeof assignHeadingIds>;

/** Nested blocks (inside lists, toggles, callouts…) sit in a small stack. */
function nested(blocks: Block[] | undefined, ids: HeadingIds): ReactNode {
  if (!blocks || blocks.length === 0) return null;
  return <div className="post-body__nested">{renderBlocks(blocks, ids)}</div>;
}

function renderListItem(item: ListItem, index: number, ids: HeadingIds) {
  const { text, children } = typeof item === "string" ? { text: item, children: undefined } : item;
  return (
    <li key={index}>
      <InlineText text={text} />
      {nested(children, ids)}
    </li>
  );
}

function renderBlock(block: Block, index: number, ids: HeadingIds): ReactNode {
  switch (block.type) {
    case "h2":
    case "h3":
    case "h4": {
      const Heading = block.type;
      return (
        <Heading
          key={index}
          id={ids.get(block)}
          className={`post-body__heading post-body__${block.type}`}
        >
          <InlineText text={block.text} />
        </Heading>
      );
    }
    case "p":
      return (
        <p key={index}>
          <InlineText text={block.text} />
        </p>
      );
    case "ul":
      return (
        <ul key={index} className="post-body__list">
          {block.items.map((item, itemIndex) => renderListItem(item, itemIndex, ids))}
        </ul>
      );
    case "ol":
      return (
        <ol key={index} className="post-body__list post-body__list--ordered">
          {block.items.map((item, itemIndex) => renderListItem(item, itemIndex, ids))}
        </ol>
      );
    case "todo":
      return (
        <TodoList
          key={index}
          items={block.items.map((item) => ({
            text: item.text,
            checked: item.checked,
            children: nested(item.children, ids),
          }))}
        />
      );
    case "toggle":
      return (
        <ToggleBlock key={index} title={block.title}>
          {renderBlocks(block.children, ids)}
        </ToggleBlock>
      );
    case "code":
      return (
        <CodeBlock
          key={index}
          code={block.code}
          language={block.language}
          filename={block.filename}
        />
      );
    case "callout":
      return (
        <Callout key={index} title={block.title} icon={block.icon}>
          {block.text && (
            <p>
              <InlineText text={block.text} />
            </p>
          )}
          {nested(block.children, ids)}
        </Callout>
      );
    case "quote":
      return (
        <PullQuote key={index} text={block.text} author={block.author}>
          {nested(block.children, ids)}
        </PullQuote>
      );
    case "image":
      return <ImageFigure key={index} src={block.src} caption={block.caption} ratio="16/10" />;
    case "video":
      return <VideoEmbed key={index} url={block.url} caption={block.caption} />;
    case "bookmark":
      return <LinkCard key={index} url={block.url} title={block.caption} />;
    case "file":
      return <LinkCard key={index} url={block.url} title={block.name} kind="file" />;
    case "table":
      return <DataTable key={index} rows={block.rows} header={block.header} />;
    case "divider":
      return <hr key={index} className="post-body__divider" />;
  }
}

function renderBlocks(blocks: Block[], ids: HeadingIds) {
  return blocks.map((block, index) => renderBlock(block, index, ids));
}

type PostBodyProps = {
  content: Block[];
};

export default function PostBody({ content }: PostBodyProps) {
  return <div className="post-body">{renderBlocks(content, assignHeadingIds(content))}</div>;
}
