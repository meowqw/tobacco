var getDaysArray = function(start, end) {
  for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
      arr.push(new Date(dt));
  }
  return arr;
};

function filterDate() {
  from = document.getElementById('input').getAttribute('from')
  to = document.getElementById('input').getAttribute('to')

  const items = document.getElementsByClassName('item')
  for (item in items) {
    if (items[item].className != undefined) {
      item_date = items[item].getAttribute('date')
      dates = getDaysArray(new Date(from), new Date(to))
      if (dates.length > 0) {
        dates = dates.map((v)=>v.toISOString().slice(0,10)).join("")
        if (dates.includes(item_date)) {
          items[item].style.display = ''
        } else {
          items[item].style.display = 'none'
        }

      } else {
        // console.log(item_date)
        console.log(from)
        console.log(item_date)
        if (from.trim() == item_date.trim()) {
          items[item].style.display = ''
        } else {
          items[item].style.display = 'none'
        }
      }

    }
  }
}


document.addEventListener('click', function (e) {
  console.log(e.target.className)
  if (e.target.className == 'air-datepicker-cell -day- -focus- -selected- -range-from-' ||
    e.target.className == 'air-datepicker-cell -day- -weekend- -focus- -selected- -range-from-') {
    year = e.target.getAttribute('data-year');
    day = e.target.getAttribute('data-date');
    month = e.target.getAttribute('data-month');
    // console.log(year, month, day)
    document.getElementById('input').setAttribute('from', `${year}-${(Number(month)+1)}-${day} `)

    filterDate()

  } else if (e.target.className == 'air-datepicker-cell -day- -focus- -selected- -range-to-'
    || e.target.className == 'air-datepicker-cell -day- -weekend- -focus- -selected- -range-to-' || e.target.className == "air-datepicker-cell -day- -current- -weekend- -focus- -selected- -range-to-") {
    year = e.target.getAttribute('data-year');
    day = e.target.getAttribute('data-date');
    month = e.target.getAttribute('data-month');
    // console.log(year, month, day)

    document.getElementById('input').setAttribute('to', `${year}-${(Number(month)+1)}-${day} `)

    filterDate()
  } else if (e.target.className == "calendar__input datepicker-here calendar focus-visible") {
    document.getElementById('input').setAttribute('from', "none")
    document.getElementById('input').setAttribute('to', "none")
  }
});

document.getElementById('catalogBtn').addEventListener('click', function() {
  if (location.pathname != '/main/') {
    location.href = '/main/'
  }
})