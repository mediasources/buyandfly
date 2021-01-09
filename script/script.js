// GET ELEMENTS GET ELEMENTS GET ELEMENTS GET ELEMENTS GET ELEMENTS//

const formSearch = document.querySelector('.form-search');
const inputCitiesFrom = formSearch.querySelector('.input__cities-from');
const dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from');
const inputCitiesTo = formSearch.querySelector('.input__cities-to');
const dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to');
const inputDateDepart = formSearch.querySelector('.input__date-depart');
const cheapestTicket = document.getElementById('cheapest-ticket');
const otherCheapTickets = document.getElementById('other-cheap-tickets');

// ARRAY ARRAY ARRAY ARRAY ARRAY ARRAY ARRAY ARRAY ARRAY ARRAY ARRAY//

const citiesAPI = 'database/cities.json';
const proxy = 'https://cors-anywhere.herokuapp.com/';
const API_KEY = 'c76894f35a99622a7c383122ab5ed5b2';
const calendar = 'https://min-prices.aviasales.ru/calendar_preload';
const MAX_COUNT = 10;

let city = [];


// FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS//

const getData = (url, callback) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
     if (request.readyState !== 4) return;

     if (request.status === 200) {
       callback(request.response);
     } else {
       console.error(request.status);
     }
    });

    request.send();

};



const showCity = (input, list) => {
  list.textContent = '';

  if (input.value !== '') {
    const filterCity = city.filter((item) => {
      if (item.name) {
      const fixItem = item.name.toLowerCase();
      return fixItem.startsWith(input.value.toLowerCase());
      }
    });

    filterCity.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('dropdown__city');
      li.textContent = item.name;
      list.append(li);
    

    });
  }
};

const selectCity = (event, input, list) => {
    const target = event.target;
    if (target.tagName === 'LI') {
      input.value = target.textContent;
      list.textContent = '';
    }
};

const getNameCity = (code) => {
    const objCity = city.find(item => item.code === code);
    return objCity.name;
};

const getDate = (date) => {
    return new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',

    });
};

const getChanges = (num) => {
    if (num) {
      return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками'; 
    } else {
      return 'Без пересадок';
    }
};

const getLinkAviasales = (data) => {
    let link = 'https://www.aviasales.ru/search';
    link += data.origin;

  const date = new Date(data.depart_date);

  const day = date.getDay();
  link += day > 10 ? '0' + day : day;
  const month = date.getMonth() +1;
  link += month > 10 ? '0' + month : month;
  link += data.destination;
  link += '1';


    return link;
};

const createCard = (data) => { 
  
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');
    console.log(data);

    let deep = '';

    if (data) {
      deep = `
      <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
          <div class="left-side">
            <a href="${getLinkAviasales(data)}" class="button button__buy">Купить
              за ${data.value}₽</a>
          </div>
          <div class="right-side">
            <div class="block-left">
              <div class="city__from">Вылет из города
                <span class="city__name">${getNameCity(data.origin)}</span>
              </div>
              <div class="date">${getDate(data.depart_date)}</div>
            </div>

            <div class="block-right">
              <div class="changes">${getChanges(data.number_of_changes)}</div>
              <div class="city__to">Город назначения:
                <span class="city__name">${getNameCity(data.destination)}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      deep = '<h3>На текущую дату билетов нет.</h3>'
    }

    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
};  

const renderCheapDay = (cheapTicket) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.innerHTML = '<h2>Какие самолёты были ???</h2>';

  const ticket = createCard(cheapTicket[0]);
  cheapestTicket.append(ticket);

};

const renderCheapYear = (cheapTickets) => {
    otherCheapTickets.style.display = 'block';
    otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';

  cheapTickets.sort((a, b) => {



  if (a.value > b.value) {
    return 1;
  }
  if (a.value < b.value) {
    return -1;
  }
  // a должно быть равным b
  return 0;


});
    for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
      const ticket = createCard(cheapTickets[i]);
      otherCheapTickets.append(ticket);
  }


  console.log(cheapTickets);
};

const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;
    
    const cheapTicketDay = cheapTicketYear.filter((item) => {
      
      return item.depart_date === date;
    });
    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear);
};



// LISTENERS LISTENERS LISTENERS LISTENERS LISTENERS // 


inputCitiesFrom.addEventListener('input', () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
  showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', (event) => { 
  selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});


dropdownCitiesTo.addEventListener('click', (event) => { 
  selectCity(event, inputCitiesTo, dropdownCitiesTo); 
});

formSearch.addEventListener('submit', (event) => {
  event.preventDefault();


  const cityFrom = city.find((item) => inputCitiesFrom.value === item.name);
  const cityTo = city.find((item) => inputCitiesTo.value === item.name);

  const formData = {
    from: cityFrom,
    to: cityTo,
    when: inputDateDepart.value,
  };

  if (formData.from && formData.to) {

  const requestData = '?depart_date=' + formData.when +
  '&origin=' + formData.from.code +
  '&destination=' + formData.to.code +
  '&one_way=true&token=' + API_KEY;


  getData(calendar + requestData, (data) => {
    renderCheap(data, formData.when);

    });
  } else {
    alert('Введите корректное название города');
  }
});

// CAL THE FNCTIONS CAL THE FUNCTIONS CAL THE FUNCTIONS CAL THE FUNCTIONS//

getData(citiesAPI, (data) => {

  city = JSON.parse(data).filter((item) => item.name);

  city.sort((a, b) => {
  if (a.name > b.name) {
    return 1;
  }
  if (a.name < b.name) {
    return -1;
  }
  // a должно быть равным b
  return 0;
});
});

