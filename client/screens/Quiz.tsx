import React, {useEffect, useMemo, useRef, useState} from "react";
import { View, Text } from "../components/Themed";
import {Animated, ImageStyle, Pressable, ScrollView, StyleSheet, ViewStyle} from "react-native";
import {useQuery} from "react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {DMSans_500Medium} from "@expo-google-fonts/dm-sans";
import Colors from "../constants/Colors";

export default function Quiz() {
    const { data: myWords } = useQuery('wordbook', async () => {
        return await AsyncStorage.getItem('wordbook').then(data => {
            return data ? JSON.parse(data) : undefined
        })
    })

    // returns random element from array
    function getRandom(arr: string | any[], n: number) {
        let result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            const x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }

    // console.log(myWords.length)
    const [targetLang, setTargetLang] = useState('en');
    const [count, setCount] = useState<number>(0);
    const [totalWords, setTotalWords] = useState<number>(0);

    const wordCount = useMemo(() => {
        if (count < totalWords) {
            return count + 1;
        } else {
            return count;
        }
    }, [count, totalWords])

    function getQuizWords () {
        // filter myWords for targetLang
        let fQuizWords = myWords.filter((word:any) => word.termLang === targetLang);
        // get random quiz words array from max 10
        let n:number = fQuizWords.length < 10 ? fQuizWords.length : 10;
        fQuizWords = getRandom(fQuizWords, n);

        let allQuizWords = [];
        for (let w of fQuizWords) {
            let quizWord:{ term: any, correct: any, wrongs: any} = {
                term: undefined,
                correct: undefined,
                wrongs: undefined
            };
            let correct = w.definition; // correct answer
            let wrongs = []; // wrong answers
            let wrongsFiltered = fQuizWords.filter((x: any) => x !== w)
            let wrongObjs = getRandom(wrongsFiltered, 3); // 3 choices
            for (let obj of wrongObjs) {
                wrongs.push(obj.definition);
            }

            // set quizWord object
            quizWord["term"] = w.term;
            quizWord["correct"] = correct;
            quizWord["wrongs"] = wrongs;

            // push quizWord to quizWords
            allQuizWords.push(quizWord);
        }
        setTotalWords(allQuizWords.length);
        return allQuizWords;
    }

    const quizWords:any[] = useMemo(getQuizWords, [myWords]);
    // console.log(quizWords);

    const currentWord = useMemo(() => {
        return quizWords && quizWords[count];
    }, [quizWords, count]);
    console.log(currentWord)

    function shuffle(array: any[]) {
        let currentIndex = array.length,
            randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    const cardChoices = useMemo(() => {
        if (!finished && currentWord) {
            let wrongs = currentWord.wrongs;
            let unshuffled = [...wrongs, currentWord.correct];
            return shuffle(unshuffled);
        }
    }, [currentWord])
    console.log(cardChoices);

    const finished = useMemo<boolean>(() => {
        if (count === totalWords) {
            return true;
        } else {
            return false;
        }
    }, [count, totalWords]);

    const [score, setScore] = useState<number>(0);
    const [scoreAttempts, setScoreAttempts] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState();
    // console.log(selectedAnswer);
    const [showNext, setShowNext] = useState<boolean>(false);
    const [correct, setCorrect] = useState<boolean>();

    function submit() {
        // correct
        let correct = currentWord.correct;
        if (selectedAnswer === correct) {
            setScore(score + 1);
            setCorrect(true);
        }

        scoreAttempts < totalWords && setScoreAttempts(scoreAttempts + 1);
        setShowNext(true);
    }

    function next() {
        // increase count by one, set to new word term
        setSelectedAnswer(undefined);
        if (count < totalWords) {
            setCount(count + 1);
            console.log(count, totalWords);
        }
        setCorrect(undefined);
        setShowNext(false);
    }
    // console.log(count, totalWords, finished);

    const scoreBarWidth = useMemo<number>(() => {
        if (finished) {
            return ((score / scoreAttempts) * 100);
        } else {
            return 0;
        }
    }, [finished, score, scoreAttempts]);

    const progressWidth = useMemo(() => {
        if (count < totalWords) {
            return ((count + 1) / totalWords) * 100;
        } else if (count === totalWords) {
            return 100;
        }
    }, [count, totalWords]);

    const scoreBarAnim = useRef(new Animated.Value(0)).current

    function startNewQuiz() {
        // set all to default zero
        setCount(0);
        setScore(0);
        setScoreAttempts(0);
        // refetch quizWords
        getQuizWords();
    }

    useEffect(() => {
        Animated.timing(
            scoreBarAnim,
            {
                useNativeDriver: false,
                toValue: scoreBarWidth,
                duration: 10000
            }
        ).start();
    }, [scoreBarAnim]);

    // useEffect(() => {
    //     // if there are 10 words in wordbook,
    //     // create array quizWords, with 10 words shuffled
    //     if(myWords) {
    //         let tempWords = myWords
    //         for (let i = 0; i <= 9; i++) {
    //             let index = Math.floor(Math.random() * tempWords.length)
    //             let wordToAdd = tempWords.splice(index, 1)
    //             quizWords.push(wordToAdd[0])
    //         }
    //     }
    //     console.log(quizWords)
    //     console.log(quizWords.length)
    // }, [myWords])

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.contentContainer}>
                {finished
                ? /* If finished, show result  */
                    <>
                        <View style={styles.quizResult}>
                            <Text colorName="textDark">Quiz Result</Text>
                            <View style={styles.scoreBarContainer}>
                                <View style={[styles.scoreBar, scoreBarStyles(scoreBarWidth).css]}/>
                            </View>
                            <Text colorName="textDark" style={styles.currentWordText}>
                                Score: {score} / {scoreAttempts} ({Math.round((score / scoreAttempts) * 100)}%)
                            </Text>

                        </View>
                        <Pressable style={styles.button} onPress={startNewQuiz}>
                            <Text colorName="textWhite" style={styles.btnText}>
                                Start New Quiz
                            </Text>
                        </Pressable>
                    </>
                : /* If not finished, show current word and cardChoices */
                    <>
                    <View style={styles.wordCount}>
                        <Text colorName="textBlack">Word {wordCount} of {totalWords}</Text>
                    </View>
                    <View style={styles.progressContainer}>
                        <View style={[styles.progress, progressStyles(progressWidth).css]}/>
                    </View>
                    <View style={styles.currentWord}>
                        <Text colorName="textDark" style={styles.currentWordText}>{currentWord?.term}</Text>
                    </View>
                    {cardChoices?.map(word => {
                        if (word === currentWord.correct){
                            return (
                                <Pressable
                                    key={word}
                                    style={[styles.cardChoice, cardChoiceCorrectStyles(showNext, selectedAnswer, currentWord).css]}
                                    onPress={() => !showNext && setSelectedAnswer(word)}
                                >
                                    <Text colorName="textDark" style={styles.cardChoiceText}>{word}</Text>
                                </Pressable>
                            )
                        } else {
                            return (
                                <>
                                    <Pressable
                                        key={word}
                                        style={[styles.cardChoice, cardChoiceWrongStyles(showNext, selectedAnswer, word).css]}
                                        onPress={() => !showNext && setSelectedAnswer(word)}
                                    >
                                        <Text colorName="textDark" style={styles.cardChoiceText}>{word}</Text>
                                    </Pressable>
                                </>
                            );
                        }
                    })}
                    {showNext ? (
                        <Pressable style={styles.button} onPress={next}>
                            <Text colorName="textWhite" style={styles.btnText}>
                                Next
                            </Text>
                        </Pressable>
                    ) : (
                        <Pressable style={styles.button} onPress={submit}>
                            <Text colorName="textWhite" style={styles.btnText}>
                                Submit
                            </Text>
                        </Pressable>
                    )}
                    <Text colorName="textBlack" style={styles.scoreBottom}>{scoreAttempts > 0 && `Score: ${score} / ${scoreAttempts}`}</Text>
                    {showNext && <Text colorName="textBlack" style={resultBottomStyles(correct).css}>That's {correct ? "Correct" : "Incorrect"}</Text>}
                    </>
                }
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 16,
        paddingHorizontal: 16,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    header: {
        color: '#6366A6',
        fontSize: 20,
        fontFamily: 'DMSans_700Bold',
    },
    quizResult: {
        width: '100%',
    },
    scoreBarContainer: {
        position: "relative",
        width: "100%",
        height: 10,
        borderRadius: 25,
        marginVertical: 10,
        borderWidth: 2,
        borderColor: "#5dd8c2",
    },
    scoreBar: {
        position: "absolute",
        transition: "width 0.5s",
        top: -2,
        left: 0,
        backgroundColor: "#5dd8c2",
        height: 10,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
    },
    wordCount: {
        width: 'auto',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 13,
        fontFamily: 'DMSans_500Medium',
    },
    progressContainer: {
        position: "relative",
        width: "100%",
        height: 10,
        borderRadius: 25,
        marginVertical: 10,
        borderWidth: 2,
        borderColor: Colors.dark.tint,
    },
    progress: {
        position: "absolute",
        transition: "width 0.5s",
        top: -2,
        left: 0,
        backgroundColor: Colors.dark.tint,
        height: 10,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
    },
    currentWord: {
        marginBottom: 10,
    },
    currentWordText: {
        fontSize: 32,
        fontFamily: 'DMSans_700Bold',
    },
    cardChoice: {
        width: '100%',
        // backgroundColor: '#f2f2f2',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 20,
        color: 'rgb(0, 6, 119)',
        fontFamily: 'DMSans_500Medium',
        fontSize: 24,
    },
    cardChoiceText: {
        fontFamily: "DMSans_500Medium",
        fontSize: 24,
        textAlign: "center",
    },
    button: {
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 10,
        backgroundColor: Colors.dark.tint,
        color: 'white',
        borderRadius: 25,
        border: 'none',
    },
    btnText: {
        fontFamily: "DMSans_700Bold",
        fontSize: 15,
        textAlign: "center",
    },
    scoreBottom: {
        fontFamily: "DMSans_500Medium",
        fontSize: 17,
        marginTop: 10
    }
});

const scoreBarStyles = (scoreBarWidth: number | false) => StyleSheet.create({
    css: {
        width: `${scoreBarWidth}%`
    }
});

const progressStyles = (progressWidth: number | undefined) => StyleSheet.create({
    css: {
        width: `${progressWidth}%`
    }
});

const cardChoiceCorrectStyles = (showNext?: boolean, selectedAnswer?: string, currentWord?: {correct: string}) => StyleSheet.create({
    css: {
        backgroundColor: !showNext && selectedAnswer === currentWord?.correct
            ? "rgb(235, 236, 255)"
            : showNext
                ? "#5dd8c2"
                : "#f2f2f2"
    }
});

const cardChoiceWrongStyles = (showNext?: boolean, selectedAnswer?: string, w?: string) => StyleSheet.create({
    css: {
        backgroundColor: !showNext && selectedAnswer === w
            ? "rgb(235, 236, 255)"
            : showNext && selectedAnswer === w
                ? "red"
                : "#f2f2f2"
    }
})

const resultBottomStyles = (correct? :boolean) => StyleSheet.create({
    css: {
        color: correct
            ? "#5dd8c2"
            : "red",
        fontFamily: "DMSans_500Medium",
        fontSize: 17,
        marginTop: 10
    }
})