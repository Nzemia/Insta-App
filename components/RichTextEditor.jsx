import { StyleSheet, Text, View } from "react-native"
import React from "react"
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor"
import { theme } from "../constants/theme"

const RichTextEditor = ({ editorRef, onChange }) => {
    return (
        <View style={{ minHeight: 285 }}>
            {
                /**i used the rich text editor, check it out here: react-native-pell-rich-editor,
                 * also, don't forget to install the dependencies, npm i react-native-webview
                */
            }
            <RichToolbar
                actions={[
                    actions.setStrikethrough,
                    actions.setBold,
                    actions.setItalic,
                    actions.setUnderline,
                    actions.removeFormat,
                    actions.insertOrderedList,
                    actions.blockquote,
                    actions.alignLeft,
                    actions.alignRight,
                    actions.alignCenter,
                    actions.code,
                    actions.line,
                    actions.heading1,
                    actions.heading4
                ]}
                iconMap={{
                    [actions.heading1]: ({ tintColor }) => (
                        <Text style={{ color: tintColor }}>H1</Text>
                    ),
                    [actions.heading4]: ({ tintColor }) => (
                        <Text style={{ color: tintColor }}>H4</Text>
                    )
                }}
                style={styles.richBar}
                flatContainerStyle={styles.flatStyle}
                selectedIconTint={theme.colors.primaryDark}
                editor={editorRef}
                disabled={false}
            />

            <RichEditor
                ref={editorRef}
                containerStyle={styles.rich}
                editorStyle={styles.contentStyle}
                placeholder="What's on your mind today?"
                onChange={onChange}
            />
        </View>
    )
}

export default RichTextEditor

const styles = StyleSheet.create({
    richBar: {
        borderTopRightRadius: theme.radius.xl,
        borderTopLeftRadius: theme.radius.xl,
        backgroundColor: theme.colors.gray
    },
    rich: {
        minHeight: 240,
        flex: 1,
        borderTopWidth: 0,
        borderWidth: 1.5,
        borderBottomLeftRadius: theme.radius.xl,
        borderBottomRightRadius: theme.radius.xl,
        borderColor: theme.colors.gray,
        padding: 5
    },
    contentStyle: {
        colr: theme.colors.textDark,
        placeholderColor: "gray"
    },
    flatStyle: {
        paddingHorizontal: 8,
        gap: 3,
    }
})
