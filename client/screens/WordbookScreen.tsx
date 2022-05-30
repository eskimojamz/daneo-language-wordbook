import React from 'react'
import { Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import { RootTabScreenProps } from '../types';
import { GlobalContext, GlobalContextInterface, Word } from '../App';
import Colors from '../constants/Colors';
import { useQuery } from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics'

export default function WordbookScreen({ navigation }: RootTabScreenProps<'Wordbook'>) {
  const { myWords } = React.useContext(GlobalContext) as GlobalContextInterface
  const { data: myWordsData } = useQuery('wordbook', async () => {
    return await AsyncStorage.getItem('wordbook').then(data => {
      console.log(data)
      return data ? JSON.parse(data) : undefined
    })
  })
  console.log(myWordsData)

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
      {myWordsData && myWordsData.map((word: Word) => {
        return (
          <Pressable
            style={styles.wordCard}
            key={word.term + word.dateAdded.toString()}
            onLongPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).then(() => {
                navigation.navigate('EditWord', { term: word.term, definition: word.definition })
              })
            }}
          >
            <View style={styles.wordCardContainer}>
              <View style={styles.wordCardMain}>
                <View style={styles.wordCardTop}>
                  <Text style={styles.wordCardLabel} colorName='textGrey'>TERM</Text>
                  <Text style={styles.wordCardTerm} colorName='textDark'>{word.term}</Text>
                </View>
                <View>
                  <Text style={styles.wordCardLabel} colorName='textGrey'>DEFINITION</Text>
                  <Text style={styles.wordCardTerm} colorName='textTint'>{word.definition}</Text>
                </View>
              </View>
              <View style={styles.wordCardBottom}>
                <Text style={styles.wordCardStatus} colorName='textDark'>{word.status}</Text>
              </View>
            </View>
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
  wordCardBottom: {
    alignSelf: 'flex-end',
    backgroundColor: '#5DD8C2',
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
