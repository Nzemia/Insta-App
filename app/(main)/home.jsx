import { Pressable, StyleSheet, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import ScreenWrapper from "../../components/ScreenWrapper"
import { useAuth } from "../../contexts/AuthContext"
import { hp, wp } from "../../helpers/common"
import { theme } from "../../constants/theme"
import Icon from "../../assets/icons"
import { useRouter } from "expo-router"
import Avatar from "../../components/Avatar"
import { fetchPosts } from "../../services/postService"
import PostCard from "../../components/PostCard"
import { FlatList } from "react-native"
import Loading from "../../components/Loading"
import { supabase } from "../../lib/supabase"
import { getUserData } from "../../services/userService"

//custom global variable for fetching posts
var limit = 0

const Home = () => {
    const { user, setAuth } = useAuth()
    const router = useRouter()

    console.log("user: ", user)

    const [posts, setPosts] = useState([])

    const [hasMore, setHasMore] = useState(true)

    const handlePostEvent = async payload => {
        if (payload.event == "INSERT" && payload?.new?.id) {
            let newPost = { ...payload.new }
            let response = await getUserData(newPost?.userId)
            newPost.postLikes = []
            newPost.comments = [{ count: 0 }]

            newPost.user = response.success ? response.data : {}
            setPosts(prevPosts => [newPost, ...prevPosts])
        }
        if (payload.eventType == "DELETE" && payload.old.id) { 
            setPosts(prevPosts => {
                let updatedPosts = prevPosts.filter(post => post.id != payload.old.id)
                return updatedPosts
            })

        }
    }

    //real time updation after creating a post
    useEffect(() => {
        let postChannel = supabase
            .channel("posts")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "posts" },
                handlePostEvent
            )
            .subscribe()

        //We no longer need to call the api here since we have implemented pagination
        // getPosts()

        return () => {
            supabase.removeChannel(postChannel)
        }
    }, [])

    const getPosts = async () => {
        //call the api
        if (!hasMore) return null
        limit = limit + 5
        let response = await fetchPosts(limit)

        if (response.success) {
            if (posts.length == response.data.length) setHasMore(false)
            setPosts(response.data)
        }
    }

    return (
        <ScreenWrapper bg="white">
            <View style={styles.container}>
                {/**Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>LinkUp</Text>
                    <View style={styles.icons}>
                        <Pressable
                            onPress={() => router.push("/notifications")}
                        >
                            <Icon
                                name="heart"
                                size={hp(3.2)}
                                strokewidth={2}
                                color={theme.colors.text}
                            />
                        </Pressable>
                        <Pressable onPress={() => router.push("/newPost")}>
                            <Icon
                                name="plus"
                                size={hp(3.2)}
                                strokewidth={2}
                                color={theme.colors.text}
                            />
                        </Pressable>
                        <Pressable onPress={() => router.push("/profile")}>
                            <Avatar
                                uri={user?.image}
                                size={hp(4.3)}
                                rounded={theme.radius.sm}
                                style={{ borderWidth: 2 }}
                            />
                        </Pressable>
                    </View>
                </View>

                {/**Posts */}
                <FlatList
                    data={posts}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listStyle}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <PostCard
                            item={item}
                            currentUser={user}
                            router={router}
                        />
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
            </View>
        </ScreenWrapper>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1
        // paddingHorizontal: wp(5)
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
        marginHorizontal: wp(4)
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(3.2),
        fontWeight: theme.fonts.bold
    },
    avatarImage: {
        height: hp(4.3),
        width: hp(4.3),
        borderRadius: theme.radius.sm,
        borderCurve: "continuous",
        borderColor: theme.colors.gray,
        borderWidth: 3
    },
    icons: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 18
    },
    listStyle: {
        paddingTop: 20,
        paddingHorizontal: wp(4)
    },
    noPosts: {
        fontSize: hp(2),
        textAlign: "center",
        color: theme.colors.text
    },
    pill: {
        position: "absolute",
        right: -10,
        top: -4,
        height: hp(2.2),
        width: hp(2.2),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: theme.colors.roseLight
    },
    pillText: {
        color: "white",
        fontSize: hp(1.2),
        fontWeight: theme.fonts.bold
    }
})
