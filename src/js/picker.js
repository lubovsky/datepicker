
    var defaults = {
      language : {
        monthArrayVal : ['','января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
        monthArray : ['','Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
        monthShortArray : ['','янв.','фев.','мар.','апр.','мая.','июн.','июл.','авг.','сен.','окт.','ноя.','дек.'],
        weekdayArray : ['','Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
        weekdayArrayLong : ['','понедельник','вторник','среда','четверг','пятница','суббота','воскресенье']
      },
      holydays : ['01012018','02012018','03012018','04012018','05012018','06012018','07012018','08012018','23022018'],
      daysInMonth : ['','31','28','31','30','31','30','31','31','30','31','30','31']
    }; 


    function getCoords(elem) { 
      var box = elem.getBoundingClientRect();


      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset,
        width: elem.offsetWidth,
        height: elem.offsetHeight,
        winWidth : $(window).width(),
        winHeight : $(window).height()
      };

    };


    function Dreampicker(element, options) {
      this.$element = $(element);
      this.elementID = element.slice(1);
      this.$pickerWraper = {};
      this.language = defaults.language;
      this.minDate = { 'day' : options.minDate.day,
                         'month' : options.minDate.month,
                         'year' : options.minDate.year
                        }; 
      this.maxDate = { 'day' : options.maxDate.day,
                       'month' : options.maxDate.month,
                       'year' : options.maxDate.year
                      }; 
      this.singleDate = null;
      this.singleDateId = null;

      this.outputMonth = options.outputMonth;

      this.range = options.range;


      this.defaultDate = true;

      this.target = '';

      this.startDate = null;
      this.endDate = null;

      this.startDateId = null;
      this.endDateId = null;
      
      this.holydays = defaults.holydays;

      this.daysInMonth = defaults.daysInMonth;


                        
      this.init();

    };

    // Инициализация

    Dreampicker.prototype.init = function() {
      
      var _this = this;

      this.createCalendar(); 

      this.render(); 

      this.$element.on('click',function(e){
           
           event.preventDefault();


           

          _this.openCalendar(e,$(this));


          //_this.fillRangePeriod(this.startDate,this.endDate,'select');

      });



      

      this.$pickerWraper.on('click','[data-datebtn]',function(){

           if (_this.target != '') {

             _this.selectRangeDate(_this.target,$(this));

           } else {

             _this.selectDate($(this));
           }
      });

      this.$pickerWraper.on('mouseover','[data-datebtn]',function(){
          
          if (_this.range) { 
            if (this.startDate != 'null' && _this.target != 'startDate' ) {
              var endDate = $(this).attr('data-date');
              _this.fillRangePeriod(_this.startDate,endDate,'hover');
            
            }
          }

      });

      
      this.$pickerWraper.on('mouseover','[data-datebtn]',function(){
        
        var startDateId = null;
        var endDateId = null;
          
        if (_this.range) { 

          if (_this.target == 'endDate') {
              
            var endDate = $(this).data('date');

            startDateId = _this.$pickerWraper.find('[data-date='+_this.startDate+']').attr('id');
            endDateId = $(this).attr('id');

             if (endDateId <= startDateId) {

              return false;

             } else {

              _this.$pickerWraper.find('[data-date='+_this.endDate+']').removeClass('selected');

              _this.fillRangePeriod(_this.startDate,endDate,'hover');

             }
            

                 
          } else if (_this.target == 'startDate') {
               
            var startDate = $(this).data('date');
          
            startDateId = $(this).attr('id');

            endDateId = _this.$pickerWraper.find('[data-date='+_this.endDate+']').attr('id');


             if (startDateId > endDateId) {
              return false;
             } else {
              _this.$pickerWraper.find('[data-date='+_this.startDate+']').removeClass('selected');
              _this.fillRangePeriod(startDate,_this.endDate,'hover');
             }
            
          }

          _this.$pickerWraper.find('[data-datebtn]').removeClass('period');
            
          }
      });

      this.$pickerWraper.on('mouseout',function() {
          _this.$pickerWraper.find('[data-datebtn]').removeClass('hovered');
          _this.fillRangePeriod(_this.startDate,_this.endDate,'select');  

          _this.$pickerWraper.find('[data-date='+_this.endDate+']').addClass('selected');
          _this.$pickerWraper.find('[data-date='+_this.startDate+']').addClass('selected');
         
         
      });


      
      this.$pickerWraper.on('click','[data-btn-month]', function(){

        
        

        var type = $(this).attr('data-btn-month');
        var newmonth,newyear;

        var month = $(this).closest('[data-date-picker]').children('[data-month-wrap]').attr('data-month');
        var year = $(this).closest('[data-date-picker]').children('[data-month-wrap]').attr('data-year');


        if (type == 'prev') {
         
          newmonth = (month == 1) ? 12 : parseInt(month) - 1;
          newyear = (month == 1) ? parseInt(year) - 1 : parseInt(year);

        } else if (type == 'next') {

          newmonth = (month == 12) ? 1 : parseInt(month) + 1;
          newyear = (month == 12) ? parseInt(year) + 1 : parseInt(year);
        }


        $(this).closest('[data-date-picker]').find('[data-month-wrap]').remove();

        var current = {
          'day' : 1,
          'month' : newmonth,
          'year' : newyear
        };

        for (var i=0; i < _this.outputMonth; i++) {

            current.month = parseInt(current.month) + i;

            if (current.month == 13) {
              current.month = 1;
              current.year = parseInt(current.year) + 1;
            } 

            current.wrap = i + 1;
            
            _this.createMonth(current);
        }

       
        _this.disableArrows(current);

        if (_this.range) { 
        
          if (_this.startDate != 'null' && _this.endDate != 'null') {
            _this.fillRangePeriod(_this.startDate,_this.endDate,'select');
            _this.$pickerWraper.find('[data-date='+_this.startDate+']').addClass('selected startDate');
            _this.$pickerWraper.find('[data-date='+_this.endDate+']').addClass('selected endDate');

          }
        } else {
          _this.selectDefaultDate();
        }


        _this.addHolydays();
        
      });


      $( window ).resize(function() {

            _this.$pickerWraper.css({
                'left':_this.popupPosition().left + 'px',
                'top': _this.popupPosition().top +'px'
            });

            
      });





      $(window).on('click', function(e){

        var targetRange = $(e.target).attr('pickerfield');

        if ($(e.target).closest("[data-date-picker]").length) {   

          return

        } else if ($(e.target).closest("label").length) {
          
          return
         
        } else {

          $('[data-date-picker]').removeClass('_active');
          $('[pickerField]').removeClass('_active');
          _this.$element.removeClass('_active');
        }

      });

      
     
    };

    Dreampicker.prototype.setMinDate = function(Date) { 
       this.minDate.day = Date[0];
       this.minDate.month = Date[1];
       this.minDate.year = Date[2];

    };


    Dreampicker.prototype.getDate = function() { 

      var outDate = {};

      if (this.range) {
        return {
          'dateStart' : this.startDate,
          'dateEnd' : this.endDate
        }
      } else {
        return {
          'singleDate' : this.singleDate
        }
       }

    };


    // Формирование календаря

    Dreampicker.prototype.render = function() {
        
        this.$pickerWraper.html('');

        _this = this;

        var current = {};




        if (this.minDate.day != 0) {
            
            current = {
              'day' : this.minDate.day,
              'month' : this.minDate.month,
              'year' : this.minDate.year
            }  

        } else {

            var now = moment();
            
            moment.locale('ru');

            current = {
              'day' : now.format('D'),
              'month' : now.format('M'),
              'year' : now.format('gggg')
            };

        }

        var inputValue = this.$element.find('[pickerfield]').val();

        var inputDate = inputValue.split('.');

        if (inputValue != '') {

           current.month = inputDate[1];
        }
            

        this.$pickerWraper.append('<a data-btn-month="next" class="arrow next"><i class="icon icon-right-arrow"></i></a>');
        this.$pickerWraper.prepend('<a data-btn-month="prev" class="arrow prev"><i class="icon icon-left-arrow"></i></a>');

        for (var i=0; i < this.outputMonth; i++) {
          current.month = parseInt(current.month) + i;
          current.wrap = i + 1;
          this.createMonth(current);
          this.disableArrows(current);
        }

        

        if (this.range) { 
          this.$pickerWraper.addClass('rangepicker');

          if (this.startDate != 'null' && this.endDate != 'null') {
            this.fillRangePeriod(this.startDate,this.endDate,'select');
          }
        }

        

        this.addHolydays();

        if (this.defaultDate) this.selectDefaultDate();

        
    };


    Dreampicker.prototype.addHolydays = function() {

      _this = this;
      
      for(var h = 0; h < _this.holydays.length; h++) {
          

        this.$pickerWraper.find('[data-date]').each(function(index, value) { 

           if ($(this).data('date') == _this.holydays[h]) {
            $(this).addClass('holyday');
           }

        });

      }

    };


    Dreampicker.prototype.disableArrows = function(current) {
      
      var currentMonth = 0;

      (this.outputMonth == 1) ? currentMonth = current.month : currentMonth = current.month - 1;

      if ((currentMonth) == this.minDate.month && current.year == this.minDate.year) {
          this.$pickerWraper.find('[data-btn-month=prev]').addClass('disabled');
        } else if (current.month + 1 == this.maxDate.month && current.year == this.maxDate.year) {
          this.$pickerWraper.find('[data-btn-month=next]').addClass('disabled');
        } else {
          this.$pickerWraper.find('[data-btn-month=prev]').removeClass('disabled');
         this.$pickerWraper.find('[data-btn-month=next]').removeClass('disabled');
      }


      


    };


    Dreampicker.prototype.createMonth = function(current,numWrap) {

      

      var activeMonth = '';

      activeMonth = 'active';

      (current.wrap == 1) ? activeMonth += ' first' : activeMonth += ' second';
      
      var monthHTML = '<div class="month-wrap '+activeMonth+'" data-year='+current.year+' data-month-range='+current.wrap+' data-month='+current.month+'  data-month-wrap="'+this.language.monthArray[current.month]+' '+current.year+'">';

      monthHTML += '<div data-picker-head="month-'+current.month+'" class="picker_head">';

     
      monthHTML += '<div class="titelMonth">'+this.language.monthArray[current.month]+' '+current.year+'</div>';
      

      monthHTML += '</div>';

      monthHTML +='<div class="daysNames">';

      for (var i = 1; i<this.language.weekdayArray.length; i++ ) {
        monthHTML += '<div class="dayName">'+this.language.weekdayArray[i]+'</div>'
      }

      monthHTML += "</div>";

      monthHTML += this.createDays(current.month,current.year);


      this.$pickerWraper.append(monthHTML);



    };

    Dreampicker.prototype.createDays = function(month,year) {

      var monthDays = moment(year+'-'+month, 'YYYY-M').daysInMonth();

      var now = moment();

      var today = {
        'day' : now.format('D'),
        'month' : now.format('M'),
        'year' : now.format('gggg')
      };

        
      var day = 1;
      var i = 0;

      var outputHTML = '';

      while (day <= monthDays) {

          var weekday = moment(year+'-'+month+'-'+day,'YYYY-M-D').format('E');

          if ( day == 1 || weekday == 1 ) {
              outputHTML +='<div class="week">';
          }

          var dayFull = (day < 10) ? dayFull = '0'+day : dayFull = day;

          var monthFull = (month < 10 ) ? monthFull = '0'+month : monthFull = month;


          var fullDate = dayFull+''+monthFull+''+year;
          
          //var outputDate = dayFull+'.'+monthFull+'.'+year;

          var dateClass = '';

          var datebtn = 'data-datebtn';

          //проверка для формирования прошедших дат текущего месяца
          if (this.minDate.day != 0) {
            if (this.minDate.day > 1 && month == this.minDate.month && year == this.minDate.year && day < this.minDate.day) {
              dateClass = dateClass + ' null';
              i = -1;
              datebtn = '';
            } 
          }

          if (this.maxDate.day != 0) {
            if (month == this.maxDate.month && year == this.maxDate.year && day > this.maxDate.day) {
              dateClass = dateClass + ' null';
              i = -1;
              datebtn = '';
            } 
          }

          if (month == today.month && year == today.year && today.day == day) {
              dateClass = dateClass + ' today';
          }

          if (this.singleDate == fullDate) {
              dateClass = dateClass + ' selected';
          }
          
          if (weekday == 6 || weekday == 7) {
            dateClass = dateClass + ' holyday';
          }


          var dt = new Date(month+'/'+day+'/'+year);

          var dayId = dt.getTime();


          outputHTML += '<div class="day d'+weekday+' '+dateClass+'" id="'+dayId+'" rel="'+i+'" '+datebtn+' data-weekday="'+weekday+'" data-day="'+day+'" data-month="'+month+'" data-year="'+year+'"  data-date="'+fullDate+'"><span>'+day+'</span></div>';

          if ( day == monthDays || weekday == 7 ) {
              outputHTML += '</div>';
              if (day == monthDays) {
                 outputHTML += '</div>';
              }
          }

          day++;
          i++;
      }

      return outputHTML;


    };


    Dreampicker.prototype.openCalendar = function(e,clickedEl) {

        var _this = this;

        this.render();

        this.selectDefaultDate();


        this.$pickerWraper.css({
          'left': this.popupPosition().left + 'px',
          'top': this.popupPosition().top +'px'
        });
        

        $('[data-date-picker]').removeClass('_active');

        $('[pickerField]').removeClass('_active');

         // clickedEl.addClass('_active');
         // _this.$pickerWraper.addClass('_active');

         if (clickedEl == undefined) {
          clickedEl = $('[data-date-picker]');
         }
        

        if (clickedEl.hasClass('_active')) {


          clickedEl.removeClass('_active');
          _this.$pickerWraper.removeClass('_active');

        } else {

          clickedEl.addClass('_active');
          _this.$pickerWraper.addClass('_active');
        }

       _this.$pickerWraper.find('[data-datebtn]').removeClass('hovered');
        
        if (_this.range) { 

           _this.target = $(e.target).attr('picker-input');

           if (_this.target == 'startDate') {

            _this.$pickerWraper.removeClass('endDate').addClass('startDate');

           } else if (_this.target == 'endDate') {

            _this.$pickerWraper.addClass('endDate').removeClass('startDate');

           }
        }

    };

    Dreampicker.prototype.hideCalendar = function() {
        
       this.$pickerWraper.removeClass('_active');
       this.$element.removeClass('_active');


    };

    Dreampicker.prototype.selectDate = function(e) {

        if (!$(this).hasClass('null')) {


          this.$pickerWraper.find('[data-datebtn]').removeClass('selected'); 

          e.addClass('selected'); 
          
          this.singleDate = e.attr('data-date');
          this.singleDateId = e.attr('id');

          this.outputSingleDate(e);

          this.$element.removeClass('_active');

          this.hideCalendar();
          
        } 
        
    };

    Dreampicker.prototype.selectDefaultDate = function() {
       

        if (this.range) {

          this.$pickerWraper.find('.startDate').removeClass('selected startDate');
          this.$pickerWraper.find('.endDate').removeClass('selected endDate');

          var startDate = this.$element.find('[picker-input="startDate"]').val().replace(/[^0-9]+/g,'');
          var endDate = this.$element.find('[picker-input="endDate"]').val().replace(/[^0-9]+/g,'');

          if (startDate && endDate) {

            var formatedStartDate = startDate;

            this.startDate = formatedStartDate;


            this.startDateId = this.$pickerWraper.find('[data-date='+formatedStartDate+']').attr('id');

            this.$pickerWraper.find('[id='+this.startDateId+']').addClass('selected startDate');

            this.endDate = endDate;

            var formatedEndDate = this.endDate;

            this.endDateId = this.$pickerWraper.find('[data-date='+formatedEndDate+']').attr('id');

            this.$pickerWraper.find('[id='+this.endDateId+']').addClass('selected endDate');

            this.fillRangePeriod(this.startDate,this.endDate,'select');
          }
            

        } else {


          var singleDate = this.$element.find('[pickerfield]').val();

          if (singleDate) {

            this.singleDate = singleDate;

            var formatedStartDate = singleDate.replace(/[^0-9]+/g,'');

            this.singleDateId = this.$pickerWraper.find('[data-date='+formatedStartDate+']').attr('id');

            this.$pickerWraper.find('[data-datebtn]').removeClass('selected');

            this.$pickerWraper.find('[id='+this.singleDateId+']').addClass('selected'); 

          }

           

        }

        
              

    };


    Dreampicker.prototype.endDateChusen = function() { 
        return true;
    }


    Dreampicker.prototype.selectRangeDate = function(target,e) {


         
      if (!e.hasClass('null')) {

        this.$pickerWraper.find('[data-datebtn]').removeClass('hovered');

        var clikedDay = parseInt(e.data('day'));
         
        if (target == 'startDate') {

          var nextDayId = null;
          var nextDay = null;


            if (e.attr('id') >= this.endDateId || this.endDateId == null || this.endDate == null) {

              if (typeof e.next().attr('id') == 'undefined' && e.closest('[data-month-wrap]').data('month-range') == 1) {


                var year = parseInt(e.data('year'));

                var month = parseInt(e.data('month'));

                if (e.data('month') == 12) {
                  year = year + 1;
                  month = 1;

                } else {
                  month = month + 1;
                }
                
                var dt = new Date(month +'/'+ 1 +'/'+year);
                nextDayId = dt.getTime();
                nextDay = this.$pickerWraper.find('#'+nextDayId);

               
              } else if (typeof e.next().attr('id') == 'undefined' && e.closest('[data-month-wrap]').data('month-range') == 2) {


                  
                var year = parseInt(e.data('year'));

                var month = parseInt(e.data('month'));

                this.$pickerWraper.find('[data-month-wrap]').remove();

                var current = {
                  'day' : 1,
                  'month' : month,
                  'year' : year
                };

                for (var i=0; i < 2; i++) {

                    current.month = parseInt(current.month) + i;

                    if (current.month == 13) {
                      current.month = 1;
                      current.year = parseInt(current.year) + 1;
                    } 

                    current.wrap = i + 1;
                    
                    this.createMonth(current);
                }



                if (e.data('year') == 12) {
                  year = year + 1;
                  month = 1;

                } else {
                  month = month + 1;
                }
                
                var dt = new Date(month +'/'+ 1 +'/'+year);
                nextDayId = dt.getTime();
                nextDay = this.$pickerWraper.find('#'+nextDayId);


              } else {
                nextDayId = e.closest('[data-month-wrap]').find('[data-day='+ (clikedDay + 1) +']').attr('id');
                nextDay = this.$pickerWraper.find('#'+nextDayId);
              }

                

              this.startDate = e.data('date');
              this.startDateId = e.attr('id');

              this.$pickerWraper.find('.startDate').removeClass('selected startDate');
              e.addClass('selected startDate');

              this.endDate = nextDay.data('date');
                
              this.endDateId = nextDay.attr('id');

              this.$pickerWraper.find('.endDate').removeClass('selected endDate');
              nextDay.addClass('selected endDate');

              this.outputRangeStartDate(e);
              this.outputRangeEndDate(nextDay);

              // this.$element.find('[lab-range-picker=startDate]').val(this.outputDate(e));
              // this.$element.find('[lab-range-picker=endDate]').val(this.outputDate(nextDay));

              if (this.range) { 
          
                if (this.startDate != 'null' && this.endDate != 'null') {
                  this.fillRangePeriod(this.startDate,this.endDate,'select');
                  this.$pickerWraper.find('[data-date='+this.startDate+']').addClass('selected startDate');
                  this.$pickerWraper.find('[data-date='+this.endDate+']').addClass('selected endDate');

                }
              }


              } else {

                this.startDate = e.data('date');
                this.startDateId = e.attr('id');
                this.$pickerWraper.find('.startDate').removeClass('selected startDate');

                this.outputRangeStartDate(e);
                //this.outputRangeDate(this.outputFormat(e),this.outputFormat(e));
                e.addClass('selected startDate');     
            }

          

          

          
          this.$pickerWraper.addClass('endDate').removeClass('startDate');


          this.target = 'endDate';


        } else if (target == 'endDate') {

          
            if (e.attr('id') <= this.startDateId || this.startDateId == null || this.startDate == null ) {

              var prevDayId = null;
              var prevDay = null;

              // if (typeof e.prev().attr('id') == 'undefined' && e.closest('[data-month-wrap]').data('month-range') == 2) {


              //   var year = parseInt(e.data('year'));

              //   var month = parseInt(e.data('month'));

              //   if (e.data('month') == 1) {
              //     year = year - 1;
              //     month = 12;

              //   } else {
              //     month = month - 1;
              //   }


                
              //   var dt = new Date(month +'/'+ this.daysInMonth[month] +'/'+year);
              //   prevDayId = dt.getTime();
              //   prevDay = this.$pickerWraper.find('#'+nextDayId);

               
              // } else if (typeof e.next().attr('id') == 'undefined' && e.closest('[data-month-wrap]').data('month-range') == 1) {


                  
              //   var year = parseInt(e.data('year'));

              //   var month = parseInt(e.data('month'));

              //   this.$pickerWraper.find('[data-month-wrap]').remove();

              //   var current = {
              //     'day' : this.daysInMonth[month],
              //     'month' : month,
              //     'year' : year
              //   };

              //   for (var i=0; i < 2; i++) {

              //       current.month = parseInt(current.month) + i;

              //       if (current.month == 13) {
              //         current.month = 1;
              //         current.year = parseInt(current.year) + 1;
              //       } 

              //       current.wrap = i + 1;
                    
              //       this.createMonth(current);
              //   }



              //   if (e.data('year') == 12) {
              //     year = year + 1;
              //     month = 1;

              //   } else {
              //     month = month + 1;
              //   }
                
              //   var dt = new Date(month +'/'+ 1 +'/'+year);
              //   nextDayId = dt.getTime();
              //   nextDay = this.$pickerWraper.find('#'+nextDayId);


              // } else {
              //   prevDayId = e.closest('[data-month-wrap]').find('[data-day='+ (clikedDay - 1) +']').attr('id');
              //   prevDay = this.$pickerWraper.find('#'+prevDayId);
              // }

              if (e.closest('[data-month-wrap]').find('[data-day='+ (clikedDay - 1) +']').hasClass('null')) {
                return false
              } else {

                prevDayId = e.closest('[data-month-wrap]').find('[data-day='+ (clikedDay - 1) +']').attr('id');
                prevDay = this.$pickerWraper.find('#'+prevDayId);


                this.endDate = e.data('date');
                this.endDateId = e.attr('id');

                this.$pickerWraper.find('.endDate').removeClass('selected startDate');
                e.addClass('selected endDate');

                this.startDate = prevDay.data('date');
                this.startDateId = prevDay.attr('id');

                this.$pickerWraper.find('.startDate').removeClass('selected startDate');

                prevDay.addClass('selected startDate');


                this.outputRangeStartDate(prevDay);
                this.outputRangeEndDate(e);
                
                // this.$element.find('[lab-range-picker=endDate]').val(this.outputDate(e));
                // this.$element.find('[lab-range-picker=startDate]').val(this.outputDate(prevDay));

              }

              
              
              

            } else {

              this.endDate = e.data('date');
              this.endDateId = e.attr('id');
              this.$pickerWraper.find('.endDate').removeClass('selected endDate');

              this.outputRangeEndDate(e);
              e.addClass('selected endDate');

            }

            this.$element.removeClass('_active');



          this.endDateChusen();
          this.hideCalendar(); 
          

          // if (this.endDate < this.startDate || this.endDate == this.startDate) { 
          //   return false
          // } else {
          //   this.$pickerWraper.find('.endDate').removeClass('selected endDate');
          //   e.addClass('selected endDate');
          //   this.$element.find('[lab-range-picker=endDate]').val(e.data('output-date'));
          // }

           
        }


      

        //this.hideCalendar();

        //this.openCalendar();
        
        this.fillRangePeriod(this.startDate,this.endDate,'select');


       
      }  
       
    };


    Dreampicker.prototype.outputFormat = function(datebtn) {

        var day = datebtn.data('day');
        var month = datebtn.data('month');
        var year = datebtn.data('year');

        var dayFull = (day < 10) ? dayFull = '0'+day : dayFull = day;
        var monthFull = (month < 10 ) ? monthFull = '0'+month : monthFull = month;

        return {
            "1" :dayFull+'.'+monthFull+'.'+year
          }

    };

    Dreampicker.prototype.outputSingleDate = function(e) {
        
       this.$element.find('[pickerfield]').val(this.outputFormat(e)[1]);

    };


    Dreampicker.prototype.outputRangeStartDate = function(startDate) {
        
        this.$element.find('[picker-input=startDate]').val(this.outputFormat(startDate)[1]);

    };

    Dreampicker.prototype.outputRangeEndDate = function(finishDate) {
        
        this.$element.find('[picker-input=endDate]').val(this.outputFormat(finishDate)[1]);

    };


    Dreampicker.prototype.fillRangePeriod = function(startDate,endDate,fillType) {

      _this = this;

      var start = null;

      var finish = null;
       

      start  = this.$pickerWraper.find('[data-date='+startDate+']').attr('id')*1;

      finish = this.$pickerWraper.find('[data-date='+endDate+']').attr('id')*1;

      var startPickerDate = this.$pickerWraper.find('[data-date]:first-child').attr('id')*1;
      var endPickerDate = this.$pickerWraper.find('[data-month-wrap]:last-child').find('.week:last-child').find('[data-date]:last-child').attr('id')*1;
      


     
      if (this.startDate != null && typeof this.$pickerWraper.find('[data-date='+startDate+']').attr('id') == 'undefined') {
        if (endPickerDate < this.startDateId ) {
          return false;
        } else {
          start  = this.$pickerWraper.find('[data-date]:first-child').attr('id')*1 - 1;

        }
        
      } 

      else if (this.endDate != null && typeof this.$pickerWraper.find('[data-date='+endDate+']').attr('id') == 'undefined') {
        
        if (startPickerDate > this.endDateId ) {
          return false;
        } else {
          var startButton = this.$pickerWraper.find('[data-date='+startDate+']');
          finish = startButton.closest('[data-date-picker]').find('[data-month-wrap]:last-child').find('.week:last-child').find('[data-date]:last-child').attr('id')*1 + 1;
        }
       

      }


      if (this.startDate != null && this.endDate != null  && typeof this.$pickerWraper.find('[data-date='+startDate+']').attr('id') == 'undefined' && typeof this.$pickerWraper.find('[data-date='+endDate+']').attr('id') == 'undefined') {
        

        if (endPickerDate < this.startDateId || startPickerDate > this.endDateId ) {
          return false;
        } else {
          start  = this.$pickerWraper.find('[data-date]:first-child').attr('id')*1 - 1;
          finish = this.$pickerWraper.find('[data-month-wrap]:last-child').find('.week:last-child').find('[data-date]:last-child').attr('id')*1 + 1;
        }
        

      }


      if ( fillType == 'select' ) {
        this.$pickerWraper.find('[data-datebtn]').removeClass('period');
      }
      
      if ( fillType == 'hover' ) { 
        this.$pickerWraper.find('[data-datebtn]').removeClass('hovered');
      }

      this.$pickerWraper.find('.day:not(.null)').each(function(index, value) { 

        if ( $(this).attr('id') > start && $(this).attr('id') < finish) {

          if ( fillType == 'select' ) {

            $(this).addClass('period');

          } else if ( fillType == 'hover' ) {

            $(this).addClass('hovered');

          }  
          
        }

      });

    };

    Dreampicker.prototype.popupPosition = function() { 

      
      var e = document.getElementById(this.elementID);

      var coords = getCoords(e),
          pickerWidth = this.$pickerWraper.innerWidth(),
          pickerHeight = this.$pickerWraper.innerHeight(); 


      // console.log(coords.left);
      // console.log(coords.top);

      // console.log(coords.winHeight);
      //  console.log(coords.winWidth);

      // console.log(pickerWidth);
      // console.log(pickerHeight);

      if ((coords.top+coords.height+pickerHeight) > coords.winHeight) {

        return {
          'left' : coords.left,
          'top' : coords.top - pickerHeight - coords.height + 5
        };

      }  else if (coords.left + pickerWidth > coords.winWidth) {

        return {
          'left' : coords.left - (coords.left + pickerWidth - coords.winWidth),
          'top' : coords.top + coords.height + 10
        };

      } if ((coords.top+coords.height+pickerHeight) > coords.winHeight && coords.left + pickerWidth > coords.winWidth) {

         return {
          'left' : coords.left - (coords.left + pickerWidth - coords.winWidth),
          'top' : coords.top - pickerHeight - coords.height + 5
        };

      } else {
         return {
          'left' : coords.left,
          'top' : coords.top + coords.height + 10
        };
      }

      


    };



    Dreampicker.prototype.createCalendar = function() {

      var pickerNum = $('body').find('[data-date-picker]').length + 1;

      var calendarWrapType = '';

      (this.outputMonth == 1) ? calendarWrapType = 'single' : calendarWrapType = 'dubble';

      $('body').append('<div data-date-picker id="picker-'+pickerNum+'" class="dreampicker pickerWrap '+calendarWrapType+'"></div>');

      this.$pickerWraper = $('#picker-'+pickerNum);

    };




    