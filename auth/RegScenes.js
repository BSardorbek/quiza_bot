const Scene = require('telegraf/scenes/base')
const Markup = require('telegraf/markup');

const axios = require('axios');
const { json } = require('body-parser');

class RegScenes{



    getAgeScene(){
 
        const age = new Scene('age')

        age.enter(async (ctx) =>{
            ctx.session.data = {
                user_id:"",
                age:"",
                fname:"",
                lname: "",
                phone: ""
              };
            await ctx.reply("Yoshingiz",Markup.removeKeyboard().extra())
        })

        age.on("text",async (ctx)=>{
            const currAge = Number(ctx.message.text)
            
            if (currAge && currAge > 20 && currAge < 100) {
                ctx.session.data.age = currAge
                ctx.session.data.user_id = ctx.message.from.id
                ctx.scene.enter("lname")
            } else {
                await ctx.reply("Yoshingizni hato kiritdingiz")
                ctx.scene.reenter()
            }
        })

        age.on('message',async (ctx) =>{
            await ctx.reply("Raxmat")
        })

        return age;
    }

    getLNameScene(){
        const lname = new Scene('lname')

        lname.enter(async (ctx) =>{
            await ctx.reply("Familiyangiz")
        })

        lname.on("text",async (ctx)=>{
    
            const currLName = String(ctx.message.text)
         

            if (currLName.length >  6 && currLName.length < 15) {
                ctx.session.data.fname = currLName
                ctx.scene.enter("fname")
            } else {
                await ctx.reply(" Familiyangizni xato kiritdingiz")
                ctx.scene.reenter()
            }
        })

        return lname;
    }

    getFNameScene(){
        const fname = new Scene('fname')

        fname.enter(async (ctx) =>{
            await ctx.reply("Ismingiz")
        })

        fname.on("text",async (ctx)=>{
    
            const currFName = String(ctx.message.text)
         

            if (currFName.length > 3 && currFName.length < 15) {
                
                ctx.session.data.lname = currFName
                ctx.scene.enter("phone")
            } else {
                await ctx.reply("Ismingizni xato kiritdingiz")
                ctx.scene.reenter()
            }
        })

        return fname;
    }

    getPhoneScene(){
        const phone = new Scene('phone')

        phone.enter(async (ctx) =>{
            await ctx.reply("Telefon raqamingiz",{ 
                reply_markup: {
                   keyboard: [
                     [{
                       text: '📲 Telefon raqam', 
                       request_contact: true,
                      }]
                    ],
                    resize_keyboard:true,
                    one_time_keyboard:true
            }
        
          })
        })

        phone.on("contact",async (ctx)=>{

            const currPhone = String(ctx.update.message.contact.phone_number)
            
            if ( currPhone ) {
                ctx.session.data.phone = currPhone
                ctx.scene.enter("verify")
            } else {
                await ctx.reply("Telefoningizni xato kiritdingiz \nMisol:+998936439414")
                ctx.scene.reenter()
            }
        })

        phone.on('sticker',async (ctx)=>{
            await ctx.reply("Telefoningizni xato kiritdingiz \nMisol:+998936439414")
            ctx.scene.enter('phone')
        })
     
        phone.on('text',async (ctx)=>{
            await ctx.reply("Telefoningizni xato kiritdingiz \nMisol:+998936439414")
            ctx.scene.enter('phone')
        })
       
        return phone;
    }

    getData(){

        const verify = new Scene('verify')

        verify.enter(async (ctx) =>{

            let info = `\nMalumotlar to'g'riligiga etibor bering ‼️\n
            Familiya : ${ctx.session.data.fname}\n
            Ism : ${ctx.session.data.lname}\n
            Yosh : ${ctx.session.data.age}\n
            Phone : ${ctx.session.data.phone}\n
            
            `
            await ctx.reply(info, 
                Markup.inlineKeyboard([
                Markup.callbackButton(" ✅ Tasdiqlash", "OK_UZ"),
                Markup.callbackButton(" ❌ Bekor qilish", "BACK_UZ"),
              ]).extra())

        })
       
        return verify;
    }


        

       
}

module.exports = RegScenes