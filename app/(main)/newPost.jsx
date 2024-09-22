import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native"
import React, { useEffect, useRef, useState } from "react"
import ScreenWrapper from "../../components/ScreenWrapper"
import Header from "../../components/Header"
import { hp, wp } from "../../helpers/common"
import { theme } from "../../constants/theme"
import Avatar from "../../components/Avatar"
import { useAuth } from "../../contexts/AuthContext"
import RichTextEditor from "../../components/RichTextEditor"
import { useLocalSearchParams, useRouter } from "expo-router"
import Icon from "../../assets/icons"
import Button from "../../components/Button"
import * as ImagePicker from "expo-image-picker"
import { getSupabaseFileUrl } from "../../services/imageService"
import { Video } from "expo-av"
import { createOrUpdatePost } from "../../services/postService"

const NewPost = () => {
    const post = useLocalSearchParams()
    const { user } = useAuth()
    const bodyRef = useRef("")
    const editorRef = useRef(null)
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(file)

    useEffect(() => {
        if (post && post.id) {
            bodyRef.current = post.body
            setFile(post.file || null)
            setTimeout(() => {
                editorRef.current?.setContentHTML(post.body)
            }, 300)
        }
    }, [])

    const onPick = async isImage => {
        let mediaConfig = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7
        }

        if (!isImage) {
            mediaConfig = {
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true
            }
        }
        let result = await ImagePicker.launchImageLibraryAsync(mediaConfig)

        // console.log("files", result.assets[0])
        if (!result.canceled) {
            setFile(result.assets[0])
        }
    }

    const isLocalFile = file => {
        if (!file) return null
        if (typeof file == "object") return true
        return false
    }

    const getFileType = file => {
        if (!file) return null
        if (isLocalFile(file)) {
            return file.type
        }

        //check image or video for remote files
        if (file.includes("postImages")) {
            return "image"
        }
        return "video"
    }

    const getFileUri = file => {
        if (!file) return null
        if (isLocalFile(file)) {
            return file.uri
        }
        return getSupabaseFileUrl(file)?.uri
    }

    const onSubmit = async () => {
        if (!bodyRef.current && !file) {
            Alert.alert("Post", "Please choose an image or add a post text")
            return
        }
        let data = {
            file,
            body: bodyRef.current,
            userId: user?.id
        }

        if(post && post.id) data.id = post.id

        // create a post
        setLoading(true)
        let response = await createOrUpdatePost(data)
        setLoading(false)

        if (response.success) {
            setFile(null)
            bodyRef.current = ""
            editorRef.current?.setContentHTML("")
            router.back()
        } else {
            Alert.alert("Post", "There was an error creating your post!")
            return
        }

        // console.log("body", bodyRef.current)
        // console.log("file", file)
    }

    // console.log("file uri", getFileUri(file))

    return (
        <ScreenWrapper bg="white">
            <View style={styles.container}>
                <Header title="Create Post" />
                <ScrollView contentContainerStyle={{ gap: 20 }}>
                    {/**Avatar */}
                    <View style={styles.header}>
                        <Avatar
                            uri={user?.image}
                            size={hp(6.5)}
                            rounded={theme.radius.xl}
                        />
                        <View style={{ gap: 2 }}>
                            <Text style={styles.userName}>
                                {user && user.name}
                            </Text>
                            <Text style={styles.publicText}>Public</Text>
                        </View>
                    </View>

                    <View style={styles.textEditor}>
                        <RichTextEditor
                            editorRef={editorRef}
                            onChange={body => (bodyRef.current = body)}
                        />
                    </View>

                    {file && (
                        <View style={styles.file}>
                            {/**for videos, you must install a library called expo av, npx expo install expo-av */}

                            {getFileType(file) == "video" ? (
                                <Video
                                    style={{ flex: 1 }}
                                    source={{ uri: getFileUri(file) }}
                                    resizeMode="cover"
                                    useNativeControls
                                    isLooping
                                />
                            ) : (
                                <Image
                                    source={{ uri: getFileUri(file) }}
                                    resizeMode="cover"
                                    style={{ flex: 1 }}
                                />
                            )}

                            {/**Delete a file*/}
                            <Pressable
                                style={styles.closeIcon}
                                onPress={() => setFile(null)}
                            >
                                <Icon name="delete" size={25} color="red" />
                            </Pressable>
                        </View>
                    )}

                    <View style={styles.media}>
                        <Text style={styles.addImageText}>
                            Add to your post
                        </Text>
                        <View style={styles.mediaIcons}>
                            <TouchableOpacity onPress={() => onPick(true)}>
                                <Icon
                                    name="image"
                                    size={30}
                                    color={theme.colors.dark}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onPick(false)}>
                                <Icon
                                    name="video"
                                    size={33}
                                    color={theme.colors.dark}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                {/** Submit Post */}
                <Button
                    title={post && post.id ? "Update" : "Post"}
                    buttonStyle={{ height: hp(6.2) }}
                    loading={loading}
                    hasShadow={false}
                    onPress={onSubmit}
                />
            </View>
        </ScreenWrapper>
    )
}

export default NewPost

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 30,
        paddingHorizontal: wp(4),
        gap: 15
    },
    title: {
        fontSize: hp(2.5),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text,
        textAlign: "center"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    userName: {
        fontSize: hp(2.2),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text
    },
    avatar: {
        height: hp(6.5),
        width: hp(6.5),
        borderRadius: theme.radius.xl,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1"
    },
    publicText: {
        fontSize: hp(1.8),
        fontWeight: theme.fonts.medium,
        color: theme.colors.textLight
    },
    media: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1.5,
        padding: 12,
        paddingHorizontal: 18,
        borderRadius: theme.radius.xl,
        borderCurve: "continuous",
        borderColor: theme.colors.gray
    },
    mediaIcons: {
        flexDirection: "row",
        gap: 5,
        alignItems: "center"
    },
    addImageText: {
        fontSize: hp(1.9),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text
    },
    imageIcon: {
        borderRadius: theme.radius.md
    },
    file: {
        height: hp(30),
        width: "100%",
        borderRadius: theme.radius.xl,
        overflow: "hidden",
        borderCurve: "continuous"
    },
    video: {},
    closeIcon: {
        position: "absolute",
        top: 10,
        right: 10
    }
})
