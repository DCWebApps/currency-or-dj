function shuffleArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

var game_data = {};

$(function() {
    // Particle effects (mandatory for all blockchain-related websites)
    particlesJS.load('particles', 'data/particles.json', function() {});
    
    // Load game data 
    $.getJSON('data/gamedata.json', function(json){
        console.log("loaded data: %o", json);
        game_data = json;
        console.log("game data: %o", game_data);
    },
    function(error){
        alert("Could not load game data.");
    });
});


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
        total_correct:0
    },
   
    methods:{
        startGame: function(){
            this.started = true;
            this.ended = false; 
            this.current_question_idx = 0;
            this.total_correct = 0;
            this.game_data = game_data;

            // Pick the questions for this round from the pool
            var q = shuffleArray(game_data.questions).slice(0, game_data.game_rules.questions_per_game);
            this.game_questions = q;
            this.preLoadCoinInfo();

        },

        total_game_questions: function(){return this.game_questions.length;},

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
        }
    }
});