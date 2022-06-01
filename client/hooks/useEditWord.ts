import AsyncStorage from "@react-native-async-storage/async-storage";
import { Keyboard } from "react-native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Word } from "../App";
import { Param } from "../screens/EditWord";

export default function useEditWord(word: Param['EditWord'], setWord: React.Dispatch<React.SetStateAction<Param['EditWord']>>){
    const queryClient = useQueryClient()

    const { data: myWords } = useQuery<Word[] | []>('wordbook', async() => {
        return await AsyncStorage.getItem('wordbook').then(data => data ? JSON.parse(data) : [])
    })

    const getNewWords = () => {
        if (myWords) {
            let newWords = myWords
            let wordIndex = myWords.findIndex(w => w.id === word.id)
            //error check
            if (wordIndex === -1) return myWords

            newWords[wordIndex] = {...word,
                term: word.term,
                definition: word.definition,
                status: word.status
            }
            return newWords
        }
    }

    const { mutateAsync: editEntry } = useMutation(() => {
        return AsyncStorage.setItem('wordbook', JSON.stringify(getNewWords()))
    }, {
        onMutate: () => {
            const current = myWords
            queryClient.setQueryData('wordbook', getNewWords())
            // rollback value
            return current
        },
        onSuccess: () => {
            setWord(prev => ({...prev, isSaved: true}))
        },
        onError: (error, _, rollback) => {
            console.error(error)
            queryClient.setQueryData('wordbook', rollback)
        },
        onSettled: () => {
            queryClient.invalidateQueries('wordbook')
            Keyboard.dismiss()
        }
    })

    return {editEntry} as const
}