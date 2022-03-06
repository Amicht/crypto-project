"use strict";
const search_box = document.getElementById(`search-box`);
const contentDiv = document.getElementById(`content`);
const limit_modal = document.getElementById(`limit-modal`);
const modal_content = document.getElementById(`modal-content`);
const load_more_btn = document.getElementById(`more-cards-btn`);
const coinAPI = `https://api.coingecko.com/api/v3/coins/`;
const linkAPI = `https://api.coingecko.com/api/v3/coins/list`;
const myCoins = [];
const coinCACHE = {};
var CACHECoinList;
var cardLoadCounter;
var chartInterval;
const myModal = new bootstrap.Modal(limit_modal);

async function getCoins(link){
    const coinsArr = await fetch(link)
        .then(res => res.json());
    return coinsArr;
}
async function getMyCoins(link){
  const myCoinsData = []
    myCoins.forEach(async coin => {
          const newCoin = await getCoins(link+coin);
          myCoinsData.push(newCoin);
    })
    return myCoinsData
}
function createSpinner(){
  return `<div class="spinner-border text-primary mx-auto"
   role="status"><span class="visually-hidden">Loading...</span></div>`;
}

async function search(){
  clearInterval(chartInterval);
  let coin = search_box.value.toLowerCase();
    if(coin == ``){
      return;
    }
    load_more_btn.style.display = `none`;
    contentDiv.innerHTML = createSpinner();
    let coinIndex = CACHECoinList.findIndex(e => coin == e.symbol);
    if(coinIndex == -1){
      return contentDiv.innerHTML = `<div style="text-align:center;">
      ERROR: no results for '${coin}'<div>`;
    }
    coin = CACHECoinList[coinIndex];
    const coinLink = coinAPI + coin.id;
    const myCoin = await getCoins(coinLink);
    contentDiv.innerHTML = setCard([myCoin]);
    if(myCoins.includes(coin.id)){
      toggleButton(coin.id).checked = true;
    }
}

async function mainPage(){
  clearInterval(chartInterval);
  contentDiv.innerHTML = createSpinner();
  cardLoadCounter = 0;
  CACHECoinList = await getCoins(linkAPI);
  const coinArr = CACHECoinList.slice(cardLoadCounter,cardLoadCounter+=51);
  
  contentDiv.innerHTML = setCard(coinArr);
  myCoins.forEach(e => {
    const button = toggleButton(e);
    if(button){
      button.checked = true;
      button.dataset.status = `true`;
    }
  })
  load_more_btn.style.display = `block`
}

function setCard(arr){
  let coinCards = ``;
  arr.forEach((e,i) => {
    const btnId = "coin"+ (cardLoadCounter+i);
    coinCards += `<div class="col-sm-4 px-0">
    <div class="card ">
      <div class="card-body">
        <div class="row">
          <h5 class="col-auto me-auto">${e.symbol.toUpperCase()}</h5>
          <div class="form-check form-switch col-auto">
            <input class="form-check-input" type="checkbox" role="switch" 
            data-coin-id="${e.id}" onclick="addCoinByToggle(event)">
          </div>
        </div>
        <p class="card-text">${e.name}</p>
        <p>
          <button class="btn btn-primary" onclick="getCorrentPrice(event)" 
            type="button" data-bs-toggle="collapse" data-coin="${e.id}" data-bs-target="#${btnId}" 
            aria-expanded="false" aria-controls="collapseExample"> More Info
          </button>
        </p>
        <div class="collapse" id="${btnId}">
          <div class="card card-body bg-light"></div>
        </div>

      </div>
    </div>
  </div>`
  });
  return coinCards;
}
function LoadMoreBtn(event){
  const coinArr = CACHECoinList.slice(cardLoadCounter,cardLoadCounter+=51);
  const div = document.createElement("div");
  div.classList.add(`row`,`more-cards`);
  const newCards = setCard(coinArr);
  div.innerHTML = newCards;
  contentDiv.appendChild(div);
}
function addCoinByToggle(event){
  let newCoin = event.target.dataset[`coinId`];
  
  if(toggleButton(newCoin).checked){
    myCoins.push(newCoin);

    if(myCoins.length > 5){
      myModal.toggle();
      toggleButton(newCoin).checked = false;
      return coinLimit();
    }
  }
  
  else{
    const coinIndex = myCoins.indexOf(newCoin);
    myCoins.splice(coinIndex,1);
    event.target.dataset.status = `false`;
  }

  
}

function coinLimit(){
  const coinSymbol = idToSymbols(myCoins);
  let coinToggleHTML = `You have riched your coin-choice limit, <br>
  to continue, please remove a coin: <br><br>` 
  myCoins.forEach((c,i) =>{
    if(myCoins.length-1 >i){
      coinToggleHTML += `<div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" role="switch" checked onclick="updateCoinList(event)">
      <label class="form-check-label" data-toggle="${c}">${coinSymbol[i]}</label>
    </div>`;
    }
  })
  modal_content.innerHTML = coinToggleHTML;
}

function updateCoinList(event){
  const coin = event.target.parentElement.children[1].dataset.toggle;
  const coinIndex = myCoins.indexOf(coin);
  myCoins.splice(coinIndex,1);
  myModal.hide();
  mainPage();
}

async function getCorrentPrice(event){
  const coin = event.target.dataset.coin;
  const infoBox = event.target.parentElement.parentElement.children[3].children[0];
  if(event.target.ariaExpanded == `false`){
    return;
  }
  else{
    infoBox.innerHTML = createSpinner();
    let now = Math.floor(new Date().getTime()/ 1000);
    if((!coinCACHE[coin] || coinCACHE[coin].time+120 < now)){
      await getCoins(coinAPI+coin)
          .then(res => {
            if(res.id){
              coinCACHE[`${res.id}`] = {
                img: res.image.small||`no img`,
                ils:  res.market_data.current_price.ils,
                usd: res.market_data.current_price.usd,
                eur: res.market_data.current_price.eur,
                time: now
              }
              infoBox.innerHTML = `<div class="coin-currency px-auto">
              <img src="${coinCACHE[coin].img}"><br>
              ${coinCACHE[coin].usd}&#36<br>
              ${coinCACHE[coin].eur}&#8364<br>
              ${coinCACHE[coin].ils}&#8362</div>`;
            }
            else{
              infoBox.innerHTML= `ERROR: info not available`;
            }
          });
    }else{
      infoBox.innerHTML = `<div class="coin-currency px-auto">
      <img src="${coinCACHE[coin].img}"><br>
      ${coinCACHE[coin].usd}&#36<br>
      ${coinCACHE[coin].eur}&#8364<br>
      ${coinCACHE[coin].ils}&#8362</div>`;
    }
  }
}

function toggleButton(coinId) {
  return document.querySelector(`[data-coin-id="${coinId}"]`);
}

function cancelModal(){
  myCoins.pop();
}
mainPage();

function idToSymbols(arr){
  let coinSymbols = [];
  arr.forEach(e => {
      const coinID = e;
      let coinIndex = CACHECoinList.findIndex(e => coinID == e.id);
      
      coinSymbols.push(CACHECoinList[coinIndex].symbol.toUpperCase());
  })
  return coinSymbols;
}