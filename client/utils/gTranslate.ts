import Constants from "expo-constants"

export default async function translate(term: string, target: string) {
    return await fetch('https://translation.googleapis.com/language/translate/v2?' + new URLSearchParams({
        'q': term,
        'target': target,
        'key': Constants?.manifest?.extra?.translateKey
    }), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(res => res.json())
    .then(res => {
        console.log(res.data.translations);
        return res.data.translations[0].translatedText
    })
    .catch(err => console.error(err))
}

