// Returns a date value in the formatted day-month-year.
exports.formatDate = function(value){
	var month = "";
	var day = "";
	
	if(value.getMonth() < 9)
		month += "0";
		
	month += (value.getMonth()+1);
		
	if(value.getDate() < 10)
		day += "0";
	day += value.getDate();
		
   return  day + "-" + month + "-" + value.getFullYear();
}