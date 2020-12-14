const Scene = require('telegraf/scenes/base')
const Markup = require('telegraf/markup');

const axios = require('axios')

class QuizKeyboardScene{


    static getQuizKeyboard(){
        return  Markup
        .inlineKeyboard([
          [
            Markup.callbackButton('a', 'a'),
            Markup.callbackButton('b', 'b'),
            Markup.callbackButton('c', 'c'),
            Markup.callbackButton('d', 'd')
          ],
          [
            Markup.callbackButton('keyingisi', 'keyingisi'),
            Markup.callbackButton('tugatish', 'tugatish')
          ]
        ])
        .resize()
        .oneTime()
        .extra();
    }

    
    static getEmpytyKeyboard(){
        return Markup.removeKeyboard().selective().extra();
    }

   
}

module.exports = QuizKeyboardScene