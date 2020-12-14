const Scene = require('telegraf/scenes/base')
const Markup = require('telegraf/markup');

const axios = require('axios');
const { json } = require('body-parser');

class EditProfile{

    static editProfile(ctx){
        ctx.reply("Profilni yangilash",Markup.removeKeyboard().extra())
    }
      
}

module.exports = EditProfile