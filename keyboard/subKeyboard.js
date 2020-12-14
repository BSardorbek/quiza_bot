const Scene = require('telegraf/scenes/base')
const Markup = require('telegraf/markup');

const axios = require('axios')

class SubKeyboardScenes{


    static getSubKeyboard(){
        return  Markup
        .keyboard([
            ['📌 Axborot xavfsizligi'],
            ['📌 Din psixologiyasi'],
            ['📌 Xalqaro munosabatlar'],
            ['🏠 Bosh saxifa']
        ])
        .resize()
        .extra();
    }

    
    static getSubAxKeyboard(){
        return  Markup
        .keyboard([
            ['📬 Yangiliklar','📚 Savollar'],
            ['📊 TOP 10'],
            ['🏠 Bosh saxifa','⏪⏪⏪']
        ])
        .resize()
        .extra();
    }

   
}

module.exports = SubKeyboardScenes