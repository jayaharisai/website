import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { InlineText } from "@/components/inline-text";
import "./todo-list.css";

export type TodoEntry = {
  text: string;
  checked: boolean;
  /** Pre-rendered nested blocks. */
  children?: ReactNode;
};

export default function TodoList({ items }: { items: TodoEntry[] }) {
  return (
    <ul className="todo-list">
      {items.map((item, index) => (
        <li key={index} className="todo-list__item">
          <span
            className="todo-list__box"
            data-checked={item.checked}
            role="img"
            aria-label={item.checked ? "Done" : "Not done"}
          >
            {item.checked && <Check size={12} strokeWidth={3} aria-hidden="true" />}
          </span>
          <div className="todo-list__body">
            <span className="todo-list__text" data-checked={item.checked}>
              <InlineText text={item.text} />
            </span>
            {item.children}
          </div>
        </li>
      ))}
    </ul>
  );
}
