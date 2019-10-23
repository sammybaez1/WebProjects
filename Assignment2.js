   var array = ["URL", "Scheme", "Userinfo", "Host", "Port", "Authority", "Path", "Query", "Fragment", "IP"];
   var httpCount = 0;
   var httpsCount = 0;
   var TLD = ["PlaceHolder"];
   var TLDcount = [0];
   var TLDcheck = false;


   document.getElementById('file').onchange = function () {
       var file = this.files[0];
       var url;

       var ph = document.getElementById("table");
       linebreak = document.createElement("br");

       var reader = new FileReader();
       reader.onload = function (progressEvent) {

           var lines = this.result.split('\n');
           var tbl = document.createElement("table");
           var tblBody = document.createElement("tbody");

           var row = document.createElement("tr");
           for (var i = 0; i < array.length; i++) {
               var text = document.createTextNode(array[i]);
               var cell = document.createElement("td");
               cell.appendChild(text);
               row.appendChild(cell);

           }
           tblBody.appendChild(row);
           tbl.appendChild(tblBody);
           ph.appendChild(tbl);
           tbl.setAttribute("border", "2");

           for (var line = 0; line < lines.length; line++) {
               var string = lines[line];
               url = new URL(string);

               var text = document.createTextNode(string);

               var scheme = document.createTextNode(url.protocol);
               if (url.protocol == "https:") {
                   httpsCount++;
               } else if (url.protocol == "http:") {
                   httpCount++;
               }

               var userinfo = document.createTextNode(url.username);


               var hostname = document.createTextNode(url.hostname);
               var first = url.hostname.indexOf(".");
               var second = url.hostname.indexOf(".", first + 1);
               var substring = url.hostname.substring(second);
               for (var i = 0; i < TLD.length; i++) {
                   if (TLD.includes(substring)) {
                       function findIt(element) {
                           return element == substring;
                       }
                       var g = TLD.findIndex(findIt);
                       if (TLDcount[g] == null) {
                           TLDcount.push(1);
                       } else {
                           TLDcount[g]++;
                       }
                       break;
                   } else {
                       TLD.push(substring);
                       TLDcount.push(1);
                       break;
                   }
               }


               var port = document.createTextNode(url.port);
               var authority = document.createTextNode(url.origin);
               var path = document.createTextNode(url.pathname);
               var search = document.createTextNode(url.search);
               var hash = document.createTextNode(url.hash);

               var host = url.host;
               var ip;
               var xhr = new XMLHttpRequest();
               var ipText = document.createTextNode("");

               xhr.open("GET", "https://dns.google.com/resolve?name=" + host.substring(host.indexOf(".") + 1), false);

               xhr.onreadystatechange = function () {
                   if (xhr.readyState == 4) {

                       var json = JSON.parse(xhr.responseText);
                       for (var i = 0; i < json.Answer.length; i++) {
                           ip = json.Answer[i].data;
                       }
                       ipText = document.createTextNode(ip);


                   }
               }
               xhr.send();

               var row = document.createElement("tr");

               var cell0 = document.createElement("td");
               cell0.setAttribute("id", "url");
               cell0.appendChild(text);
               row.appendChild(cell0);

               var cell1 = document.createElement("td");
               cell1.appendChild(scheme);
               row.appendChild(cell1);

               var cell2 = document.createElement("td");
               cell2.appendChild(userinfo);
               row.appendChild(cell2);

               var cell3 = document.createElement("td");
               cell3.appendChild(hostname);
               row.appendChild(cell3);

               var cell4 = document.createElement("td");
               cell4.appendChild(port);
               row.appendChild(cell4);

               var cell5 = document.createElement("td");
               cell5.appendChild(authority);
               row.appendChild(cell5);

               var cell6 = document.createElement("td");
               cell6.appendChild(path);
               row.appendChild(cell6);

               var cell7 = document.createElement("td");
               cell7.appendChild(search);
               row.appendChild(cell7);

               var cell8 = document.createElement("td");
               cell8.appendChild(hash);
               row.appendChild(cell8);

               var cell9 = document.createElement("td");
               cell9.appendChild(ipText);
               row.appendChild(cell9);

               tblBody.appendChild(row);
               tbl.appendChild(tblBody);
               ph.appendChild(tbl);
               tbl.setAttribute("border", "2");
           }

           google.charts.load('current', {
               'packages': ['corechart']
           });
           google.charts.setOnLoadCallback(drawChart);


           function drawChart() {
               var data = google.visualization.arrayToDataTable([
  ['Task', 'Hours per Day'],
  ['Https', httpsCount],
  ['Http', httpCount]
]);

               var merged = [["Task", "Hours per Day"]];

               for (var i = 0; i < TLD.length; i++) {
                   merged.push([TLD[i], TLDcount[i]]);
               }


               var data2 = google.visualization.arrayToDataTable(merged);

               var options = {
                   'title': 'Scheme Occurences',
                   'width': 550,
                   'height': 400
               };
               var options2 = {
                   'title': 'TLD Occurences',
                   'width': 550,
                   'height': 400
               };

               var chart = new google.visualization.PieChart(document.getElementById('piechart'));
               chart.draw(data, options);
               var chart = new google.visualization.PieChart(document.getElementById('piechart2'));
               chart.draw(data2, options2);
           }

       };

       reader.readAsText(file);
   };
