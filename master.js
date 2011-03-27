$(function(){
    var matches = [
        {
            "match" : 87,
            "alliance" : "red",
            "time" : "2:57 PM",
            "partner1" : "3128",
            "partner2" : "702",
            "partner3" : "1717",
            "complete" : false
        },
        {
            "match" : 101,
            "alliance" : "blue",
            "time" : "2:58 PM",
            "partner1" : "3128",
            "partner2" : "689",
            "partner3" : "1",
            "complete" : false
        },
        {
            "match" : 111,
            "alliance" : "red",
            "time" : "2:59 PM",
            "partner1" : "3128",
            "partner2" : "504",
            "partner3" : "3120",
            "complete" : false
        }
    ];

    var currentMatch = false;

    function displayMatch(match){

        currentMatch = match;

        $("#countdown").text("Match #" + match.match);
        $("#alliance").text(match.alliance);
        $("#alliance").removeClass("red");
        $("#alliance").removeClass("blue");
        if(match.alliance == "red"){
            $("#alliance").addClass("red");
        }else{
            $("#alliance").addClass("blue");
        }
        $("#time").text(match.time);
        $("#partner1").text(match.partner1);
        $("#partner2").text(match.partner2);
        $("#partner3").text(match.partner3);

    }

    function nextMatch(){

        if(currentMatch == false){
            currentMatch = {
                "match": 0
            };
        }

        var match = getNextMatch();
        if(match == -1){
            var len = matches.length;
            for(var i=0; i < len; i++){
                
                matches[i].complete = false;
            }
            currentMatch = {
                "match" : 0
            };
            match = getNextMatch();
        }

        matches[match].complete = true;
        //console.log("Match " + matches[match].match + " selected");
        displayMatch(matches[match]);
    }

    function getNextMatch(){
        var current = currentMatch.match;

        var next = -1;
        var nextLength = 100;

        var len = matches.length;
        for(var i=0; i<len; i++){
            var m = matches[i];
            var t = 0;

            //console.log("Match " + m.match + " testing");

            if(m.complete == true){
                //console.log("Match " + m.match + " already completed");
                continue;
            }

            //console.log("Checking " + parseInt(m.match, 10) + " > " + parseInt(current, 10));

            // Only get future matches
            if(parseInt(m.match, 10) > parseInt(current, 10)){

                //console.log("Success");

                // Find the closest match
                t = parseInt(m.match, 10) - parseInt(current, 10)
                //console.log("Difference: " + t);
                if(t < nextLength){
                    //console.log("Match " + m.match + " is " + t + "away");
                    nextLength = t;
                    next = i;
                }
            }
        }

        return next;
    }

    nextMatch();
    $("#countdown").click(function(){
        nextMatch();
    })
})