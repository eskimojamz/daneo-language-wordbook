import React from "react"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View, TextInput, Pressable } from "react-native"
import { Text } from "../components/Themed"
import Colors from "../constants/Colors"
import useEditWord from "../hooks/useEditWord"

export type Param = {
    EditWord: {
        id: string | number[],
        term: string,
        termLang: string,
        definition: string,
        status: string,
        isSaved: boolean,
        dateAdded: number
    }
}

export default function EditWord() {
    const navigation = useNavigation()
    const route = useRoute<RouteProp<Param, 'EditWord'>>()

    const [word, setWord] = React.useState<Param['EditWord']>({
        id: route.params.id,
        term: route.params.term,
        termLang: route.params.termLang,
        definition: route.params.definition,
        status: route.params.status,
        isSaved: false,
        dateAdded: route.params.dateAdded
    })

    const {
        term,
        definition,
        status,
        isSaved
    } = word

    const { editEntry } = useEditWord(word, setWord)

    React.useEffect(() => {
        isSaved && navigation.navigate('Wordbook')
    }, [isSaved])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={styles.group}>
                    <Text style={styles.label} colorName='textGrey'>TERM</Text>
                    <TextInput
                        style={styles.input}
                        selectionColor={Colors['light']['tint']}
                        value={term}
                        onChangeText={(newText) => setWord(prev => ({ ...prev, term: newText }))}
                    />
                </View>
                <View style={styles.group}>
                    <Text style={styles.label} colorName='textGrey'>DEFINITION</Text>
                    <TextInput
                        style={styles.input}
                        selectionColor={Colors['light']['tint']}
                        value={definition}
                        onChangeText={(newText) => setWord(prev => ({ ...prev, definition: newText }))}
                    />
                </View>
                <View style={styles.group}>
                    <Text style={styles.label} colorName='textGrey'>STATUS</Text>
                    <View style={styles.status}>
                        <Pressable
                            style={[styles.statusPill, { backgroundColor: status === 'Learning' ? '#EBECFF' : '#F2F2F2', marginRight: 8 }]}
                            onPress={() => setWord(prev => ({ ...prev, status: status === 'Learning' ? 'Mastered' : 'Learning' }))}
                        >
                            <Text style={styles.statusText} colorName={status === 'Learning' ? 'textDark' : 'textGrey'}>Learning</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.statusPill, { backgroundColor: status === 'Mastered' ? '#5DD8C2' : '#F2F2F2', marginRight: 8 }]}
                            onPress={() => setWord(prev => ({ ...prev, status: status === 'Learning' ? 'Mastered' : 'Learning' }))}
                        >
                            <Text style={styles.statusText} colorName={status === 'Learning' ? 'textGrey' : 'textDark'}>Mastered</Text>
                        </Pressable>
                    </View>
                </View>
                <Pressable
                    style={({ pressed }) => [styles.btnSave, { opacity: pressed ? 0.7 : 1 }]}
                    onPress={() => editEntry()}
                >
                    <Text colorName="textWhite" style={styles.btnText}>Save</Text>
                </Pressable>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        position: 'relative',
        backgroundColor: '#fff'
    },
    group: {
        display: 'flex',
        marginTop: 16
    },
    label: {
        fontSize: 12,
        fontFamily: 'DMSans_700Bold'
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
    btnSave: {
        backgroundColor: Colors['light']['tint'],
        borderColor: Colors['light']['tint'],
        borderWidth: 2,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        marginTop: 32
    },
    btnText: {
        fontSize: 15,
        fontFamily: 'DMSans_700Bold',
    },
    status: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8
    },
    statusPill: {
        flex: 1,
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    statusLearning: {
        backgroundColor: '#8085E7'
    },
    statusMastered: {
        flex: 1,
        backgroundColor: '#5DD8C2',
        borderRadius: 15
    },
    statusText: {
        fontSize: 13,
        fontFamily: 'DMSans_500Medium',
        textAlign: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
    }
})