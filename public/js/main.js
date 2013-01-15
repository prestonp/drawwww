var canvas = document.getElementById('drawwwwCanvas');
var ctx = canvas.getContext('2d');

ctx.fillStyle = 'red';
ctx.fillRect(30, 30, 50, 50);


$(function() {
  /* Set up jQueryUI sliders */
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

$(document).ready(function() {
  init();
  var $currswatch = null;

  /**
    Convert rgb or rgba values 
    to hexadecimal
  **/
  function rgba2hex(str) {
    str = str.indexOf("rgba") !== -1 ?
            str.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/) : 
            str.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(str[1]) + hex(str[2]) + hex(str[3]);
  }

  /**
    Double click swatches to open
    color picker
  **/  
  $('.swatch').live('dblclick', function() {
    var $curr = $(this);
    var $hex = rgba2hex($curr.css('background-color'));
    $('#colorModal').modal('show');
    $('#color').attr('value', $hex);
    $('#colorpicker').farbtastic('#color');
    $currswatch = $curr;
  });

  /**
    Click a swatch to set
    current color
  **/
  $('.swatch').live('click', function() {
    var $curr = $(this);
    var $hex = rgba2hex($curr.css('background-color'));
    $('.current-color').css('background-color', $hex);
  });

  /** 
    Set color after using
    the color picker
  **/
  $('#set-color').click(function() {
    var $hex = $('#color').attr('value');
    $currswatch.css('background-color', $hex);
    $('#colorModal').modal('hide');
  }); 
 
});

function init() {

  tool = new ToolPencil();

  canvas.addEventListener('mousedown', canvasEvent, false);
  canvas.addEventListener('mousemove', canvasEvent, false);
  canvas.addEventListener('mouseup', canvasEvent, false);
}

function ToolPencil () {
  var tool = this;
  this.started = false;

  this.mousedown = function (e) {
    ctx.beginPath();
    ctx.moveTo(e._x, e._y);
    tool.started = true;
  };

  this.mousemove = function (e) {
    if(tool.started) {
      ctx.lineTo(e._x, e._y);
      ctx.stroke();
     }
  }; 

  this.mouseup = function (e) {
    if(tool.started) {
      tool.mousemove(e);
      tool.started = false;
    }
  };
}

function canvasEvent (e) {
  if(e.layerX || e.layerX == 0) {
    e._x = e.layerX;
    e._y = e.layerY;
  } else if (e.offsetX || e.offsetX == 0) {
    e._x = e.offsetX;
    e._y = e.offsetY;
  }

  var func = tool[e.type];
  if (func) {
    func(e);
  }
}
var started = false;
function mousemoveEvent(e) {
  var x, y;

  if (e.layerx || e.layerX == 0) { // Firefox
     x = e.layerX;
     y = e.layerY;
  } else if (e.offsetX || e.offsetX == 0) { //Opera
     x = e.offsetX;
     y = e.offsetY;
  }

  if(!started) {
     ctx.beginPath();
     ctx.moveTo(x, y);
     started = true;
  } else {
     ctx.lineTo(x, y);
     ctx.stroke();
  }
}
