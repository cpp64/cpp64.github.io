
// может переделат структуру таблицы, чтоб было в первую очередь по кабинетам

// количество корпусов, дней, уроков в день, кабинетов, классов в каждой параллели
let Ncorp, Nlessons = [], Nparallel = [], Ndays = 6, Ncab = 9999;
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
                let temp = ParseCSV(new Uint8Array(fr.result));
                let buf = [];
                for(let i = 1; i < temp.length; ++i) {
                        // 0 строка - заголовок таблицы
                        let t = [];
                        let t_buf = [];
                        for(let j = 0; j < temp[i].length; ++j) {
                                let cell = SplitTo1(temp[i][j]," \t");
                                t.push(atoi(cell));
                                t_buf.push(cell);
                        }
                        Nparallel.push(t);
                        buf.push(t_buf);
                }
                console.log('Nparallel:');
                console.log(Nparallel);
                console.log('buf:');
                console.log(buf);
                BuildTable();
        };
        let parallel_input = document.getElementById("parallel_input");
        fr.readAsArrayBuffer(parallel_input.files[0]);
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
        //console.log("parse_csv()");
        //console.log(s);
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
                res = res * 10 + arr[i] - 48;
        return res;
}
// индексация schedule[корпус][день][урок][параллель][класс]
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
function MakeParallel(corp, parallel) {
        let _parallel = [];
        let class_count = Nparallel[corp][parallel];
        for (let _class = 0; _class < class_count; ++_class)
                _parallel.push([]);
        return _parallel;
}
function BuildTable() {
        var fr = new FileReader();
        fr.onload = function () {
                BuildTable1(new Uint8Array(fr.result));
        };
        let hours_table_input = document.getElementById("hours_table_input");
        fr.readAsArrayBuffer(hours_table_input.files[0]);
}
function BuildTable1(s) {
        let table = ParseCSV(s);
        let schedule = [];
        for (let corp = 0; corp < Ncorp; ++corp) {
                let _week = [];
                for (let day = 0; day < Ndays; ++day) {
                        let _day = [];
                        for (let lesson = 0; lesson < Nlessons[day]; ++lesson) {
                                let _lesson = [];
                                for (let parallel = 0; parallel < 11; ++parallel)
                                        _lesson.push(MakeParallel(corp, parallel));
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
                        for (let lesson = 0; lesson < Nlessons[day]; ++lesson) {
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
                let corp = SplitToInt(table[i][0], " \t")-1;
                console.log("corp:");
                console.log(corp);
                let _class_temp = MySplit(table[i][1], "/- _");
                console.log("_class_temp:");
                console.log(_class_temp);
                let parallel = atoi(_class_temp[0])-1;
                console.log("parallel:");
                console.log(parallel);
                let _class = atoi(_class_temp[1])-1;
                console.log("_class:");
                console.log(_class);
                let hrs = SplitToInt(table[i][2], " \t");
                console.log("hrs:");
                console.log(hrs);
                let min = SplitToInt(table[i][3], " \t");
                console.log("min:");
                console.log(min);
                let max = SplitToInt(table[i][4], " \t");
                console.log("max:");
                console.log(max);
                let skip = SplitToInt(table[i][5]," \t");
                console.log("skip:");
                console.log(skip);
                let days = ParseInterval(table[i][6]);
                console.log("days:");
                console.log(days);
                let cab_temp = MySplit(table[i][7], "/ -;,+");
                console.log("cab_temp:");
                console.log(cab_temp);
                let cab = [];
                for(let i = 0; i < cab_temp.length; ++i)
                        cab.push(atoi(cab_temp[i]));
                console.log("cab:");
                console.log(cab);
                let fio = MySplit(table[i][8], "/ -;,+");
                console.log("fio:");
                console.log(fio);
                for (let day = 0; day < Ndays && hrs > 0; ++day) { // hrs условие не понятное
                        // БАГИ ЗДЕСЬ
                        let free_cnt = 0;
                        for (let lesson = 0; lesson < Nlessons[day]; ++lesson) {
                                // достаточно проверки занятости кабинета
                                // проверка таблицы учителей не нужна
                                if (cabs[corp][day][lesson][cab] != 0)
                                        continue;
                                ++free_cnt;
                        }
                        console.log("free_cnt:");
                        console.log(free_cnt);
                        console.log("min:");
                        console.log(min);
                        if(free_cnt < min)
                                continue;
                        let hrs_to_fill = Math.min(max, free_cnt);
                        console.log("hrs_to_fill:");
                        console.log(hrs_to_fill);
                        for (let lesson = 0; lesson < Nlessons[day] && hrs_to_fill > 0; ++lesson) {
                                if (cabs[corp][day][lesson][cab] != 0)
                                        continue;
                                // если просто присвоить он почему-то добавляет
                                // массив в массив, вместо того, чтобы присвоить
                                // массиву массив
                                // schedule[corp][day][lesson][parallel][_class] = fio;
                                for(let i = 0; i < fio.length; ++i)
                                        schedule[corp][day][lesson][parallel][_class].push(fio[i]);
                                cabs[corp][day][lesson][cab] = 1;
                                --hrs_to_fill;
                        }
                }
                console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        }
        s = [];
        // дни недели транслитом
        let weekday = ["Gjytltkmybr", "Dnjhybr", "Chtlf", "Xtndthu", "Gznybwf", "Ce,,jnf", "Djcrhtctymt"];
        for (let corp = 0; corp < Ncorp; ++corp) {
                PushTranslit("Rjhgec ", s); //"Корпус "
                PushStr((corp+1).toString()+"\n", s);
                for (let day = 0; day < Ndays; ++day) {
                        PushTranslit(weekday[day], s);
                        for (let parallel = 0; parallel < 11; ++parallel) {
                                for (let _class = 0; _class < Nparallel[corp][parallel]; ++_class) {
                                        let ParallelS = (parallel+1).toString();
                                        let ClassS = (_class+1).toString();
                                        PushStr("; "+ParallelS+"-"+ClassS, s);
                                }
                        }
                        PushStr("\n", s);
                        for (let lesson = 0; lesson < Nlessons[day]; ++lesson) {
                                PushStr((lesson+1).toString()+";", s);
                                for (let parallel = 0; parallel < 11; ++parallel) {
                                        for (let _class = 0; _class < Nparallel[corp][parallel]; ++_class) {
                                                PushStr("{", s);
                                                let str = schedule[corp][day][lesson][parallel][_class];
                                                console.log("pushing:", str);
                                                for(let i = 0; i < str.length; ++i)
                                                        s.push(str[i]);
                                                // здесь почему-то пихается массив в массиве вместо
                                                // просто массива
                                                PushStr("};", s);
                                        }
                                }
                                PushStr("\n", s);
                        }
                        PushStr("\n", s);
                }
        }
        console.log("schedule[0][0][0]:");
        console.log(schedule[0][0][0]);
        SaveData(s, "Расписание.csv");
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