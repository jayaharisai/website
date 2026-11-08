import { InlineText } from "@/components/inline-text";
import "./data-table.css";

type DataTableProps = {
  rows: string[][];
  /** First row is a header. */
  header?: boolean;
};

export default function DataTable({ rows, header = false }: DataTableProps) {
  if (rows.length === 0) return null;
  const head = header ? rows[0] : undefined;
  const body = header ? rows.slice(1) : rows;

  return (
    <div className="data-table" tabIndex={0} role="region" aria-label="Table">
      <table>
        {head && (
          <thead>
            <tr>
              {head.map((cell, index) => (
                <th key={index} scope="col">
                  <InlineText text={cell} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  <InlineText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
