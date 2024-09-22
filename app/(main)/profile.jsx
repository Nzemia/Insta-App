import {
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native"
import React, { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useRouter } from "expo-router"
import Header from "../../components/Header"
import ScreenWrapper from "../../components/ScreenWrapper"
import { hp, wp } from "../../helpers/common"
import Icon from "../../assets/icons"
import { theme } from "../../constants/theme"
import { supabase } from "../../lib/supabase"
import Avatar from "../../components/Avatar"
import { fetchPosts } from "../../services/postService"
import Loading from "../../components/Loading"
import PostCard from "../../components/PostCard"

var limit = 0

const Profile = () => {
    const { user, setAuth } = useAuth()
    const router = useRouter()
    const [posts, setPosts] = useState([])

    const [hasMore, setHasMore] = useState(true)

    const onLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            Alert.alert("Sign out", "Error signing out!")
        }
    }

    const handleLogOut = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            {
                text: "Cancel",
                onPress: () => console.log("modal cancelled"),
                style: "cancel"
            },
            {
                text: "Logout",
                onPress: () => onLogout(),
                style: "destructive"
            }
        ])
    }

    const getPosts = async () => {
        //call the api
        if (!hasMore) return null
        limit = limit + 4
        let response = await fetchPosts(limit, user.id)

        if (response.success) {
            if (posts.length == response.data.length) setHasMore(false)
            setPosts(response.data)
        }
    }

    return (
        <ScreenWrapper bg="white">
            <FlatList
                data={posts}
                ListHeaderComponent={
                    <UserHeader
                        user={user}
                        router={router}
                        handleLogOut={handleLogOut}
                    />
                }
                ListHeaderComponentStyle={{marginBottom: 30}}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listStyle}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <PostCard item={item} currentUser={user} router={router} />
                )}
                //pagination
                onEndReached={() => {
                    getPosts()
                }}
                onEndReachedThreshold={0.5}
                //loading while fetching more posts
                ListFooterComponent={
                    hasMore ? (
                        <View
                            style={{
                                marginVertical: posts.length == 0 ? 200 : 30
                            }}
                        >
                            <Loading />
                        </View>
                    ) : (
                        <View style={{ marginVertical: 30 }}>
                            <Text style={styles.noPosts}>
                                No more posts to show!
                            </Text>
                        </View>
                    )
                }
            />
        </ScreenWrapper>
    )
}

const UserHeader = ({ user, router, handleLogOut }) => {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "white",
                paddingHorizontal: wp(4)
            }}
        >
            <View>
                <Header title="Profile" mb={30} />
                <TouchableOpacity
                    style={styles.logOutButton}
                    onPress={handleLogOut}
                >
                    <Icon name="logout" color={theme.colors.rose} />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <View style={{ gap: 15 }}>
                    <View style={styles.avatarContainer}>
                        <Avatar
                            uri={user?.image}
                            size={hp(12)}
                            rounded={theme.radius.xxl * 1.4}
                        />

                        <Pressable
                            style={styles.editIcon}
                            onPress={() => router.push("/editProfile")}
                        >
                            <Icon name="edit" strokewidth={2.5} size={20} />
                        </Pressable>
                    </View>

                    {/**User Name and address*/}
                    <View style={{ alignItems: "center", gap: 4 }}>
                        <Text style={styles.userName}>{user && user.name}</Text>
                        <Text style={styles.infoText}>
                            {user && user.address}
                        </Text>
                    </View>

                    {/**email, phone, bio */}
                    <View style={{ gap: 10 }}>
                        <View style={styles.info}>
                            <Icon
                                name="mail"
                                size={20}
                                color={theme.colors.textLight}
                            />
                            <Text style={styles.infoText}>
                                {user && user.email}
                            </Text>
                        </View>
                    </View>
                    {user && user.phoneNumber && (
                        <View style={{ gap: 10 }}>
                            <View style={styles.info}>
                                <Icon
                                    name="call"
                                    size={20}
                                    color={theme.colors.textLight}
                                />
                                <Text style={styles.infoText}>
                                    {user && user.phoneNumber}
                                </Text>
                            </View>
                        </View>
                    )}
                    {user && user.bio && (
                        <Text style={styles.infoText}>{user && user.bio}</Text>
                    )}
                </View>
            </View>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerContainer: {
        marginHorizontal: wp(4),
        marginBottom: 20
    },
    logOutButton: {
        position: "absolute",
        right: 0,
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: "#fee2e2"
    },
    headerShape: {
        width: wp(100),
        height: hp(20)
    },
    avatarContainer: {
        height: hp(12),
        width: hp(12),
        alignSelf: "center"
    },
    editIcon: {
        position: "absolute",
        bottom: 0,
        right: -12,
        padding: 7,
        borderRadius: 50,
        backgroundColor: "white",
        shadowColor: theme.colors.textLight,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7
    },
    userName: {
        fontSize: hp(3),
        fontWeight: "500",
        color: theme.colors.textDark
    },
    info: {
        alignItems: "center",
        gap: 10
    },
    infoText: {
        fontSize: hp(1.6),
        fontWeight: "500",
        color: theme.colors.textLight
    },
    listStyle: {
        paddingHorizontal: wp(4),
        paddingBottom: 30
    },
    noPosts: {
        fontSize: hp(2),
        textAlign: "center",
        color: theme.colors.textLight
    }
})
