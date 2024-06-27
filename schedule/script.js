/*
	?? может переделат структуру таблицы, чтоб было в первую очередь по кабинетам ??

	индексация schedule[корпус][день][урок][параллель][класс]

	ДОБАВИТЬ ОПРЕДЕЛЕНИЕ КОЛ-ВА КАБИНЕТОВ ПО НОМЕРУ САМОГО БОЛЬШОГО КАБИНЕТА

 	Не будет работать со случаем: min = 3, max = 6 и H = 8,
	заполнит в первый день сразу 6 и на 2 день не останется, чтобы заполнить 3.

  	Раскидывать так: сначала накидать по минимуму. Потом накинуть туда, где уже
   	есть, но так, чтобы осталось хотя бы min. Иначе, если останется меньше, чем
    	min, нельзя будет добавить в новый день.
*
/*
 	Ncab - количество кабинетов
  	Ncorp - корпусов
   	ND - учебных дней
    	NL[i] - уроков в день i
     	NP[i] - классов в параллели i
*/
let Ncab = 9999, Ncorp, ND = 6, NL = [], NP = [];
function fake_click() {
        let Ncorp_input = document.getElementById("Ncorp_input");
        Ncorp = Number(Ncorp_input.value);
        NL = [];
        for(let i = 1; i < 7; ++i) {
                let id = "Nlessons_input"+i.toString();
                let input = document.getElementById(id);
                NL.push(Number(input.value));
        }
        var fr = new FileReader();
        fr.onload = function () {
                let csv = ParseCSV(new Uint8Array(fr.result));
                for(let i = 1; i < csv.length; ++i) {
                        // 0 строка - заголовок таблицы
                        let row = [];
                        for(let j = 0; j < csv[i].length; ++j) {
                                let cell = SplitTo1(csv[i][j]," \t");
                                row.push(atoi(cell));
                        }
                        NP.push(row);
                }
                console.log('NP:');
                console.log(NP);
                BuildTable();
        };
        let PInput = document.getElementById("parallel_input");
        fr.readAsArrayBuffer(PInput.files[0]);
}
function ParseInterval(s) {
        let t = [[],[]], result = [], t_id = 0;
        for(let i = 0; i <= s.length; ++i) {
                // если i == s.length, дальше условие проверяться не будет
                if(i == s.length || s[i] == INT(',') || s[i] == INT(';')) {
                        if(t_id == 1) {
                                let start = atoi(t[0]);
                                let end = atoi(t[1]);
                                for(let i = start; i <= end; ++i)
                                        result.push(i);
                                t_id = 0;
                        } else {
                                result.push(atoi(t[0]));
                        }
                        t = [[],[]];
                        continue;
                }
                if(s[i] == INT(' '))
                        continue;
                if(INT('0') <= s[i] && s[i] <= INT('9')) {
                        t[t_id].push(s[i]);
                        continue;
                }
                if(s[i] == INT('-')) {
                        t_id = 1;
                        continue;
                }
        }
        return result;
}
function RN(code) {
        return code == INT('\r') || code == INT('\n');
}
function ParseCSV(s) {
        let table = [], row = [], t = [];
        for (let i = 0; i < s.length; ++i) {
                // работает некорректно, не добавляет последнюю ячейку
                if (s[i] == INT(';')) {
                        row.push(t);
                        t = [];
                } else if (RN(s[i])) {
                        // очень коряво
                        if (i > 0 && RN(s[i-1]))
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
// translit[x] = y, где x - код буквы на англ.раскладке, y - код буквы на рус.раскладке win1251
// для независящих от языка символов (пробел, цифры, ...) translit[x] = x
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
function INT(CHAR) {
        return CHAR.charCodeAt(0);
}
function PushStr(str, arr) {
        for (let i = 0; i < str.length; ++i)
                arr.push(INT(str[i]));
}
function PushTranslit(str, arr) {
        for (let i = 0; i < str.length; ++i)
                arr.push(translit[INT(str[i])]);
}
function atoi(arr) {
        let res = 0;
        for (let i = 0; i < arr.length; ++i)
                res = res*10+arr[i]-48;
        return res;
}
function MySplit(arr, separators_str) {
        let sep = [];
        PushStr(separators_str, sep);
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
function SplitTo1(arr, separators_str) {
        return MySplit(arr, separators_str)[0];
}
function SplitToInt(arr, separators_str) {
        return atoi(SplitTo1(arr, " \t"));
}
function BuildTable() {
        var fr = new FileReader();
        fr.onload = function () {
                BuildTable1(new Uint8Array(fr.result));
        };
        let Hinput = document.getElementById("hours_table_input");
        fr.readAsArrayBuffer(Hinput.files[0]);
}
function BuildTable1(s) {
        let schedule = [];
        for (let corp = 0; corp < Ncorp; ++corp) {
                let _week = [];
                for (let D = 0; D < ND; ++D) {
                        let _day = [];
                        for (let L = 0; L < NL[D]; ++L) {
                                let _lesson = [];
                                for (let P = 0; P < 11; ++P) {
					let _parallel = [];
					for (let i = 0; i < NP[corp][P]; ++i)
						_parallel.push([]);
					_lesson.push(_parallel);
				}
                                _day.push(_lesson);
                        }
                        _week.push(_day);
                }
                schedule.push(_week);
        }
	console.log("schedule after create: ", schedule);
        let cab = [];
        for (let corp = 0; corp < Ncorp; ++corp) {
                let _week = [];
                for (let D = 0; D < ND; ++D) {
                        let _day = [];
                        for (let L = 0; L < NL[D]; ++L) {
				// fill заполняет одним и тем же, если заполнять пустым массивом,
				// то накидает ссылок на один и тот же пустой массив
                                let _lesson = Array(Ncab).fill(0);
                                _day.push(_lesson);
                        }
                        _week.push(_day);
                }
                cab.push(_week);
        }
        let table = ParseCSV(s);
        for (let i = 1; i < table.length; ++i) {
                let corp = SplitToInt(table[i][0], " \t")-1;
                console.log("corp:", corp);
                let _class_temp = MySplit(table[i][1], "/- _");
                console.log("_class_temp:", _class_temp);
                let P = atoi(_class_temp[0])-1;
                console.log("P:", P);
                let _class = atoi(_class_temp[1])-1;
                console.log("_class:", _class);
                let H = SplitToInt(table[i][2], " \t");
                console.log("H:", H);
                let min = SplitToInt(table[i][3], " \t");
                console.log("min:", min);
                let max = SplitToInt(table[i][4], " \t");
                console.log("max:", max);
                let skip = SplitToInt(table[i][5]," \t");
                console.log("skip:", skip);
                let DayList = ParseInterval(table[i][6]);
                console.log("DayList:", DayList);
                let cab_temp = MySplit(table[i][7], "/\\");
                console.log("cab_temp:", cab_temp);
                let CabList = [];
                for(let i = 0; i < cab_temp.length; ++i)
                        CabList.push(ParseInterval(cab_temp[i]));
                console.log("CabList:", CabList);
                let fio = MySplit(table[i][8], "/\\"); // НАБОР из нескольких ФИО
                console.log("fio:", fio);
		/*
  			L - lesson
     			D - day
     			H - hours
     			P - parallel
			ND - number of days
			NL - number of lessons
  		*/
                for (let D = 0; D < ND && H > 0; ++D) {
                        FreeCnt = 0;
			let answers = [];
                        for (let L = 0; L < NL[D]; ++L) {
				BruteFlag = false;
				BruteAns = Array(CabList.length).fill(0);
                                BruteCab = ArrClone(cab[corp][D][L]);
				Brute(CabList, 0);
				console.log("D: ", D, " L: ", L, " BruteAns: ", BruteAns);
                                if(BruteFlag) {
					answers.push(BruteAns);
					FreeCnt += 1;
				} else {
					answers.push([]);
				}
                        }
                        console.log("FreeCnt: ", FreeCnt);
                        if(FreeCnt < min)
                                continue;
                        let HrsToFill = Math.min(Math.min(max, FreeCnt), H);
                        console.log("HrsToFill: ", HrsToFill);
                        H -= HrsToFill;
                        for (let L = 0; L < NL[D] && HrsToFill > 0; ++L) {
				if(answers[L].length == 0)
					continue;
				ArrPush(schedule[corp][D][L][P][_class], table[i][8]);
                                for(let i = 0; i < answers[L].length; ++i)
                                        cab[corp][D][L][answers[L][i]] = 1;
                                --HrsToFill;
			}
                }
		if(H > 0)
			alert("Ошибка 000");
                console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        }
        s = [];
        let weekday = ["Gjytltkmybr", "Dnjhybr", "Chtlf", "Xtndthu", "Gznybwf", "Ce,,jnf", "Djcrhtctymt"];
	///////////////"Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"
	console.log("!! schedule: ", schedule);
	console.log("!! cab: ", cab);
        for (let corp = 0; corp < Ncorp; ++corp) {
                PushTranslit("Rjhgec ", s); //"Корпус "
                PushStr((corp+1).toString()+"\n", s);
                for (let D = 0; D < ND; ++D) {
                        PushTranslit(weekday[D], s);
                        for (let P = 0; P < 11; ++P)
                                for (let i = 0; i < NP[corp][P]; ++i)
                                        PushStr("; "+(P+1).toString()+"-"+(i+1).toString(), s);
                        PushStr("\n", s);
                        for (let L = 0; L < NL[D]; ++L) {
                                PushStr((L+1).toString()+";", s);
                                for (let P = 0; P < 11; ++P) {
                                        for (let i = 0; i < NP[corp][P]; ++i) {
						ArrPush(s, schedule[corp][D][L][P][i]);
                                                PushStr(";", s);
                                        }
                                }
                                PushStr("\n", s);
                        }
                        PushStr("\n", s);
                }
        }
        SaveData(s, "Расписание.csv");
}
function ArrPush(dst, src) {
	for(let i = 0; i < src.length; ++i)
		dst.push(src[i]);
}
function ArrClone(src) {
	let dst = [];
	ArrPush(dst, src);
	return dst;
}
function SaveData(data, fileName) {
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
let BruteAns = [], BruteFlag, BruteCab = [], FreeCnt;
function Brute(a,i) {
        if(BruteFlag)
                return;
        if(i == a.length) {
                BruteFlag = true;
                return;
        }
        for(let j = 0; j < a[i].length && !BruteFlag; ++j) {
                if(BruteCab[a[i][j]])
                        continue;
		BruteAns[i] = a[i][j];
                BruteCab[a[i][j]] = true;
                Brute(a, i+1);
                BruteCab[a[i][j]] = false;
        }
}
