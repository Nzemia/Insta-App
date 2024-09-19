import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import React from "react"
import { theme } from "../constants/theme"
import Avatar from "./Avatar"
import { hp } from "../helpers/common"
import moment from "moment"
import Icon from "../assets/icons"
import RenderHtml from "react-native-render-html"

const PostCard = ({ item, currentUser, router, hasShadow = true }) => {
    const shadowStyles = {
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3
    }

    const createdAt = moment(item?.created_at).format("MMM D")

    const openDetails = () => {}

    return (
        <View style={[styles.container, hasShadow && shadowStyles]}>
            <View style={styles.header}>
                {/**user info and post time */}
                <View style={styles.userInfo}>
                    <Avatar
                        size={hp(4.5)}
                        uri={item?.user?.image}
                        rounded={theme.radius.md}
                    />

                    <View style={{ gap: 2 }}>
                        <Text style={styles.userName}>{item?.user?.name}</Text>
                        {/**for the time, i used the library npm i moment for formatting the date */}
                        <Text style={styles.postTime}>{createdAt}</Text>
                    </View>

                    {/**the 3 dots */}
                    <TouchableOpacity onPress={openDetails}>
                        <Icon
                            name="threeDotsHorizontal"
                            size={hp(3.4)}
                            strokeWidth={3}
                            color={theme.colors.text}
                        />
                    </TouchableOpacity>
                </View>

                {/**Post body and media */}
                {/**for converting the html tags to text, i used the library npm i react-native-render-html */}
                <View style={styles.content}>
                    <View style={styles.postBody}>
                        <Text>{item?.body}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default PostCard

const styles = StyleSheet.create({
    container: {
        gap: 10,
        marginBottom: 15,
        borderRadius: theme.radius.xxl * 1.1,
        borderCurve: "continuous",
        padding: 10,
        paddingVertical: 12,
        backgroundColor: "white",
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: "#000"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    userInfo: {}
})
