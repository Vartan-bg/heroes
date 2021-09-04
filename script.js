const input = document.getElementsByTagName('input')[0];
const mainDoc = document.querySelector('.main-doc');
const form = document.getElementsByTagName('form')[0];
const popup = document.querySelector('.popup');
const body = document.getElementsByTagName('body')[0];

const getData = () => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', './dbHeroes.json');
        request.setRequestHeader('Content-type', 'application/json');
        request.addEventListener('readystatechange', () => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.readyState === 4 && request.status === 200) {
                const data = JSON.parse(request.responseText);
                resolve(data);
            } else {
                reject();
            }
        });
        request.send();
           
    });
};

const postHero = (data) => {
    mainDoc.innerHTML = "";
    data.forEach((item) => {
        if (item.movies && item.movies.some(elem => elem.trim()===input.value.trim())) {
            let newHero = document.createElement('button');
            newHero.setAttribute('class', 'hero-card');
            newHero.innerHTML = `<img class="hero-pic" src=${item.photo} alt="${item.name}">
                                <div class='hero-info'>
                                Имя: ${item.name}
                                </div>`;
            return mainDoc.insertAdjacentElement('beforeend', newHero);
        }
    });
};
    
const postError = (e) => {
    console.log(e);
};

input.addEventListener('blur', () => {
    getData().then(postHero).catch(postError);
});

const createDataList = (data) => {
    if (input.nextElementSibling && input.nextElementSibling.getAttribute('id') === 'movies') {
        return;
    } else {
        const dataList = document.createElement('datalist');
        dataList.setAttribute('id', 'movies');
        input.setAttribute('list', 'movies');
        form.insertAdjacentElement('beforeend', dataList);
        data.forEach((item) => {
            if (item.movies) {
                item.movies.forEach((elem) => {
                    let option = document.createElement('option');
                    option.setAttribute('value', elem.trim());
                    dataList.insertAdjacentElement('beforeend', option);
                });
                
            }
        });
        let arr = [...document.getElementsByTagName('option')];
        for (let a = arr.length-1; a >= 0; a--) {
            if (arr[a].value) {
                for (let i = a-1; i >=0; i--) {
                    if ((arr[i].value!==undefined) && (arr[a].value === arr[i].value)) {
                        arr[i].removeAttribute('value');
                    }
                }
            }
        }
    }
};
body.addEventListener('click', (event) => {
    let target = event.target;
    console.log(target);
    if (target.closest('.hero-card')) {
        popup.style.display = 'block';
        const createPopup = (data) => {
            popup.innerHTML = '';
            data.forEach((item) => {
                if (target.closest('.hero-card').childNodes[0].getAttribute('src') === item.photo) {
                    let popupDiv = document.createElement('div');
                    popupDiv.classList.add('popup-div');
                    popupDiv.innerHTML = `<image class = "popup-img" src="${item.photo}"></image>
                                        <div class="popup-info">
                                        Name: ${item.name}<br>
                                        RealName: ${item.realName}<br>
                                        Species: ${item.species}<br>
                                        Citizenship: ${item.citizenship}<br>
                                        Gender: ${item.gender}<br>
                                        BirthDay: ${item.birthDay}<br>
                                        DeathDay: ${item.deathDay}<br>
                                        Status: ${item.status}<br>
                                        Actors: ${item.actors}
                                        </div>`.replace(/undefined/, 'unknown');
                    popup.insertAdjacentElement('beforeend', popupDiv);
                }
            });
        };
        getData().then(createPopup).catch(postError);
    } else {
        popup.style.display = 'none';
    }

});

window.addEventListener('DOMContentLoaded', () => {
    getData().then(createDataList).catch(postError);
});