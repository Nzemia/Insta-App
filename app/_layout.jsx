import React, { useEffect } from "react"
import { Stack, useRouter } from "expo-router"
import { AuthProvider, useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import { getUserData } from "../services/userService"
import { LogBox } from "react-native"


{/**Logs to ignore the errors provided by the render html library */ }
LogBox.ignoreLogs([
    "Warning: TRenderEngineProvider",
    "MemoizedTNodeRenderer",
    "TNodeChildrenRenderer"
])

const _layout = () => {
    return (
        <AuthProvider>
            <MainLayout />
        </AuthProvider>
    )
}
const MainLayout = () => {
    const { setAuth, setUserData } = useAuth()
    const router = useRouter()

    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            console.log("session: ", session?.user?.id)

            if (session) {
                //set auth
                setAuth(session?.user)

                //call the updated user data in table
                updatedUserData(session?.user, session?.user?.email)

                //move to home screen
                router.replace("/home")
            } else {
                // set auth as null
                setAuth(null)
                //move to welcome screen
                router.replace("/welcomeScreen")
            }
        })
    }, [])

    const updatedUserData = async (user, email) => {
        let response = await getUserData(user?.id)

        if (response.success) setUserData({ ...response.data, email })
    }
    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="(main)/postDetails" options={{presentation: "modal"}} />
        </Stack>
    )
}

export default _layout
