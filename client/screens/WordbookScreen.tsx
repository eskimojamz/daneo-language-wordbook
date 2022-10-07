import React, {useState} from 'react'
import { Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import { RootTabScreenProps } from '../types';
import { Word } from '../App';
import { useQuery } from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics'
import { useActionSheet } from '@expo/react-native-action-sheet';
import useDeleteWord from "../hooks/useDeleteWord";
import WordCard from "../components/WordCard";

export default function WordbookScreen({ navigation }: RootTabScreenProps<'Wordbook'>) {
  const { data: myWords } = useQuery('wordbook', async () => {
    return await AsyncStorage.getItem('wordbook').then(data => {
      console.log(data)
      return data ? JSON.parse(data) : undefined
    })
  })

  // state for deleting a word
  const [wordToDelete, setWordToDelete] = useState<Word>()
  // deleteEntry for word
  const { deleteEntry } = useDeleteWord(wordToDelete)

  const { showActionSheetWithOptions } = useActionSheet()

  const showActions = (word: Word) => {
    const options = ['Edit', 'Delete', 'Cancel']
    const cancelButtonIndex = 2
    const destructiveButtonIndex = 1
    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex
    },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            if (Platform.OS === 'android' || 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).then(() => {
                navigation.navigate('EditWord', { id: word.id, term: word.term, termLang: word.termLang, definition: word.definition, status: word.status })
              })
            } else if (Platform.OS === 'web') {
              navigation.navigate('EditWord', { id: word.id, term: word.term, termLang: word.termLang, definition: word.definition, status: word.status })
            }
            break
          case 1:
            if (Platform.OS === 'android' || 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).then(() => {
                setWordToDelete(word)
                deleteEntry()
              })
            } else if (Platform.OS === 'web') {
              setWordToDelete(word)
              deleteEntry()
            }
            break
          default:
            break;
        }
      })
  }

  return (
    <ScrollView style={styles.container}>
      <Pressable onPress={() => navigation.navigate('Quiz')}>
        <LinearGradient
          style={styles.quizCard}
          colors={['(rgba(27, 159, 255, 1)', 'rgba(93, 216, 194, 1))']}
        >
          <Text style={{ fontSize: 32, fontFamily: 'DMSans_700Bold' }} colorName='textDark'>Wordbook</Text>
          <Text style={{ fontSize: 32, fontFamily: 'DMSans_700Bold' }} colorName='textDark'>Quiz</Text>
        </LinearGradient>
      </Pressable>
      {/* Map word cards */}
      {myWords && myWords.map((word: Word) => {
        return (
          <Pressable
            style={styles.wordCard}
            key={word.id?.toString()}
            onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).then(() => showActions(word))}
          >
            <WordCard word={word} showActions={showActions}/>
          </Pressable>
        )
      })}
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
  quizCard: {
    height: 170,
    width: 'auto',
    borderRadius: 10,
    padding: 16,
    justifyContent: 'flex-end'
  },
  wordCard: {
    height: 'auto',
    width: 'auto',
    display: 'flex',
    justifyContent: 'space-around',
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  }
});
