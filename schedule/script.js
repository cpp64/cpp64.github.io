// количество корпусов, дней, уроков в день, кабинетов, классов в каждой параллели
let Ncorp, Nlessons = [], Ncab = 9999, Nparallel = [], Ndays = 6;
function fake_click() {
        console.log("fake_click");
	Ncorp = Number(document.getElementById("Ncorp_input").value);
	Nlessons = [];
	for(let i = 1; i < 7; ++i) {
		let input = document.getElementById("Nlessons_input"+i.toString());
		Nlessons.push(Number(input.value));
	}
	var fr = new FileReader();
	fr.onload = function () {
		saveData(fr.result,"temporary.csv");
		let temp = parse_csv(new Uint8Array(fr.result));
		for(let i = 1; i < temp.length; ++i) {
			// 0 строка - заголовок таблицы
			let t = [];
			for(let j = 0; j < temp[i].length; ++j)
				t.push(ASCIIarrToInt(my_split(temp[i][j]," \t")));
			Nparallel.push(t);
		}
		console.log('Nparallel:');
		console.log(Nparallel);
		build_table();
	};
	fr.readAsArrayBuffer(document.getElementById("parallel_input").files[0]);
}
/*let arrr = [];
appendStrToIntArray("1 - 3, 8, 12 - 15", arrr);
console.log(arrr);
console.log(parse_interval(arrr));*/
function parse_interval(s) {
	let t = [[],[]], result = [], t_id = 0;
	for(let i = 0; i <= s.length; ++i) {
		// если i == s.length, дальше условие проверяться не будет
		if(i == s.length || s[i] == _int(',') || s[i] == _int(';')) {
			if(t_id == 1) {
				for(let i = ASCIIarrToInt(t[0]); i <= ASCIIarrToInt(t[1]); ++i)
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
function parse_csv(s) {
	//console.log("parse_csv()");
	//console.log(s);
	let table = [], row = [], t = [];
	for (let i = 0; i < s.length; ++i) {
		// работает некорректно, не добавляет последнюю ячейку
		if (s[i] == _int(';')) {
			row.push(t);
			t = [];
		} else if (s[i] == _int('\r') || s[i] == _int('\n')) {
			if (i > 0 && (s[i-1] == _int('\r') || s[i-1] == _int('\r'))) // очень коряво
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
function appendStrToIntArray(s, a) {
	for (let i = 0; i < s.length; ++i)
		a.push(_int(s[i]));
}
function appendTranslitStrToIntArray(s, a) {
	for (let i = 0; i < s.length; ++i)
		a.push(translit[_int(s[i])]);
}
function ASCIIarrToInt(arr) {
	let res = 0;
	for (let i = 0; i < arr.length; ++i)
		res = res * 10 + arr[i] - 48;
	return res;
}
function build_table() {
	var fr = new FileReader();
	fr.onload = function () {
		build_table1(new Uint8Array(fr.result));
	};
	fr.readAsArrayBuffer(document.getElementById("input").files[0]);
}
// индексация schedule[корпус][день][урок][параллель][класс]
function my_split(str, sep) {
	let res = [], t = "";
	for(let i = 0; i < str.length; ++i) {
		let j = 0;
		while(j < sep.length && str[i] != sep[j])
			++j;
		if(j < sep.length) {
			if(t.length > 0)
				res.push(t);
			t = "";
			continue;
		}
		t += str[i];
	}
	if(t.length > 0)
		res.push(t);
	return res;
}
function make_parallel(corp, parallel) {
	let _parallel = [];
	for (let _class = 0; _class < Nparallel[corp][parallel]; ++_class) {
		_parallel.push([]);
	}
	return _parallel;
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
		let _class_temp = my_split(table[i][1], "/- _");
		let parallel = ASCIIarrToInt(_class_temp[0]) - 1;
		let _class = ASCIIarrToInt(_class_temp[1]) - 1;
		let hrs = ASCIIarrToInt(my_split(table[i][2]," \t")) - 1;
		let min = ASCIIarrToInt(my_split(table[i][3]," \t")) - 1;
		let max = ASCIIarrToInt(my_split(table[i][4]," \t")) - 1;
		let skip = ASCIIarrToInt(my_split(table[i][5]," \t")) - 1;
		let days = parse_interval(table[i][6]);
		let cab = my_split(table[i][7],"/ -;,+");
		let fio = my_split(table[i][8],"/ -;,+");
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
					let cursum = 0,
						minsum = 0;
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
