window.onload = function(){
  var log = console.log;

  // requestAnimationFrame Shim
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;

  var CustomerGauge = {
    canvas: document.querySelector('canvas'),
    ticColor: '#fff',
    unfilledColor: '#d4d0c8',
    filledColor: '#4aae34',
    darkGray: '#8b8b8b',
    openSans: "'Open Sans', sans-serif",
    radius: 150,
    canvasCenter: {},
    ctx: null,
    unfilledStrokeWidth: 45,
    filledStrokeWidth: 50,
    canvasSize: {},
    labelLineLength: 200,
    setCanvasSize: function(){
      this.canvasSize.height = ((this.radius) + (this.filledStrokeWidth * 4));
      this.canvasSize.width = ((this.radius) + (this.filledStrokeWidth * 4) + (this.labelLineLength * 2));
    },
    setContext: function(){
      this.ctx = this.canvas.getContext('2d');

      this.ctx.textBaseline = 'middle';
      this.ctx.textAlign = 'center';
    },
    setCanvasCenter: function(){
      this.canvasCenter = {x:this.canvasSize.width / 2, y:this.canvasSize.height / 2};
    },
    getRadianFromPercentage: function(percentValue){
      var tickRange = 1.5;
      var radianMultiplier = (tickRange * (percentValue * .01));
      var zeroPercentRadianMultiplier = .75;

      return ((zeroPercentRadianMultiplier + radianMultiplier) * Math.PI);
    },
    drawUnfilledArc: function(){
      this.drawArc(this.unfilledColor, this.unfilledStrokeWidth, this.radius - ((this.filledStrokeWidth - this.unfilledStrokeWidth)/2), this.getRadianFromPercentage(100));
    },
    drawFilledArc: function(){
      this.drawArc(this.filledColor, this.filledStrokeWidth, this.radius, this.getRadianFromPercentage(100));
    },
    drawArc: function(color, width, radius, arcEnd){
      this.ctx.beginPath();
      this.ctx.arc(this.canvasCenter.x, this.canvasCenter.y, radius, this.getRadianFromPercentage(0), arcEnd);
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = width;
      this.ctx.stroke();
    },
    drawTics: function(){
      for(var i = 1; i <=10; i++){
        var multiplier = (i * .15);
        var startRadian = ((.75 + multiplier) * Math.PI);
        var endRadian = ((.75 + multiplier + .01) * Math.PI);

        this.ctx.beginPath();
        this.ctx.arc(this.canvasCenter.x, this.canvasCenter.y,this.radius, startRadian, endRadian);
        this.ctx.strokeStyle = this.ticColor;
        this.ctx.lineWidth = this.filledStrokeWidth + 2;
        this.ctx.stroke();
      }

      this.drawMilestoneTics();
    },
    drawMilestoneTics: function(){
      // black tic
      this.ctx.beginPath();
      this.ctx.arc(this.canvasCenter.x, this.canvasCenter.y,this.radius, this.getRadianFromPercentage(10), this.getRadianFromPercentage(10.3));
      this.ctx.strokeStyle = this.newAnimationPercent >= 10 ? '#000' : this.darkGray;
      this.ctx.stroke();

      // end tic
      this.ctx.beginPath();
      this.ctx.arc(this.canvasCenter.x, this.canvasCenter.y,this.radius, this.getRadianFromPercentage(99.7), this.getRadianFromPercentage(100));
      this.ctx.strokeStyle = Math.ceil(this.newAnimationPercent) === 100 ? '#000' : this.darkGray;
      this.ctx.stroke();
    },
    drawMilestoneLinesAndLabels: function(){
      // setup milestone 1 line
      var milestone1Achieved = this.newAnimationPercent >= 10;
      this.m1yPos = this.canvasCenter.y + (this.radius/2.83);
      this.m1xPos = this.canvasCenter.x - this.radius - 18;
      this.ctx.beginPath();
      this.ctx.strokeStyle = milestone1Achieved ? '#000' : this.darkGray;
      this.ctx.moveTo(this.m1xPos, this.m1yPos);
      this.ctx.lineWidth = 3;
      this.ctx.lineTo(this.m1xPos - this.labelLineLength, this.m1yPos);
      this.ctx.stroke();

      // setup dark gray line
      var milestone2Achieved = Math.ceil(this.newAnimationPercent) === 100;
      this.m2yPos = this.canvasCenter.y + (this.radius/1.21);
      this.m2xPos = this.canvasCenter.x + this.radius - 25;
      this.ctx.beginPath();
      this.ctx.strokeStyle = milestone2Achieved ? '#000' : this.darkGray;
      this.ctx.moveTo(this.m2xPos, this.m2yPos);
      this.ctx.lineWidth = 3;
      this.ctx.lineTo(this.m2xPos + this.labelLineLength, this.m2yPos);
      this.ctx.stroke();

      this.drawMilestoneLabels();
    },
    drawMilestoneLabels: function(){
      this.ctx.font = "16px " + this.openSans;
      this.ctx.fillStyle = this.darkGray;
      this.ctx.fillText('Milestone 1', this.m1xPos - (this.labelLineLength/2), this.m1yPos + 15);

      this.ctx.font = "22px " + this.openSans;
      this.ctx.fillStyle = this.darkGray;
      this.ctx.fillText('10 Customers', this.m1xPos - (this.labelLineLength/2), this.m1yPos + 35);

      this.ctx.font = "16px " + this.openSans;
      this.ctx.fillStyle = this.darkGray;
      this.ctx.fillText('Milestone 2', this.m2xPos + (this.labelLineLength/2), this.m2yPos - 35);

      this.ctx.font = "22px " + this.openSans;
      this.ctx.fillStyle = this.darkGray;
      this.ctx.fillText('100 Customers', this.m2xPos + (this.labelLineLength/2), this.m2yPos - 15);
    },
    drawText: function(customerCount){
      var countVerticalPos = this.canvasCenter.y - 20;
      var topTextVerticalPos = countVerticalPos + 50;
      var bottomTextVerticalPos = topTextVerticalPos + 22;

      this.ctx.font = "88px " + this.openSans;
      this.ctx.fillStyle = '#0c9cd2';
      this.ctx.fillText(customerCount, this.canvasCenter.x, countVerticalPos);

      this.ctx.font = "20px " + this.openSans;
      this.ctx.fillStyle = '#000';
      this.ctx.fillText('customers', this.canvasCenter.x, topTextVerticalPos);

      this.ctx.font = "20px " + this.openSans;
      this.ctx.fillStyle = '#000';
      this.ctx.fillText('in ' + this.daysElapsed + ' of 60 days', this.canvasCenter.x, bottomTextVerticalPos);
    },
    easeInOutQuart: function(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
      return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    newAnimationPercent: 0,

    animateArc: function(endPercent){
      var self = this;
      var time = new Date().getTime() - this.start;
      if (time <= this.duration) {
        var x = this.easeInOutQuart(time, 0, endPercent - 0, this.duration);
        this.newAnimationPercent = x;
      }else{
        this.arcAnimationFinished = true;
        this.newAnimationPercent = this.endPercent;
      }
    },

    setupMilestone1IconAnimation: function(){
        var self = this;
      
        if(typeof this.iconAnimationStartTime === 'undefined'){
          this.iconAnimationStartTime = new Date().getTime();
        }
        var time = new Date().getTime() - this.iconAnimationStartTime;
        if (time <= this.iconDuration) {
          var x = this.easeInOutQuart(time, 0, 1, this.iconDuration);
          var m1IconFontSize = Math.ceil(32/(x));
          self.m1IconFontSize = m1IconFontSize;
          this.milestone1AnimationStarted = true;
        }else{
          this.milestone1AnimationFinished = true;
        }
    },
    setupMilestone2IconAnimation: function(){
        var self = this;

        if(typeof this.icon2AnimationStartTime === 'undefined'){
          this.icon2AnimationStartTime = new Date().getTime();
        }
        var time = new Date().getTime() - this.icon2AnimationStartTime;
        if (time <= this.iconDuration) {
          var x = this.easeInOutQuart(time, 0, 1, this.iconDuration);
          var m2IconFontSize = Math.ceil(32/(x));
          self.m2IconFontSize = m2IconFontSize;
          this.milestone2AnimationStarted = true;
        }else{
          this.milestone2AnimationFinished = true;
        }
    },
    getAnimationFinished: function(){
      if(this.milestone1AnimationStarted && !this.milestone1AnimationFinished){
        return false;
      }

      if(this.milestone2AnimationStarted && !this.milestone2AnimationFinished){
        return false;
      }

      return this.arcAnimationFinished;
    },
    arcAnimationFinished: false,
    setupAndRunAnimation: function(fillPercent){
      this.duration = 1500;
      this.start = new Date().getTime();

      this.iconDuration = 2000;
      this.endPercent = fillPercent;
      this.runAnimation(fillPercent);
    },
    runAnimation: function(fillPercent){
      var self = this;
      requestAnimationFrame(function(){
        if(!self.getAnimationFinished()){
          self.runAnimation(fillPercent)
        }
      });
      this.animateArc(fillPercent);
      this.draw();
    },
    draw: function(){
      this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);

      this.drawUnfilledArc();
      this.drawMilestoneLinesAndLabels();

      this.drawArc(this.filledColor, this.filledStrokeWidth, this.radius, this.getRadianFromPercentage(this.newAnimationPercent));

      this.drawStaticTopElements();

      if(this.newAnimationPercent >= 10){
        this.setupMilestone1IconAnimation();
        this.drawMilestone1Icon();
      }

      if(this.newAnimationPercent >= 100){
        this.setupMilestone2IconAnimation();
        this.drawMilestone2Icon();
      }
    },
    drawStaticTopElements: function(){
      this.drawTics();
      this.drawText(Math.ceil(this.newAnimationPercent));
    },
    drawMilestone1Icon: function(){
      this.ctx.font = this.m1IconFontSize + "px FontAwesome";
      this.ctx.fillStyle = this.filledColor;
      this.ctx.fillText('\uf058', this.m1xPos - (this.labelLineLength/2), this.m1yPos - 20);
    },
    drawMilestone2Icon: function(){
      this.ctx.font = this.m2IconFontSize + "px FontAwesome";
      this.ctx.fillStyle = this.filledColor;
      this.ctx.fillText('\uf058', this.m2xPos + (this.labelLineLength/2), this.m2yPos - 60);
    },
    achievedMilestones: [],
    animateMilestone: function(){
      achievedMilestones.each(function(milestone){
        milestone.update();
      })
    },
    init: function(fillPercent, daysElapsed){
      this.setCanvasSize();
      this.daysElapsed = daysElapsed;
      this.canvas.width = this.canvasSize.width;
      this.canvas.height = this.canvasSize.height;
      this.setContext();
      this.setCanvasCenter();

      this.setupAndRunAnimation(fillPercent);
    }
  };

  // fillPercent, daysElapsed
  CustomerGauge.init(100, 12);
}