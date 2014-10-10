$(function() {
	d3.tsv("DNS.tsv", function(data) {
		var headRow = Object.keys(data[0]);
		var FirstRow = Object.keys(data[1]);
		console.log(headRow);
		console.log(FirstRow);
	});
});


