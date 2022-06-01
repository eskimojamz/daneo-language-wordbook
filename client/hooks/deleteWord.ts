import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient, useQuery, useMutation } from "react-query";
import { Word } from "../App";

export default function deleteWord(word: Word){
    const queryClient = useQueryClient()

    const { data: myWords } = useQuery<Word[] | []>('wordbook', async() => {
        return await AsyncStorage.getItem('wordbook').then(data => data ? JSON.parse(data) : [])
    })

    const getWords = () => {
        let newWords = myWords 
        let wordIndex = myWords?.findIndex(w => w.id === word.id)
        if (wordIndex) newWords?.splice(wordIndex, 1)
        return newWords
    }

    const { mutateAsync: deleteEntry } = useMutation(() => {
        return AsyncStorage.setItem('wordbook', JSON.stringify(getWords()))
    }, {
        onMutate: () => {
            const current = myWords
            queryClient.setQueryData('wordbook', JSON.stringify(getWords()))
            // rollback value
            return current
        },
        onError: (error, _, rollback) => {
            console.error(error)
            queryClient.setQueryData('wordbook', rollback)
        },
        onSettled: () => {
            queryClient.invalidateQueries('wordbook')
        }
    })

    return deleteEntry()
}