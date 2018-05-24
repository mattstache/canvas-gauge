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
    canvasSize: 600,
    radius: 150,
    canvasCenter: null,
    ctx: null,
    unfilledStrokeWidth: 30,
    filledStrokeWidth: 50,
    setContext: function(){
      this.ctx = this.canvas.getContext('2d');
    },
    setCanvasCenter: function(){
      this.canvasCenter = this.canvasSize / 2
    },
    getRadianFromPercentage: function(percentValue){
      var tickRange = 1.5;
      var radianMultiplier = (tickRange * (percentValue * .01));
      var zeroPercentRadianMultiplier = .75;

      return ((zeroPercentRadianMultiplier + radianMultiplier) * Math.PI);
    },
    drawUnfilledArc: function(){
      this.arc(this.unfilledColor, this.unfilledStrokeWidth, this.radius - 10, this.getRadianFromPercentage(100));
    },
    drawFilledArc: function(){
      this.arc(this.filledColor, this.filledStrokeWidth, this.radius, this.getRadianFromPercentage(100));
    },
    arc: function(color, width, radius, arcEnd){
      this.ctx.beginPath();
      this.ctx.arc(this.canvasCenter, this.canvasCenter, radius, this.getRadianFromPercentage(0), arcEnd);
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
        this.ctx.arc(this.canvasCenter, this.canvasCenter,this.radius, startRadian, endRadian);
        this.ctx.strokeStyle = this.ticColor;
        this.ctx.lineWidth = this.filledStrokeWidth + 2;
        this.ctx.stroke();
      }
    },
    setupText: function(){
      var countVerticalPos = this.canvasCenter - 20;
      var topTextVerticalPos = countVerticalPos + 50;
      var bottomTextVerticalPos = topTextVerticalPos + 22;

      this.ctx.font = '88px serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#0c9cd2';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('6', this.canvasCenter, countVerticalPos);

      this.ctx.font = '20px serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#000';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('customers', this.canvasCenter, topTextVerticalPos);

      this.ctx.font = '20px serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#000';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('in 21 of 60 days', this.canvasCenter, bottomTextVerticalPos);
    },
    animate: function(currentPercent, endPercent){
      log('animate: ' + currentPercent)
      var self = this;
      this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
      this.drawUnfilledArc();
      this.arc(this.filledColor, this.filledStrokeWidth, this.radius, this.getRadianFromPercentage(currentPercent));
      this.drawTics();
      this.setupText();
      currentPercent++;
      if (currentPercent <= endPercent) {
        requestAnimationFrame(function () {
          self.animate(currentPercent, endPercent)
        });
      }
    },

    init: function(){
      this.canvas.width = this.canvasSize;
      this.canvas.height = this.canvasSize;
      this.setContext();
      this.setCanvasCenter();
      this.drawUnfilledArc();
      this.drawFilledArc();
      this.drawTics();
      this.setupText();

      this.animate(0, 90);
    }
  };

  CustomerGauge.init();
}