import {
    Alert,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, { useRef, useState } from "react"
import ScreenWrapper from "../components/ScreenWrapper"
import BackButton from "../components/BackButton"
import { useRouter } from "expo-router"
import { hp, wp } from "../helpers/common"
import { theme } from "../constants/theme"
import Input from "../components/Input"
import Icon from "../assets/icons"
import Button from "../components/Button"

const SignUp = () => {
    const router = useRouter()

    const nameRef = useRef("")
    const emailRef = useRef("")
    const passwordRef = useRef("")
    const [loading, setLoading] = useState(false)

    const onSubmit = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert("Sign Up", "Please fill all the fields")
            return
        }
    }

    return (
        <ScreenWrapper bg="white">
            {/**For the icons i used  HugeIcons site*/}
            <StatusBar style="dark" />
            <View style={styles.container}>
                <BackButton router={router} />

                {/**Welcome Text */}
                <View>
                    <Text style={styles.welcomeText}>Let's</Text>
                    <Text style={styles.welcomeText}>Get Started!</Text>
                </View>
            </View>

            {/**Form */}
            <View style={styles.form}>
                <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
                    Please fill the details to create an account
                </Text>
                <Input
                    icon={<Icon name="user" size={26} strokewidth={1.6} />}
                    placeholder="Enter your Name"
                    onChangeText={value => (nameRef.current = value)}
                />
                <Input
                    icon={<Icon name="mail" size={26} strokewidth={1.6} />}
                    placeholder="Enter your Email"
                    onChangeText={value => (emailRef.current = value)}
                />
                <Input
                    icon={<Icon name="lock" size={26} strokewidth={1.6} />}
                    placeholder="Enter your Password"
                    secureTextEntry
                    onChangeText={value => (passwordRef.current = value)}
                />

                {/**Button */}
                <Button title="Sign Up" loading={loading} onPress={onSubmit} />
            </View>

            {/**Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <Pressable>
                    <Text
                        style={[
                            styles.footerText,
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
        </ScreenWrapper>
    )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5)
    },
    welcomeText: {
        fontSize: hp(4),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text
    },
    form: {
        gap: 25
    },
    forgotPassword: {
        textAlign: "right",
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5
    },
    footerText: {
        textAlign: "center",
        color: theme.colors.textLight,
        fontSize: hp(1.6)
    }
})
