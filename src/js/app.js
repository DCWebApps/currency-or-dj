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

var sounds = {
    right:new Howl({"src":"sfx/right.wav"}),
    wrong:new Howl({"src":"sfx/wrong.wav"})
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
        total_correct:0
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
            // pre-loading coin information.
            this.preLoadCoinInfo();
        },

        // Fetch Coin INfo
        preLoadCoinInfo: function(){
            //get random date.
            var random_date = getRandomDate();
            var random_date_unix = (Math.floor(random_date/ 1000));

            $.each(this.game_questions, function (i, item) {
                ticker = item.cryptocompare_symbol;
                if (item["cryptocompare_symbol"] != null){
                    if (Math.floor(random_date/ 1000) < item.listing_timestamp){
                        random_date_unix = item.listing_timestamp;
                    }
                    $.when(
                        $.ajax({
                            type: "get",
                            url: "https://min-api.cryptocompare.com/data/pricehistorical",
                            data:{
                                "fsym": item.cryptocompare_symbol,
                                "tsyms": "USD",
                                "ts": random_date_unix
                            },
                            dataType: 'json', 
                            success: function(data) { 
                                item.historcal_usd_value = data[item.cryptocompare_symbol]["USD"];
                                item.coin_info = data[0];
                            },
                            error: function() { 
                                console.log("error featching token info");
                            }
                        })

                    ).then(function() {

                        $.ajax({
                            url: "https://min-api.cryptocompare.com/data/price",
                            data:{
                                "fsym": item.cryptocompare_symbol,
                                "tsyms": "USD"
                            },
                            dataType: 'json', 
                            success: function(data) { 
                                item.current_usd_value = data["USD"];

                                //what is $1k worth today
                                var investment = "1000.00";
                                var total_coins = investment / item.historcal_usd_value;
                                var value_of_investment = item.current_usd_value * total_coins;
                                item.today_value = value_of_investment;

                                //localize date
                                var options = {year: 'numeric', month: 'long', day: 'numeric'};
                                item.historical_date = random_date.toLocaleString('en-US', options);

                                // item.coin_marketcap = data["USD"];
                                // console.log(item.coin_marketcap.toLocaleString('en'));
                            },
                            error: function() { 
                                console.log("error featching token info");
                            }
                        })

                    });  
                }
                else{
                    // leave for DJ info/calls or we cold hard code into json file.
                }

            });
        },

        nextQuestion: function(){
            console.log("Next question")
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
            var q = this.game_questions[this.current_question_idx];
            var is_correct = (answer == q.category) || (q.category == "both"); 
            var game = this;

            (is_correct ? sounds.right : sounds.wrong).play();

            this.flashOverlay(is_correct ? 'right' : 'wrong', 
                function(){
                    game.guessed = answer;
                    game.isCrypto = (q.category != "edm");
                
                    if(is_correct){
                        game.total_correct++;
                    }
            });
        },

        // Two overlay divs on the page for fullscreen "WRONG" or "RIGHT"
        flashOverlay: function(name, shown_callback){
            var overlay = $("#"+name+"-overlay");

            // There is a nifty way to do this by chaining together
            // .show, .animate, .delay, etc, but it doesn't seem to be working.

            overlay.show();
            overlay.animate({opacity:1},100, function(){
                 // advance game state while overlay is shown
                window.setTimeout(function(){
                    shown_callback();
                    overlay.animate({opacity:0},100, function(){
                        overlay.hide();
                    });
                }, 300);
            });
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