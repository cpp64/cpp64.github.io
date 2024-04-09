// количество корпусов, дней, уроков в день, кабинетов, классов в каждой параллели
let Ncorp, Ndays, Nlessons, Ncab = 9999, Nparallel = [];
function fake_click() {
        alert("fake_click");
	load_N();
	build_table();
}
function load_N() {
	var fr = new FileReader();
	fr.onload = function () {
		var data = fr.result;
		var array = new Uint8Array(data);
		load_N1(array);
	};
	fr.readAsArrayBuffer(document.getElementById("parallel_input").files[0]);
}
function load_N1(s) {
	Ncorp = Number(document.getElementById("Ncorp_input").value);
	Ndays = Number(document.getElementById("Ndays_input").value);
	Nlessons = Number(document.getElementById("Nlessons_input").value);
	let t = [];
	let row = [];
	let rn = 0;
	for (let i = 0; i < s.length; ++i) {
		if (s[i] == 59) { // ';'
			row.push(t);
			t = [];
		} else if (s[i] == 10 || s[i] == 13) { // '\n' or '\r'
			if (i > 0 && (s[i - 1] == 10 || s[i - 1] == 13)) // очень коряво
				continue;
			row.push(t);
			t = [];
			Nparallel.push(row);
			row = [];
		} else {
			t.push(s[i]);
		}
	}
}
// translit[x] = y, где x - код буквы на англ.раскладке,
// y - код буквы на рус.раскладке win1251
// + пробел и др. неязыковые символы
let translit = [
	  0,   0,   0,   0,   0,   0,   0,   0,
	  0,   0,  10,   0,   0,   0,   0,   0,
	  0,   0,   0,   0,   0,   0,   0,   0,
	  0,   0,   0,   0,   0,   0,   0,   0,
	 32,   0, 221,   0,   0,   0,   0, 253,
	  0,   0,   0,   0, 225,   0, 254,   0,
	  0,   0,   0,   0,   0,   0,   0,   0,
	  0,   0, 198, 230, 193,   0, 222,   0,
	  0, 212, 200, 209, 194, 211, 192, 207,
	208, 216, 206, 203, 196, 220, 210, 217,
	199, 201, 202, 219, 197, 195, 204, 214,
	215, 205, 223, 245,   0, 250,   0,   0,
	184, 244, 232, 241, 226, 243, 224, 239,
	240, 248, 238, 235, 228, 252, 242, 249,
	231, 233, 234, 251, 229, 227, 236, 246,
	247, 237, 255, 213,   0, 218, 168,   0
];
function appendStrToIntArray(s, a) {
	for (let i = 0; i < s.length; ++i)
		a.push(s[i].charCodeAt(0));
}
function appendTranslitStrToIntArray(s, a) {
	for (let i = 0; i < s.length; ++i)
		a.push(translit[s[i].charCodeAt(0)]);
}
function ASCIIarrToInt(arr) {
	let res = 0;
	for (let i = 0; i < arr.length; ++i)
		res = res * 10 + arr[i] - 48;
	return res;
}
//document.getElementById("input").addEventListener("change", handleFiles, false);
function build_table() {
	var fr = new FileReader();
	fr.onload = function () {
		var data = fr.result;
		var array = new Uint8Array(data);
		build_table1(array);
	};
	fr.readAsArrayBuffer(document.getElementById("input").files[0]);
}
function build_table1(s) {
	let t = [];
	let table = [];
	let row = [];
	let rn = 0;
	for (let i = 0; i < s.length; ++i) {
		if (s[i] == 59) { // ';'
			row.push(t);
			t = [];
		} else if (s[i] == 10 || s[i] == 13) { // '\n' or '\r'
			if (i > 0 && (s[i - 1] == 10 || s[i - 1] == 13)) // очень коряво
				continue;
			row.push(t);
			t = [];
			table.push(row);
			row = [];
		} else {
			t.push(s[i]);
		}
	}
	let fio = [];
	for (let corp = 0; corp < Ncorp; ++corp) {
		let week = [];
		for (let day = 0; day < Ndays; ++day) {
			let _day = [];
			for (let lesson = 0; lesson < Nlessons; ++lesson) {
				let _lesson = [];
				for (let parallel = 0; parallel < 11; ++parallel) {
					let _parallel = [];
					for (let _class = 0; _class < Nparallel[corp][parallel]; ++_class) {
						_parallel.push([]);
					}
					_lesson.push(_parallel);
				}
				_day.push(_lesson);
			}
			week.push(_day);
		}
		fio.push(week);
	}
	let cabs = [];
	for (let corp = 0; corp < Ncorp; ++corp) {
		let week = [];
		for (let day = 0; day < Ndays; ++day) {
			let _day = [];
			for (let lesson = 0; lesson < Nlessons; ++lesson) {
				let _lesson = [];
				for (let cab = 0; cab < Ncab; ++cab) {
					_lesson.push(0);
				}
				_day.push(_lesson);
			}
			week.push(_day);
		}
		cabs.push(week);
	}
	for (let i = 1; i < table.length; ++i) {
		let corp = ASCIIarrToInt(table[i][0]) - 1;
		let _fio = table[i][1];
		let cab = ASCIIarrToInt(table[i][3]) - 1;
		let parallel = ASCIIarrToInt(table[i][4]) - 1;
		for (let day = 0; day < Ndays && hrs > 0; ++day) {
			for (let lesson = 0; lesson < Nlessons && hrs > 0; ++lesson) {
				if (cabs[corp][day][lesson][cab] != 0) {
					continue;
				}
				let imin = 0;
				while (imin < Nparallel[corp][parallel] &&
					fio[corp][day][lesson][parallel][imin].length != 0)
					++imin;
				if (imin >= Nparallel[corp][parallel]) {
					continue;
				}
				for (let icur = imin + 1; icur < Nparallel[corp][parallel]; ++icur) {
					if (fio[corp][day][lesson][parallel][imin].length != 0)
						continue;
					let cursum = 0,
						minsum = 0;
					for (let c = 0; c < lesson; ++c) {
						if (fio[corp][day][c][parallel][imin] == _fio)
							minsum += 1;
						if (fio[corp][day][c][parallel][icur] == _fio)
							cursum += 1;
					}
					if (cursum < minsum) {
						imin = icur;
					}
				}
				--hrs;
				fio[corp][day][lesson][parallel][imin] = _fio;
				cabs[corp][day][lesson][cab] = 1;
			}
		}
	}
	s = [];
	// дни недели транслитом
	let weekday = ["Gjytltkmybr", "Dnjhybr", "Chtlf", "Xtndthu", "Gznybwf", "Ce,,jnf", "Djcrhtctymt"];
	for (let corp = 0; corp < Ncorp; ++corp) {
		appendTranslitStrToIntArray("Rjhgec ", s); //"Корпус "
		appendStrToIntArray((corp + 1).toString() + "\n", s);
		for (let day = 0; day < Ndays; ++day) {
			appendTranslitStrToIntArray(weekday[day], s);
			for (let parallel = 0; parallel < 11; ++parallel) {
				for (let i = 0; i < Nparallel[corp][parallel]; ++i) {
					appendStrToIntArray("; " + (parallel + 1).toString() + "-" + (i + 1).toString(), s);
				}
			}
			appendStrToIntArray("\n", s);
			for (let lesson = 0; lesson < Nlessons; ++lesson) {
				appendStrToIntArray((lesson + 1).toString() + ";", s);
				for (let parallel = 0; parallel < 11; ++parallel) {
					for (let _class = 0; _class < Nparallel[corp][parallel]; ++_class) {
						//s.concat(a[corp][day][lesson]); почему нельзя это
						// вместо кошмара ниже
						for (let x = 0; x < fio[corp][day][lesson][parallel][_class].length; ++x)
							s.push(fio[corp][day][lesson][parallel][_class][x]);
						appendStrToIntArray(";", s);
					}
				}
				appendStrToIntArray("\n", s);
			}
			appendStrToIntArray("\n", s);
		}
	}
	/*var saveData = (function () {
	        var a = document.createElement("a");
	        // document.body.appendChild(a); можно
	        // a.style = "display: none"; но не нужно
	        return function (data, fileName) {
	                var blob = new Blob([new Uint8Array(data)], { type: "application/octet-stream" });
	                var url = window.URL.createObjectURL(blob);
	                a.href = url;
	                a.download = fileName;
	                a.click();
	                window.URL.revokeObjectURL(url);
	        };
	})();*/
	saveData(s, "Расписание.csv");
} // build_table1()
function saveData(data, fileName) {
	var a = document.createElement("a");
	// document.body.appendChild(a); можно
	// a.style = "display: none"; но не нужно
	var blob = new Blob([new Uint8Array(data)], {
		type: "application/octet-stream"
	});
	var url = window.URL.createObjectURL(blob);
	a.href = url;
	a.download = fileName;
	a.click();
	window.URL.revokeObjectURL(url);
}
