const Scene = require('telegraf/scenes/base')
const Markup = require('telegraf/markup');

const axios = require('axios')

class StartKeyboardScenes{


    static getStartKeyboard(){
        return Markup
        .keyboard([[`Ro'yxatdan o'tish`]])
        .resize()
        .extra();
    }

   
}

module.exports = StartKeyboardScenes