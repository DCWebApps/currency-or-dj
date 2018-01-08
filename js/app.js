function shuffleArray(e){var t,o,a;for(a=e.length-1;a>0;a--)t=Math.floor(Math.random()*(a+1)),o=e[a],e[a]=e[t],e[t]=o;return e}function getRandomDate(){var e=new Date(2017,0,1),t=new Date(2017,11,30);return new Date(e.getTime()+Math.random()*(t.getTime()-e.getTime()))}function encodeQueryData(e){var t=[];for(var o in e)t.push(encodeURIComponent(o)+"="+encodeURIComponent(e[o]));return t.join("&")}var game_data={};$(function(){particlesJS.load("particles","data/particles.json",function(){}),$.getJSON("data/gamedata.json",function(e){console.log("Loaded game data"),game_data=e,checkGameData()},function(e){alert("Could not load game data.")})});function checkGameData(){var e={};$.each(game_data.questions,function(t,o){e[o.category]=e[o.category]?e[o.category]+1:1}),console.log("Deck Totals: %o",e)}var game=new Vue({el:"#game",data:{started:!1,ended:!1,guessed:!1,guessed_correct:!1,game_questions:[],current_question_idx:0,isCrypto:!1,total_correct:0,historicalDate:null},methods:{startGame:function(){this.started=!0,this.ended=!1,this.current_question_idx=0,this.total_correct=0,this.game_data=game_data;var e=shuffleArray(game_data.questions).slice(0,game_data.game_rules.questions_per_game);this.game_questions=e,this.preLoadCoinInfo(),this.historicalDate=getRandomDate()},preLoadCoinInfo:function(){$.each(this.game_questions,function(e,t){ticker=t.coinmarketcap_id,null!=t.coinmarketcap_id&&$.ajax({url:"https://api.coinmarketcap.com/v1/ticker/"+ticker+"/",dataType:"json",success:function(e){t.coin_info=e[0],t.coin_marketcap=e[0].market_cap_usd,console.log(t.coin_marketcap.toLocaleString("en"))},error:function(){console.log("error featching token info")}})})},nextQuestion:function(){console.log("resettting state"),this.isCrypto=!1,this.current_question_idx<this.game_questions.length-1?(this.current_question_idx+=1,this.guessed=null):(console.log("Game over"),this.ended=!0)},guess:function(e){console.log("guessed: %o",e),this.guessed=e;var t=this.game_questions[this.current_question_idx];"crypto"==t.category||"both"==t.category?this.isCrypto=!0:"edm"==t.category&&(this.isCrypto=!1),e==t.category||"both"==t.category?(this.guessed_correct=!0,this.total_correct++):this.guessed_correct=!1},shareWhatsApp:function(){var e={text:"I got "+this.total_correct+"/"+this.game_questions.length+" correct on Currency or DJ! Can you beat me? "+location.href};location.href="whatsapp://send?"+encodeQueryData(e)},shareFacebook:function(){console.log("FB share");var e="https://www.facebook.com/dialog/share?"+encodeQueryData({app_id:0x42866e427d424,display:"popup",href:location.href});console.log("Opening %s",e),location.href=e},shareTwitter:function(){var e={text:"I got "+this.total_correct+"/"+this.game_questions.length+' right on "Currency or DJ?" Can you beat me?',url:location.href,related:"dangrover,mzaveri"};location.href="https://twitter.com/intent/tweet?"+encodeQueryData(e)},shareMessenger:function(){var e={app_id:0x42866e427d424,link:window.location};window.open("fb-messenger://share?"+encodeQueryData(e))},shareTelegram:function(){location.href="https://t.me/share/url?url="+encodeURIComponent(location.href)}}});