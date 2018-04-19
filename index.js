

$(document).ready(function() {

var rangePicker = new Dreampicker('#date_range',
                    options = {
                      minDate : {
                        month : 04,
                        year : 2018,
                        day : 19
                      },
                      maxDate : {
                        month : 0,
                        year : 0,
                        day : 0
                      },
                      outputMonth : 2,
                      range: true,
                      defaultDate :true
                    }
       );


var simplePicker = new Dreampicker('#simple_date',
                    options = {
                      minDate : {
                        month : 04,
                        year : 2018,
                        day : 19
                      },
                      maxDate : {
                        month : 0,
                        year : 0,
                        day : 0
                      },
                      outputMonth : 1,
                      range: false,
                      defaultDate :true
                    }
       );


var simplePicker2 = new Dreampicker('#simple_date2',
                    options = {
                      minDate : {
                        month : 04,
                        year : 2018,
                        day : 19
                      },
                      maxDate : {
                        month : 0,
                        year : 0,
                        day : 0
                      },
                      outputMonth : 1,
                      range: false,
                      defaultDate :true
                    }
       );


var simplePicker3 = new Dreampicker('#simple_date3',
                    options = {
                      minDate : {
                        month : 04,
                        year : 2018,
                        day : 19
                      },
                      maxDate : {
                        month : 0,
                        year : 0,
                        day : 0
                      },
                      outputMonth : 1,
                      range: false,
                      defaultDate :true
                    }
       );


var simplePicker4 = new Dreampicker('#simple_date4',
                    options = {
                      minDate : {
                        month : 0,
                        year : 0,
                        day : 0
                      },
                      maxDate : {
                        month : 0,
                        year : 0,
                        day : 0
                      },
                      outputMonth : 1,
                      range: false,
                      defaultDate :true
                    }
       );


$.event.special.inputchange = {
    setup: function() {
        var self = this, val;
        $.data(this, 'timer', window.setInterval(function() {
            val = self.value;
            if ( $.data( self, 'cache') != val ) {
                $.data( self, 'cache', val );
                $( self ).trigger( 'inputchange' );
            }
        }, 20));
    },
    teardown: function() {
        window.clearInterval( $.data(this, 'timer') );
    },
    add: function() {
        $.data(this, 'cache', this.value);
    }
};




$('#open').on('click',function(){

  simplePicker2.openCalendar();



});

$('#getDay1').on('click',function(){


  this.closest('.calendar-wrap').append(rangePicker.getDate().dateStart);
  this.closest('.calendar-wrap').append(rangePicker.getDate().dateEnd);

});
$('#getDay2').on('click',function(){


  this.closest('.calendar-wrap').append(simplePicker.getDate().singleDate);

});


$('#simple_date3 input').on('inputchange',function(){
  
  var date = $(this).val();

  var dates = date.split('.');

  simplePicker4.setMinDate(dates);

});

});