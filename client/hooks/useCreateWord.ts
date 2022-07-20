import AsyncStorage from "@react-native-async-storage/async-storage"
import {Keyboard} from "react-native"
import {useMutation, useQuery, useQueryClient} from "react-query"
import {Word} from "../App"
import {targetEnum, WordStateProps} from "../screens/AddWord"
import uuid from 'react-native-uuid'

export default function useCreateWord(word: WordStateProps, setWord: React.Dispatch<React.SetStateAction<WordStateProps>>) {
    const queryClient = useQueryClient()

    const { data: myWords, refetch: refetchMyWords } = useQuery<Word[] | []>('wordbook', async() => {
        return await AsyncStorage.getItem('wordbook').then(data => data ? JSON.parse(data) : [])
    })

    const entry = {
        id: uuid.v4(),
        term: word.term,
        definition: word.definition,
        termLang: /^[a-zA-Z]+$/.test(word.term) ? 'en' : 'ko',
        status: 'Learning',
        dateAdded: Date.now()
    }

    const { mutateAsync: createEntry } = useMutation(() => {
        if (myWords) {
            return AsyncStorage.setItem('wordbook', JSON.stringify([entry, ...myWords]))
        } else {
            return AsyncStorage.setItem('wordbook', JSON.stringify([entry]))
        }
    }, {
        onMutate: () => {
            const current = myWords
            if (myWords) {
                queryClient.setQueryData('wordbook', [entry, ...myWords])
            } else {
                queryClient.setQueryData('wordbook', [entry])
            }
            // rollback value
            return current
        },
        onSuccess: () => {
            setWord({term: '', definition: '', termLang: targetEnum.en, isSaved: true})
            setTimeout(() => {
                setWord(prev => ({...prev, isSaved: false}))
            }, 1000)
            refetchMyWords()
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

    return {createEntry} as const
}