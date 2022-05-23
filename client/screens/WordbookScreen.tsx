import { StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import { RootTabScreenProps } from '../types';

export default function WordbookScreen({ navigation }: RootTabScreenProps<'Wordbook'>) {
  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.quizCard}
        colors={['(rgba(27, 159, 255, 1)', 'rgba(93, 216, 194, 1))']}
      >
        <Text style={{ fontSize: 32, fontFamily: 'DMSans_700Bold' }} colorName='textDark'>Wordbook</Text>
        <Text style={{ fontSize: 32, fontFamily: 'DMSans_700Bold' }} colorName='textDark'>Quiz</Text>
      </LinearGradient>
    </View>
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
  }
});
