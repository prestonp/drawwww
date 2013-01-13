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
