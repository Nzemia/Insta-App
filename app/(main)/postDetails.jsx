import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native"
import React, { useEffect, useRef, useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"
import {
    createComment,
    deleteComment,
    fetchPostDetails,
    removePost
} from "../../services/postService"
import { hp, wp } from "../../helpers/common"
import { theme } from "../../constants/theme"
import PostCard from "../../components/PostCard"
import { useAuth } from "../../contexts/AuthContext"
import Loading from "../../components/Loading"
import Icon from "../../assets/icons"
import Input from "../../components/Input"
import CommentItem from "../../components/CommentItem"
import { supabase } from "../../lib/supabase"
import { getUserData } from "../../services/userService"
import { createNotification } from "../../services/notificationService"

const PostDetails = () => {
    const { postId, commentId } = useLocalSearchParams()

    const [post, setPost] = useState(null)

    const { user } = useAuth()

    const router = useRouter()

    const [startLoading, setStartLoading] = useState(true)

    const inputRef = useRef(null)

    const commentRef = useRef("")

    const [loading, setLoading] = useState(false)

    // useEffect(() => {
    //     getPostDetails()
    // }, [])

    const handleNewComment = async payload => {
        console.log("Got new comment: ", payload.new)
        if (payload.new) {
            let newComment = { ...payload.new }
            let res = await getUserData(newComment.userId)
            newComment.user = res.success ? res.data : {}

            setPost(prevPost => {
                return {
                    ...prevPost,
                    comments: [newComment, ...prevPost.comments]
                }
            })
        }
    }

    //real time updation after deleting a post
    useEffect(() => {
        let commentChannel = supabase
            .channel("comments")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "comments",
                    filter: `postId=eq.${postId}`
                },
                handleNewComment
            )
            .subscribe()

        getPostDetails()

        return () => {
            supabase.removeChannel(commentChannel)
        }
    }, [])

    const getPostDetails = async () => {
        //get posts details here
        let response = await fetchPostDetails(postId)

        if (response.success) setPost(response.data)

        setStartLoading(false)
    }

    if (startLoading)
        return (
            <View style={styles.center}>
                <Loading />
            </View>
        )

    if (!post) {
        return (
            <View
                style={[
                    styles.center,
                    { justifyContent: "flex-start", marginTop: 100 }
                ]}
            >
                <Text style={styles.notFound}>Post not found!</Text>
            </View>
        )
    }

    const onNewCommentSend = async () => {
        if (!commentRef.current) return null
        let data = {
            userId: user?.id,
            postId: post?.id,
            text: commentRef.current
        }
        //saving comment
        setLoading(true)
        let response = await createComment(data)
        setLoading(false)

        if (response.success) {
            //send notification
            if (user.id != post.userId) {
                let notify = {
                    senderId: user.id,
                    receiverId: post.userId,
                    title: "Commented on your post",
                    data: JSON.stringify({
                        postId: post.id,
                        commentId: response?.data?.id
                    })
                }
                createNotification(notify)
            }

            inputRef?.current?.clear()
            commentRef.current = ""
        } else {
            Alert.alert("Comment", response.msg)
        }
    }

    const onDeleteComment = async comment => {
        let response = await deleteComment(comment?.id)
        if (response.success) {
            setPost(prevPost => {
                let updatedPost = { ...prevPost }
                updatedPost.comments = updatedPost.comments.filter(
                    comment => comment.id != comment.id
                )
                return updatedPost
            })
        } else {
            Alert.alert("Comment", response.msg)
        }
    }

    const onDeletePost = async item => {
        let response = await removePost(post.id)

        if (response.success) {
            router.back()
        } else {
            Alert.alert("Post", response.msg)
        }
    }

    const onEditPost = async item => {
        router.back()
        router.push({ pathname: "newPost", params: { ...item } })
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
            >
                <PostCard
                    item={{
                        ...post,
                        comments: [{ count: post?.comments?.length }]
                    }}
                    currentUser={user}
                    router={router}
                    hasShadow={false}
                    showMoreIcon={false}
                    showDelete={true}
                    onDelete={onDeletePost}
                    onEdit={onEditPost}
                />

                {/**comment input */}
                <View style={styles.inputContainer}>
                    <Input
                        inputRef={inputRef}
                        onChangeText={value => (commentRef.current = value)}
                        placeholder="Add a comment..."
                        placeholderTextColor={theme.colors.textLight}
                        containerStyle={{
                            flex: 1,
                            height: hp(6.2),
                            borderRadius: theme.radius.xl
                        }}
                    />
                    {loading ? (
                        <View style={styles.loading}>
                            <Loading size="small" />
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.sendIcon}
                            onPress={onNewCommentSend}
                        >
                            <Icon
                                name="send"
                                color={theme.colors.primaryDark}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/** displaying the comments */}
                <View style={{ marginVertical: 15, gap: 17 }}>
                    {post?.comments?.map(comment => (
                        <CommentItem
                            key={comment?.id?.toString()}
                            item={comment}
                            highlight={commentId == commentId}
                            canDelete={
                                user.id == comment.userId ||
                                user.id == post.userId
                            }
                            onDelete={onDeleteComment}
                        />
                    ))}

                    {post?.comments?.length == 0 && (
                        <Text
                            style={{ color: theme.colors.text, marginLeft: 5 }}
                        >
                            Be first to comment!
                        </Text>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}

export default PostDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingVertical: wp(7)
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    list: {
        paddingHorizontal: wp(4)
    },
    sendIcon: {
        width: hp(5.8),
        height: hp(5.8),
        borderCurve: "continuous",
        borderRadius: theme.radius.lg,
        borderColor: theme.colors.primary
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    notFound: {
        fontSize: hp(2.5),
        color: theme.colors.text,
        fontWeight: theme.fonts.medium
    },
    loading: {
        height: hp(5.8),
        width: hp(5.8),
        justifyContent: "center",
        alignItems: "center",
        transform: [{ scale: 1.3 }]
    }
})
