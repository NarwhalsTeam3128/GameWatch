$(function(){
    var ourTeam = "3128";
    var matches = [
        {
            "match" : 0,
            "alliance" : "red",
            "time" : "Wed Dec 31 1969 16:00:00 GMT-0800 (PST)",
            "partner1" : "3128",
            "partner2" : "702",
            "partner3" : "1717",
            "blue1" : "3128",
            "blue2" : "702",
            "blue3" : "1717",
            "red1" : "3128",
            "red2" : "702",
            "red3" : "1717",
            "complete" : false
        },
    ];
    

    var storage = Storage(window);
    var prev = storage.load("gameWatcher");
    if(prev != false){
        matches = prev;
    }else{
        storage.save("gameWatcher", matches);
    }
    
    var currentMatch = false;

    function displayMatch(match){

        currentMatch = match;

        $("#countdown").html($.timeago(new Date(match.time)));
        $("#alliance").text(match.alliance);
        $("#alliance").removeClass("red");
        $("#alliance").removeClass("blue");
        if(match.alliance == "red"){
            $("#alliance").addClass("red");
        }else{
            $("#alliance").addClass("blue");
        }
        var d = new Date(match.time);
        var string = d.getHours() + ":" + d.getMinutes() + " AM";
        if(d.getHours() > 12){
            string = (d.getHours() - 12) + ":" + d.getMinutes() + " PM";
        }
        $("#time").text(string);
        $("#partner1").text(match.partner1);
        $("#partner2").text(match.partner2);
        $("#partner3").text(match.partner3);

    }

    function nextMatch(){
        console.log(matches);
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
            match = 0;
        }

        matches[match].complete = true;
        displayMatch(matches[match]);
    }

    function getNextMatch(){
        var current = currentMatch.match;

        var next = -1;
        var nextLength = 10000;

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

        //console.log("Match " + next + " picked.");

        return next;
    }

    function loadMatches(){
        var header = '<table class="sortable" cellpadding="0" cellspacing="0"><tr class="header"><td class="match">Match</td><td class="time">Time</td><td class="blue">Blue 1</td><td class="blue">Blue 2</td><td class="blue">Blue 3</td><td class="red">Red 1</td><td class="red">Red 2</td><td class="red">Red 3</td></tr></table>';

        var table = $(header);
        var len = matches.length;
        for(var i=0; i < len; i++){
            var match = matches[i];
            var data = $("<tr>");
            $(data).append($("<td>", {"class" : "match", "text" : match.match}));
            var d = new Date(match.time);
            var string = d.getHours() + ":" + d.getMinutes() + " AM";
            if(d.getHours() > 12){
                string = (d.getHours() - 12) + ":" + d.getMinutes() + " PM";
            }

            $(data).append($("<td>", {"class" : "time", "text" : string}));
            $(data).append($("<td>", {"class" : "blue", "text" : match.blue1}));
            $(data).append($("<td>", {"class" : "blue", "text" : match.blue2}));
            $(data).append($("<td>", {"class" : "blue", "text" : match.blue3}));
            $(data).append($("<td>", {"class" : "red", "text" : match.red1}));
            $(data).append($("<td>", {"class" : "red", "text" : match.red2}));
            $(data).append($("<td>", {"class" : "red", "text" : match.red3}));
            $(data).click(deleteMatch);
            $(table).append(data);
        }

        $("#tracker table:first").replaceWith(table);
    }

    function addMatch(){

        // Match Number
        var match = {};

        match.match = $("#input_match").val();
        if(match.match == ""){
            return;
        }
        var t = new Date();
        console.log(t);
        t.setHours(parseInt($("#input_hour").val(), 10));
        t.setMinutes(parseInt($("#input_minute").val(), 10));
        match.time = t.toString();
        console.log(t);
        
        match.blue1 = $("#input_blue1").val();
        match.blue2 = $("#input_blue2").val();
        match.blue3 = $("#input_blue3").val();
        match.red1 = $("#input_red1").val();
        match.red2 = $("#input_red2").val();
        match.red3 = $("#input_red3").val();

        if(match.blue1 == ourTeam || match.blue2 == ourTeam || match.blue3 == ourTeam){
            match.alliance = "blue";
            match.partner1 = match.blue1;
            match.partner2 = match.blue2;
            match.partner3 = match.blue3;
        }
        else if(match.red1 == ourTeam || match.red2 == ourTeam || match.red3 == ourTeam){
            match.alliance = "red";
            match.partner1 = match.red1;
            match.partner2 = match.red2;
            match.partner3 = match.red3;
        }
        else{
            match.alliance = "NA"
            match.partner1 = "-";
            match.partner2 = "-";
            match.partner3 = "-";
        }

        matches[matches.length] = match;

        var len = matches.length;
        for(var i=0; i < len; i++){
            matches[i].complete = false;
        }

        storage.save("gameWatcher", matches);

        loadMatches();

    }

    var deleteMatch = function(){
        var match = parseInt($(this).children("td:first").text(), 10);
        var len = matches.length;
        for(var i=0; i < len; i++){
            if(matches[i]["match"] == match)
            {
                matches.splice(i, 1);
                storage.save("gameWatcher", matches);
                loadMatches();
                return;
            }
        }
    }

    var displayCurrentTime = function(){
        var date = new Date();

        var min = date.getMinutes();
        if(min < 15){
            //date.setMinutes((min - 10) + 60);
            //date.setHours(date.getHours() - 1)
        }else{
            //date.setMinutes((min - 10));
        }

        var string = date.getHours() + ":" + date.getMinutes() + " AM";
        if(date.getHours() > 12){
            string = (date.getHours() - 12) + ":" + date.getMinutes() + " PM";
        }

        $("#currentTime").text(string + " (10 minutes late)");
    }
    setInterval(displayCurrentTime, 100);

    var displayMatchTime = function(){
        var date = new Date(currentMatch.time);

        var min = date.getMinutes();
        if(min > 45){
            date.setMinutes((min + 1) - 60);
            //date.setHours(date.getHours() + 1)
        }else{
            //date.setMinutes((min ));
        }

        $("#countdown").html("Match #" + currentMatch.match + " starts " + $.timeago(date));
    }
    setInterval(displayMatchTime, 100);

    

    nextMatch();
    loadMatches();

    $("#countdown").click(function(){
        nextMatch();
    });
    $("#addMatch").click(function(){
        addMatch();
        return false;
    });
    $("#showWatcher").click(function(){
        $("#watcher").show();
        $("#tracker").hide();
    });
    $("#showTracker").click(function(){
        $("#watcher").hide();
        $("#tracker").show();
    });
    window.nextMatch = function(){
        nextMatch();
    }
})