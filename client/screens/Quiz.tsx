import React, {useEffect} from "react";
import { View, Text } from "../components/Themed";
import {ScrollView, StyleSheet} from "react-native";
import {useQuery} from "react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Quiz() {
    const { data: myWords } = useQuery('wordbook', async () => {
        return await AsyncStorage.getItem('wordbook').then(data => {
            return data ? JSON.parse(data) : undefined
        })
    })

    console.log(myWords.length)

    const quizWords: any[] = []

    useEffect(() => {
        // if there are 10 words in wordbook,
        // create array quizWords, with 10 words shuffled
        if(myWords) {
            let tempWords = myWords
            for (let i = 0; i <= 9; i++) {
                let index = Math.floor(Math.random() * tempWords.length)
                let wordToAdd = tempWords.splice(index, 1)
                quizWords.push(wordToAdd[0])
            }
        }
        console.log(quizWords)
        console.log(quizWords.length)
    }, [myWords])

    return (
        <ScrollView style={styles.container}>
            <View>
                <Text style={styles.header} colorName="textDark">Word of</Text>
            </View>
            <View style={styles.word}>
                <Text style={styles.wordText} colorName="textDark">word</Text>
            </View>
            {/*<View style={styles.result}>*/}
            {/*    <Text style={styles.resultText} colorName="textDark">Result</Text>*/}
            {/*</View>*/}
            {/*<View style={styles.choices}>*/}

            {/*</View>*/}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 16,
        paddingHorizontal: 16,
    },
    header: {
        color: '#6366A6',
        fontSize: 20,
        fontFamily: 'DMSans_700Bold',
    },
    word: {
        width: 'auto',
        height: 'auto',
        paddingVertical: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EBECFF',
        borderRadius: 15,
        marginTop: 16,
    },
    wordText: {
        fontSize: 48,
        fontFamily: 'DMSans_700Bold',
    }
});