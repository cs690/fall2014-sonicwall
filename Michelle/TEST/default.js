$(function() {
	d3.tsv("DNS.tsv", function(data) {
	/*Get the header: Object.keys()  can change data[0] to [1]...
	 * data[0] grab the first row. */
		var headRow = Object.keys(data[0]);
		console.log(headRow);
	/*manipulate data row-by-row: data.map(): map function will iterate through 
	 * each element of the data, then perform transformation on d and the transformation will
	 * be applied to an entire data set. */
		data.map(function(d) {
			if(d['TIME_SPAN']== '1') {
				console.log('this is the length of TIME_SPAN 1' +d['DNS']);
			}
		});
	});
});

