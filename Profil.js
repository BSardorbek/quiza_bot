const Scene = require('telegraf/scenes/base')
const Markup = require('telegraf/markup');

const axios = require('axios');
const ProfilKeyboardScenes = require('./keyboard/profilKeyboard');
const MainKeyboardScenes = require('./keyboard/mainKeyboard');

class Profil{


    static getProfil(ctx){
        const userId = ctx.update.message.from.id
        axios.get('http://127.0.0.1:5000/bot/isUser/'+userId)
        .then(function (response) {
           
            const {
                first_name,
                last_name,
                phone,
                age,
                id
            } = response.data[0]
            let msg = `\n Shaxsiy kabinet \n`
            ctx.reply(msg,ProfilKeyboardScenes.getMainKeyboard())
            
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    static getProfilBall(ctx){
        const userId = ctx.update.message.from.id
        axios.get('http://127.0.0.1:5000/bot/isReting/'+userId)
        .then(function (response) {
           
            const {
                first_name,
                last_name,
                phone,
                age,
                id
            } = response.data
            let arrReting = response.data.isReting
            if (arrReting) {
                const result = arrReting.reduce( 
                    ( sum, { correct } ) => sum + parseInt(correct) , 0)
             
                    console.log(result + "ss");
                let msg = `\n Umumiy ball : <i><b>${result ? result : 0}</b></i> \n`
                ctx.replyWithHTML(msg,ProfilKeyboardScenes.getMainKeyboard())
            } else {
                let msg = `\n Umumiy ball : <i><b>0</b></i> \n`
                ctx.replyWithHTML(msg,ProfilKeyboardScenes.getMainKeyboard())
            }
           
            
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    static  getSettings(ctx){
        const userId = ctx.update.message.from.id
        axios.get('http://127.0.0.1:5000/bot/isUser/'+userId)
        .then(function (response) {
           
            const {
                first_name,
                last_name,
                phone,
                age,
                id
            } = response.data[0]
            let msg = `\n<u> Shaxsiy malumotlar</u> \n\n`+
                `Familiya:<b>${first_name}</b>\n`+
                `Ism:<b>${last_name}</b>\n`+
                `Yosh:<b>${phone}</b>\n`+
                `Tel:<b>${age}</b>\n`
            ctx.replyWithHTML(msg,ProfilKeyboardScenes.getSettingsKeyboard())
            
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    static getTopReting(ctx){
        ctx.replyWithHTML("TOP 10",MainKeyboardScenes.getMainKeyboard())


        axios.get('http://127.0.0.1:5000/bot/isTopReting')
        .then(function (response) {

            let topUser = response.data

            let msg=""
            
            topUser.forEach( (obj,i)=>{
               
                if (ctx.message.from.id == parseInt(topUser[i]['_id'].id)) {

                     msg +=    `\n<u> ✳️TOP ${i+1}✳️ </u> \n\n`+
                    `Familiya:     <b>${obj['_id'].first_name}</b>\n`+
                    `Ism:           <b>${obj['_id'].last_name}</b>\n`+
                    `Umumiy ball:   <b>${obj.total}</b>\n`
                    

                } else {

                     msg +=    `\n<u> TOP ${i+1} </u> \n\n`+
                    `Familiya:     <b>${obj['_id'].first_name}</b>\n`+
                    `Ism:           <b>${obj['_id'].last_name}</b>\n`+
                    `Umumiy ball:   <b>${obj.total}</b>\n`
                    
                }
                
                
            })
            ctx.replyWithHTML(msg,MainKeyboardScenes.getMainKeyboard())
            
        })
        .catch(function (error) {
            console.log(error);
        })
    }

   
}

module.exports = Profil