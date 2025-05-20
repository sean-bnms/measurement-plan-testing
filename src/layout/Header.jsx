export default function Header() {
    return (
        <header className="bg-blue-600 text-white flex items-center justify-between px-20 py-4 sticky top-0 z-50 h-16">
            <div>
                <span className="text-xl font-bold">Claritics</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="rounded-full w-8 h-8 border-2 bg-blue-100 text-blue-600 text-center flex items-center justify-center">
                    <span className="text-xs">SB</span>
                </div>
                <span className="text-md">Sean Bns</span>
            </div>
        </header> 
    );
}