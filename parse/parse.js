
function getDataFromProperties(row, name){
	return row.properties.filter(function(i){ return i.name == name})[0].value;
}

function getMukimData(row, i){
	var id = getDataFromProperties(row, "OBJECTID");
	var id1 = getDataFromProperties(row, "OBJECTID_1");	
	var mukim = getDataFromProperties(row, "MUKIM_NAME");
	var shapeLength = getDataFromProperties(row, "SHAPE_LENG");
	var shape = getDataFromProperties(row, "SHAPE").data[0];
	//console.log(i + ". " + mukim + "|");
	return {
		id: id,
		name: mukim,
		length: shapeLength,
		shape: shape
	}
}
function getDistrictData(row, i){
	var id = getDataFromProperties(row, "OBJECTID");
	var name = getDataFromProperties(row, "DISTRICT_NAME");
	var code = getDataFromProperties(row, "DISTCODE");	
	var shape = getDataFromProperties(row, "SHAPE").data[0];
	//console.log(i + ". " + mukim + "|");
	return {
		id: id,
		name: name,
		code: code,
		shape: shape
	}
}
function getPoiData(row, i){
	var id = getDataFromProperties(row, "OBJECTID");
	var name = getDataFromProperties(row, "PLACENAME");
	var description = getDataFromProperties(row, "DESCR");
	var category = getDataFromProperties(row, "CATEGORY");	
	var shape = getDataFromProperties(row, "SHAPE").data[0];
	//console.log(i + ". " + mukim + "|");
	return {
		id: id,
		name: name,
		description: description,
		category: category,
		shape: shape
	}
}
function getKampongData(row,i){
	var id = getDataFromProperties(row, "OBJECTID");
	var l1 = getDataFromProperties(row, "L1");
	var l2 = getDataFromProperties(row, "L2");
	var l3 = getDataFromProperties(row, "L3");
	var l4 = getDataFromProperties(row, "L4");
	var fcode = getDataFromProperties(row, "F_CODE");
	var mukim = getDataFromProperties(row, "ADMIN_MUKIM_NAME");
	var kampong = getDataFromProperties(row, "ADMIN_KG_NAME");
	var shape = getDataFromProperties(row, "SHAPE").data[0];
	var area = getDataFromProperties(row, "ADMIN_AREA");
	//console.log(i + ". " + mukim + "|" + kampong);
	return {
		id: id,
		name: kampong,
		mukim: mukim,
		area: area,
		shape: shape
	}
}
function addBoundary(point, data, boundaries){
	var key = JSON.stringify(point);
	if(!boundaries[key]) boundaries[key] = [];
	boundaries[key].push(data);
}
function addFinalBoundary(array, boundaries){
	var tmp = [];
	array.forEach(function(me, i){
		array.forEach(function(others, j){
			if(i == j) return;
			addFinalBoundaryItem(me, others, boundaries);
		})
	})
}
function addFinalBoundaryItem(key, data, boundaries){
	if(!boundaries[key]) boundaries[key] = {};
	boundaries[key][data] = 1;
}
function parseData(inputFile, outputFile, type){
	console.log(type);
	var out = fs.createWriteStream(outputFile);
	var boundaries = {};


	out.once('open', function(fd){
		fs.readFile(inputFile, 'utf8', function (err, data) {
		    if (err) throw err; // we'll not consider error handling for now
			fs.write(fd, '{"type":"FeatureCollection","features":[\n');
		    var obj = JSON.parse(data);
		    var mainData = obj.features;

		    mainData.forEach(function(row,i){ 
		    	var data = null;
		    	if(type == "mukims"){
		    		console.log("Mukim");
		    		data = getMukimData(row,i);
		    	}
		    	else if(type == "districts"){
		    		console.log("Districts");
		    		data = getDistrictData(row,i);
		    	}
		    	else if(type == "poi"){
		    		console.log("Poi");
		    		data = getPoiData(row,i);
		    	}
		    	else{
		    		console.log("Kampong");
		    		data = getKampongData(row,i);
		    	}
	    		var tmp = {
	    			"type":"Feature",
	    			"properties": {},
	    			"geometry":{"type":"Polygon","coordinates":[[]]}
	    		}
	    		for(var key in data){
	    			if(key !== "shape"){
	    				tmp.properties[key] = data[key];
	    			}
	    		}

				// fix differently formatted data
				if(tmp.properties.name == "Kg. Biong" 
					|| tmp.properties.name == "Kawasan Padang Tembak Binturan"
					)
				{
					data.shape = data.shape[0]
				}
				var tmpArr = [];
				data.shape.forEach(function(coord,x){
					tmpArr.push(coord)
					if(x % 2 == 1){
						tmp.geometry.coordinates[0].push(tmpArr);
						addBoundary(tmpArr, tmp.properties.id, boundaries);
						tmpArr = [];
					}
				});
				if(tmp.properties['id'])
					tmp.id = tmp.properties['id'];
				fs.write(fd, (i > 0 ? ',' : '') + JSON.stringify(tmp) + '\n');

		    });
			fs.write(fd,']}');

			var finalBoundaries = {}
			for(var bound in boundaries){
				if(boundaries[bound].length > 1){
					addFinalBoundary(boundaries[bound], finalBoundaries);
				}
			}
			var finalBoundariesFormated = {}
			for(var bound in finalBoundaries){
				finalBoundariesFormated[bound] = []
			}
			for(var bound in finalBoundaries){
				for(var key in finalBoundaries[bound]){
					finalBoundariesFormated[bound].push(key);
				}
			}
			fs.writeFile(type + "_boundaries.json", JSON.stringify(finalBoundariesFormated), function(err) {
			    if(err) {
			        return console.log(err);
			    }
			    console.log("Boundaries saved");
			}); 
		});
	});
}
var fs = require('fs');

var mukims = false;
var inputFiles = [
{file: 'kampongs_latlon.txt', type: 'kampongs'}
, {file: 'mukims_latlon.txt', type: 'mukims'}
, {file: 'districts_latlon.txt', type: 'districts'}
//, {file: 'poi_latlon.txt', type: 'poi'}
];

inputFiles.forEach(function(i,ii){
	var OUTPUTFILE = i.file + ".geojson";
	//if(ii == 0) return;
	parseData(i.file, OUTPUTFILE, i.type);
});







