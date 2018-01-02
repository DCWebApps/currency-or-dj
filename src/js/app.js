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
    particlesJS.load('particles', '/data/particles.json', function() {});
    
    // Load game data 
    $.getJSON('/data/gamedata.json', function(json){
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
        guessted:false,
        game_questions:[],
        current_question_idx:0,
        total_correct:0
    },
   
    methods:{
        startGame: function(){
            this.started = true;
            this.current_question_idx = 0;
            this.total_correct = 0;

            // Pick the questions for this round from the game data 
            var q = shuffleArray(game_data.questions).slice(0, game_data.game_rules.questions_per_game);
            this.game_questions = q;

            console.log("selected questions = %o", this.gamequestions);
        },
        total_game_questions: function(){return this.game_questions.length;},
        nextQuestion: function(){

        },
        guess: function(answer){
            console.log("guessed: %o", answer);
        }
    }
});