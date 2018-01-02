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

function getCoinInfo(ticker){
    var xhr = new XMLHttpRequest();
    var url = "https://api.coinmarketcap.com/v1/ticker/" + ticker + "/"
    xhr.open("GET", url, false);
    xhr.send();
    var response = JSON.parse(xhr.responseText);
    //var market_cap = (response[0]["market_cap_usd"]);
    //console.log("Market Cap is: %s", market_cap);
    console.log("Info = %o", response[0]);
    return response[0];
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

        },

        total_game_questions: function(){return this.game_questions.length;},

        nextQuestion: function(){
            if(this.current_question_idx < (this.game_questions.length - 1)){
                this.current_question_idx += 1;
                this.guessed = null; 

                 // If crypto, get market cap
                 if (this.game_questions[this.current_question_idx].coinmarketcap_id != null){
                     console.log("Gonna fetch coin info");
                    this.game_questions[this.current_question_idx].coin_info = getCoinInfo(this.game_questions[this.current_question_idx].coinmarketcap_id);
                }

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