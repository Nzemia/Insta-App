import { Image, Pressable, StyleSheet, Text, View } from "react-native"
import React from "react"
import ScreenWrapper from "../components/ScreenWrapper"
import { StatusBar } from "expo-status-bar"
import { hp, wp } from "../helpers/common"
import { theme } from "../constants/theme"
import Button from "../components/Button"

const WelcomeScreen = () => {
    return (
        <ScreenWrapper bg="white">
            <StatusBar style="dark" />
            <View style={styles.container}>
                {/**Welcome Image */}
                <Image
                    style={styles.welcomeImage}
                    resizeMode="contain"
                    source={require("../assets/images/welcome.png")}
                />

                {/**Title */}
                <View style={{ gap: 20 }}>
                    <Text style={styles.title}>LinkUp!</Text>
                    <Text style={styles.punchline}>
                        Where every thought finds a home and every image tells a
                        story.
                    </Text>
                </View>

                {/**Footer   */}
                <View style={styles.footer}>
                    <Button
                        title="Getting Started"
                        buttonStyle={{
                            marginHorizontal: wp(3)
                        }}
                        onPress={() => {}}
                    />

                    <View style={styles.bottomTextContainer}>
                        <Text style={styles.loginText}>
                            Already have an account?
                        </Text>
                        <Pressable>
                            <Text
                                style={[
                                    styles.loginText,
                                    {
                                        color: theme.colors.primaryDark,
                                        fontWeight: theme.fonts.semibold
                                    }
                                ]}
                            >
                                Login
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default WelcomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "white",
        marginHorizontal: wp(10)
    },
    welcomeImage: {
        width: wp(100),
        height: wp(70),
        alignSelf: "center"
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(4),
        textAlign: "center",
        fontWeight: theme.fonts.extrabold
    },
    punchline: {
        textAlign: "center",
        paddingHorizontal: wp(10),
        fontSize: hp(1.7),
        color: theme.colors.text
    },
    footer: {
        gap: 30,
        width: "100%"
    },
    bottomTextContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10
    },
    loginText: {
        textAlign: "center",
        color: theme.colors.text,
        fontSize: hp(1.6)
    }
})
