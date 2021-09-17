document.addEventListener('DOMContentLoaded', function () {
    // инициализация слайдера
    var slider = new SimpleAdaptiveSlider('.slider', {
      autoplay: true,
      interval: 5000,
    });
});

var RangeSlider = function(containerID) {
  var self = this,
      $RangeSlider = $('#'+containerID),
      $SliderThumnb = $RangeSlider.find('.RangeSlider_Thumb'),
      $SliderTrack = $RangeSlider.find('.RangeSlider_Track'),
      $SliderTrackFill = $RangeSlider.find('.RangeSlider_TrackFill'),
      $ClickArea = $RangeSlider.find('.RangeSlider_ClickArea'),
      $SliderPoints = $RangeSlider.find('.RangeSlider_Point');
  
  this.value = 0;
    
  /* helper to find slider value based on filled track width */
  var findValueFromTrackFill = function(trackFillWidth) {
    var totalWidth = $SliderTrack.width(),
        onePercentWidth = totalWidth / 100,
        value = Math.round((trackFillWidth / onePercentWidth) / 10);
    return value;
  }
  
  /* change highlighted number based on new value */
  var updateSelectedValue = function(newValue) {
    $SliderPoints.removeClass('RangeSlider_PointActive');
    $SliderPoints.eq( newValue ).addClass('RangeSlider_PointActive');
  }
  
  /* highlight track based on new value (and move thumb) */
  var updateHighlightedTrack = function(newPosition) {
    newPosition = newPosition + '0%';
    $SliderTrackFill.css('width', newPosition);
  }
  
  /* set up drag funcationality for thumbnail */
  var setupDrag = function($element, initialXPosition) {
    $SliderTrackFill.addClass('RangeSlider_TrackFill-stopAnimation');
    var trackWidth = $SliderTrackFill.width();
    
    var newValue = findValueFromTrackFill( trackWidth );
    updateSelectedValue(newValue);
    
    $element.on('mousemove', function(e){
      var newPosition = trackWidth + e.clientX - initialXPosition;
      self.imitateNewValue( newPosition );
      
      newValue = findValueFromTrackFill( $SliderTrackFill.width() );
      updateSelectedValue(newValue);
    });
  }
  /* remove drag functionality for thumbnail */
  var finishDrag = function($element) {
    $SliderTrackFill.removeClass('RangeSlider_TrackFill-stopAnimation');
    $element.off('mousemove');
    var newValue = findValueFromTrackFill( $SliderTrackFill.width() );
    self.updateSliderValue( newValue );
  }
  
  /* method to update all things required when slider value updates */
  this.updateSliderValue = function(newValue) {
    updateSelectedValue( newValue );
    updateHighlightedTrack( newValue );
    self.value = newValue;
    console.log('this.value = ', self.value);
  }
  
  /* method to imitate new value without animation */
  this.imitateNewValue = function(XPosition) {
    $SliderTrackFill.addClass('RangeSlider_TrackFill-stopAnimation');
    if ( XPosition > $SliderTrack.width() ) {
      XPosition = $SliderTrack.width();
    }
    $SliderTrackFill.css('width', XPosition + 'px');
  }
  
  /*
   * bind events when instance created
   */
  $ClickArea.on('mousedown', function(e){
    /* if a number or thumbnail has been clicked, use their event instead */
    var $target = $(e.target);
    if ( $target.hasClass('RangeSlider_Thumb') ) {
      return false;
    }
    /* now we can continue based on where the clickable area was clicked */
    self.imitateNewValue( e.offsetX );
    setupDrag( $(this), e.clientX );
  });
  
  $ClickArea.on('mouseup', function(e){
    console.log('"$ClickArea" calling "finishDrag"');
    finishDrag( $(this) );
  });
  
  // update value when markers are clicked
  $SliderPoints.on('mousedown', function(e){
    e.stopPropagation();
    var XPos = $(this).position().left + ($(this).width()/2);
    self.imitateNewValue( XPos );
    setupDrag( $ClickArea, e.clientX );
  });
  
  // when thumbnail is clicked down, init the drag stuff
  $SliderThumnb.on('mousedown', function(e){
    e.stopPropagation();
    setupDrag( $(this), e.clientX );
  });
  
  // when the thumbnail is released, remove the drag stuff
  $SliderThumnb.on('mouseup', function(e){
    console.log('"$SliderThumnb" calling "finishDrag"');
    finishDrag( $(this) );
  });
}

var rangeSlider = new RangeSlider('RangeSlider');
var rangeSlider2 = new RangeSlider('RangeSlider2');
var rangeSlider2 = new RangeSlider('RangeSlider3');