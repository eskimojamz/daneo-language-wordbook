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

const WordCard = ({word, showActions}: {word: Word, showActions: any}) => {
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
                navigation.navigate('EditWord', { id: word.id, term: word.term, definition: word.definition, status: word.status })
              })
            } else if (Platform.OS === 'web') {
              navigation.navigate('EditWord', { id: word.id, term: word.term, definition: word.definition, status: word.status })
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
      <LinearGradient
        style={styles.quizCard}
        colors={['(rgba(27, 159, 255, 1)', 'rgba(93, 216, 194, 1))']}
      >
        <Text style={{ fontSize: 32, fontFamily: 'DMSans_700Bold' }} colorName='textDark'>Wordbook</Text>
        <Text style={{ fontSize: 32, fontFamily: 'DMSans_700Bold' }} colorName='textDark'>Quiz</Text>
      </LinearGradient>
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
    backgroundColor: '#fff'
  },
  quizCard: {
    height: 170,
    width: 'auto',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    justifyContent: 'flex-end'
  },
  wordCard: {
    height: 'auto',
    width: 'auto',
    paddingHorizontal: 16,
    display: 'flex',
    justifyContent: 'space-around'
  },
  wordCardContainer: {
    paddingVertical: 16,
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
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
