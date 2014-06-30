$(document).ready(function() {

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
    $("#gameAlerts").append("<br/>" + this.name + " draws a question off the deck.")
    if (qD.questions.length == 0) {
      $("#gameAlerts").append("<br/>" + "There are no more questions on the deck! " + this.name + " is going off the rails and is asking a difficult question about their specialty!");
      questionOnTable = new QuestionCard(this.specialty, 2);
      
    }
    else {
      var currentQ = qD.draw();
      if (this.wantsToAsk(currentQ.specialty)) {
        $("#gameAlerts").append("<br/>" + this.name + " likes this " + this.specInterp(currentQ.specialty) + " question. They're about to ask it.")
        questionOnTable = currentQ;
      }
      else {
        $("#gameAlerts").append("<br/>" + this.name + " tosses the " + this.specInterp(currentQ.specialty)+ " question card away in disgust.")
        this.askAQuestion();
      }
    }
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

    if (questionOnTable.specialty == 0) {
      if (this.gen >= ((Math.floor(Math.random() * 10)) + 1)) {
        $("#gameAlerts").append("<br/>" + this.name + " deftly handles the " + this.specInterp(questionOnTable.specialty) + " question.");
          //insert score keeping here
      }
      else {
        $("#gameAlerts").append("<br/>" + this.name + " handles the " + this.specInterp(questionOnTable.specialty) + " question terribly!");
          //insert score keeping here
      }
    }

    else if (questionOnTable.specialty == 1) {
      if (this.foreign >= ((Math.floor(Math.random() * 10)) + 1)) {
        $("#gameAlerts").append("<br/>" + this.name + " deftly handles the " + this.specInterp(questionOnTable.specialty) + " question.");
          //insert score keeping here
      }
      else {
        $("#gameAlerts").append("<br/>" + this.name + " handles the " + this.specInterp(questionOnTable.specialty) + " question terribly!");
          //insert score keeping here
      }      
    }

    else {
      if (this.domestic >= ((Math.floor(Math.random() * 10)) + 1)) {
        $("#gameAlerts").append("<br/>" + this.name + " deftly handles the " + this.specInterp(questionOnTable.specialty) + " question.");
          //insert score keeping here
      }
      else {
        $("#gameAlerts").append("<br/>" + this.name + " handles the " + this.specInterp(questionOnTable.specialty) + " question terribly!");
          //insert score keeping here
      }      
    }

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
    questioningReporter = this.repQueue.splice(0, 1)[0];
    $(".reporter").fadeOut("slow");
    $("#currentreporter").html(questioningReporter.name + "<br/>" + questioningReporter.specInterp(questioningReporter.specialty));
    $("#r1").html(this.repQueue[0].name + "<br/>" + questioningReporter.specInterp(this.repQueue[0].specialty));
    $("#r2").html(this.repQueue[1].name + "<br/>" + questioningReporter.specInterp(this.repQueue[1].specialty));
    $("#currentreporter").fadeIn("slow");
    $("#r1").fadeIn("slow");  
    $("#r2").fadeIn("slow");
  }
  this.repAfterThisOne = function () {
    //meant to be called after nextRep()
    return this.repQueue[0];
  }
  this.repDone = function () {
    this.repQueue[this.repQueue.length] =  questioningReporter;
    $(".reporter").fadeOut("slow");
    $("#r1").html(this.repQueue[0].name + "<br/>" + questioningReporter.specInterp(this.repQueue[0].specialty));
    $("#r2").html(this.repQueue[1].name + "<br/>" + questioningReporter.specInterp(this.repQueue[1].specialty));
    $("#r3").html(this.repQueue[2].name + "<br/>" + questioningReporter.specInterp(this.repQueue[2].specialty));
    $("#r1").fadeIn("slow");  
    $("#r2").fadeIn("slow");  
    $("#r3").fadeIn("slow");
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

$("lmin").html(saul.name + "<br/>" + saul.specInterp(saul.specialty));
$("mmin").html(sam.name + "<br/>" + sam.specInterp(sam.specialty));
$("rmin").html(sil.name + "<br/>" + sil.specInterp(sil.specialty));

var currentMinister = sam;

var theQuestionsGame = function () {
  while(qD.questions.length != 0) {
    //Basic game flow

    ourLine.nextRep();
    afterThis = ourLine.repAfterThisOne();
    questioningReporter.askAQuestion();

    $("#gameAlerts").append("<br/>" + "Minister " + currentMinister.name + " who has " + currentMinister.specInterp(currentMinister.specialty) + " knowledge has the panel microphone. Do you want to switch ministers?")

    if (currentMinister.next != null && currentMinister.previous != null) {
      $("#gameAlerts").append("<br/>" + "You can switch to " + currentMinister.previous.name + " who has " + currentMinister.specInterp(currentMinister.previous.specialty) + " knowledge. You could also switch to " + currentMinister.next.name + " who has " + currentMinister.specInterp(currentMinister.next.specialty) + " knowledge.");
      var chooseMinister = prompt("Type " + currentMinister.name + " to keep the current Minister or type " + currentMinister.previous.name + " or " + currentMinister.next.name + " to switch to them.").toUpperCase();
      
      switch(chooseMinister) {
        case currentMinister.previous.name.toUpperCase():
        currentMinister = currentMinister.previous;
        $("#gameAlerts").append("<br/>" + currentMinister.name + " gets the microphone and prepares to answer the question.");
        break;

        case currentMinister.name.toUpperCase():
        currentMinister = currentMinister;
        $("#gameAlerts").append("<br/>" + currentMinister.name + " keeps the microphone and prepares to answer the question.");
        break;

        case currentMinister.next.name.toUpperCase():
        currentMinister = currentMinister.next;
        $("#gameAlerts").append("<br/>" + currentMinister.name + " gets the microphone and prepares to answer the question.");
        break;

        default: 
        $("#gameAlerts").append("<br/>" + "Your ministers didn't understand your instructions. In the confusion, the current minister grasps the microphone tighter; " + currentMinister.name + " still has the microphone!");
      }
    }

    else if (currentMinister.next != null && currentMinister.previous == null) {
      $("#gameAlerts").append("<br/>" + "You can switch to " + currentMinister.next.name + " who has " + currentMinister.specInterp(currentMinister.next.specialty) + " knowledge.");
      var chooseMinister = prompt("Type " + currentMinister.name + " to keep the current Minister or type " + currentMinister.next.name + " to switch to them.").toUpperCase();    

      switch(chooseMinister) {

        case currentMinister.name.toUpperCase():
        currentMinister = currentMinister;
        $("#gameAlerts").append("<br/>" + currentMinister.name + " keeps the microphone and prepares to answer the question.");
        break;

        case currentMinister.next.name.toUpperCase():
        currentMinister = currentMinister.next;
        $("#gameAlerts").append("<br/>" + currentMinister.name + " gets the microphone and prepares to answer the question.");
        break;

        default: 
        $("#gameAlerts").append("<br/>" + "Your ministers didn't understand your instructions. In the confusion, the current minister grasps the microphone tighter; " + currentMinister.name + " still has the microphone!");    
      }
    }
    else {
      $("#gameAlerts").append("<br/>" + "You can switch to " + currentMinister.previous.name + " who has " + currentMinister.specInterp(currentMinister.previous.specialty) + " knowledge.");
      var chooseMinister = prompt("Type " + currentMinister.name + " to keep the current Minister or type " + currentMinister.previous.name + " to switch to them.").toUpperCase();    

      switch(chooseMinister) {

        case currentMinister.name.toUpperCase():
        currentMinister = currentMinister;
        $("#gameAlerts").append("<br/>" + currentMinister.name + " keeps the microphone and prepares to answer the question.");
        break;

        case currentMinister.previous.name.toUpperCase():
        currentMinister = currentMinister.previous;
        $("#gameAlerts").append("<br/>" + currentMinister.name + " gets the microphone and prepares to answer the question.");
        break;

        default: 
        $("#gameAlerts").append("<br/>" + "Your ministers didn't understand your instructions. In the confusion, the current minister grasps the microphone tighter; " + currentMinister.name + " still has the microphone!");    
      }    
    }

    currentMinister.askedAQuestion();
    ourLine.repDone();
    alert("Are you done with the current alerts?");
    $("#gameAlerts").empty();
  }
  $("#gameAlerts").append("<br/>" + "Samantha stands up and says, \"Well, that's all the questions. Thank you for coming to our panel. We look forward to reading your positive reports in the paper.\"");
}
theQuestionsGame();
//thanks to http://www.nczonline.net/blog/2009/04/21/computer-science-in-javascript-doubly-linked-lists/ for ideas on how to implement the doubly-linked list for the ministers.
})
