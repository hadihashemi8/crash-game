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




let userConis = 5000
countText.innerHTML = userConis

// ratio starter num
let ratioNum
// random target number 
let randomNum;
// interval ratio
let startRatio;


// user options to type fast 
options.forEach(item => {
    item.addEventListener('click', () => {
        userInput.value = ''
        userInput.value = item.textContent

    })
})


// game algoritms
let algoritms = [
    { condition: 'randomNum < 1.02 || randomNum > 1.10', count: 5 },
    { condition: 'randomNum < 1.10 || randomNum > 2', count: 4 },
    { condition: 'randomNum < 2 || randomNum > 4', count: 3 },
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



    // error msg 
    if (userBet > userConis) {
        errorText.innerHTML = 'your stock not enough'
        setTimeout(() => {
            errorText.innerHTML = ""
        }, 2000);

    } else if (userBet == '' || userBet < 10) {
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
        userRatio.innerHTML = ''

        // minues user bet from user stock
        userConis -= userBet
        countText.innerHTML = userConis.toFixed(2)

        // at least ratio is 1
        ratioNum = 1
        randomNum = genratorrandomNum()




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
                if (ratioNum.toFixed(2) == randomNum) {
                    clearInterval(startRatio)
                    ratioElem.style.color = 'red'
                    startBtn.removeAttribute('disabled', 'true')
                    userInput.removeAttribute('readonly', null)
                    stopBtn.setAttribute('disabled', 'true')
                    minValueBtn.removeAttribute('disabled', 'true')
                    maxValueBtn.removeAttribute('disabled', 'true')


                }

            }, 40);

        }


    }




})


stopBtn.addEventListener('click', () => {
    if (ratioNum == randomNum) {
        startBtn.removeAttribute('disabled', 'true')
    }
    stopBtn.setAttribute('disabled', 'true')
    userInput.removeAttribute('readonly', null)
    minValueBtn.removeAttribute('disabled', 'true')
    maxValueBtn.removeAttribute('disabled', 'true')
    userRatio.innerHTML = ratioNum.toFixed(2)
    let userPrize = Number(userInput.value)
    userConis += Number(userPrize * ratioNum)
    countText.innerHTML = userConis.toFixed(2)

})




// min and max btn 

minValueBtn.addEventListener('click', () => {
    userInput.value = 10
})

maxValueBtn.addEventListener('click', () => {
    userInput.value = userConis
})