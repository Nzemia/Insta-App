import { Button, StyleSheet, Text, View } from "react-native"
import React from "react"
import { useRouter } from "expo-router"
import ScreenWrapper from "../components/ScreenWrapper"

const index = () => {
    const router = useRouter()
    return (
        <ScreenWrapper>
            <Text>index</Text>
            <Button
                title="go to welcome screen"
                onPress={() => router.push("welcomeScreen")}
            />
        </ScreenWrapper>
    )
}

export default index
