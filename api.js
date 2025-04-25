export const readSettings = () => {
    fetch('settings.json', {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => (res) => {
        if(res.ok){
            return res.json
        }
        return Promise.reject(`Ошибка: ${res.status}`)
    })
}

 const addNewSettingsFolder = (obj) => {
    fetch('settings.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            obj
        })
    })
        .then(res => (res) => {
            if (res.ok) {
                return res.json
            }
            return Promise.reject(`Ошибка: ${res.status}`)
        })
}