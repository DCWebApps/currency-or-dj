var game_data = {};


// Page Load 
$(function() {
    // Particle effects (mandatory for all blockchain-related websites)
    particlesJS.load('particles', 'data/particles.json', function() {});
    
    // Load game data 
    $.getJSON('data/gamedata.json', function(json){
        console.log("Loaded game data");
        game_data = json;
        checkGameData();
    },
    function(error){
        alert("Could not load game data.");
    });
});


 // Make sure we have enough of each category for a fair game.
 function checkGameData(){
    var totals = {};
    $.each(game_data.questions, function(idx, q){
        totals[q.category] = totals[q.category] ? totals[q.category] + 1 : 1;
    }); 
    console.log("Deck Totals: %o", totals);
};



var game = new Vue({
    el:'#game',
    data: {
        started:false, 
        ended:false,
        guessed:false,
        guessed_correct:false,
        game_questions:[],
        current_question_idx:0,
        isCrypto:false,
        total_correct:0,
        historicalDate:null
    },
   
    methods:{
        startGame: function(){
            this.started = true;
            this.ended = false; 
            this.current_question_idx = 0;
            this.total_correct = 0;
            this.game_data = game_data;
            this.isCrypto = false; 
            this.guessed = false;

            // Pick the questions for this round from the pool
            var q = shuffleArray(game_data.questions).slice(0, game_data.game_rules.questions_per_game);
            this.game_questions = q;
            this.preLoadCoinInfo();

            //ge random date.
            this.historicalDate = getRandomDate();
        },

        // Fetch market caps for everything 
        preLoadCoinInfo: function(){
            $.each(this.game_questions, function (i, item) {
                ticker = item.coinmarketcap_id;
                if (item["coinmarketcap_id"] != null){
                    $.ajax({
                        url: "https://api.coinmarketcap.com/v1/ticker/" + ticker + "/",
                        dataType: 'json', 
                        success: function(data) { 
                            item.coin_info = data[0];
                            item.coin_marketcap = data[0]["market_cap_usd"];
                            console.log(item.coin_marketcap.toLocaleString('en'));
                        },
                        error: function() { 
                            console.log("error featching token info");
                        }
                    });  
                }
                else{
                    // leave for DJ info/calls or we cold hard code into json file.
                }
            });
        },

        nextQuestion: function(){
            console.log("resettting state")
            this.isCrypto = false;

            if(this.current_question_idx < (this.game_questions.length - 1)){
                this.current_question_idx += 1;
                this.guessed = null; 
            }else{
                // End game, show final results
                console.log("Game over");
                this.ended = true; 
            }
        },

       

        guess: function(answer){
            console.log("guessed: %o", answer);
            this.guessed = answer;
            var q = this.game_questions[this.current_question_idx];

            if(q.category == "crypto" || q.category == "both"){
                this.isCrypto = true;
            }else if(q.category == "edm"){
                this.isCrypto = false;
            }

            if((answer == q.category) || (q.category == "both")){
                // correct
                this.guessed_correct = true;
                this.total_correct++;

            }else{
                // wrong 
                this.guessed_correct = false;    
            }
        },

        // Sharing 

        shareWhatsApp: function(){
            var query_params = {
                text: "I got "+this.total_correct+"/"+this.game_questions.length+" correct on Currency or DJ! Can you beat me? "+location.href
            };
            location.href = 'whatsapp://send?' + encodeQueryData(query_params);
        },

        shareFacebook: function(){
            console.log("FB share");
            var query_params = {
                app_id: 1170322286433316,
                display: "popup",
                href: location.href
            };

            var share_url = 'https://www.facebook.com/dialog/share?' + encodeQueryData(query_params);
            console.log("Opening %s", share_url);
            location.href = share_url;
        },

        shareTwitter: function(){
            var query_params = {
                text: "I got "+this.total_correct+"/"+this.game_questions.length+" right on \"Currency or DJ?\" Can you beat me?",
                url:location.href,
                related:'dangrover,mzaveri'
            }

            location.href = 'https://twitter.com/intent/tweet?' + encodeQueryData(query_params);
        },

        shareMessenger: function(){
            // Only works on mobile
            var query_params = {
                app_id: 1170322286433316,
                link: window.location
            };

            window.open('fb-messenger://share?' + encodeQueryData(query_params));
        },

        shareTelegram: function(){
            location.href='https://t.me/share/url?url='+encodeURIComponent(location.href);
        }
    }
});