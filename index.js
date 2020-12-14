const config = require('config')
const axios = require('axios')
const Telegraf = require('telegraf')
const {
    Extra,
    Markup,
    Stage,
    session
  } = Telegraf


const RegScenes = require('./auth/RegScenes')
const EditProfile = require('./EditProfile')
const {quizScene,quizStart} = require('./Quiz')

const StartKeyboardScenes = require('./keyboard/startkeyboard')
const MainKeyboardScenes = require('./keyboard/mainKeyboard')


const Profil = require('./Profil')
const SubKeyboardScenes = require('./keyboard/subKeyboard')
const QuizKeyboardScene = require('./keyboard/quizKeyboard')


const bot = new Telegraf(config.get('BOT.token'))


const regScene = new RegScenes()

const stage = new Stage([
    regScene.getAgeScene(),
    regScene.getLNameScene(),
    regScene.getFNameScene(),
    regScene.getPhoneScene(),
    regScene.getData(),
    quizScene
    // editScene.editName()
])

// stage.register(quizScene)

bot.use(session())
bot.use(stage.middleware())
bot.use((ctx, next) => { 
    if (ctx.session.initialisation) return next();
    ctx.session.initialisation = false;
    return next();
  });


bot.start( async (ctx) => {

    let userId = ctx.update.message.from.id
    console.log(ctx.update.message.from.id);

    axios.get('http://127.0.0.1:5000/bot/isUser/'+userId)
    .then(function (response) {
       
       if (response.data[0].id == userId) {
        let msg = `\n Assalomu alaykum \n`
        ctx.reply(msg,MainKeyboardScenes.getMainKeyboard())
        } else {
            let msg = `\n Assalomu alaykum \n Siz ro'yxatdan o'tmagansiz`
            ctx.reply(msg,StartKeyboardScenes.getStartKeyboard())
        }
    })
    .catch(function (error) {
        console.log(error + "1111111111");
    })
      
})

bot.action("BACK_UZ", (ctx) => {
    ctx.answerCbQuery(`Bekor qilindi`);
    ctx.reply(`Siz malumotlarni rad qildingiz!\nYangi malumot kiritishingiz mumkun\n`,Markup.removeKeyboard().extra());
    ctx.session.data = {}
    ctx.scene.enter('age')
  });
  
  bot.action("OK_UZ", (ctx) => {

    if (ctx.session.data) {
        const {
            user_id,
            age,
            fname,
            lname,
            phone
    
        } = ctx.session.data

        axios.post('http://127.0.0.1:5000/bot/add', {
            first_name: fname,
            last_name:  lname,
            phone:      phone,
            age:        age,
            id:         user_id
        })
        .then(function (response) {
            console.log(response);
    
            let msg_txt = `
            Xush kelibsiz.
        `
            ctx.reply(msg_txt)
        })
        .catch(function (error) {
            console.log(error);
        });

        ctx.answerCbQuery(`✅ Qabul qilindi ✅`);

        ctx.reply(
        `✅ Sizning malumotlaringiz saqlandi ‼️ \n`,MainKeyboardScenes.getMainKeyboard());

       

    } else {
        console.log(ctx);
    }

  


});

bot.hears('Ro\'yxatdan o\'tish',(ctx) =>{
    console.log(ctx);
    ctx.scene.enter('age')
});


//=====================================
//      Profil uchun
//=====================================
bot.hears('👤 Profil',(ctx) =>{
    Profil.getProfil(ctx)
});

bot.hears('⚠️ Sozlamalar',(ctx) =>{
    Profil.getSettings(ctx)
});

//Profil uchun
bot.hears('⏮ Ortga',(ctx) =>{
    Profil.getProfil(ctx)
});

bot.hears('📈 Ball',(ctx) =>{
    Profil.getProfilBall(ctx)
});

bot.hears('♻️ Profilni yangilash',(ctx) =>{
    console.log(ctx);
    ctx.scene.enter('age')
});
bot.hears(`♻️ Profilni yangilash`,(ctx) =>{
    EditProfile.editProfile(ctx)
});

//=====================================
bot.hears(`📊 TOP 20`,(ctx) =>{
    Profil.getTopReting(ctx)
});



//=====================================
//      Bo'limlar
//=====================================
bot.hears(`🗂 Bolimlar`,(ctx) =>{
    ctx.reply(`Kerakli bo'limni tanlang`,SubKeyboardScenes.getSubKeyboard())
});
bot.hears(`📌 Axborot xavfsizligi`,(ctx) =>{
    ctx.reply(`Kerakli bo'limni tanlang`,SubKeyboardScenes.getSubAxKeyboard())
});

//biz haqimizda
let about = `Buyerga maluimot yoziladi`
bot.hears('😌 Biz haqimizda',(ctx) =>{
    ctx.reply(about,MainKeyboardScenes.getMainKeyboard())
});
// bosh saxifaga qaytish
bot.hears('🏠 Bosh saxifa',(ctx) =>{
    ctx.reply('Bosh saxifa',MainKeyboardScenes.getMainKeyboard())
});
bot.hears('⏪⏪⏪',(ctx) =>{
    ctx.reply('Bosh saxifa',SubKeyboardScenes.getSubKeyboard())
});
bot.hears('🎉 Viktorina 🎉',quizStart);



bot.launch()