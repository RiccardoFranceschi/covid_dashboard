  
     fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json')
     .then(response => response.json())
     .then(dati => {


       let modal = document.querySelector('.modal-custom')
       let modalContent = document.querySelector('.modal-custom-content')

       
       // ordino dati più recenti per primi
       let sorted = dati.reverse()

       // ultima data caricata
       let lastUpdated = sorted[0].data


       // formattazione per mostrare data di ultimo update
       let lastUpdateFormatted = lastUpdated.split("T")[0].split("-").reverse().join("/")
       document.querySelector("#data").innerHTML = lastUpdateFormatted

       let lastUpdatedData = sorted.filter(el => el.data == lastUpdated).sort((a,b) => b.nuovi_positivi - a.nuovi_positivi)


       let totalCases = lastUpdatedData.map(el=>el.totale_casi).reduce((t,n)=>t+n)
       document.querySelector("#totalCases").innerHTML = totalCases
       
       let totalRecovered = lastUpdatedData.map(el => el.dimessi_guariti).reduce((t,n)=>t+n)
       document.querySelector("#totalRecovered").innerHTML = totalRecovered

       let totalDeaths = lastUpdatedData.map(el => el.deceduti).reduce((t,n)=>t+n)
       document.querySelector("#totalDeaths").innerHTML = totalDeaths

       let totalPositives = lastUpdatedData.map(el => el.totale_positivi).reduce((t,n)=>t+n)
       document.querySelector("#totalPositives").innerHTML = totalPositives
       


       let days = Array.from(new Set(sorted.map(el => el.data))).reverse()

       document.querySelectorAll('[data-trend').forEach(el => {
         el.addEventListener('click', ()=>{
          
            let set = el.dataset.trend

            
            let totalsPerDays = days.map(el => [el, sorted.filter( i => i.data == el).map(e => e[set]).reduce((t,n) => t+n)])
            let maxData = Math.max(...totalsPerDays.map(el => el[1]))
            console.log(maxData)

             
            modal.classList.add('active')
            modalContent.innerHTML = 
              `
              <div class="container py-5 my-5">
                <div class="row">
                  <div class="col-12">
                        <p class="h3 text-main">${set.replace(/_/g," ").toUpperCase()}</p>
                    </div>
                    <div class="col-12">
                        <div id="totalTrend" class="d-flex align-items-end plot"></div>
                    </div>
                </div>
              </div>
              `

           let totalTrend = document.querySelector('#totalTrend')

           totalsPerDays.forEach(el => {

              let col = document.createElement('div')
              col.classList.add('d-inline-block', 'pin-new')
              col.style.height = `${70 * el[1] / maxData}%`
              totalTrend.appendChild(col)
            
            })      


         })
       })



       let cardWrapper = document.querySelector("#cardWrapper")
       let progressWrapper = document.querySelector("#progressWrapper")

       let todayMax = Math.max(...lastUpdatedData.map(el=>el.nuovi_positivi))

       lastUpdatedData.forEach(el => {

          let div = document.createElement('div')
          div.classList.add('col-12', 'col-md-4', 'my-4')
          div.innerHTML = 
          `
          <div class="card-custom p-3 pb-0 h-100" data-region="${el.denominazione_regione}">
            <p>${el.denominazione_regione}</p>
            <p class=" h5 mb-0 text-main">${el.nuovi_positivi}</p>
            <hr>
            <p class="mb-0">Scopri di più</p>
          </div>
          `
          cardWrapper.appendChild(div)


       })

      


       document.querySelectorAll('[data-region').forEach(el=>{
         el.addEventListener('click', ()=>{

             let region = el.dataset.region
             modal.classList.add('active')

             let dataAboutRegion = lastUpdatedData.filter(el => el.denominazione_regione == region )[0]

             modalContent.innerHTML = 
             `
             <div class="container">
                <div class="row">
                      <div class="col-12">
                          <p class="h2 text-main">${dataAboutRegion.denominazione_regione}</p>
                      </div>
                      <div class="col-12">
                          <p class="lead">Totale casi: ${dataAboutRegion.totale_casi}</p>
                          <p class="lead">Nuovi positivi: ${dataAboutRegion.nuovi_positivi}</p>
                          <p class="lead">Deceduti: ${dataAboutRegion.deceduti}</p>
                          <p class="lead">Guariti: ${dataAboutRegion.dimessi_guariti}</p>
                          <p class="lead">Ricoverati con sintomi: ${dataAboutRegion.ricoverati_con_sintomi}</p>
                      </div>
                </div>
                <div class="row">
                      <div class="col-12">
                        <p class="mb-0 mt-5 text-main">Trend nuovi casi</p>
                        <div id="trendNew" class="d-flex align-items-end plot"></div>
                      </div>
                      <div class="col-12">
                        <p class="mb-0 mt-5 text-main">Trend decessi</p>
                        <div id="trendDeath" class="d-flex align-items-end plot"></div>
                      </div>
                      <div class="col-12">
                        <p class="mb-0 mt-5 text-main">Trend guariti</p>
                        <div id="trendRecovered" class="d-flex align-items-end plot"></div>
                      </div>
                </div>
             </div>
             `
             
             let trendData = sorted.map(el=>el).reverse().filter(el => el.denominazione_regione == region).map(el => [el.data, el.nuovi_positivi, el.deceduti, el.dimessi_guariti])

             let maxNew = Math.max(...trendData.map(el => el[1]))
             let maxDeath = Math.max(...trendData.map(el => el[2]))
             let maxRecovered = Math.max(...trendData.map(el => el[3]))

             let trendNew = document.querySelector('#trendNew')
             let trendDeath = document.querySelector('#trendDeath')
             let trendRecovered = document.querySelector('#trendRecovered')

             trendData.forEach(el => {

                let colNew = document.createElement('div')
                colNew.classList.add('d-inline-block', 'pin-new')
                colNew.style.height = `${70 * el[1] / maxNew}%`
                trendNew.appendChild(colNew)

                let colDeath = document.createElement('div')
                colDeath.classList.add('d-inline-block', 'pin-death')
                colDeath.style.height = `${70 * el[2] / maxDeath}%`
                trendDeath.appendChild(colDeath)

                let colRecovered = document.createElement('div')
                colRecovered.classList.add('d-inline-block', 'pin-recovered')
                colRecovered.style.height = `${70 * el[3] / maxRecovered}%`
                trendRecovered.appendChild(colRecovered)


             })





         })
       })

       


       let pieTrigger = document.querySelector('#pieTrigger')
       pieTrigger.addEventListener('click', ()=>{
         modal.classList.add('active')

         let temp = []
         for ( let i = 21; i >= 1; i-- ) {
           let color = `rgba(17,67,153, ${ (i / 21).toFixed(2) })`
           temp.push(color)
         }

         let max = lastUpdatedData.map(el => el.nuovi_positivi).reduce((t,n) => t+n)

         let recap = lastUpdatedData.map( (el, i) => [el.denominazione_regione, el.nuovi_positivi, temp[i]]).sort()

         let start = 0
         let cumulative = [ 0,...recap.map(el => start += +(360*el[1]/max).toFixed(3))]

         console.log(cumulative)

         let spreader = cumulative
         .map((el,i) => [cumulative[i], cumulative[i+1]])
         .splice(0,cumulative.length-1)
         .map( (el,i) => [...el,...recap[i]])

         console.log(spreader)


         let final = spreader.map(el => [`${el[4]} ${el[0]}deg ${el[1]}deg`,...el])

         let valueToShow = final.map(el => el[0]).join(",")

         console.log(valueToShow)


         modalContent.innerHTML = 
         `
          <div class="container my-5 py-5">
            <div class="row justify-content-center align-items-center">
              <div class="pieChart"></div>
            </div>
            <div id="legend" class="row mt-5 pt-3">
              </div>
          </div>
              
         `

         document.querySelector(".pieChart").style.background = `conic-gradient(${valueToShow})`

         let legend = document.querySelector('#legend')
         final.forEach(el => {
           let voice = document.createElement('div')
           voice.classList.add('col-6','col-md-3','mb-3')
           voice.innerHTML = `<p class="small mb-0">${el[3]}: ${el[4]}</p>`
           voice.style.borderLeft = `6px solid ${el[5]}`
           legend.appendChild(voice)
         })
       })



       window.addEventListener('click', function(e) {
         if(e.target == modal) {
           modal.classList.remove('active')
         }
       })



         
     })