/*Data in D3 can be any array of values.
 * */
// Reference: http://charlesmartinreid.com/wiki/D3#Loading_Single_CSV_File
$(function() {
	d3.tsv("DNS.tsv", function(data) {
	/*Get the header: Object.keys()  can change data[0] to [1]...
	 * data[0] grab the first row. */
		var headRow = Object.keys(data[0]);
		console.log(headRow);
	/*manipulate data row-by-row: data.map(): map function will iterate through 
	 * each element of the data, then perform transformation on d and the transformation will
	 * be applied to an entire data set. */
	/*Operate on specific element, or get the data from specific element*/
		data.map(function(d) {
			if(d['TIME_SPAN']== '1') {
				console.log('this is the length of TIME_SPAN 1' +d['DNS']);
			}
		});
	});
		/*Manipulate multidimensional data: 
		 * get two columns and do ratio of two numbers(one from each column):
		 * e.g.  get "Inning" vs "Avg"*/
	/*d3.csv("data_as_giants.csv", function(data) {
		//Return a new array to save Inning and Avg: and then access by key 'Inning' and 'Avg'
		xy_pairs = data.map(function(d) {
			if(d['Inning'] != 'Total'){  //filter rows that Inning is 'Total'. 
				var result = {Inning: +d['Inning'],
							  Avg: +d['Avg']
				}
				return result
			}
		});
		xy_pairs = cleanArray(xy_pairs);  remove the undefined pair(with the Inning = 'Total')
		After get pairs(each pair has two value) then return the value d['0'] d['1']
			 xy_pairs.map(function(d) { 
				console.log( 'Inning ' + d['Inning'] + ' - Avg ' + d['Avg']); });
		});  */
		
	/*forEach()  : executes a provided function once per array element
	 * arr.forEach(callback,[thisArg]) 
	 * callback is invoked with three elements: 
	 * 1.the element value
	 * 2.the element index
	 * 3.the array being traversed. */
		d3.tsv("DNS.tsv", function(data) {
			xy_pairs = data.map(function(d) {
				var result = {};
				if(d['TIME_SPAN' < '10']) {
				   result = { TIME:+d['TIMESPAN'], DNS: +d['DNS']}
						return result;
				}
			  console.log(result);
			});
					});


});

