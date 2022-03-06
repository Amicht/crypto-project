"use strict";

function aboutPage(event){
    load_more_btn.style.display = `none`;
    clearInterval(chartInterval);
    const details = {
        title: `Follow your crypto-coins, easy and free of charge!`,
        about_me: `Amit Licht, 32, junior Web Developer and musician`,
        p: `Welcome to "Cryptonite", you can find here data about all crypto-coins,
        and get coin value in USD/EURO/ILS currencies. you can also select up to 5 coins 
        and get Live updated data report and movement. so what are you waiting for? 
        go get your coins!`,
        img: `img/IMG_3919.JPG`
    }
    
    contentDiv.innerHTML = `
    <div class="about row">
    <img class="col-4" src="${details.img}">
    <div class="col">
        <h2>${details.title}</h2><br>
        <p class="mb-5">${details.p}</p>
        <span>Creator: ${details.about_me}</span>
    </div>`;
}