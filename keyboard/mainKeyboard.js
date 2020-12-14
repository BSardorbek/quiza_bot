const Scene = require('telegraf/scenes/base')
const Markup = require('telegraf/markup');

const axios = require('axios')

class MainKeyboardScenes{


    static getMainKeyboard(){
        return  Markup
        .keyboard([
            [' 🎉 Viktorina 🎉 '],
            ['📊 TOP 20','🗂 Bolimlar'],
            ['👤 Profil','😌 Biz haqimizda']
        ])
        .resize()
        .extra();
    }

   
}

module.exports = MainKeyboardScenes