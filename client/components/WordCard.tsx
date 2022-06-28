import {Word} from "../App";
import React, {useState} from "react";
import {Text, View} from "./Themed";
import {Pressable, StyleSheet} from "react-native";
import * as Haptics from "expo-haptics";
import {LinearGradient} from "expo-linear-gradient";

export default function WordCard({word, showActions}: {word: Word, showActions?: any}) {
    const [showWord, setShowWord] = useState<boolean>(false);

    return (
        <View style={styles.wordCardContainer}>
            <View style={styles.wordCardMain}>
                <View style={styles.wordCardTop}>
                    <Text style={styles.wordCardLabel} colorName='textGrey'>TERM</Text>
                    <Text style={styles.wordCardTerm} colorName='textDark'>{word.term}</Text>
                </View>
                <Pressable
                    onPress={() => setShowWord(!showWord)}
                    onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).then(() => showActions(word))}
                >
                    <Text style={styles.wordCardLabel} colorName='textGrey'>DEFINITION</Text>
                    {showWord
                        ? <Text style={styles.wordCardTerm} colorName='textTint'>{word.definition}</Text>

                        : (
                            <View style={styles.wordCardBars}>
                                <LinearGradient style={[styles.wordCardBar, { marginBottom: 4 }]} colors={['rgba(169, 170, 201, 1)', 'rgba(169, 170, 201, 0.65)']}/>
                                <LinearGradient style={styles.wordCardBar} colors={['rgba(169, 170, 201, 1)', 'rgba(169, 170, 201, 0.65)']}/>
                            </View>
                        )
                    }
                </Pressable>
            </View>
            <View style={[styles.wordCardBottom, { backgroundColor: word.status === 'Learning' ? '#EBECFF' : '#5DD8C2' }]}>
                <Text style={styles.wordCardStatus} colorName='textDark'>{word.status}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wordCardContainer: {
        paddingVertical: 16,
    },
    wordCardMain: {
        display: 'flex',
        gap: 4
    },
    wordCardTop: {
        marginBottom: 4
    },
    wordCardLabel: {
        fontSize: 12,
        fontFamily: 'DMSans_700Bold',
        marginBottom: 0
    },
    wordCardTerm: {
        fontSize: 24,
        fontFamily: 'DMSans_700Bold'
    },
    wordCardBars: {
        marginTop: 4,
        flexDirection: 'column',
    },
    wordCardBar: {
        height: 6,
        width: 100,
        borderRadius: 15,
    },
    wordCardBottom: {
        alignSelf: 'flex-end',
        borderRadius: 15
    },
    wordCardStatus: {
        fontSize: 13,
        fontFamily: 'DMSans_500Medium',
        textAlign: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
    }
});