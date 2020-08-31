var pdfreader = require('pdfreader');
 
var rows = {}; // indexed by y-position
var a = [];

function printRows() {
  Object.keys(rows) // => array of y-positions (type: float)
    .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
    .forEach((y) => {
        if(rows[y][2]!='A' && rows[y][2]!='M'){
            rows[y][4]= rows[y][3];
            rows[y][3]=rows[y][2];
            rows[y][2]="";
        }
        var o ={ 
            name : rows[y][0],
            value : rows[y][1],
            prob : rows[y][2],
            unit : rows[y][3],
            ref : rows[y][4]

        }
        a.push(o);
    });
   console.log(typeof rows);
   console.log(a);
    function search(a, key){
        var found = false;
        for(var i=0; i<a.length;i++){
            console.log(a[i].name);
            if(key == a[i].name){
                console.log("siker");
                i=a[i].length;
            }
        }
    }
    search(a, "Kalcium");

        //objektum mérete
        Object.size = function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };
        var size = Object.size(rows);
        console.log(size);
}
 
new pdfreader.PdfReader().parseFileItems('asd.pdf', function(err, item){
  if (!item || item.page) {
    // end of file, or page
/*     var array = [];
    array.forEach(function(e){
        array.push
    });
    array.forEach(function(element){
        console.log(element);
    }) */
    printRows();
   // console.log('PAGE:', item.page);
    rows = {}; // clear rows for next page
  }
  else if (item.text) {
    // accumulate text items into rows object, per line
    (rows[item.y] = rows[item.y] || []).push(item.text);
  }
});