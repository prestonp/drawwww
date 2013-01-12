var canvas = document.getElementById('drawwwwCanvas');
var ctx = canvas.getContext('2d');

ctx.fillStyle = 'red';
ctx.fillRect(30, 30, 50, 50);


$(function() {
  $('#size-slider').slider({
    value: 50,
    range: 'min',
    orientation: 'horizontal'
  });
  $('#opacity-slider').slider({
    value: 85,
    range: 'min',
    orientation: 'horizontal'
  });
});

//$('drawwwwCanvas').append("ppppp");
