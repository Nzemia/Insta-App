import { View, Text } from "react-native"
import React, { useEffect } from "react"
import { Stack, useRouter } from "expo-router"
import { AuthProvider, useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"

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
                updatedUserData(session?.user)
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

    const updatedUserData = async user => {
        // let response = await getUserData(user?.id)
        let response = await setUserData(user?.id)

        if (response.success) {
            setUserData(response.data)
        }
        
    }
    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        />
    )
}

export default _layout
