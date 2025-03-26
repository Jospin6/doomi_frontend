"use client"
import { useCurrentUser } from "@/hooks/useCurrentUser"

export default function Account () {
    const user = useCurrentUser()
    return <div>
        <h1>{user?.name}</h1>
    </div>
}