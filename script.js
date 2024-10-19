const main = document.getElementById("main");
const scroll_list = document.getElementById("scroll_list");
const cards_box = document.getElementById("cards_box");
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
const CUR = {
    d: 30,
    c: 20,
    a: 150,
    b: 55
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
    type: "card",
    sound: true,
    day: []
}
let DayFromStart = "2024-10-18";
let arr_for_test = [];
let RightAnswer = 0;
let OurText = "";
let BegP = {
    x: null, 
    y: null
}
let ScrPos = {
    x: 0,
    y: 0
};
let CrsC = false;
let ThisDevice = "";
let CardWords = {
    korean: "",
    uzbek: ""
};
// qurilmani tekshirish
const userAgent = navigator.userAgent;
if (/mobile/i.test(userAgent)) {
    ThisDevice = "Phone";
} else {
    ThisDevice = "PC";
}
//localStorage.setItem("Voc_v11_settings", JSON.stringify(settings));

/*if (localStorage.getItem("Voc_v11_settings") !== null) {
    settings = JSON.parse(localStorage.getItem("Voc_v11_settings"));
}*/



TextToSpeech("", "uz");
DateReset();
ResetSettings();
Menu(2);


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
        StartCardTest();
    }
}

function StartCardTest() {
    RandomQ = Math.floor(Math.random()*arr_for_test.length);
    CardWords.korean = arr_for_test[RandomQ].korean;
    CardWords.uzbek = arr_for_test[RandomQ].uzbek;

    slideFlashcard("l")
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
        setTimeout(() => {
            SoundBtn();            
        }, 250);
    }
}

function ChoosedOption(nth_) {
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
//




if (ThisDevice === "PC") {
    cards_box.addEventListener('mousemove', (event) => {
        // Elementning o'lchovlarini olish
        const rect = cards_box.getBoundingClientRect();
        // Kursor pozitsiyasini hisoblash
        const x = (event.clientX - rect.left)/rect.width*100; // X koordinati
        const y = (event.clientY - rect.top)/rect.height*100;  // Y koordinati
        // Kursor pozitsiyasini ko'rsatish
    //  PC
        ScrPos.x = x;
        ScrPos.y = y;
    });
    cards_box.addEventListener("mousedown", (event) => {
        BegP.x = ScrPos.x;
        BegP.y = ScrPos.y;
        CrsC = true;
        id = setInterval(() => {
            if (CrsC) {
                if (BegP.x > ScrPos.x+CUR.d && (BegP.y-CUR.c < ScrPos.y || ScrPos.y < BegP.y+CUR.c) ) {
                    slideFlashcard("r");
                    clearInterval(id);                      
                }
                if (BegP.x < ScrPos.x-CUR.d && (BegP.y-CUR.c < ScrPos.y || ScrPos.y < BegP.y+CUR.c) ) {
                    slideFlashcard("l");
                    clearInterval(id);                      
                }
                if (BegP.y > ScrPos.y+CUR.d && (BegP.x-CUR.c < ScrPos.x || ScrPos.x < BegP.x+CUR.c) ) {
                    Aylan();
                    clearInterval(id);                      
                }
                if (BegP.y < ScrPos.y-CUR.d && (BegP.x-CUR.c < ScrPos.x || ScrPos.x < BegP.x+CUR.c) ) {
                    Aylan();
                    clearInterval(id);                      
                }
            } 
        }, 25);
    })
    cards_box.addEventListener("mouseup", (event) => {
        BegP.x = null;
        BegP.y = null;
        CrsC = false;
        clearInterval(id);
    })
} else {
    /*
    cards_box.addEventListener('touchmove', (event) => {
        // Birinchi touch nuqtasini olish
        const touch = event.touches[0];
        // Elementning o'lchovlarini olish
        const rect = cards_box.getBoundingClientRect();
        // Barmoq pozitsiyasini hisoblash
        const x = (touch.clientX - rect.left)/rect.width*100; // X koordinati
        const y = (touch.clientY - rect.top)/rect.height*100;  // Y koordinati
        // Barmoq pozitsiyasini ko'rsatish
    // if MOBILE 
        ScrPos.x = x;
        ScrPos.y = y;
        // Hodisani to'xtatish, aks holda sahifa aylanishi mumkin
        event.preventDefault();
    });*/
    const cards_box = document.getElementById('cards_box');
    let startX, startY;

    // CUR obyektini aniqlash (threshold)
    const CUR = {
        a: 30, // X yo'nalishi bo'yicha minimal masofa
        b: 30  // Y yo'nalishi bo'yicha minimal masofa
    };

    // Touch start hodisasi - dastlabki koordinatalarni olish
    cards_box.addEventListener('touchstart', (event) => {
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    });

    // Touch move hodisasi - surish yo'nalishini aniqlash
    cards_box.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        // Gorizontal surish (chap/o'ng)
        if (Math.abs(deltaX) > CUR.a && Math.abs(deltaY) < CUR.b) {
            if (deltaX > 0) {
                // O'ngga surildi
                slideFlashcard("r");
            } else {
                // Chapga surildi
                slideFlashcard("l");
            }
        }

        // Vertikal surish (yuqoriga/pastga)
        if (Math.abs(deltaY) > CUR.a && Math.abs(deltaX) < CUR.b) {
            if (deltaY > 0) {
                // Pastga surildi
                Aylan(); // Sizning funksiyangiz
            } else {
                // Yuqoriga surildi
                Aylan(); // Sizning funksiyangiz
            }
        }
    });


}

function Aylan() {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped'); // "flipped" klassini qo'shadi yoki olib tashlaydi
}



let currentCardIndex = 0;

function updateFlashcard() {
    const flashcard = document.getElementById('flashcard');
    const front = flashcard.querySelector('.front h2');
    const back = flashcard.querySelector('.back h2');

    
    front.textContent = CardWords.korean;
    back.textContent = CardWords.uzbek;
}

function slideFlashcard(dir_) {

    RandomQ = Math.floor(Math.random()*arr_for_test.length);
    OurText = arr_for_test[RandomQ].korean;
    CardWords.korean = arr_for_test[RandomQ].korean;
    CardWords.uzbek = arr_for_test[RandomQ].uzbek;



    const flashcard = document.getElementById('flashcard');
    const incomingCard = document.createElement('div');
    if (dir_ === "r") {
        incomingCard.className = 'flashcard incoming-r';
    } else {
        incomingCard.className = 'flashcard incoming-l';
    }
    incomingCard.innerHTML = `
        <div class="card front">
            <h2>${CardWords.korean}</h2>
        </div>
        <div class="card back">
            <h2>${CardWords.uzbek}</h2>
        </div>
    `;
    document.querySelector('.flashcard-container').appendChild(incomingCard);

    // Asosiy kartani kichraytirib va o'chirish
    if (dir_ === "r") {
        flashcard.classList.add('slide-out-r');
    } else {
        flashcard.classList.add('slide-out-l');
    }

    setTimeout(() => {
        flashcard.style.visibility = 'hidden'; // Asosiy kartani yashirish

        updateFlashcard();
        
        // O'ng tomondan kelayotgan kartani ko'rsatish
        incomingCard.classList.add('show');
        if (dir_ === "r") {
            flashcard.classList.remove('slide-out-r');
        } else {
            flashcard.classList.remove('slide-out-l');
        }

        setTimeout(() => {
            incomingCard.remove(); // Kirayotgan kartani olib tashlash
        }, 600); // 600ms (animatsiya davomiyligi) dan keyin
    }, 600); // 600ms (animatsiya davomiyligi) da

    // O'zgarishdan keyin kartani ko'rsatish
    setTimeout(() => {
        flashcard.style.visibility = 'visible'; // Asosiy kartani qayta ko'rsatish
    }, 1200); // Animatsiya tugagandan keyin
}
