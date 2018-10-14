
const convertToClock = seconds =>{

  const minutes = Math.floor(seconds/60)
  const hours = Math.floor(minutes/60)
  const days = Math.floor(hours/24)

  return stringify = days + 'days' + hours%24 + 'hours' + minutes%60 + 'minutes' + seconds%60 + 'seconds'  
}

const renderClock= (futureDate, total, latestCommit, mean) => {

  //Aside from displaying our countdown, this function is responsible for initializing our click handler
  //It relies on closure to keep track of relevant averages and latest commits

    const countdown = document.getElementById("countdown")
    setInterval(()=>{
      countdown.innerHTML = convertToClock(futureDate-Math.floor(Date.now()/1000))
    }, 1000)
  

  const commitButton = document.getElementById("addCommit") 

  commitButton.addEventListener('click', event=>{

    const countdown = document.getElementById("countdown")
    countdown.innerHTML = 'Calculating new estimate for 2000th commit...'

    
    const nextCommit = Math.floor(Date.now()/1000) 
    const timeSinceLast = nextCommit - latestCommit

    latestCommit = nextCommit
    total++ //dataset increases
    mean += (timeSinceLast/(total-1)) //convert to a weighted value to add the mean

    const twoThousand = latestCommit + (mean * (2000-total))
    futureDate = Math.floor(twoThousand) //set reference for interval timer

  })
}

fetch(`https://api.staging.coord.co/codechallenge/commits`)
.then(data=>data.json())
.then(commitTimes=>{

  const timesBetweenCommits = commitTimes[0] - commitTimes[commitTimes.length-1]

  const mean = timesBetweenCommits/commitTimes.length-1
  
  const twoThousand = commitTimes[0] + (mean * (2000-commitTimes.length))

  console.log(commitTimes.length)
  console.log('Mean ', convertToClock(mean), ' last commit ', convertToClock(Date.now()/1000-commitTimes[0]))

  renderClock(Math.floor(twoThousand), commitTimes.length, commitTimes[0], mean)
})
