window.onload = function(){

  var log = console.log;
  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');

  var deg0   = (1.5 * Math.PI);
  var deg90  = (0   * Math.PI);
  var deg135  = (0.25   * Math.PI);
  var deg180 = (0.5 * Math.PI);
  var deg225 = (0.75 * Math.PI);
  var deg270 = (1   * Math.PI);
  var ticColor = '#fff';
  var unfilledColor = '#d4d0c8';
  var filledColor = '#2b8b43';

  var canvasSize = 600;
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  var x = canvasSize/2,
  y = canvasSize/2,
  radius = 150,
      angleStart = deg225,
      angleEnd = deg135,
      filledStrokeWidth = 50;

      var lineLength = radius + filledStrokeWidth;


  //Draw circle
  ctx.beginPath();
  ctx.arc(x, x, radius, 0, 2*Math.PI, false);
  ctx.lineWidth = 30;
  ctx.strokeStyle = 'rgba(255,255,255, 0.2)'
  ctx.stroke();

  //Draw arc full
  ctx.beginPath();
  ctx.arc(x, y, radius - 10, angleStart, angleEnd);
  ctx.strokeStyle = unfilledColor;
  ctx.lineWidth = 30;
  ctx.stroke();

  //Draw arc full
  ctx.beginPath();
  ctx.arc(x, y, radius, angleStart, deg0);
  ctx.strokeStyle = filledColor;
  ctx.lineWidth = filledStrokeWidth;
  ctx.stroke();

  for(var i = 1; i <=10; i++){
    var multiplier = (i * .15);
    var startRadian = ((.75 + multiplier) * Math.PI);
    var endRadian = ((.75 + multiplier + .01) * Math.PI);

    ctx.beginPath();
    ctx.arc(x, y, radius, startRadian, endRadian);
    ctx.strokeStyle = ticColor;
    ctx.lineWidth = filledStrokeWidth + 2;
    ctx.stroke();
  }

  var verticalCenter = canvasSize/2;
  var countVerticalPos = verticalCenter - 20;
  var topTextVerticalPos = countVerticalPos + 50;
  var bottomTextVerticalPos = topTextVerticalPos + 22;

  ctx.font = '88px serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0c9cd2';
  ctx.textBaseline = 'middle';
  ctx.fillText('6', canvasSize/2, countVerticalPos);

  ctx.font = '20px serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#000';
  ctx.textBaseline = 'middle';
  ctx.fillText('customers', canvasSize/2, topTextVerticalPos);

  ctx.font = '20px serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#000';
  ctx.textBaseline = 'middle';
  ctx.fillText('in 21 of 60 days', canvasSize/2, bottomTextVerticalPos);

}