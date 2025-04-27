import ActionButton from "./ActionButton";

export default function Modal({ 
    isOpen, 
    title, 
    children, 
    confirmBtn,
    cancelBtn, 
  }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-gray-900/10 flex items-center justify-center ">
        <div className="bg-white p-6 rounded shadow-lg z-60 pointer-events-auto w-full max-w-xl">
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          {children}
  
          <div className="flex justify-end space-x-3">
            <ActionButton 
                variant={cancelBtn.variant}
                onClick={cancelBtn.onClick}
                label={cancelBtn.label}
                icon={cancelBtn.icon? cancelBtn.icon : null}
                size="lg"
            />
            <ActionButton 
                variant={confirmBtn.variant}
                onClick={confirmBtn.onClick}
                label={confirmBtn.label}
                icon={confirmBtn.icon? confirmBtn.icon : null}
                size="lg"
            />
          </div>
        </div>
      </div>
    );
  }

  