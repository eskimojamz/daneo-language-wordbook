import React from "react"
import { RouteProp, useRoute } from "@react-navigation/native"
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View, TextInput, Pressable } from "react-native"
import { Text } from "../components/Themed"
import Colors from "../constants/Colors"

type Param = {
    EditWord: {
        term: string,
        definition: string
    }
}

export default function EditWord() {
    const route = useRoute<RouteProp<Param, 'EditWord'>>()

    const [state, setState] = React.useState<Param['EditWord']>({
        term: route.params.term,
        definition: route.params.definition
    })

    const { term, definition } = state

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={styles.group}>
                    <Text style={styles.label} colorName='textGrey'>TERM</Text>
                    <TextInput
                        style={styles.input}
                        selectionColor={Colors['light']['tint']}
                        value={term}
                        onChangeText={(newText) => setState(prev => ({ ...prev, term: newText }))}
                    />
                </View>
                <View style={styles.group}>
                    <Text style={styles.label} colorName='textGrey'>DEFINITION</Text>
                    <TextInput
                        style={styles.input}
                        selectionColor={Colors['light']['tint']}
                        value={definition}
                        onChangeText={(newText) => setState(prev => ({ ...prev, definition: newText }))}
                    />
                </View>
                <Pressable
                    style={({ pressed }) => [styles.btnSave, { opacity: pressed ? 0.7 : 1 }]}
                    onPress={() => { }}
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
        marginTop: 16
    },
    btnText: {
        fontSize: 15,
        fontFamily: 'DMSans_700Bold',
    },
})