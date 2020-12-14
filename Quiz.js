const WizardScene = require('telegraf/scenes/wizard');

const initQuestions = require('./config/questions');
const QuizKeyboardScene = require('./keyboard/quizKeyboard');

const Markup = require('telegraf/markup');
const MainKeyboardScenes = require('./keyboard/mainKeyboard');
const { default: Axios } = require('axios');

const questions = initQuestions();

const quizStart = async ctx => {

  ctx.session.answers = {
    test_id:0,
    correct: 0,
    wrong: 0
  };
  await ctx.reply('Viktorinani boshlaymiz', Markup.removeKeyboard().selective().extra());
  ctx.scene.enter('quiz');
};

const quizEnd = async ctx => {

  const {correct, wrong} = ctx.session.answers;

  const all = questions.length;

  const skipped = all - correct - wrong;

  // console.log(ctx.update.callback_query.from.id);

  let reting = {
    user_id:ctx.update.callback_query.from.id,
    test_id:ctx.session.answers.test_id,
    correct:correct,
    wrong:wrong,
    skip:skipped
  }

  Axios.post('http://127.0.0.1:5000/bot/addReting', {
    user_id: reting.user_id,
    test_id: reting.test_id,
    correct: reting.correct,
    wrong:   reting.wrong,
    skip:    reting.skip
})
.then(function (response) {
    console.log(response);
})
.catch(function (error) {
    console.log(error);
});

  await ctx.replyWithHTML(
    `Viktarina yakuniga yetdi:\n\n${all}-ta savol\n\n` +
    `To'g'ri javoblar: ${' '.repeat(36)} ${correct} ta  (${(correct / all * 100).toFixed()}%)\n` +
    `Xatolar:${' '.repeat(52)} ${wrong} ta  (${(wrong / all * 100).toFixed()}%)\n` +
    `O'tkazib yuborganlar:${' '.repeat(25)} ${skipped} ta  (${(skipped / all * 100).toFixed()}%)`
    ,MainKeyboardScenes.getMainKeyboard());
  await ctx.scene.leave();
};

const handleAnswer = async (ctx, question) => {
  const response = ctx.update.callback_query.data;
  const {answers} = ctx.session;
  answers['test_id'] = question.test_id
  const isCorrect = response === question.key;

  if (response === 'keyingisi') return;
  answers[isCorrect ? 'correct' : 'wrong']++;

  await ctx.replyWithHTML(
    `${isCorrect ? 'Javob togri' : 'Javob xato'}\n` +
    `${question.comment}`
  );
};

//acc ---> qayta qo'ng'iroqni amalga oshiradi
//el ---> bu savol massivining elementi 0 dan boshlanadi
//i ---> bu osha massiv elementining indeksi
const steps = questions.reduce((acc, el, i) => {

  acc.push(
    async ctx => {
        console.log(i);
      await ctx.reply(
        `Jami: ${questions.length} ta savol\n\n ${i + 1}-Savol:\n\n` +
        `${el.question}`, QuizKeyboardScene.getQuizKeyboard()
      );

      return ctx.wizard.next();
    }
  );

  acc.push(
    async ctx => {
    
     // ichki klaviaturadan javob bo'lsa
      if (ctx.update.callback_query) {
          console.log(ctx.update.callback_query);
       // clb bering
        ctx.answerCbQuery();

        // klaviaturani olib tashlang
        await ctx.editMessageText(questions[i].question);

        // muddatidan oldin tugatishni boshqarish
        if (ctx.update.callback_query.data === 'tugatish') return quizEnd(ctx);

        // javobni qayta ishlash
        await handleAnswer(ctx, questions[i]);

        // keyingi savolga o'ting
        ctx.wizard.next();
        ctx.wizard.steps[ctx.wizard.cursor](ctx);
      } else {
       // aks holda orqaga qayting
        ctx.wizard.back();
        ctx.wizard.steps[ctx.wizard.cursor](ctx);
      }
    }
  );

  return acc;
}, []);

steps.push(ctx => quizEnd(ctx));

const quizScene = new WizardScene('quiz', ...steps);


module.exports = {quizScene, quizStart};
