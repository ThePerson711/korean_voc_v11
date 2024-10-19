const main = document.getElementById("main");
const scroll_list = document.getElementById("scroll_list");
const test = {
    option: {
        p: document.getElementById("opt_p"),
        a: [
            document.getElementById("opt_a1"),
            document.getElementById("opt_a2"),
            document.getElementById("opt_a3"),
            document.getElementById("opt_a4")
        ]
    }
}
let inp = {
    lang: {
        krtouz: document.getElementById("box_inp_kr-to-uz"),
        uztokr: document.getElementById("box_inp_uz-to-kr")
    },
    type: {
        option: document.getElementById("box_inp_option"),
        card: document.getElementById("box_inp_card")
    },
    sound: document.getElementById("box_inp_sound"),
    date: []
};
let settings = {
    lang: "krtouz",
    type: "option",
    sound: true,
    day: []
}
let DayFromStart = "2024-10-18";
let arr_for_test = [];
let RightAnswer = 0;
let OurText = "";

//localStorage.setItem("Voc_v11_settings", JSON.stringify(settings));

/*if (localStorage.getItem("Voc_v11_settings") !== null) {
    settings = JSON.parse(localStorage.getItem("Voc_v11_settings"));
}*/



TextToSpeech("", "uz");
DateReset();
ResetSettings();
Menu(1);


function DateReset() {
    inp.date = [];
    scroll_list.innerHTML = "";
    for (let i = 0; i <= daysBetween(DayFromStart); i++) {
        scroll_list.innerHTML += `
<div class="sl_days">
    <p class="sld_p">${DataPar(i)}</p>
    <input id="days_ckb_${i}" onclick="CheckboxClick(${i});" class="sld_inp" type="checkbox">
</div>`;
    }
    for (let i = 0; i <= daysBetween(DayFromStart); i++) {
        settings.day.push(false);
        inp.date.push(document.getElementById(`days_ckb_${i}`));
    }
}

function CheckboxClick(nth_) {
    settings.day[nth_] = (inp.date[nth_].checked ? true : false);
}

function ResetSettings() {
    if (settings.lang === "krtouz") {
        inp.lang.krtouz.click();
    } else if (settings.lang === "uztokr") {
        inp.lang.uztokr.click();
    }    
    if (settings.type === "option") {
        inp.type.option.click();
    } else if (settings.type === "card") {
        inp.type.card.click();
    }
    inp.sound.checked = settings.sound;
    inp.date[0].click();
}

function DaysShortSort(num_) {
    if (num_ === 0) {
        (inp.date[0].checked ? true : inp.date[0].click())
    } else if (num_ === 1) {
        for (let i = 0; i < 7; i++) {
            if (inp.date.length > i) {
                (inp.date[i].checked ? true : inp.date[i].click())                
            }
        }
    } else if (num_ === 2) {
        for (let i = 0; i < 30; i++) {
            if (inp.date.length > i) {
                (inp.date[i].checked ? true : inp.date[i].click())                
            }
        }
    } else if (num_ === 3) {
        inp.date.forEach(checks => {
            (checks.checked ? true : checks.click())
        });
    }
}

function StartTest() {
    // for date sort
    arr_for_test = [];
    for (let i = 0; i <= daysBetween(DayFromStart); i++) {
        if (settings.day[i]) {
            for (let j = 1; j <= 20; j++) {
                if ((daysBetween(DayFromStart)-i)*20+j-1 < Top_1000_Voc.length) {
                    arr_for_test.push(Top_1000_Voc[    (daysBetween(DayFromStart)-i)*20+j-1   ]);                    
                }
            }
        }
    }
    // for type test    
    if (settings.type === "option") {
        document.getElementById("mn_center").style = `transform: translateY(calc(1vh*100*(0)));`;
        StartOptionTest();
    } else if (settings.type === "card") {
        document.getElementById("mn_center").style = `transform: translateY(calc(1vh*100*(-1)));`;
    }
}

function StartOptionTest() {
    for (let i = 0; i < 4; i++) {
        test.option.a[i].style = `background-color: rgba(47, 172, 172, 0.37);`;
    }
    option_F = [];
    arr_1 = [];
    for (let i = 0; i < arr_for_test.length; i++) {
        arr_1.push(i)
    }
    RandomQ = Math.floor(Math.random()*arr_for_test.length);
    OurText = arr_for_test[RandomQ].korean;
    arr_1.splice(RandomQ, 1);
    RightAnswer = Math.floor(Math.random()*4);
    for (let i = 0; i < 4; i++) {
        if (i !== RightAnswer) {
            ran_for_a = Math.floor(Math.random()*arr_1.length);
            option_F.push(arr_1[ran_for_a]);
            arr_1.splice(ran_for_a, 1);    
        } else {
            option_F.push(RandomQ)
        }
    }
    //console.table(option_F)
    Options = [];
    for (let i = 0; i < 4; i++) {
        Options.push((settings.lang === "krtouz")?(arr_for_test[option_F[i]].uzbek) : (arr_for_test[option_F[i]].korean))
    }
    test.option.p.innerHTML =  (settings.lang === "krtouz")?(arr_for_test[RandomQ].korean):(arr_for_test[RandomQ].uzbek);
    for (let i = 0; i < 4; i++) {
        test.option.a[i].innerHTML = Options[i];
    }
    if (settings.sound) {
        console.log("0",OurText)
        setTimeout(() => {
            SoundBtn();            
        }, 250);
    }
}

function ChoosedOption(nth_) {
    //console.log(nth_)
    if (nth_ === RightAnswer) {
        test.option.a[nth_].style = `background-color: green;`;
    } else {
        test.option.a[nth_].style = `background-color: red;`;
        test.option.a[RightAnswer].style = `background-color: green;`;
    }
    setTimeout(() => {
        StartOptionTest();
    }, 1250);
}

function SoundBtn() {
    TextToSpeech(OurText, "kr");
}

function Menu(page) {
    main.style = 
        `transform: translateX(calc(-1vw*${page-1}00));`;
    if (page == 2 ) {
        StartTest();
    }
}


//
// yil oy kun 
//"2024-12-31"; 
function Date_Today() {
    // Bugungi sanani olish
    const today = new Date();

    // Sana qismlarini olish
    const day = today.getDate(); // kun
    const month = today.getMonth() + 1; // oy (0 dan boshlanadi, shuning uchun +1)
    const year = today.getFullYear(); // yil

    // Formatlangan sanani chiqarish
    return `${year}-${month}-${day}`;
}
//
function daysBetween(dateString) {
    // Kiritilgan sanani olamiz
    const inputDate = new Date(dateString);
  
    // Bugungi sanani olamiz
    const today = new Date();
  
    // Kiritilgan sana va bugungi sana orasidagi farqni millisekundlarda hisoblaymiz
    const timeDifference = today - inputDate;
  
    // Millisekundlarni kunlarga aylantirish (1 kun = 24 soat * 60 daqiqa * 60 soniya * 1000 millisekund)
    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  
    return dayDifference;
}
//
function DataPar(days_) {
    answer = "";
    if (days_ === 0) {
        answer = "Today";
    } else if (days_ === 1) {
        answer += "Yesterday"
    }
    answer += ` ${getDateNDaysAgo(days_)}`;
    return answer;
}
//
function getDateNDaysAgo(daysAgo) {
    // Bugungi sanani olamiz
    const today = new Date();

    // Bugungi sanadan 'daysAgo' kunlarni kamaytiramiz
    today.setDate(today.getDate() - daysAgo);

    // Yangi sanani olamiz
    const day = today.getDate(); // Kun
    const month = today.getMonth() + 1; // Oy (oylar 0 dan boshlanadi, shuning uchun +1)
    const year = today.getFullYear(); // Yil

    // Sanani "YYYY-MM-DD" formatida chiqaramiz
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}
//
// Converts Text to Speech {en,uz,ru,kr}
function TextToSpeech(text_, lang_) {
    if ('speechSynthesis' in window) {
        // Create a new SpeechSynthesisUtterance object
        var utterance = new SpeechSynthesisUtterance();
        // Set the text to be spoken
        utterance.text = text_;
        // Specify Korean as the language
        if (lang_ === "kr") {
        utterance.lang = 'ko-KR';
        } else if (lang_ === "uz") {
        utterance.lang = 'uz-UZ'; // Set language to Uzbek
        } else if (lang_ === "en") {
        utterance.lang = 'en-US'; // Set language to English
        } else if (lang_ === "ru") {
        utterance.lang = 'ru-RU'; // Set language to Russian
        }
        // Speak the text
        speechSynthesis.speak(utterance);
    } else {
        // If speech synthesis is not supported, alert the user
        alert('Sorry, your browser does not support speech synthesis.');
    }
}
  