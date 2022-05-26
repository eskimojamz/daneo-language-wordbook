import { ScrollView, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import { RootTabScreenProps } from '../types';

export default function WordbookScreen({ navigation }: RootTabScreenProps<'Wordbook'>) {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        style={styles.quizCard}
        colors={['(rgba(27, 159, 255, 1)', 'rgba(93, 216, 194, 1))']}
      >
        <Text style={{ fontSize: 32, fontFamily: 'DMSans_700Bold' }} colorName='textDark'>Wordbook</Text>
        <Text style={{ fontSize: 32, fontFamily: 'DMSans_700Bold' }} colorName='textDark'>Quiz</Text>
      </LinearGradient>
      <View style={styles.wordCard}>
        <View style={styles.wordCardMain}>
          <View style={styles.wordCardGroup}>
            <Text style={styles.wordCardLabel} colorName='textGrey'>TERM</Text>
            <Text style={styles.wordCardTerm} colorName='textDark'>Tree</Text>
          </View>
          <View style={styles.wordCardGroup}>
            <Text style={styles.wordCardLabel} colorName='textGrey'>DEFINITION</Text>
            <Text style={styles.wordCardTerm} colorName='textTint'>나무</Text>
          </View>
        </View>
        <View style={styles.wordCardBottom}>
          <Text style={styles.wordCardStatus} colorName='textDark'>Mastered</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
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
    height: 170,
    width: 'auto',
    padding: 16,
    display: 'flex',
    justifyContent: 'space-around'
  },
  wordCardMain: {
    display: 'flex',
    gap: 4
  },
  wordCardGroup: {
    display: 'flex',
  },
  wordCardLabel: {
    fontSize: 12,
    fontFamily: 'DMSans_700Bold'
  },
  wordCardTerm: {
    fontSize: 24,
    fontFamily: 'DMSans_700Bold'
  },
  wordCardBottom: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  wordCardStatus: {
    backgroundColor: '#5DD8C2',
    fontSize: 13,
    fontFamily: 'DMSans_500Medium',
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15
  }
});
