// Base canvas
var canvaso = document.getElementById('drawwwwCanvas');
var ctxo = canvaso.getContext('2d');

// Buffer canvas
var container = canvaso.parentNode;
var canvas = document.createElement('canvas');
canvas.id = 'bufferCanvas';
canvas.width = canvaso.width;
canvas.height = canvaso.height;
canvas.top = canvaso.top;
container.appendChild(canvas);
$('#bufferCanvas').css('left', $('#drawwwwCanvas').offset()['left']);
$('#bufferCanvas').css('top', $('#drawwwwCanvas').offset()['top']);
var ctx = canvas.getContext('2d');
ctx.lineCap = 'round';

$(function() {
  /* Set up jQueryUI sliders */
  $('#size-slider').slider({
    value: 10,
    min: 1,
    max: 20,
    range: 'min',
    orientation: 'horizontal'
  });
  $('#opacity-slider').slider({
    value: 100,
    min: 1,
    max: 100,
    range: 'min',
    orientation: 'horizontal'
  });
});


/**
  This function draws the #imageTemp canvas on top of #imageView,
  after which #imageTemp is cleared. This function is called each time when the
  user completes a drawing operation.
**/
function imgUpdate () {
  ctxo.drawImage(canvas, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

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

$(document).ready(function() {
  init();
  var $currswatch = null;

  /** 
    Set current tool
  **/
  $('#tools button').on('click', function(event) {
    $('#tools button').removeClass('active');
    $(this).addClass('active');
    activateTool($(this).attr('id'));
  }); 

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

// Active tool instance
var tool = false;
var tool_default = 'brush';

// Holds impementation of each drawing tool
var tools = {};

function init() {

  // Activate default tool
  activateDefaultTool();

  // set up event handlers
  registerEventHandlers();
}

function activateDefaultTool() {
  // Find default tool
  var type = $('#tools button.active').attr('id');
    
  // Find control and apply active state
  activateTool(type);

  // Set current 'tool'
}

function activateTool(type) {
  switch(type) {
    case 'brush' :
      tool = new ToolPencil();
      break;
    case 'eraser' :
      tool = new ToolEraser();
      break;
    default :
      tool = new ToolPencil();
      break;
  }
}

function registerEventHandlers() {
  canvas.addEventListener('mousedown', canvasEvent, false);
  canvas.addEventListener('mousemove', canvasEvent, false);
  canvas.addEventListener('mouseup', canvasEvent, false);
}



function ToolPencil () {
  var tool = this;
  this.started = false;

  this.mousedown = function (e) {
    ctx.beginPath();
    ctx.strokeStyle = getColor();   
    ctx.moveTo(e._x, e._y);
    tool.started = true;
  };

  this.mousemove = function (e) {
    if(tool.started) {
      ctx.lineTo(e._x, e._y);
      ctx.lineWidth = $( "#size-slider" ).slider( "option", "value" );
      ctx.stroke();
      imgUpdate();
     }
  }; 

  this.mouseup = function (e) {
    if(tool.started) {
      tool.mousemove(e);
      tool.started = false;
      imgUpdate();
    }
  };
}

function ToolEraser() {
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
      ctx.strokeStyle = '#ffffff';
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

function getColor() {
  var color = $('.current-color').css('background-color');
  /*
  color = color.replace('rgb', 'rgba');
  color = color.replace(')', '');
  color += ', ' + ($( "#opacity-slider" ).slider( "option", "value" ) / 100.0) + ')';
  */
  ctx.globalAlpha = $( "#opacity-slider" ).slider( "option", "value" ) / 100.0;
  return rgba2hex(color);
}

function uploadImage() {
  //var imageData = ctxo.getImageData(0, 0, canvaso.width, canvaso.height);
  
  $.post('/images', 
  {
    img : canvaso.toDataURL(),
    title : $('#image-title').val(),
    user : $('#image-user').val()
  },
  function(data) {
    window.location.replace('./images/'+data);
    //alert(data);
  });
}

function clearImage() {
  ctxo.clearRect(0,0,canvaso.width,canvaso.height)
}

function imageDirectLink() {
  window.location.replace('http://' + $('#direct-link').val());
}
