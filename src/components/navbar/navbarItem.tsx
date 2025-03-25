export const NavbarItem = ({icon, label, className}: {icon: React.ReactNode, label: string, className?: string}) => {
    return <div className={`flex flex-col text-gray-600 items-center ${className}`}>
        <div className="flex justify-center">{icon}</div>
        <div className="text-center text-[12px]">{label}</div>
    </div>
}