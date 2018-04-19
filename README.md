# datepicker
Datepicker with options v. 1.0

# About
This plugin was originally written for the widget http://idls.su/spasibo/<br>
Then it was introduced into all the calendars of the reservation system.<br>
The plugin uses jQuery and Moment.js http://momentjs.com/

# Demo

Live demo: http://idls.su/picker/

# How it use

Use jQuery https://jquery.com/ and Moment.js http://momentjs.com/
Use picker.js and picker.css (if you need) from this package.

#Initialization

Example <br>

```html
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
                      range: true
                    }
);

```

Construction for datarangepicker 

```html

    <div id="date_range" class="range">
        <label class="field-wrap reservation-field">
            <span class="label">From</span>
            <input id="checkInDate" pickerfield="pickerField" picker-input="startDate" name="period_start" value="20.04.2018" readonly="" class="input-text not-opacity">
        </label>
        <label class="field-wrap reservation-field">
            <span class="label">To</span>
            <input id="checkOutDate" pickerfield="pickerField" picker-input="endDate" name="period_end" value="25.04.2018" readonly="" class="input-text not-opacity">
        </label>
    </div>

```

Construction for no range picker

```html

    <label id="simple_date" class="field-wrap reservation-field">
        <span class="label">From</span>
        <input pickerfield="pickerField" name="period_start" value="20.04.2018" readonly="" class="input-text not-opacity">
    </label> 
```


#Options

minDate - The minimum date from the range
maxDate - The max date from the range
outputMonth - Maximum month in calendar wrap (3 мax)
range - range or single date (true/false)