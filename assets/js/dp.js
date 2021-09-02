'use strict';
const months = [
    {
        key: "January",
        value: "00"
    },
    {
        key: "February",
        value: "01"
    },
    {
        key: "March",
        value: "02"
    },
    {
        key: "April",
        value: "03"
    },
    {
        key: "May",
        value: "04"
    },
    {
        key: "June",
        value: "05"
    },
    {
        key: "July",
        value: "06"
    },
    {
        key: "August",
        value: "07"
    },
    {
        key: "September",
        value: "08"
    },
    {
        key: "October",
        value: "09"
    },
    {
        key: "November",
        value: "10"
    },
    {
        key: "December",
        value: "11"
    }
];
var selectDate;
var selectYear;
var selectMonth;
var selectMonthBlock;
var selectYearBlock;
var selectedDate;
var selectedMonth;
var selectedYear;
var focusedElement;
var overlay;

const yearRange = {
    start : 1999,
    end : 2021
}

const currYear  = new Date().getFullYear();
const currMonth = new Date().getMonth();
const currDate  = new Date().getDate();
const currDay   = new Date().getDay();
selectedYear    = currYear;
selectedMonth   = currMonth;
console.log(currYear, currMonth)

const dropIcon = "<span class='dp-rotate'>&gt;</span>";

class DatePicker {
    constructor() {
        this.day   = currDay;       // week day
        this.date  = currDate;      // date
        this.month = currMonth;     // month
        this.year  = currYear;  // year

        // create date picker structure
        let datePicker = document.createElement('div');
        datePicker.className = 'date-picker';
        
        overlay = document.createElement('div');
        overlay.className = 'dp-overlay';
        overlay.addEventListener('click', () => {
            this.hideMonthDropDown();
            this.hideYearDropDown();
            this.hideOverlay();
        })

        datePicker.appendChild(overlay);

        let content = document.createElement('div');
        content.className = 'dp-content'
        let div, dropDown;
        div = document.createElement('div');
        div.className = 'dp-year-month-container';
        
        // year start
        selectYearBlock = document.createElement('div');
        selectYearBlock.className = 'dp-year-block dp-dropdown';
        selectYearBlock.addEventListener('click', () => {
            this.showYearDropDown();
            this.showOverlay();
        });

        dropDown = document.createElement('div');
        dropDown.style.display = 'none';
        dropDown.className = 'dp-year-dropdown';
        selectYear = dropDown;
        for(let y=yearRange.start; y<=yearRange.end; y++) {
            let label = document.createElement('label');
            let input = document.createElement('input');
            input.value = y;
            input.type = 'radio';
            input.name = 'dp-year-value';
            let span  = document.createElement('span');
            span.innerText = y;
            label.appendChild(input);
            label.appendChild(span);
            if(this.year == y) {
                input.checked = true;
                selectedYear = y;
                selectYearBlock.innerHTML= y + dropIcon;
            }
            span.addEventListener('click', () => {
                setTimeout(() => {
                    this.setYear();
                    this.hideOverlay();
                    this.hideYearDropDown();
                }, 1)
                
            })
            dropDown.appendChild(label);
        }
        div.appendChild(selectYearBlock)
        div.appendChild(dropDown);
        // year end

        // month start
        selectMonthBlock = document.createElement('div');
        selectMonthBlock.className = 'dp-month-block dp-dropdown';
        selectMonthBlock.addEventListener('click', () => {
            this.showMonthDropDown();
            this.showOverlay();
        });

        dropDown = document.createElement('div');
        dropDown.style.display = 'none';
        dropDown.className = 'dp-month-dropdown';
        selectMonth = dropDown;
        months.forEach((m) => {
            let label = document.createElement('label');
            let input = document.createElement('input');
            input.value = m.value;
            input.type = 'radio';
            input.name = 'dp-month-value';
            let span  = document.createElement('span');
            span.innerText = m.key;
            label.appendChild(input);
            label.appendChild(span);
            if(this.month == m.value) {
                input.checked = true;
                selectedMonth = m.value;
                selectMonthBlock.innerHTML = m.key + dropIcon;
            }
            span.addEventListener('click', () => {
                setTimeout(() => {
                    this.setMonth();
                    this.hideOverlay();
                    this.hideMonthDropDown();
                }, 1)
                
            })
            dropDown.appendChild(label);
        })
        
        div.appendChild(selectMonthBlock)
        div.appendChild(dropDown);
        // month end

        content.appendChild(div);

        div = document.createElement('div');
        div.className = 'dp-week-container';
        content.appendChild(div);
        
        div = document.createElement('div');
        div.className = 'dp-dates-container';
        content.appendChild(div);
        
        div = document.createElement('div');
        div.className = 'dp-action';

        let button;
        button = document.createElement('button');
        button.innerText = 'Today'
        button.addEventListener('click', () => {
            this.setToday();
            this.pickToday();
        });
        div.appendChild(button);

        button = document.createElement('button');
        button.innerText = 'Save';
        button.addEventListener('click', this.pickedDate);

        div.appendChild(button);
        content.appendChild(div);
        
        datePicker.appendChild(content);

        document.body.appendChild(datePicker);
    }

    weekSymbol() {
        let weekContainer = document.getElementsByClassName('dp-week-container')[0];
        weekContainer.innerHTML = '';
        let week = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        week.forEach((w) => {
            let weekBox = document.createElement('div');
            weekBox.innerText = w;
            weekBox.className = 'dp-week-box';
            weekContainer.appendChild(weekBox);
        })
    }

    dateBox() {
        let datesConatiner = document.getElementsByClassName('dp-dates-container')[0];
        datesConatiner.innerHTML = '';
        // add padding 
        let dayOne = new Date(selectedYear, selectedMonth, 1).getDay();
        let noOfDays = new Date(selectedYear, parseInt(selectedMonth)+1, 0).getDate();
        for(let d=1; d<=dayOne; d++) {
            let dateBox = document.createElement('div');
            dateBox.className = 'dp-date-pad-box';
            datesConatiner.appendChild(dateBox);
        }
        let control = 0;
        for(let d=1; d<=noOfDays; d++) {
            let dateBox = document.createElement('label');
            dateBox.className = 'dp-date-box';
            let input = document.createElement('input');
            input.type = 'radio';
            input.value = d;
            input.name = 'datepickerDay';
            if(currYear == selectedYear && currMonth == selectedMonth && this.date == input.value) {
                input.checked = true;
                control = 1;
            }
            
            let span = document.createElement('span');
            span.innerText = d;
            dateBox.appendChild(input);
            dateBox.appendChild(span);
            datesConatiner.appendChild(dateBox);
        }
        selectDate = datesConatiner;
        if(!control)
            selectDate.getElementsByClassName('dp-date-box')[0].getElementsByTagName('input')[0].checked = true
            
    }

    setMonth() {
        let label = selectMonth.getElementsByTagName('label');
        for(let i=0; i<label.length; i++) {
            let input = label[i].getElementsByTagName('input')[0];
            let span  = label[i].getElementsByTagName('span')[0];
            if(input.checked) {
                this.month = input.value;
                selectedMonth = input.value;
                selectMonthBlock.innerHTML = span.innerText + dropIcon;
                break;
            }
        }
        selectedDate = 1;
        this.dateBox();
    }

    setYear() {
        let label = selectYear.getElementsByTagName('label');
        for(let i=0; i<label.length; i++) {
            let input = label[i].getElementsByTagName('input')[0];
            let span  = label[i].getElementsByTagName('span')[0];
            if(input.checked) {
                this.year = input.value;
                selectedYear = input.value;
                selectYearBlock.innerHTML = span.innerText + dropIcon;
                break;
            }
        }
        this.dateBox();
    }

    showOverlay() {
        overlay.style.display = 'flex'
    }

    hideOverlay() {
        overlay.style.display = 'none'
    }

    showMonthDropDown() {
        selectMonth.style.display = 'flex'
    }

    hideMonthDropDown() {
        selectMonth.style.display = 'none'
    }

    showYearDropDown() {
        selectYear.style.display = 'flex'
    }

    hideYearDropDown() {
        selectYear.style.display = 'none'
    }

    config() {
        date.dateBox();
        date.weekSymbol();
    }

    setToday() {
        selectedYear = currYear;
        selectedMonth = currMonth;
        let label = selectYear.getElementsByTagName('label');
        for(let i=0; i<label.length; i++) {
            let input = label[i].getElementsByTagName('input')[0];
            let span  = label[i].getElementsByTagName('span')[0];
            if(input.value == selectedYear) {
                input.checked = true;
                selectYearBlock.innerHTML = span.innerText + dropIcon;
                break;
            }
        }
        
        label = selectMonth.getElementsByTagName('label');
        for(let i=0; i<label.length; i++) {
            let input = label[i].getElementsByTagName('input')[0];
            let span  = label[i].getElementsByTagName('span')[0];
            if(input.value == selectedMonth) {
                input.checked = true;
                selectMonthBlock.innerHTML = span.innerText + dropIcon;
                break;
            }
        }
        date.dateBox();
    }
    
    pickToday() {
        this.pickedDate();
    }

    pickedDate() {
        let y = selectedYear;
        let m = parseInt(selectedMonth) + 1;
        if(m < 10)
            m = "0" + m;
        let d
        let dateBox = document.getElementsByClassName('dp-date-box');
        
        for(let i=0; i<dateBox.length; i++) {
            let input = dateBox[i].getElementsByTagName('input')[0];
            if(input.checked)
                d = input.value;
        }
        if(d < 10)
            d = "0" + d;
        let selectedDate = y + '-' + m + '-' + d;
        focusedElement.value = selectedDate;
        document.getElementsByClassName('date-picker')[0].style.display = 'none'
        return selectedDate;
    }
}


const date = new DatePicker();
date.config();


const fetchElements = () => {
    var el = document.querySelectorAll('[dp="true"]')
    var dp = document.getElementsByClassName('date-picker')[0]
    for(let i=0; i<el.length; i++) {
        el[i].addEventListener('click', (e) => {
            date.setToday();
            focusedElement = el[i];
            let rect = el[i].getBoundingClientRect();
            let x = rect.x;
            let y = rect.y;
            let elOffsetHeight = el[0].offsetHeight;
            let innerHeight    = window.innerHeight;
            dp.style.position = 'absolute';
            dp.style.left     = x + 'px';
            if(y + 400 < innerHeight) {
                dp.style.top      = y + elOffsetHeight + 10 + window.pageYOffset + 'px'
            }
            else {
                dp.style.top = (y - (dp.offsetHeight + 10) + window.pageYOffset) + 'px'
            }
            dp.style.display = 'block'
        })
    }
}

fetchElements()

        