import { ScrollView, StyleSheet, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { fetchNotifications } from "../../services/notificationService"
import { useAuth } from "../../contexts/AuthContext"
import { hp, wp } from "../../helpers/common"
import { theme } from "../../constants/theme"
import ScreenWrapper from "../../components/ScreenWrapper"
import { useRouter } from "expo-router"
import NotificationItem from "../../components/NotificationItem"
import Header from "../../components/Header"

const Notifications = () => {
    const [notifications, setNotifications] = useState([])
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        getNotifications()
    }, [])

    const getNotifications = async () => {
        let response = await fetchNotifications(user.id)
        if (response.success) setNotifications(response.data)
    }

    return (
      <ScreenWrapper bg="white">
        <Header title="Notifications" />
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listStyle}
                >
                    {notifications.map(item => {
                        return (
                            <NotificationItem
                                key={item?.id}
                                item={item}
                                router={router}
                            />
                        )
                    })}
                    {notifications.length == 0 && (
                        <Text style={styles.noData}>
                            No notifications to show!
                        </Text>
                    )}
                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}

export default Notifications

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(4)
    },
    listStyle: {
        paddingVertical: 20,
        gap: 10
    },
    noData: {
        fontSize: hp(1.8),
        fontWeight: theme.fonts.medium,
        color: theme.colors.textLight,
        textAlign: "center"
    }
})
