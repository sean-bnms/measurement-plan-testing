import { CheckIcon } from "lucide-react";

export default function MilestoneTracker({ milestones, currentStep }) {
  return (
    <div className="relative flex justify-between items-center">
      {milestones.map((label, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        const isLast = i === milestones.length - 1;

        return (
          <div key={label} className="relative flex-1 flex flex-col items-center">
            {/* Right-side connector line */}
            {!isLast && (
              <div className={`absolute top-4 right-0 w-full h-0.75 z-0 translate-x-1/2
                ${i < currentStep ? 'bg-blue-600' : 'bg-gray-300'}`} />
            )}

            {/* Circle */}
            <div
              className={`z-10 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium
                ${isCompleted ? 'bg-blue-600 text-white' :
                  isCurrent ? 'border-2 border-blue-600 bg-white text-blue-600' :
                  'border-2 border-gray-300 bg-white text-gray-500'}`}
            >
              {isCompleted ? <CheckIcon size={16} /> : i + 1}
            </div>

            <span className="text-xs text-center mt-2">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
