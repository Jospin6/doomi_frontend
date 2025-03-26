import { useCurrentUser } from "@/hooks/useCurrentUser"

export default function Profile () {
    const user = useCurrentUser()
    return <div>
        <h1>{user?.name}</h1>
    </div>
}