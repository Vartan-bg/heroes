const input = document.getElementsByTagName('input')[0];
const mainDoc = document.querySelector('.main-doc');
const form = document.getElementsByTagName('form')[0];
const popup = document.querySelector('.popup');
const body = document.getElementsByTagName('body')[0];

//получение информации из файла json
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

const postError = (e) => {
    console.log(e);
};

//Создание карточек героев при событии на инпуте
input.addEventListener('change', () => {
    getData()
    .then((data) => {
        mainDoc.innerHTML = "";
        data.forEach((item) => {
            if (item.movies && item.movies.some(elem => elem.trim() === input.value.trim())) {
                let newHero = document.createElement('button');
                newHero.setAttribute('class', 'hero-card');
                newHero.innerHTML = `<img class="hero-pic" src=${item.photo} alt="${item.name}">
                                    <div class='hero-info'>
                                    ${item.name}
                                    </div>`;
                return mainDoc.insertAdjacentElement('beforeend', newHero);
            }
        });
    })
    .catch(postError);
});

//Создание popup окни с информацией о герое
body.addEventListener('click', (event) => {
    let target = event.target;
    //событие срабатывает при нажатии на карточку героя
    if (target.closest('.hero-card')) {
        popup.style.display = 'flex';
        getData()
        .then((data) => {
            //создание пустого popup
            popup.innerHTML = '';
            data.forEach((item) => {
                //если у таргета есть изображение с героем, заполняем popup информацией
                if (target.closest('.hero-card').childNodes[0].getAttribute('src') === item.photo) {
                    let popupDiv = document.createElement('div');
                    popupDiv.classList.add('popup-div');
                    popupDiv.innerHTML = `<image class = "popup-img" src="${item.photo}"></image>
                                        <div class="popup-info">
                                        <p>Name: ${item.name}</p>
                                        <p>RealName: ${item.realName}</p>
                                        <p>Species: ${item.species}</p>
                                        <p>Citizenship: ${item.citizenship}</p>
                                        <p>Gender: ${item.gender}</p>
                                        <p>BirthDay: ${item.birthDay}</p>
                                        <p>DeathDay: ${item.deathDay}</p>
                                        <p>Status: ${item.status}</p>
                                        <p>Actors: ${item.actors}</p>
                                        </div>`.replace(/undefined/g, 'unknown');
                    popup.insertAdjacentElement('beforeend', popupDiv);
                }
            });
        })
        .catch(postError);
        //закрытие popup окна при нажатии в любой области экрана
    } else {
        popup.style.display = 'none';
    }
});

//создание тега datalist и тегов option с value, равным названиям фильмов 
window.addEventListener('DOMContentLoaded', () => {
    getData()
    .then((data) => {
        //создание тега datalist и тегов option? добавление атрибута list для инпута
        const dataList = document.createElement('datalist');
        dataList.setAttribute('id', 'movies');
        input.setAttribute('list', 'movies');
        form.insertAdjacentElement('beforeend', dataList);
            data.forEach((item) => {
            //если у героя есть список фильмов
                if (item.movies) {
                    //название каждого фильма положить в value нового option
                    item.movies.forEach((elem) => {
                        let option = document.createElement('option');
                        option.setAttribute('value', elem.trim());
                        dataList.insertAdjacentElement('beforeend', option);
                    });
                }
            });
        //удаление всех повторяющихся тегов option
        let arr = [...document.getElementsByTagName('option')];
        for (let a = arr.length - 1; a >= 0; a--) {
            if (arr[a].value) {
                for (let i = a - 1; i >= 0; i--) {
                    if ((arr[i].value !== undefined) && (arr[a].value === arr[i].value)) {
                        arr[i].remove();
                    }
                }
            }
        }
    })
    .catch(postError);
});