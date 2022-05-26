import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Button, Keyboard, Pressable, StyleSheet, Switch, TextInput, TouchableWithoutFeedback } from "react-native";
import { View, Text } from "../components/Themed";
import Colors from "../constants/Colors";

interface StateProps {
    isTranslate: boolean;
    order: number
}

export default function AddWord() {
    const [state, setState] = React.useState<StateProps>({
        isTranslate: false,
        order: 0,
    })
    const { isTranslate, order } = state

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={styles.translateGroup}>
                    <View style={styles.switch}>
                        <Text style={styles.label} colorName='textGrey'>TRANSLATE MODE</Text>
                        <Switch
                            value={isTranslate}
                            onValueChange={(value) => setState({ ...state, isTranslate: value })}
                            thumbColor='#fff'
                            //@ts-expect-error type 
                            activeThumbColor='#fff'
                            trackColor={{ false: '#DDDEFD', true: '#8085E7' }}
                            style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }], marginTop: 8 }}
                        />
                    </View>
                    {isTranslate &&
                        <View style={styles.swap}>
                            <Text style={styles.swapLabel} colorName="textDark">{order === 0 ? 'English' : 'Korean'}</Text>
                            <Pressable
                                style={styles.swapBtn}
                                onPress={() => setState({ ...state, order: order === 0 ? 1 : 0 })}
                            >
                                <MaterialCommunityIcons name="swap-horizontal-circle" size={32} color="#8085E7" />
                            </Pressable>
                            <Text style={styles.swapLabel} colorName="textDark">{order === 0 ? 'Korean' : 'English'}</Text>
                        </View>
                    }
                </View>

                <View style={styles.group}>
                    <Text style={styles.label} colorName='textGrey'>TERM</Text>
                    <TextInput
                        style={styles.input}
                        selectionColor={Colors['light']['tint']}
                    />
                </View>

                {isTranslate &&
                    <Pressable style={styles.btnTranslate}>
                        <Text colorName="tint" style={styles.btnText}>Translate</Text>
                    </Pressable>
                }

                <View style={styles.group}>
                    <Text style={styles.label} colorName='textGrey'>DEFINITION</Text>
                    <TextInput
                        style={styles.input}
                        selectionColor={Colors['light']['tint']}
                    />
                </View>

                <Pressable style={styles.btnSave}>
                    <Text colorName="textWhite" style={styles.btnText}>Save</Text>
                </Pressable>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1
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
        backgroundColor: '#fff',
        borderColor: Colors['light']['tint'],
        borderWidth: 2,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        marginTop: 16
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
    }
})