const $ = document
const startBtn = $.querySelector('.start-game')
const stopBtn = $.querySelector('.stop-game')
const minValueBtn = $.querySelector('.min-value-btn')
const maxValueBtn = $.querySelector('.max-value-btn')
let ratioElem = $.querySelector('.ratio')
let countText = $.querySelector('.count-text')
let userInput = $.querySelector('.user-input')
let errorText = $.querySelector('.erroe-text')
const options = $.querySelectorAll('.opt-item')
let userRatio = $.querySelector('.user-ratio')
const activeAutoCashOut = $.querySelector('.active-autoCashOut')
const autoCashOutInput = $.querySelector('.autoCashOut-input')
const coinSound = $.querySelector('#coin-sound')
const loseSound = $.querySelector('#lose-sound')
const gameOverSound = $.querySelector('#gameOver-sound')
const errorSound = $.querySelector('#error-sound')


let userConis; 


// check localstorage coins

window.addEventListener('load', () => {
    const coins = localStorage.getItem("coins")
    
    
    
    if (coins) {
        userConis = coins
    } else {
        userConis = 5000
        
    }
    
    countText.innerHTML = userConis
})



// ratio starter num
let ratioNum
// random target number 
let randomNum;
// interval ratio
let startRatio;
// user Ratio
let autoRatio;


// user options to type fast 
options.forEach(item => {
    item.addEventListener('click', () => {
        userInput.value = ''
        userInput.value = item.textContent

    })
})


// game algoritms
let algoritms = [
    { condition: 'randomNum < 1.02 || randomNum > 1.10', count: 6 },
    { condition: 'randomNum < 1.10 || randomNum > 2', count: 6 },
    { condition: 'randomNum < 2 || randomNum > 4', count: 5 },
    { condition: 'randomNum < 4 || randomNum > 10', count: 2 },
    { condition: 'randomNum < 10 || randomNum > 50', count: 1 },
]

let copyAlgoritm = JSON.parse(JSON.stringify(algoritms))



// function to create random numbers matching with algoritms
function genratorrandomNum() {
    // genrate a random number to take a random algoritm
    let getAlgoritm = Math.floor(Math.random() * copyAlgoritm.length)



    // condition for check Authorized use from algoritms
    if (copyAlgoritm[getAlgoritm].count == 0) {
        // if a algoritm use count equal to 0   filtred and remove from algoritms
        copyAlgoritm = copyAlgoritm.filter(algoritm => algoritm.count != 0)

        // this is for genrate other random number if we not access to prev algoritm to use
        getAlgoritm = Math.floor(Math.random() * copyAlgoritm.length)


        // if copy algoritms array is empty here resart and algoritms start from first
        if (!copyAlgoritm.length) {
            copyAlgoritm = JSON.parse(JSON.stringify(algoritms))
        } else {
            // if is not empty target algoritm become minus 1
            copyAlgoritm[getAlgoritm].count--
        }


    } else {
        copyAlgoritm[getAlgoritm].count--

    }




    // this loop continue to when genrate number that matching with algoritm 
    do {
        randomNum = (Math.random() * 100).toFixed(2)


    } while (
        eval(copyAlgoritm[getAlgoritm].condition)
    )



    return (randomNum)
}


// game start btn
startBtn.addEventListener('click', () => {

    let userBet = Number(userInput.value)
    autoRatio = autoCashOutInput.value



    console.log(userBet, Number(userConis).toFixed(2));

    // error msg 
    if (userBet > Number(userConis).toFixed(2)) {
        errorSound.play()
        errorText.innerHTML = 'your stock not enough'
        setTimeout(() => {
            errorText.innerHTML = ""
        }, 2000);

    } else if (userBet == '' || userBet < 10) {
        errorSound.play()
        errorText.innerHTML = 'At least value 10 coin'
        setTimeout(() => {
            errorText.innerHTML = ""
        }, 2000);
    }
    else {
        // if evrything ok game start
        ratioElem.style.color = 'white'
        userInput.setAttribute('readonly', null)
        startBtn.setAttribute('disabled', 'true')
        stopBtn.removeAttribute('disabled', 'true')
        minValueBtn.setAttribute('disabled', 'true')
        maxValueBtn.setAttribute('disabled', 'true')
        autoCashOutInput.setAttribute('readonly', null)
        autoCashOutInput.style.opacity = 0.2
        userRatio.innerHTML = ''

        // minues user bet from user stock
        userConis = userConis - userBet
        userConis < 0 ? countText.innerHTML = '0.00' : countText.innerHTML = userConis.toFixed(2)

        localStorage.setItem("coins", userConis.toFixed(2))


        // at least ratio is 1
        ratioNum = 1
        randomNum = genratorrandomNum()
        console.log(randomNum);



        // because  at least ratio is 1 we check here  if random number is smaller than 1 then set random number to 1
        if (randomNum < 1) {
            randomNum = 1
        }
        // if random number equal to 1 we stop ratio starter and give some style  
        if (randomNum == 1) {
            ratioNum = 1
            ratioElem.innerHTML = ratioNum.toFixed(2)
            clearInterval(startRatio)
            ratioElem.style.color = 'red'
            startBtn.removeAttribute('disabled', 'true')
            userInput.removeAttribute('readonly', null)
            stopBtn.setAttribute('disabled', 'true')


        } else {

            // if random number not equal to 1 we start ratio starter
            startRatio = setInterval(() => {
                ratioNum += 0.01
                ratioElem.innerHTML = ratioNum.toFixed(2)

                // and here if random number equal to ratio game over and update some style
                if (ratioNum.toFixed(2) == Number(autoRatio).toFixed(2)) {
                    userRatio.innerHTML = Number(autoRatio).toFixed(2)
                    userConis += userBet * ratioNum
                    countText.innerHTML = userConis.toFixed(2)
                    stopBtn.setAttribute('disabled', 'true')
                    coinSound.play()
                    localStorage.setItem("coins", userConis.toFixed(2))

                }
                else if (ratioNum.toFixed(2) == randomNum) {
                    clearInterval(startRatio)
                    ratioElem.style.color = 'red'
                    startBtn.removeAttribute('disabled', 'true')
                    userInput.removeAttribute('readonly', null)
                    stopBtn.setAttribute('disabled', 'true')
                    minValueBtn.removeAttribute('disabled', 'true')
                    maxValueBtn.removeAttribute('disabled', 'true')
                    autoCashOutInput.removeAttribute('readonly', null)
                    autoCashOutInput.style.opacity = 1

                    if (userConis == 0) {
                        gameOverSound.play()
                    } else {
                        loseSound.play()

                    }
                }

            }, 40);

        }


    }




})


stopBtn.addEventListener('click', () => {
    if (ratioNum == randomNum) {
        startBtn.removeAttribute('disabled', 'true')
    }
    coinSound.play()
    stopBtn.setAttribute('disabled', 'true')
    userRatio.innerHTML = ratioNum.toFixed(2)
    let userBet = Number(userInput.value)
    userConis += userBet * ratioNum
    countText.innerHTML = userConis.toFixed(2)
    localStorage.setItem("coins", userConis.toFixed(2))
    autoCashOutInput.removeAttribute('readonly', null)
    autoCashOutInput.style.opacity = 1
})




// min and max btn 

minValueBtn.addEventListener('click', () => {
    userInput.value = 10
})

maxValueBtn.addEventListener('click', () => {
    userInput.value = Number(userConis).toFixed(2)
})



// auto cashout section




activeAutoCashOut.addEventListener('click', () => {
    autoCashOutInput.removeAttribute('disabled')
})



let x = new Date().toLocaleTimeString()

console.log(x);

let countDownDate = new Date(`August ${5}, 2023 18:52:00`).getTime();



// Update the count down every 1 second
let timer = setInterval(function() {

  // Get today's date and time
  let now = new Date().getTime();
  
  // Find the distance between now and the count down date
  let distance = countDownDate - now;
  
  
  
  // Time calculations for days, hours, minutes and seconds
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);


  if (distance < 0) {
    clearInterval(x);
 console.log('ok');
  }

} , 1000)