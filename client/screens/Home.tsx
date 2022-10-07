import React, {useMemo} from "react";
import { View, Text } from "../components/Themed";
import {Pressable, ScrollView, StyleSheet} from "react-native";
import {useQuery} from "react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Word} from "../App";
import WordCard from "../components/WordCard";
import {LinearGradient} from "expo-linear-gradient";
import {useNavigation} from "@react-navigation/native";
import {RootTabScreenProps} from "../types";

export default function Home({navigation}: RootTabScreenProps<'Home'>) {

    const { data: myWords } = useQuery('wordbook', async () => {
        return await AsyncStorage.getItem('wordbook').then(data => {
            return data ? JSON.parse(data) : undefined
        })
    })

    const myWordsLength = useMemo(() => {
        return myWords ? myWords.length : 0
    }, [myWords])

    const myWordsLearning = useMemo(() => {
        return myWords ? myWords.filter((word: Word) => word.status === 'Learning').length : 0
    }, [myWords])

    const myWordsMastered = useMemo(() => {
        return myWords ? myWords.filter((word: Word) => word.status === 'Mastered').length : 0
    }, [myWords])

    return (
        <ScrollView style={styles.container}>
            <Pressable onPress={() => navigation.navigate('Quiz')}>
                <LinearGradient style={styles.quizCard} colors={['(rgba(27, 159, 255, 1)', 'rgba(93, 216, 194, 1))']}>
                    <Text style={styles.quizText} colorName="textDark">Wordbook</Text>
                    <Text style={styles.quizText} colorName="textDark">Quiz</Text>
                </LinearGradient>
            </Pressable>
            <View style={styles.section}>
                <Text style={styles.title} colorName='textDark'>Recent Words</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {/* Map word cards */}
                {myWords && myWords.slice(0,5).map((word: Word) => {
                    return (
                        <View
                            style={styles.wordCard}
                            key={word.id?.toString()}
                        >
                            <WordCard word={word} />
                        </View>
                    )
                })}
                </ScrollView>
            </View>
            <View style={styles.section}>
                <Text style={styles.title} colorName='textDark'>At A Glance</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={[styles.glanceCard, {backgroundColor: '#DDDEFF'}]}>
                        <Text style={styles.glanceNumber} colorName="textDark">{myWordsLength}</Text>
                        <Text style={styles.glanceLabel} colorName="textDark">Total</Text>
                        <Text style={styles.glanceLabel} colorName="textDark">Words</Text>
                    </View>
                    <View style={[styles.glanceCard, {backgroundColor: '#9297FB'}]}>
                        <Text style={styles.glanceNumber} colorName="textWhite">{myWordsLearning}</Text>
                        <Text style={styles.glanceLabel} colorName="textWhite">Learning</Text>
                        <Text style={styles.glanceLabel} colorName="textWhite">Words</Text>
                    </View>
                    <View style={[styles.glanceCard, {backgroundColor: '#6366A6'}]}>
                        <Text style={styles.glanceNumber} colorName="textWhite">{myWordsMastered}</Text>
                        <Text style={styles.glanceLabel} colorName="textWhite">Mastered</Text>
                        <Text style={styles.glanceLabel} colorName="textWhite">Words</Text>
                    </View>
                </ScrollView>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 16,
    },
    section: {
        marginTop: 24,
        flexDirection: 'column',
    },
    title: {
        fontSize: 20,
        fontFamily: 'DMSans_700Bold',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    quizCard: {
        height: 170,
        width: 'auto',
        borderRadius: 15,
        padding: 16,
        justifyContent: 'flex-end',
        marginHorizontal: 16,
    },
    quizText: {
        fontSize: 32,
        fontFamily: 'DMSans_700Bold'
    },
    wordCard: {
        height: 150,
        width: 250,
        paddingHorizontal: 16,
        display: 'flex',
        justifyContent: 'space-around',
        borderColor: '#E5E5E5',
        borderWidth: 1,
        borderRadius: 15,
        marginLeft: 16,
    },
    glanceCard: {
        height: 170,
        width: 150,
        borderRadius: 15,
        padding: 16,
        justifyContent: 'flex-end',
        marginLeft: 16
    },
    glanceNumber: {
        fontSize: 48,
        fontFamily: 'DMSans_700Bold',
    },
    glanceLabel: {
        fontSize: 20,
        fontFamily: 'DMSans_500Medium',
    }
});