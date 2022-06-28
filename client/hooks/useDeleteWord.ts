import AsyncStorage from "@react-native-async-storage/async-storage";
import { Keyboard } from "react-native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Word } from "../App";

export default function useDeleteWord(word: Word | undefined) {
    const queryClient = useQueryClient()

    const { data: myWords } = useQuery<Word[] | []>('wordbook', async() => {
        return await AsyncStorage.getItem('wordbook').then(data => data ? JSON.parse(data) : [])
    })

    const getNewWords = () => {
        if (myWords) {
            let newWords = myWords
            let wordIndex = myWords.findIndex(w => w.id === word?.id)
            //error check
            if (wordIndex === -1) return myWords
            console.log(newWords)
            return newWords.filter((w, i) => i !== wordIndex)
        }
    }

    const { mutateAsync: deleteEntry } = useMutation(() => {
        console.log('deleteEntry')
        return AsyncStorage.setItem('wordbook', JSON.stringify(getNewWords()))
    }, {
        onMutate: () => {
            const current = myWords
            queryClient.setQueryData('wordbook', getNewWords())
            // rollback value
            return current
        },
        onError: (error, _, rollback) => {
            console.error(error)
            queryClient.setQueryData('wordbook', rollback)
        },
        onSettled: () => {
            queryClient.invalidateQueries('wordbook').then(() => {
                Keyboard.dismiss()
            })
        }
    })

    return {deleteEntry} as const
}