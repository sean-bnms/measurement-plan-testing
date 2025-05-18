/**
 * A responsive two-column layout component.
 *
 * @param {React.ReactNode} left - Left-side content
 * @param {React.ReactNode} right - Right-side content
 * @param {string} [gap="gap-6"] - Tailwind gap between columns
 * @param {string} [templateKey="2fr_1fr"] - Width ratio key used for grid template
 */
export default function SplitPanel({
    left,
    right,
    gap = "gap-20",
    templateKey = "2fr_1fr"
  }) {

    const widthClassMap = {
        "2fr_1fr": "md:grid-cols-[2fr_1fr]",
        "1fr_1fr": "md:grid-cols-[1fr_1fr]",
        "auto_auto": "md:grid-cols-[auto_auto]",
      };

      const gridColsClass = widthClassMap[templateKey] || widthClassMap["2fr_1fr"];

      return (
        <div className={`grid grid-cols-1 ${gridColsClass} ${gap} mt-10`}>
          <div>{left}</div>
          <div>{right}</div>
        </div>
      );
    }
  