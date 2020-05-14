(function(){
    const lSelect = document.getElementById('lSelect');
    const lTextarea = document.getElementById('lTextarea');

    const eTextArea = document.getElementById('eTextarea');

    const yTextarea =  document.getElementById('yTextarea');

    const translateBtn = document.getElementById('translateBtn')

    var apiHelper = (function(){
        const KEY = 'trnsl.1.1.20200513T145830Z.1a227ecfd85acf4d.3aa3e756629a23f5f675082107815457ac60486a';
        const FROM = 'ro';
        const TO = 'en'; // default target language
    
        const yandexTranslateOrigin = 'https://translate.yandex.net';
        const yandexBaseAPI = `${yandexTranslateOrigin}/api/v1.5/tr.json`;

        const funnyTranslateOrigin = "http://api.funtranslations.com/translate";
        const funnyKey = "of_NurCLjLvXoCKEwozV1AeF"
    
        // to prevent cors in the browser
        const withCors = (url) => `https://cors-anywhere.herokuapp.com/${url}`; 
    
        function encodeURI(data){
            return "?" + Object.keys(data).map(
                function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
            ).join('&')
        }
    
        async function callApi(type, req, success) {
            var url = req.params ? req.url + encodeURI(req.params) : req.url;
            const response = await fetch(url, {
                method: type,
                headers: req.headers
            });
            const responseData = await response.json();
            success(responseData);
        }
    
        function getSupportedLang(callback){
            var req = {
                url: yandexBaseAPI + "/getLangs",
                params: {
                    key: KEY,
                    ui: FROM
                },
            }
    
            callApi("GET", req, response => {
                callback(response)
            })
        }

        function translateToEnglish(callback){
            var from = lSelect.value
            var sourceText = lTextarea.value;

            var req = {
                url: yandexBaseAPI + "/translate",
                params: {
                    key: KEY,
                    lang: from + "-" + TO,
                    text: sourceText
                }
            }
    
            callApi("GET", req, response => {
                const text = response.text[0];
                callback(text)
            })
        }

        function funnyTranslate(type, text, callback){
            var req = {
                url: funnyTranslateOrigin + "/yoda.json",
                headers: {
                    'X-Funtranslations-Api-Secret': funnyKey
                },
                params: {
                    text: text,
                }
            }
    
            callApi("GET", req, response => {
                callback(response)
            })
        }
    
        return {
            getSupportedLang,
            translateToEnglish,
            funnyTranslate
        }
    }())

    apiHelper.getSupportedLang(response => {
        const langs = response.langs;        

        for (var key in langs) {
            if (langs.hasOwnProperty(key)) {
                var el = document.createElement("option");
                el.textContent = langs[key];
                el.value = key;
                if(key === "ro"){
                    el.selected = true;
                }
                lSelect.appendChild(el);
            }
        }

        uiCustomSelect.init(lSelect.parentNode);
    })

    translateBtn.addEventListener('click', () => {
        apiHelper.translateToEnglish(response => {
            eTextArea.textContent = response;

            apiHelper.funnyTranslate("yoda", response, fResponse => {
                yTextarea.textContent = fResponse.contents.translated;
            })
        })
    })
}())