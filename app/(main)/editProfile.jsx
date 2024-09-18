import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native"
import React, { useEffect, useState } from "react"
import ScreenWrapper from "../../components/ScreenWrapper"
import { hp, wp } from "../../helpers/common"
import { theme } from "../../constants/theme"
import Header from "../../components/Header"
import { Image } from "expo-image"
import { useAuth } from "../../contexts/AuthContext"
import { getUserImageSource, uploadFile } from "../../services/imageService"
import Icon from "../../assets/icons"
import Input from "../../components/Input"
import Button from "../../components/Button"
import { updateUser } from "../../services/userService"
import { useRouter } from "expo-router"
import * as ImagePicker from "expo-image-picker"

const editProfile = () => {
    const { user: currentUser, setUserData } = useAuth()
    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const [user, setUser] = useState({
        name: "",
        phoneNumber: "",
        image: null,
        bio: "",
        address: ""
    })

    useEffect(() => {
        if (currentUser) {
            setUser({
                name: currentUser.name || "",
                phoneNumber: currentUser.phoneNumber || "",
                image: currentUser.image || null,
                bio: currentUser.bio || "",
                address: currentUser.address || ""
            })
        }
    }, [currentUser])

    const onSubmit = async () => {
        let userData = { ...user }
        let { name, phoneNumber, image, bio, address } = userData

        if (!name || !phoneNumber || !image || !bio || !address) {
            Alert.alert("Profile", "Please fill all the fields!")
            return
        }

      setLoading(true)
      
      if (typeof image == "object") { 
        //upload image
        let imageResponse = await uploadFile("profiles", image?.uri, true)
        if (imageResponse.success) userData.image = imageResponse.data
        else userData.image = null;
      }

        //update user
        const response = await updateUser(currentUser?.id, userData)

        setLoading(false)

        if (response.success) {
            setUserData({ ...currentUser, ...userData })
            Alert.alert("Profile", "Profile updated successfully!")
            router.back()
            return
        } else {
            Alert.alert("Profile", "There was an error updating your profile!")
            return
        }
    }

    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7
        })

        if (!result.canceled) {
            setUser({ ...user, image: result.assets[0] })
        }
    }

    let imageSource =
        user.image && typeof user.image == "object"
            ? user.image.uri
            : getUserImageSource(user.image)

    return (
        <ScreenWrapper bg="white">
            <View style={styles.container}>
                <ScrollView style={{ flex: 1 }}>
                    <Header title="Edit Profile" />

                    {/**form */}
                    <View style={styles.form}>
                        <View style={styles.avatarContainer}>
                            <Image source={imageSource} style={styles.avatar} />
                            <Pressable
                                style={styles.cameraIcon}
                                onPress={onPickImage}
                            >
                                <Icon
                                    name="camera"
                                    size={20}
                                    strokewidth={2.5}
                                />
                            </Pressable>
                        </View>

                        <Text
                            style={{
                                fontSize: hp(1.5),
                                color: theme.colors.text
                            }}
                        >
                            Please fill your profile details
                        </Text>
                        <Input
                            icon={<Icon name="user" />}
                            placeholder="Enter your name"
                            value={user.name}
                            onChangeText={value =>
                                setUser({ ...user, name: value })
                            }
                        />
                        <Input
                            icon={<Icon name="call" />}
                            placeholder="Enter your phone number"
                            value={user.phoneNumber}
                            onChangeText={value =>
                                setUser({ ...user, phoneNumber: value })
                            }
                        />
                        <Input
                            icon={<Icon name="location" />}
                            placeholder="Enter your address"
                            value={user.address}
                            onChangeText={value =>
                                setUser({ ...user, address: value })
                            }
                        />
                        <Input
                            placeholder="Enter your bio"
                            value={user.bio}
                            multiline={true}
                            containerStyle={styles.bio}
                            onChangeText={value =>
                                setUser({ ...user, bio: value })
                            }
                        />

                        <Button
                            title="Update"
                            loading={loading}
                            onPress={onSubmit}
                        />
                    </View>
                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}

export default editProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(4)
    },
    avatarContainer: {
        height: hp(14),
        width: hp(14),
        alignSelf: "center"
    },
    avatar: {
        width: "100%",
        height: "100%",
        borderRadius: theme.radius.xxl * 1.8,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: theme.colors.darkLight
    },
    cameraIcon: {
        position: "absolute",
        bottom: 0,
        right: -10,
        padding: 8,
        borderRadius: 50,
        backgroundColor: "white",
        shadowColor: theme.colors.textLight,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7
    },
    form: {
        gap: 18,
        marginTop: 20
    },
    input: {
        flexDirection: "row",
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: "continuous",
        paddingHorizontal: 20,
        padding: 17,
        gap: 15
    },
    bio: {
        flexDirection: "row",
        height: hp(15),
        alignItems: "flex-start",
        paddingVertical: 15
    }
})
