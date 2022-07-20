import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Keyboard, Modal, Pressable, StyleSheet, Switch, TextInput, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { GlobalContext, GlobalContextInterface, Word } from "../App";
import { View, Text } from "../components/Themed";
import Colors from "../constants/Colors";
import useCreateWord from "../hooks/useCreateWord";
import useWordbook from "../hooks/useCreateWord";
import translate from "../utils/gTranslate";
import Dictionary from "./Dictionary";

export interface WordStateProps {
    term: string;
    definition: string;
    isSaved: boolean;
    termLang: targetEnum;
}

export enum targetEnum {
    en = 'en',
    ko = 'ko'
}

interface TranslateProps {
    isTranslate: boolean;
    target: targetEnum.en | targetEnum.ko;
}

export default function AddWord() {
    const navigation = useNavigation()

    const [word, setWord] = React.useState<WordStateProps>({
        term: '',
        definition: '',
        isSaved: false,
        termLang: targetEnum.en
    })

    const {
        term,
        definition,
        isSaved
    } = word

    const [translateState, setTranslate] = React.useState<TranslateProps>({
        isTranslate: false,
        target: targetEnum.ko,
    })

    const {
        isTranslate,
        target,
    } = translateState

    // myWords array, createEntry mutation to localStorage
    const { createEntry } = useCreateWord(word, setWord)

    const { mutateAsync: translateTerm } = useMutation(() => translate(term, target),
        {
            onError: (error) => {
                console.error(error)
            },
            onSuccess: (translated) => {
                console.log(translated)
                setWord(prev => ({ ...prev, definition: translated }))
            }
        }
    )

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={styles.translateGroup}>
                    <View style={styles.switch}>
                        <Text style={styles.label} colorName='textGrey'>TRANSLATE MODE</Text>
                        <Switch
                            value={isTranslate}
                            onValueChange={(value) => setTranslate(prev => ({ ...prev, isTranslate: value }))}
                            thumbColor='#fff'
                            //@ts-expect-error type 
                            activeThumbColor='#fff'
                            trackColor={{ false: '#DDDEFD', true: '#8085E7' }}
                            style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }], marginTop: 8 }}
                        />
                    </View>
                    {isTranslate &&
                        <View style={styles.swap}>
                            <View style={styles.swapLabelContainer}>
                                <Text style={styles.swapLabel} colorName="textDark">{target === targetEnum.ko ? 'English' : 'Korean'}</Text>
                            </View>
                            <Pressable
                                style={({ pressed }) => [styles.swapBtn, { opacity: pressed ? 0.7 : 1 }]}
                                onPress={() => setTranslate(prev => ({ ...prev, target: target === targetEnum.en ? targetEnum.ko : targetEnum.en }))}
                            >
                                <MaterialCommunityIcons name="swap-horizontal-circle" size={32} color="#8085E7" />
                            </Pressable>
                            <View style={styles.swapLabelContainer}>
                                <Text style={styles.swapLabel} colorName="textDark">{target === targetEnum.ko ? 'Korean' : 'English'}</Text>
                            </View>
                        </View>
                    }
                </View>

                <View style={styles.group}>
                    <Text style={styles.label} colorName='textGrey'>TERM</Text>
                    <TextInput
                        style={styles.input}
                        selectionColor={Colors['light']['tint']}
                        value={term}
                        onChangeText={(newText) => setWord(prev => ({ ...prev, term: newText }))}
                    />
                </View>

                {isTranslate &&
                    <View style={{ flexDirection: 'row' }}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.btnTranslate,
                                {
                                    backgroundColor: pressed ? Colors['dark']['lightPurple'] : '#fff',
                                    borderColor: pressed ? Colors['dark']['lightPurple'] : Colors['light']['tint'],
                                    marginRight: 8
                                }
                            ]}
                            onPress={() => translateTerm()}
                        >
                            <Text colorName="tint" style={styles.btnText}>Translate</Text>
                        </Pressable>
                        <Pressable style={[styles.btnTranslate, { backgroundColor: '#000677', borderColor: '#000677', marginLeft: 8 }]}
                            onPress={() => navigation.navigate('Dictionary', { term })}
                        >
                            <Text colorName="textWhite" style={styles.btnText}>
                                View in Dictionary
                            </Text>
                        </Pressable>
                    </View>
                }

                <View style={styles.group}>
                    <Text style={styles.label} colorName='textGrey'>DEFINITION</Text>
                    <TextInput
                        style={styles.input}
                        selectionColor={Colors['light']['tint']}
                        value={definition}
                        onChangeText={(newText) => setWord(prev => ({ ...prev, definition: newText }))}
                    />
                </View>

                <Pressable
                    style={({ pressed }) => [styles.btnSave, { opacity: pressed ? 0.7 : 1 }]}
                    onPress={() => createEntry()}
                >
                    <Text colorName="textWhite" style={styles.btnText}>Save</Text>
                </Pressable>

                {isSaved &&
                    <View style={styles.savedContainer}>
                        <Text colorName="textWhite" style={styles.label}>
                            Saved to Wordbook
                        </Text>
                    </View>
                }
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        position: 'relative'
    },
    group: {
        display: 'flex',
        marginTop: 16
    },
    label: {
        fontSize: 12,
        fontFamily: 'DMSans_700Bold'
    },
    translateGroup: {
        display: 'flex',
    },
    switch: {
        alignItems: 'flex-end'
    },
    swap: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16
    },
    swapLabelContainer: {
        backgroundColor: Colors['dark']['lightPurple'],
        borderRadius: 15,
        paddingVertical: 8,
        width: 75,
        alignItems: 'center',
    },
    swapLabel: {
        fontSize: 14,
        fontFamily: 'DMSans_700Bold',
    },
    swapBtn: {
        marginHorizontal: 16
    },
    input: {
        fontSize: 15,
        fontFamily: 'DMSans_700Bold',
        backgroundColor: '#F2F2F2',
        borderColor: '#E5E5E5',
        borderWidth: 1,
        borderRadius: 50,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginTop: 8,
    },
    btnTranslate: {
        flex: 1,
        borderWidth: 2,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        marginTop: 16,
    },
    btnSave: {
        backgroundColor: Colors['light']['tint'],
        borderColor: Colors['light']['tint'],
        borderWidth: 2,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        marginTop: 24
    },
    btnText: {
        fontSize: 15,
        fontFamily: 'DMSans_700Bold',
    },
    savedContainer: {
        marginTop: 24,
        alignSelf: 'center',
        backgroundColor: '#1BA0FF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        shadowColor: "#1BA0FF",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    }
})