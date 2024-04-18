// количество корпусов, дней, уроков в день, кабинетов, классов в каждой параллели
let Ncorp, Nlessons = [], Ncab = 9999, Nparallel = [], Ndays = 6;
function fake_click() {
        console.log("fake_click");
	let Ncorp_input = document.getElementById("Ncorp_input");
	Ncorp = Number(Ncorp_input.value);
	Nlessons = [];
	for(let i = 1; i < 7; ++i) {
		let id = "Nlessons_input"+i.toString();
		let input = document.getElementById(id);
		Nlessons.push(Number(input.value));
	}
	var fr = new FileReader();
	fr.onload = function () {
		saveData(fr.result, "temporary.csv");
		let temp = parse_csv(new Uint8Array(fr.result));
		let buf = [];
		for(let i = 1; i < temp.length; ++i) {
			// 0 строка - заголовок таблицы
			let t = [];
			let t_buf = [];
			for(let j = 0; j < temp[i].length; ++j) {
				let cell = my_split(temp[i][j]," \t");
				t.push(ASCIIarrToInt(cell[0]));
				t_buf.push(cell);
			}
			Nparallel.push(t);
			buf.push(t_buf);
		}
		console.log('Nparallel:');
		console.log(Nparallel);
		console.log('buf:');
		console.log(buf);
		build_table();
	};
	let parallel_input = document.getElementById("parallel_input");
	fr.readAsArrayBuffer(parallel_input.files[0]);
}
/* let arrr = [];
appendStrToIntArray("1 - 3, 8, 12 - 15", arrr);
console.log(arrr);
console.log(parse_interval(arrr)); */
function parse_interval(s) {
	let t = [[],[]], result = [], t_id = 0;
	for(let i = 0; i <= s.length; ++i) {
		// если i == s.length, дальше условие проверяться не будет
		if(i == s.length || s[i] == _int(',') || s[i] == _int(';')) {
			if(t_id == 1) {
				let start = ASCIIarrToInt(t[0]);
				let end = ASCIIarrToInt(t[1]);
				for(let i = start; i <= end; ++i)
					result.push(i);
				t_id = 0;
			} else {
				result.push(ASCIIarrToInt(t[0]));
			}
			t = [[],[]];
			continue;
		}
		if(s[i] == _int(' '))
			continue;
		if(_int('0') <= s[i] && s[i] <= _int('9')) {
			t[t_id].push(s[i]);
			continue;
		}
		if(s[i] == _int('-')) {
			t_id = 1;
			continue;
		}
	}
	return result;
}
function is_rn(code) {
	return code == _int('\r') || code == _int('\n');
}
function parse_csv(s) {
	//console.log("parse_csv()");
	//console.log(s);
	let table = [], row = [], t = [];
	for (let i = 0; i < s.length; ++i) {
		// работает некорректно, не добавляет последнюю ячейку
		if (s[i] == _int(';')) {
			row.push(t);
			t = [];
		} else if (is_rn(s[i])) {
			// очень коряво
			if (i > 0 && is_rn(s[i-1]))
				continue;
			row.push(t);
			t = [];
			table.push(row);
			row = [];
		} else {
			t.push(s[i]);
		}
	}
	return table;
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
function _int(_char) {
	return _char.charCodeAt(0);
}
function appendStrToIntArray(str, arr) {
	for (let i = 0; i < str.length; ++i)
		arr.push(_int(str[i]));
}
function appendTranslitStrToIntArray(str, arr) {
	for (let i = 0; i < str.length; ++i)
		arr.push(translit[_int(str[i])]);
}
function ASCIIarrToInt(arr) {
	let res = 0;
	for (let i = 0; i < arr.length; ++i)
		res = res * 10 + arr[i] - 48;
	return res;
}
// индексация schedule[корпус][день][урок][параллель][класс]
function my_split(arr, separators_str) {
	let sep = [];
	appendStrToIntArray(separators_str, sep);
	let res = [], t = [];
	for(let i = 0; i < arr.length; ++i) {
		let j = 0;
		while(j < sep.length && arr[i] != sep[j])
			++j;
		if(j < sep.length) {
			if(t.length > 0)
				res.push(t);
			t = [];
			continue;
		}
		t.push(arr[i]);
	}
	if(t.length > 0)
		res.push(t);
	return res;
}
function make_parallel(corp, parallel) {
	let _parallel = [];
	let class_count = Nparallel[corp][parallel];
	for (let _class = 0; _class < class_count; ++_class)
		_parallel.push([]);
	return _parallel;
}
function build_table() {
	var fr = new FileReader();
	fr.onload = function () {
		build_table1(new Uint8Array(fr.result));
	};
	let hours_table_input = document.getElementById("hours_table_input");
	fr.readAsArrayBuffer(hours_table_input.files[0]);
}
function build_table1(s) {
	let table = parse_csv(s);
	let schedule = [];
	for (let corp = 0; corp < Ncorp; ++corp) {
		let _week = [];
		for (let day = 0; day < Ndays; ++day) {
			let _day = [];
			for (let lesson = 0; lesson < Nlessons[day]; ++lesson) {
				let _lesson = [];
				for (let parallel = 0; parallel < 11; ++parallel)
					_lesson.push(make_parallel(corp, parallel));
				_day.push(_lesson);
			}
			_week.push(_day);
		}
		schedule.push(_week);
	}
	let cabs = [];
	for (let corp = 0; corp < Ncorp; ++corp) {
		let _week = [];
		for (let day = 0; day < Ndays; ++day) {
			let _day = [];
			for (let lesson = 0; lesson < Nlessons; ++lesson) {
				let _lesson = [];
				for (let cab = 0; cab < Ncab; ++cab) {
					_lesson.push(0);
				}
				_day.push(_lesson);
			}
			_week.push(_day);
		}
		cabs.push(_week);
	}
	for (let i = 1; i < table.length; ++i) {
		let corp = ASCIIarrToInt(my_split(table[i][0]," \t")) - 1;
		console.log("corp");
		console.log(corp);
		let _class_temp = my_split(table[i][1], "/- _");
		console.log("_class_temp");
		console.log(_class_temp);
		let parallel = ASCIIarrToInt(_class_temp[0]) - 1;
		console.log("parallel");
		console.log(parallel);
		let _class = ASCIIarrToInt(_class_temp[1]) - 1;
		console.log("_class");
		console.log(_class);
		let hrs = ASCIIarrToInt(my_split(table[i][2]," \t")) - 1;
		console.log("hrs");
		console.log(hrs);
		let min = ASCIIarrToInt(my_split(table[i][3]," \t")) - 1;
		console.log("min");
		console.log(min);
		let max = ASCIIarrToInt(my_split(table[i][4]," \t")) - 1;
		console.log("max");
		console.log(max);
		let skip = ASCIIarrToInt(my_split(table[i][5]," \t")) - 1;
		console.log("skip");
		console.log(skip);
		let days = parse_interval(table[i][6]);
		console.log("days");
		console.log(days);
		let cab = my_split(table[i][7],"/ -;,+");
		console.log("cab");
		console.log(cab);
		let fio = my_split(table[i][8],"/ -;,+");
		console.log("fio");
		console.log(fio);
		for (let day = 0; day < Ndays && hrs > 0; ++day) {
			for (let lesson = 0; lesson < Nlessons && hrs > 0; ++lesson) {
				if (cabs[corp][day][lesson][cab] != 0) {
					continue;
				}
				let imin = 0;
				while (imin < Nparallel[corp][parallel] &&
					schedule[corp][day][lesson][parallel][imin].length != 0)
					++imin;
				if (imin >= Nparallel[corp][parallel]) {
					continue;
				}
				for (let icur = imin + 1; icur < Nparallel[corp][parallel]; ++icur) {
					if (schedule[corp][day][lesson][parallel][imin].length != 0)
						continue;
					let cursum = 0, minsum = 0;
					for (let c = 0; c < lesson; ++c) {
						if (schedule[corp][day][c][parallel][imin] == _fio)
							minsum += 1;
						if (schedule[corp][day][c][parallel][icur] == _fio)
							cursum += 1;
					}
					if (cursum < minsum) {
						imin = icur;
					}
				}
				--hrs;
				schedule[corp][day][lesson][parallel][imin] = fio;
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
	saveData(s, "Расписание.csv");
} // build_table1()
function saveData(data, fileName) {
	var blob = new Blob([new Uint8Array(data)], {
		type: "application/octet-stream"
	});
	var a = document.createElement("a");
	// document.body.appendChild(a); можно
	// a.style = "display: none"; но не нужно
	a.href = window.URL.createObjectURL(blob);
	a.download = fileName;
	a.click();
	window.URL.revokeObjectURL(a.href);
}
