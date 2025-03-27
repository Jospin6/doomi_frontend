"use client"
import { useCurrentUser } from "@/hooks/useCurrentUser"

export default function Favorite () {
    const user = useCurrentUser()
    return <div>
        Favorite {user?.id}
    </div>
}