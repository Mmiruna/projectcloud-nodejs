# Proiect Cloud Computing


## Descriere proiect

Ideea de bază a proiectului constă într-o dublă traducere a unui text din orice limbă dorită într-o limbă aproape universală planetei noastre, mai exact în limba engleză, iar mai apoi într-o limbă misterioasă ....tobele🥁🥁🥁.... care este chiar limba micului, dar marelui maestru Yoda din Star Wars! (un articol interesant descrie ideea cum că limbajul originar al oamenilor de acum circa 50.000 de ani suna precum discursul lui Yoda din Războiul Stelelor: https://stiintasitehnica.com/limbajul-originar-al-oamenilor-suna-precum-discursul-lui-yoda-din-razboiul-stelelor/). 
Așa că, să vorbești vrei Yoda precum???
![Wise words from Yoda](https://cdn.shopify.com/s/files/1/0017/0432/9285/products/git-force-tee-closeup_grande.jpg?v=1544870407)

## Prezentare API-uri utilizate 

API-uri le pe care le-am folosit sunt următoarele:
1. https://tech.yandex.com/translate/ ('https://translate.yandex.net') - folosit pentru traducerea din orice limbă selectată în limba engleză
2. https://funtranslations.com/api/yoda ("http://api.funtranslations.com") - folosit pentru traducetea în dialectul lui jedi Yoda 

## Descriere arhitectură

* Aplicația conține dpdv al funcționalităților 3 secțiuni, fiecare prezentând câte un select de limbă și un text area pentru introducerea cuvintelor dorite
* Selectul pentru limba din care se dorește a se face traducerea vine by default în română, putând fi aleasă ulterior orice altă limbă
* Limbajul în care se realizează prima traducere se poate face doar în limba engleză
* Întrucât al doilea API integrat permite doar traducerea în Yoda language, aceasta va fi, de asmenea, singură opțiune din cel de-al treilea container

* Pentru o interfață mai friendly (elementele ready-built de select și character count) sunt consumate din librăria de UI a celor de la https://codyhouse.co/ds/components/forms/form-elements?page=3&show=all - în script.js se regăsește codul sursă al framework-ului, în ui.js sunt conținute elementele folosite peste acesta și fișierul de css.style regăsit tot în cadrul framework-ului oferit
* În ui.js pentru cele 2 elemente sunt folosite uiCustomSelect ce construiește elementul de select și uiCustomTextArea pentru elementul de character count
* În controller.js este conținută o funcție ce se autoapelează într-un context anonim
* În cadrul acestui context se mai creează un alt context în variabila apiHelper 
* Adresele API-urilor se regăsesc în yandexTranslateOrigin + yandexBaseAPI pentru primul API și funnyTranslateOrigin pentru cel de-al doilea API care prezintă și cheia funnyKey

* callApi este metoda generică care apelează asincron primind tipul, obiectul de request și callback-ul de succes 
```
 async function callApi(type, req, success) {
            var url = req.params ? req.url + encodeURI(req.params) : req.url;
            const response = await fetch(withCors(url), {
                method: type,
                headers: req.headers
            });
            const responseData = await response.json();
            success(responseData);
        }
```
* Metodele apelate cu API-urile integrate sunt: 
1. getSupportedLang pentru primul API de la yandex care apelează cu callApi type-ul GET, request-ul din URL-ul compus și params KEY, FROM și care uletiror populează selectul în momentul încărcării paginii
```
function getSupportedLang(callback){
            var req = {
                url: yandexBaseAPI + "/getLangs",
                params: {
                    key: KEY,
                    ui: FROM
                },
                headers: {
                    Origin: yandexTranslateOrigin
                }
            }
    
            callApi("GET", req, response => {
                callback(response)
            })
        }
```        
2. translateToEnglish pentru primul API de la yandex ce presupune un nou parametru în care se configurează traducerea din valoarea selectului din prima limbă și textul introdus în limba dorită (la click-ul butonului se face apel către yandex cu codul limbii și traducerea dorită, ulterior apelându-se și o a treia metodă)
```
function translateToEnglish(callback){
            var from = lSelect.value
            var sourceText = lTextarea.value;

            var req = {
                url: yandexBaseAPI + "/translate",
                params: {
                    key: KEY,
                    lang: from + "-" + TO,
                    text: sourceText
                },
                headers: {
                    Origin: yandexTranslateOrigin
                }
            }
    
            callApi("GET", req, response => {
                const text = response.text[0];
                callback(text)
            })
        }
```        
3. funnyTranslate pentru cel de-al doilea API de la funny translate care odată cu primirea răspunsului cu textul din engleză se apelează callback-ul cu răspuns
```
function funnyTranslate(type, text, callback){
            var req = {
                url: funnyBaseApi + "/yoda.json",
                headers: {
                    'X-Funtranslations-Api-Secret': funnyKey,
                    Origin: funnyTranslateOrigin
                },
                params: {
                    text: text,
                }
            }
    
            callApi("GET", req, response => {
                callback(response)
            })
        }
```
* Funcția care se autoapelează de apiHelper, odată apelată returnează funcțiile apelate (cele 3 metode) 
```
return {
            getSupportedLang,
            translateToEnglish,
            funnyTranslate
        }
```
