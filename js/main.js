var questionOnTable;
var questioningReporter;
var afterThis;

function Knowledge () {
  this.specInterp = function(number){
    var specialtyIndex = ["General Interest", "Foreign Interest", "Domestic Interest"]
    return specialtyIndex[number];
  }
}

function QuestionDeck() {
  this.questions = [];
  this.count = function() {
    return this.questions.length;
  }
  this.draw = function() {
    /*var newQCard = this.questions[(this.count - 1)];
    this.questions[(this.count - 1)] = null;
    return newQCard;*/
    return this.questions.pop();
  }
}

qD = new QuestionDeck;

function QuestionCard (specialty, difficulty) {
  this.specialty = specialty;
  this.difficulty = difficulty;
}

function Person(name, job, specialty) {
  this.name = name;
  this.job = job;
  this.specialty = specialty;
}


function Reporter(name, specialty) {
  this.name = name;
  this.job = "Reporter";
  this.specialty = specialty;
  /* Reporters like to ask questions about their specialty. 
  If a question is in their specialty, they ask it.
  Otherwise, there's a 50-50 chance they'll discard it and go to the next question in the stack */
  this.wantsToAsk = function(questionType) {
    if (questionType == this.specialty) {
      return true
    }
    else {
      var coinFlip;
      coinFlip = Math.floor(Math.random() * 2) 
      return coinFlip //This will be a boolean 0 or 1 so we don't have to write another if-else
    }
  }
  /*Before the panel begins, reporters write random questions with random difficulty and put it on the stack.
  FUTURE FEATURE: They're more likely to write questions about their specialty */
  this.writeAQuestion = function() {
    var randQType;
    randQType = Math.floor(Math.random() * 3);
    var questionDiff;
    questionDiff = Math.floor(Math.random() * 3);
    //Treat the question deck as a stack, find the next available slot and put the new question card there. Push would be a better option
    var i;
    i = 0;
    while((typeof qD.questions[i]) != "undefined") {
      i++
    }
    qD.questions[i] = new QuestionCard(randQType, questionDiff);
  } 

  this.askAQuestion = function() {
    console.log("In ask a question");
    $(document).ready(function() {
    $("#gameAlerts").append("<br/>" + questioningReporter.name + " draws a question off the deck.")
    if (qD.questions.length == 0) {
      $("#gameAlerts").append("<br/>" + "There are no more questions on the deck! " + questioningReporter.name + " is going off the rails and is asking a difficult question about their specialty!");
      questionOnTable = new QuestionCard(questioningReporter.specialty, 2);
      
    }
    else {
      var currentQ = qD.draw();
      if (questioningReporter.wantsToAsk(currentQ.specialty)) {
        $("#gameAlerts").append("<br/>" + questioningReporter.name + " likes this " + questioningReporter.specInterp(currentQ.specialty) + " question. They're about to ask it.")
        questionOnTable = currentQ;
        ministerSwitch();
      }
      else {
        $("#gameAlerts").append("<br/>" + questioningReporter.name + " tosses the " + questioningReporter.specInterp(currentQ.specialty)+ " question card away in disgust.")
        questioningReporter.askAQuestion();

      }
    }
  })
  }
}

function Minister(name, specialty) {
  this.name = name;
  this.job = "Minister";
  this.specialty = specialty;
  this.previous = 0;
  this.next = 0;
  this.intComp = function() {
    switch(this.specialty) {
      case 0:
      this.gen = 7;
      this.foreign = 5;
      this.domestic = 5;
      break;

      case 1: 
      this.gen = 4;
      this.foreign = 10;
      this.domestic = 3;
      break;

      case 2: 
      this.gen = 4;
      this.foreign = 3;
      this.domestic = 10;
      break;
    }
  }
  //Ministers answer questions successfully if they roll a number on a d10 less than or equal to their stat in that area.
  //DRY this up with object bracket notation with variables for the different specialty types.
  this.askedAQuestion = function() {
    console.log("In Minister is being asked a question.")
    $(document).ready(function() {
    if (questionOnTable.specialty == 0) {
      if (currentMinister.gen >= ((Math.floor(Math.random() * 10)) + 1)) {
        $("#gameAlerts").append("<br/>" + currentMinister.name + " deftly handles the " + currentMinister.specInterp(questionOnTable.specialty) + " question.");
          //insert score keeping here
          questionCleanUp();
      }
      else {
        $("#gameAlerts").append("<br/>" + currentMinister.name + " handles the " + currentMinister.specInterp(questionOnTable.specialty) + " question terribly!");
          //insert score keeping here
          questionCleanUp();
      }
    }

    else if (questionOnTable.specialty == 1) {
      if (currentMinister.foreign >= ((Math.floor(Math.random() * 10)) + 1)) {
        $("#gameAlerts").append("<br/>" + currentMinister.name + " deftly handles the " + currentMinister.specInterp(questionOnTable.specialty) + " question.");
          //insert score keeping here
          questionCleanUp();
      }
      else {
        $("#gameAlerts").append("<br/>" + currentMinister.name + " handles the " + currentMinister.specInterp(questionOnTable.specialty) + " question terribly!");
          //insert score keeping here
          questionCleanUp();
      }      
    }

    else {
      if (currentMinister.domestic >= ((Math.floor(Math.random() * 10)) + 1)) {
        $("#gameAlerts").append("<br/>" + currentMinister.name + " deftly handles the " + currentMinister.specInterp(questionOnTable.specialty) + " question.");
          //insert score keeping here
          questionCleanUp();
      }
      else {
        $("#gameAlerts").append("<br/>" + currentMinister.name + " handles the " + currentMinister.specInterp(questionOnTable.specialty) + " question terribly!");
          //insert score keeping here
          questionCleanUp();
      }      
    }
    
  })
  }
}
QuestionCard.prototype = new Knowledge();
Person.prototype = new Knowledge();
Reporter.prototype = new Person();
Minister.prototype = new Person();

var bob = new Reporter("Robert", 0);
var beth = new Reporter("Elizabeth", 1);
var bill = new Reporter("William", 2);

//each reporter writes [numberOfQuestions] questions
var numberOfQuestions;
numberOfQuestions = 2;
for (i = 0; i < numberOfQuestions; i++) {
bob.writeAQuestion();
beth.writeAQuestion();
bill.writeAQuestion();
}

function ReporterQueue() {
  this.repQueue = [bob, beth, bill]; //[]
  //this.startQueue = function() {} build a reporter queue from scratch
  this.nextRep = function () {
    console.log("next reporter to the microphone.")
    questioningReporter = this.repQueue.splice(0, 1)[0];
    $(document).ready(function() {
    $(".reporter").fadeOut("slow");
    $("#currentreporter").html(questioningReporter.name + "<br/>" + questioningReporter.specInterp(questioningReporter.specialty));
    $("#r1").html(ourLine.repQueue[0].name + "<br/>" + questioningReporter.specInterp(ourLine.repQueue[0].specialty));
    $("#r2").html(ourLine.repQueue[1].name + "<br/>" + questioningReporter.specInterp(ourLine.repQueue[1].specialty));
    $("#currentreporter").fadeIn("slow");
    $("#r1").fadeIn("slow");  
    $("#r2").fadeIn("slow");
    })
    questioningReporter.askAQuestion();
  }
  this.repAfterThisOne = function () {
    //meant to be called after nextRep()
    return this.repQueue[0];
  }
  this.repDone = function () {
    console.log("Reporter is returning to the queue.")
    this.repQueue[this.repQueue.length] =  questioningReporter;
    $(document).ready(function() {
    $(".reporter").fadeOut("slow");
    $("#r1").html(ourLine.repQueue[0].name + "<br/>" + questioningReporter.specInterp(ourLine.repQueue[0].specialty));
    $("#r2").html(ourLine.repQueue[1].name + "<br/>" + questioningReporter.specInterp(ourLine.repQueue[1].specialty));
    $("#r3").html(ourLine.repQueue[2].name + "<br/>" + questioningReporter.specInterp(ourLine.repQueue[2].specialty));
    $("#r1").fadeIn("slow");  
    $("#r2").fadeIn("slow");  
    $("#r3").fadeIn("slow");
    })
  }
} 
var ourLine = new ReporterQueue();

var saul = new Minister("Saul", 1);
var sam = new Minister("Samantha", 0);
var sil = new Minister("Silas", 2);

saul.intComp();
saul.previous = null;
saul.next = sam;

sam.intComp();
sam.previous = saul;
sam.next = sil;

sil.intComp();
sil.previous = sam;
sil.next = null;

$(document).ready(function() {
$("#lmin").html(saul.name + "<br/>" + saul.specInterp(saul.specialty));
$("#mmin").html(sam.name + "<br/>" + sam.specInterp(sam.specialty));
$("#rmin").html(sil.name + "<br/>" + sil.specInterp(sil.specialty));
})

var currentMinister = sam;
var switchClick;

var ministerSwitch = function() {
  console.log("ready for input");
  switchClick = false;
  $(document).ready(function() {
  $("#alert1").empty();
  $("#alert1").html("Do you want to pass the microphone? <br/> Click a vaild panelist to continue.");
  $("#alert1").fadeIn("slow");
  
  switch(currentMinister) {
    case sam:
      $("#lmin").removeClass();
      $("#mmin").addClass("curminister");
      $("#rmin").removeClass();

      $("#lmin").hover(
        function() {
          $("#lmin").addClass("possminister");
        },
        function() {
          $("#lmin").removeClass("possminister");
        }
        )

      $("#mmin").hover(
        function() {
          $("#mmin").removeClass("curminister");
          $("#mmin").addClass("possminister");
        },
        function() {
          $("#mmin").removeClass("possminister");
          $("#mmin").addClass("curminister");
        }
        )
      $("#rmin").hover(
        function() {
          $("#rmin").addClass("possminister");
        },
        function() {
          $("#rmin").removeClass("possminister");
        }
        )
      $("#lmin").on("click", function() {
        $("#mmin").removeClass("curminister");
        $("#lmin").addClass("curminister");
        currentMinister = saul;
        cleanUpMinClick(); 
      })
      $("#mmin").on("click", function() {
        $("#mmin").addClass("curminister");
        currentMinister = sam;
        cleanUpMinClick();
      })
      $("#rmin").on("click", function() {
        $("#mmin").removeClass("curminister");
        $("#rmin").addClass("curminister");
        currentMinister = sil;
        cleanUpMinClick();
      })
      break;

    case saul:
      $("#lmin").addClass("curminister");
      $("#mmin").removeClass();
      $("#rmin").removeClass();
      $("#lmin").hover(
        function() {
          $("#lmin").removeClass("curminister");
          $("#lmin").addClass("possminister");
        },
        function() {
          $("#lmin").removeClass("possminister");
          $("#lmin").addClass("curminister");
        }
        )
      $("#mmin").hover(
        function() {
          $("#mmin").addClass("possminister");
        },
        function() {
          $("#mmin").removeClass("possminister");
        }
        )
      $("#rmin").hover(
        function() {
          $("#rmin").addClass("impossminister");
        },
        function() {
          $("#rmin").removeClass("impossminister");
        }
        )
      $("#lmin").on("click", function() {
        currentMinister = saul;
        cleanUpMinClick();
      })
      $("#mmin").on("click", function() {
        $("#lmin").removeClass("curminister");
        $("#mmin").addClass("curminister");
        currentMinister = sam;
        cleanUpMinClick(); 
      })
      break;  

    case sil:
      $("#lmin").removeClass();
      $("#mmin").removeClass();
      $("#rmin").addClass("curminister");
      $("#lmin").hover(
        function() {
          $("#lmin").addClass("impossminister");
        },
        function() {
          $("#lmin").removeClass("impossminister");
        }
        )
      $("#mmin").hover(
        function() {
          $("#mmin").addClass("possminister");
        },
        function() {
          $("#mmin").removeClass("possminister");
        }
        )
      $("#rmin").hover(
        function() {
          $("#rmin").removeClass("curminister");
          $("#rmin").addClass("possminister");
        },
        function() {
          $("#rmin").removeClass("possminister");
          $("#rmin").addClass("curminister");
        }
        )
      $("#rmin").on("click", function() {
        currentMinister = sil;
        cleanUpMinClick();
      })
      $("#mmin").on("click", function() {
        $("#rmin").removeClass("curminister");
        $("#mmin").addClass("curminister");
        currentMinister = sam;
        cleanUpMinClick(); 
      })
      break;        
  }
})
}

var cleanUpMinClick = function() {
  console.log("cleaning up after you clicked on a minister.")
  $(document).ready(function() {
    $("#alert1").fadeOut("slow");

  switch(currentMinister) {
    case sam:
      $("#lmin").removeClass();
      $("#mmin").addClass("curminister");
      $("#rmin").removeClass();
      break;

    case saul:
      $("#lmin").addClass("curminister");
      $("#mmin").removeClass();
      $("#rmin").removeClass();
      break;

    case sil:
      $("#lmin").removeClass();
      $("#mmin").removeClass();
      $("#rmin").addClass("curminister");
      break;
  }
  //add next function call, should be the minister being asked the question.
  //TEST:
  currentMinister.askedAQuestion();
})
}

var questionCleanUp = function() {
    console.log("Cleaning up after the question was asked.")
    if(qD.questions.length != 0) {
      ourLine.repDone();
      $(document).ready(function() {
        $("#alert1").empty();
        //$("#alert1").html("Read the alerts on the right to see what's going on. <br/> Click me when you're ready to go on.");
        $("#alert1").html("Well, one round is all we can do. Come back for more rounds later!");
        $("#alert1").fadeIn("slow");
        /* 
        $("#alert1").on("click", function() {
          FIXIT: Code breaks after one round. 
          Enable newRound(); after bug is fixed. 
          ?Because of jQuery behavior stacking up in ministerSwitch? 
          newRound(); 
        })
        */
    })
    }
    else {
      $(document).ready(function() {
      $("#gameAlerts").append("<br/>" + "Samantha stands up and says, \"Well, that's all the questions. Thank you for coming to our panel. We look forward to reading your positive reports in the paper.\"");
      })
    }
}

var newRound = function() {
  console.log("Starting a new round.")
  $(document).ready(function() {
    $("#alert1").fadeOut("fast");
    $("#gameAlerts").empty();
  ourLine.nextRep();
})
}

newRound();