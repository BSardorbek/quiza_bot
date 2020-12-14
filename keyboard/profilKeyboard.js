const Scene = require('telegraf/scenes/base')
const Markup = require('telegraf/markup');

const axios = require('axios')

class ProfilKeyboardScenes{


    static getMainKeyboard(){
        return  Markup
        .keyboard([
            ['⚠️ Sozlamalar','📈 Ball'],
            ['🏠 Bosh saxifa']
        ])
        .resize()
        .extra();
    }

    static getSettingsKeyboard(){
        return  Markup
        .keyboard([
            [`♻️ Profilni yangilash`,'⏮ Ortga']
        ])
        .resize()
        .extra();
    }

   
}

module.exports = ProfilKeyboardScenes