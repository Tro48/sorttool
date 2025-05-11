const fs = require('fs');
const path = require('path');

export class SettingsApi{

    #settingsFile

    constructor(settingsFile){
        this.#settingsFile = settingsFile
    }

    getSettings(){
        const settingsPromise = new Promise((resolve) => {
              setTimeout(() => {
                  try{
                      const settings = JSON.parse(fs.readFileSync(this.#settingsFile, 'utf8'))
                      resolve(settings)
                  }catch{
                      fs.writeFile(this.#settingsFile, JSON.stringify({}), (err) => {
                          if (err) {
                              console.log(err)
                          } else {
                              const settings = JSON.parse(fs.readFileSync(this.#settingsFile, 'utf8'))
                              resolve(settings)
                          }
                    })
                  }
              }, 1)
            })
        return settingsPromise
    }
    setSettings(newSettings){
        const settingsPromise = new Promise((resolve) => {
            setTimeout(() => {
                fs.writeFile(this.#settingsFile, JSON.stringify(newSettings),(err)=>{
                    if(err){
                        console.log(err)
                    }else{
                        const settings = JSON.parse(fs.readFileSync(this.#settingsFile, 'utf8'))
                        resolve(settings)
                    }
                })
            }, 1)
        })
        return settingsPromise
    }
}