export const translate = (term: string, target: string) => {
    fetch('https://translation.googleapis.com/language/translate/v2', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'q': term,
            'target': target 
        })
        // add google credentials
    }).then(res => {
        return res.json
        // return translation data
    })
}

