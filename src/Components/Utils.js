
class Utils{

  getTodaysDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    //var timestamp = today.getTime();
    if(dd<10) { dd='0'+dd; }

    if(mm<10) { mm='0'+mm; }

    var timestamp = new Date(today.setHours(0,0,0,0)).getTime();
  //  today = mm+'/'+dd+'/'+yyyy;
 //d.split(' ')[0]
    var timestampWithoutZone = new Date(Date.UTC(today.getFullYear(),today.getMonth(), today.getDate()));//new Date(yyyy,mm,dd);
    let objectDate = {  DateTimeStamp : timestampWithoutZone.getTime() , Timestamp:new Date().getTime() ,
      todayDate : mm+'/'+dd+'/'+yyyy , showDate : this.formattedDate(dd,mm,yyyy) , todayDateCalenderFormat : yyyy+'-'+mm+'-'+dd , ForTodayTimeStamp : dd+'-'+mm+'-'+yyyy };
    return objectDate;
  }

 

  compareDates(from,to){
    let isValid = false;
    var fr = Date.parse(from);
    var to = Date.parse(to);
    if (fr < to) {
      isValid = true;
    }
    return isValid;
  }

  compareDate(startDate,EndDate){

  }

  formattedSmallDate(date,month,year){
    let monthFullName = '';

    if(month == '01'){
      monthFullName = 'Jan ';
    }
    else if(month == '02'){
      monthFullName = 'Feb ';
    }
    else if(month == '03'){
      monthFullName = 'Mar ';
    }
    else if(month == '04'){
      monthFullName = 'Apr ';
    }
    else if(month == '05'){
      monthFullName = 'May ';
    }
    else if(month == '06'){
      monthFullName = 'June ';
    }
    else if(month == '07'){
      monthFullName = 'July ';
    }
    else if(month == '08'){
      monthFullName = 'Aug ';
    }
    else if(month == '09'){
      monthFullName = 'Sep ';
    }
    else if(month == '10'){
      monthFullName = 'Oct ';
    }
    else if(month == '11'){
      monthFullName = 'Nov ';
    }
    else if(month == '12'){
      monthFullName = 'Dec ';
    }

    return monthFullName + date+ ', '+year;
  }

  formattedDate(date,month,year){
    let monthFullName = '';

    if(month == '01'){
      monthFullName = 'January ';
    }
    else if(month == '02'){
      monthFullName = 'February ';
    }
    else if(month == '03'){
      monthFullName = 'March ';
    }
    else if(month == '04'){
      monthFullName = 'April ';
    }
    else if(month == '05'){
      monthFullName = 'May ';
    }
    else if(month == '06'){
      monthFullName = 'June ';
    }
    else if(month == '07'){
      monthFullName = 'July ';
    }
    else if(month == '08'){
      monthFullName = 'August ';
    }
    else if(month == '09'){
      monthFullName = 'September ';
    }
    else if(month == '10'){
      monthFullName = 'October ';
    }
    else if(month == '11'){
      monthFullName = 'November ';
    }
    else if(month == '12'){
      monthFullName = 'December ';
    }

    return monthFullName + date+ ', '+year;
  }

}

export default Utils;
