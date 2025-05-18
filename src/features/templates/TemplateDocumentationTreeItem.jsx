import { ChevronDown, ChevronRight } from "lucide-react";

import Badge from "../../components/Badge";

export default function TemplateDocumentationTreeItem({ item, onClick, selectionMap, selectedItemParents }) {
    const hasChildren = item.children && Object.keys(item.children).length > 0;
    const isSelected = selectionMap.filter((obj) => obj.path === item.path)[0].status;
    const isParent = isSelected ? false : selectedItemParents.includes(item.path);

    function handleClick(item) {
        onClick(item);
    }

    // Manages indentation classes, while accounting for collapsible chevron size
    const marginLevel = {
        level_1: "pl-4",
        level_2: "pl-8",
        level_3: "pl-12",
        level_4: "pl-14"
    };

    const marginLevelWithoutChevron = {
        // chevron takes 1.5 + 4 + 1.5 so we account for 8 to keep consistency with Tailwind CSS
        level_1: "pl-4",
        level_2: "pl-16", 
        level_3: "pl-20",
        level_4: "pl-24"
    }

    const textColorClass = isSelected ? "text-blue-700" : isParent ? "text-gray-900" : "text-gray-600";

    return (
        <div className="my-1">
            <div className={hasChildren ? `${marginLevel[`level_${item.level}`]} my-3` : `${marginLevelWithoutChevron[`level_${item.level}`]} my-2`}>
                <div 
                    className={`flex items-center cursor-pointer`} 
                    onClick={() => {
                        handleClick(item);
                    }}
                >
                    {hasChildren && (
                        <span 
                        className={`p-1.5 text-sm bg-transparent ${textColorClass}`} aria-hidden="true">
                            {(isSelected || isParent) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </span> 
                    )}

                    <h3 className={`text-md ${textColorClass} mr-2`}>{item.key}</h3>
                        
                    <div>
                        {
                            item.metadata.type !== null && item.metadata.type !== undefined ? 
                            <Badge variant={item.metadata.type === "unknown" ? "warning" : "gray"} label={item.metadata.type} /> 
                            : <Badge variant={"warning"} label={"unkown"} />
                        }
                    </div>
                </div>
            </div>

            {hasChildren && (isSelected || isParent) && (
                Object.values(item.children).map((child) => {
                    const itemSelected = selectionMap.filter((obj) => obj.path === child.path)[0].status;
                    return <TemplateDocumentationTreeItem key={child.path} item={child} onClick={handleClick} selectionMap={selectionMap} selectedItemParents={selectedItemParents} />
                })
            )}
        </div>
    );
}
