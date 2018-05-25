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
      this.arc(this.unfilledColor, this.unfilledStrokeWidth, this.radius - ((this.filledStrokeWidth - this.unfilledStrokeWidth)/2), this.getRadianFromPercentage(100));
    },
    drawFilledArc: function(){
      this.arc(this.filledColor, this.filledStrokeWidth, this.radius, this.getRadianFromPercentage(100));
    },
    arc: function(color, width, radius, arcEnd){
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
    setupLabels: function(){
      // setup milestone 1 line
      var milestone1Achieved = this.newAnimationPercent >= 10;
      var m1yPos = this.canvasCenter.y + (this.radius/2.83);
      var m1xPos = this.canvasCenter.x - this.radius - 18;
      this.ctx.beginPath();
      this.ctx.strokeStyle = milestone1Achieved ? '#000' : this.darkGray;
      this.ctx.moveTo(m1xPos, m1yPos);
      this.ctx.lineWidth = 3;
      this.ctx.lineTo(m1xPos - this.labelLineLength, m1yPos);
      this.ctx.stroke();

      if(milestone1Achieved){
        var m1IconFontSize = 32/(this.newAnimationPercent * .01);
        console.log(m1IconFontSize)
        this.ctx.font = m1IconFontSize + "px FontAwesome";
        this.ctx.fillStyle = this.filledColor;
        this.ctx.fillText('\uf058', m1xPos - (this.labelLineLength/2), m1yPos - 20);
      }

      // setup dark gray line
      var milestone2Achieved = Math.ceil(this.newAnimationPercent) === 100;
      var m2yPos = this.canvasCenter.y + (this.radius/1.21);
      var m2xPos = this.canvasCenter.x + this.radius - 25;
      this.ctx.beginPath();
      this.ctx.strokeStyle = milestone2Achieved ? '#000' : this.darkGray;
      this.ctx.moveTo(m2xPos, m2yPos);
      this.ctx.lineWidth = 3;
      this.ctx.lineTo(m2xPos + this.labelLineLength, m2yPos);
      this.ctx.stroke();

      if(milestone2Achieved){
        var m2IconFontSize = 32/(this.newAnimationPercent * .01);
        this.ctx.font = m2IconFontSize + "px FontAwesome";
        this.ctx.fillStyle = this.filledColor;
        this.ctx.fillText('\uf058', m2xPos + (this.labelLineLength/2), m2yPos - 60);
      }

      this.setupMilestoneLabels(m1xPos, m1yPos, m2xPos, m2yPos);
    },
    setupMilestoneLabels: function(m1xPos, m1yPos, m2xPos, m2yPos){
      this.ctx.font = "16px " + this.openSans;
      this.ctx.fillStyle = this.darkGray;
      this.ctx.fillText('Milestone 1', m1xPos - (this.labelLineLength/2), m1yPos + 15);

      this.ctx.font = "22px " + this.openSans;
      this.ctx.fillStyle = this.darkGray;
      this.ctx.fillText('10 Customers', m1xPos - (this.labelLineLength/2), m1yPos + 35);

      this.ctx.font = "16px " + this.openSans;
      this.ctx.fillStyle = this.darkGray;
      this.ctx.fillText('Milestone 2', m2xPos + (this.labelLineLength/2), m2yPos - 35);

      this.ctx.font = "22px " + this.openSans;
      this.ctx.fillStyle = this.darkGray;
      this.ctx.fillText('100 Customers', m2xPos + (this.labelLineLength/2), m2yPos - 15);
    },
    setupText: function(customerCount){
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
    runAnimation: function(fillPercent){
      this.duration = 1500;
      this.start = new Date().getTime();
      this.animate(fillPercent);
    },
    animate: function(endPercent){
      var self = this;
      var time = new Date().getTime() - this.start;
      if (time <= this.duration) {
        this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
        this.drawUnfilledArc();
        this.setupLabels();

        var x = this.easeInOutQuart(time, 0, endPercent - 0, this.duration);
        this.newAnimationPercent = x;
        this.arc(this.filledColor, this.filledStrokeWidth, this.radius, this.getRadianFromPercentage(this.newAnimationPercent));

        this.drawTics();
        this.setupText(Math.ceil(this.newAnimationPercent));

        requestAnimationFrame(function () {self.animate(endPercent)});
      }
    },
    animateMilestone: function(){

    },
    init: function(fillPercent, daysElapsed){
      this.setCanvasSize();
      this.daysElapsed = daysElapsed;
      this.canvas.width = this.canvasSize.width;
      this.canvas.height = this.canvasSize.height;
      this.setContext();
      this.setCanvasCenter();
      this.drawUnfilledArc();
      this.drawFilledArc();
      this.drawTics();
      this.setupText();

      this.runAnimation(fillPercent);
    }
  };

  // fillPercent, daysElapsed
  CustomerGauge.init(100, 12);
}