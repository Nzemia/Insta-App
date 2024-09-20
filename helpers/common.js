import { Dimensions } from "react-native"

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window")

//hp- height percentage
//wp- width percentage
export const hp = percentage => {
    return (percentage * deviceHeight) / 100
}

export const wp = percentage => {
    return (percentage * deviceWidth) / 100
}

/**to remove the html tags while sharing the post */
export const removeHtmlTags = html => {
    return html.replace(/<[^>]*>?/gm, "")
}
