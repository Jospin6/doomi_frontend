import { AppDispatch } from "@/redux/store"
import { fetchUser, selectUser } from "@/redux/user/userSlice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function Account () {
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector(selectUser)
    useEffect(() => {
        dispatch(fetchUser("1"))
    }, [])
    return <div>
        <h1>{user?.name}</h1>
    </div>
}