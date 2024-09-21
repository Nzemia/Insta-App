import { supabase } from "../lib/supabase"
import { uploadFile } from "./imageService"

export const createOrUpdatePost = async post => {
    try {
        //upload image
        if (post.file && typeof post.file == "object") {
            let isImage = post?.file?.type == "image"
            let folderName = isImage ? "postImages" : "postVideos"
            let fileResult = await uploadFile(
                folderName,
                post?.file?.uri,
                isImage
            )

            if (fileResult.success) post.file = fileResult.data
            else {
                return fileResult
            }
        }

        const { data, error } = await supabase
            .from("posts")
            .upsert(post)
            .select()
            .single()

        if (error) {
            console.log("Create post error", error)
            return { success: false, msg: "Error creating post" }
        }

        return { success: true, data: data }
    } catch (error) {
        console.log("Create post error", error)
        return { success: false, msg: "Error creating post" }
    }
}

export const fetchPosts = async (limit = 10) => {
    try {
        const { data, error } = await supabase
            .from("posts")
            .select(
                `*, user:users(id, name, image), postLikes(*), comments (count)`
            )
            .order("created_at", { ascending: false })
            .limit(limit)

        if (error) {
            console.log("Fetch post error", error)
            return { success: false, msg: "Error fetching posts" }
        }

        return { success: true, data: data }
    } catch (error) {
        console.log("Fetch post error", error)
        return { success: false, msg: "Error fetching posts" }
    }
}

export const createPostLike = async postLike => {
    try {
        const { data, error } = await supabase
            .from("postLikes")
            .insert(postLike)
            .select()
            .single()

        if (error) {
            console.log("Post like error", error)
            return { success: false, msg: "Could not like post" }
        }

        return { success: true, data: data }
    } catch (error) {
        console.log("Post like error", error)
        return { success: false, msg: "Could not like post" }
    }
}

export const removePostLike = async (postId, userId) => {
    try {
        const { data, error } = await supabase
            .from("postLikes")
            .delete()
            .eq("userId", userId)
            .eq("postId", postId)

        if (error) {
            console.log("Post remove error", error)
            return { success: false, msg: "Could not remove post" }
        }

        return { success: true }
    } catch (error) {
        console.log("Post remove error", error)
        return { success: false, msg: "Could not remove post" }
    }
}

export const fetchPostDetails = async postId => {
    try {
        const { data, error } = await supabase
            .from("posts")
            .select(
                `*, user:users(id, name, image), postLikes(*), comments(*, user:users(id, name, image))`
            )
            .eq("id", postId)
            .order("created_at", { ascending: false, foreignTable: "comments" })
            .single()

        if (error) {
            console.log("Fetch post details error", error)
            return { success: false, msg: "Error fetching post details" }
        }

        return { success: true, data: data }
    } catch (error) {
        console.log("Fetch post details error", error)
        return { success: false, msg: "Error fetching post details" }
    }
}

export const createComment = async comment => {
    try {
        const { data, error } = await supabase
            .from("comments")
            .insert(comment)
            .select()
            .single()

        if (error) {
            console.log("Comment like error", error)
            return { success: false, msg: "Could not create comment" }
        }

        return { success: true, data: data }
    } catch (error) {
        console.log("Comment error", error)
        return { success: false, msg: "Could not create comment" }
    }
}

export const deleteComment = async commentId => {
    try {
        const { error } = await supabase
            .from("comments")
            .delete()
            .eq("id", commentId)

        if (error) {
            console.log("Comment delete error", error)
            return { success: false, msg: "Could not delete comment" }
        }

        return { success: true, data: { commentId } }
    } catch (error) {
        console.log("Comment delete error", error)
        return { success: false, msg: "Could not delete comment" }
    }
}
