
// ************************************************************************
// File:    function.js
// Purpose: Achieve a few functions, such as search plots, group plots, sort plots
// Author:  Houdong Hu
// ************************************************************************


var rawData = {};
var data = {};
var fields = {"var":String,
	      "img":String,
	      "KS":Number,
	      "Tree_Importance":Number,
	      "Dictionary":String
	     };

function makeFileLoader(htmlElements, fileHandler) {

    $(htmlElements.input).change(function(evt) {
	var files = evt.target.files;
	$.when.apply($,$.map(files, function(file) {
	    var reader = new FileReader();
	    var deferred = $.Deferred();
	    reader.onload = function(e) {
		rawData[file.name] = e.target.result;
		deferred.resolve();
	    };
	    reader.readAsText(file);

	    return deferred.promise();
	})).done(function() {
	    fileHandler();
	    $(htmlElements.input).val(null); //allowing selecting same file again
	});
    });


}

function csv2array(text, sep, fields, multiple) {

    var array = [];
    var lines = $.map(text.split("\n"),
                      function(line) {
			  var trimmed = line.replace(/\r/g,"");
			  if (trimmed.length > 0)
                              return trimmed;
                      });

    if (lines.length == 0)
	return array;

    var header = $.map(lines[0].split(sep),
		       function(colName) {
			   return colName.trim()
                       });

    var fieldIndices = {};
    $.each(header, function(idx,colName) {
	if (colName in fields) {
	    fieldIndices[colName] = idx;
	}
    });

    for(var i=1; i<lines.length; i++) {
	var tokens = $.map(lines[i].split(sep),function(token){return token.trim()});
	var row = {};
	$.each(fieldIndices, function(colName,idx) {
	    var type = fields[colName];
	    if (tokens[idx] == "")
		row[colName] = null; 
	    else
		row[colName] = type(tokens[idx]);
	});
	array.push(row)
    }

    return array;
}

function parseRawData() {
    var processedExtensions = [];
    $.each(rawData, function(filename, filetext) {
	if (filename != null){
	    data=csv2array(filetext,"|",fields,true);
	//    $("#input-file").html(filename);
	}
    });

    $.each(rawData,function(key,value) {
	delete rawData[key];
    });

    dataChanged = processedExtensions.length > 0;
}



function initializeInput() {
    makeFileLoader({input: $("#input-file")[0]},
                 parseRawData
                  );
}

function sortdata(){
    console.log("sortdata")
    var div = $("#imgNames");
    $( "#sort-order" )
        .change(function() {
	    var value= $( this ).attr('value');
            console.log(value)
            data.sort(function(o1, o2) {
		return o1[value] > o2[value] ? 1 : o1[value] < o2[value] ? -1 : 0;
            });
            $("div#imgNames").empty()
            $.each(data, function(i, val) {
		$("<span />").html(val.Dictionary).appendTo(div);
		$("<br/>").appendTo(div);
		$("<img />").attr("src", val.img).appendTo(div);
		$("<br/>").appendTo(div);
            });
        });
}

function searchdata(){
    console.log("searchdata")
    var div = $("#imgNames");
    $( "#search-item" )
        .change(function() {
	    $("div#imgNames").empty()
            var value= $( this ).val();
            for (var i = 0, len = data.length; i< len; i++) {
		val=data[i]
		if (val.var==value) {
		    $("<span />").html(val.Dictionary).appendTo(div);
		    $("<br/>").appendTo(div);
		    $("<img />").attr("src", val.img).appendTo(div);
		    $("<br/>").appendTo(div);
		}
            }
        });
}

function groupdata(){
    console.log("groupdata")
    var div = $("#imgNames");
    $( "#search-group" )
        .change(function() {
	    $("div#imgNames").empty()
            var value= $( this ).val();
            for (var i = 0, len = data.length; i< len; i++) {
		val=data[i]
		if ((val.var).indexOf(value)>-1) {
		    $("<span />").html(val.Dictionary).appendTo(div);
		    $("<br/>").appendTo(div);
		    $("<img />").attr("src", val.img).appendTo(div);
		    $("<br/>").appendTo(div);
		}
            }
        });
}