
(() =>{
    const burgerBtn = document.querySelector('.header__burger-btn'),
    navMenu = document.querySelector('.nav-menu'),
    closeNavBtn = navMenu.querySelector('.nav-menu__close')

    burgerBtn.addEventListener('click', showNavMenu)
    closeNavBtn.addEventListener('click', hideNavMenu)

    function showNavMenu(){
        navMenu.classList.add('open')
        bodyScrollToggle()
    }
    function hideNavMenu(){
        navMenu.classList.remove('open')
        bodyScrollToggle()
    }

    document.addEventListener('click', (event) =>{
        if(event.target.classList.contains('link-item')){
            if(event.target.hash !== ''){
                event.preventDefault()
                const hash = event.target.hash
                smoothScroll(hash,800)
                navMenu.querySelector('.active').classList.add('outer-shadow','hover-in-shadow')
                navMenu.querySelector('.active').classList.remove('active','inner-shadow')
                if(navMenu.classList.contains('open')){
                event.target.classList.add('active','inner-shadow')
                event.target.classList.remove('outer-shadow','hover-in-shadow')
                hideNavMenu()
                }else{
                    let navItems =  navMenu.querySelectorAll('.link-item')
                    navItems.forEach((item) =>{
                        if(hash === item.hash){
                            item.classList.add('active','inner-shadow')
                            item.classList.remove('outer-shadow','hover-in-shadow')
                        }
                    })
                }
                window.location.hash = hash
            }
            
        }
    })

    function smoothScroll(tar,duration){
        const target = document.querySelector(tar)
        const targetPosition = target.getBoundingClientRect().top
        const startPosition = window.pageYOffset
        const distance = targetPosition - startPosition
        let startTime = null

        function animation(currentTime) {  
            if(startTime === null) startTime = currentTime
            const timeElapsed = currentTime - startTime
            const run = ease(timeElapsed, startPosition,distance,duration)
            window.scrollTo(0,run)
            if(timeElapsed < duration) requestAnimationFrame(animation)
        }

        function ease(t, b, c, d) {
            t /= d / 2
            if (t < 1) return c / 2 * t * t + b
            t--
            return -c / 2 * (t * (t - 2) - 1) + b
          }
          requestAnimationFrame(animation)
    }

})();

(() =>{
    const aboutSection = document.querySelector(".about"),
    tabsContainer = document.querySelector(".about__tabs")

    tabsContainer.addEventListener("click", (event) =>{
        if(event.target.classList.contains("about__tabs-item") && !event.target.classList.contains("active")){
            const target = event.target.getAttribute("data-target")
            tabsContainer.querySelector(".active").classList.remove("outer-shadow","active")
            event.target.classList.add("active","outer-shadow")
            aboutSection.querySelector(".tab-content.active").classList.remove("active")
            aboutSection.querySelector(target).classList.add("active")
        }
    })
})();

function bodyScrollToggle(){
    document.body.classList.toggle('stop-scroll')
}

(() =>{

    const filterContainer = document.querySelector(".portfolio__filter"), 
    portfolioItemsContainer = document.querySelector(".portfolio__items"),
    portfolioItems = document.querySelectorAll(".portfolio__item"), popup = document.querySelector(".portfolio-popup"),
    prevBtn = popup.querySelector(".pp__prev"),
    nextBtn = popup.querySelector(".pp__next"),
    closeBtn = popup.querySelector(".pp__close"),
    projectDetailsContainer = popup.querySelector(".pp__details"),
    projectDetailsBtn = popup.querySelector(".pp__project-details-btn")

    let itemIndex, slideIndex, screenshots;

    filterContainer.addEventListener("click", (event) =>{
        if(event.target.classList.contains('portfolio__filter-item') && !event.target.classList.contains('active')){
            filterContainer.querySelector('.active').classList.remove('outer-shadow','active')
            event.target.classList.add('active','outer-shadow')
            const target = event.target.getAttribute('data-target')
            portfolioItems.forEach((item) =>{
                if(target === item.getAttribute('data-category') || target === 'all'){
                    item.classList.remove('hide')
                    item.classList.add('show')
                }else{
                    item.classList.remove('show')
                    item.classList.add('hide')
                }
            })
        }
    })

    portfolioItemsContainer.addEventListener('click', (event) =>{
        if(event.target.closest('.portfolio__item-inner')){
            const portfolioItem = event.target.closest('.portfolio__item-inner').parentElement
             itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem)
             screenshots = portfolioItems[itemIndex].querySelector('.portfolio__item-img img').getAttribute('data-screenshots')
             screenshots = screenshots.split(',')
             if(screenshots.length === 1){
                 prevBtn.style.display = 'none'
                 nextBtn.style.display = 'none'
             }else{
                prevBtn.style.display = 'block'
                nextBtn.style.display = 'block'
             }
             slideIndex = 0;
             popupToggle()
             popupSlideshow()
             popupDetails()
        }
    })
    
    closeBtn.addEventListener('click',() =>{
        popupToggle()
        if(projectDetailsContainer.classList.contains('active')){
            popupDetailsToggle()
        }
    })

    function popupToggle(){
        popup.classList.toggle('open')
        bodyScrollToggle()
    }
    function popupSlideshow() {  
        const imgSrc = screenshots[slideIndex]
        const popupImg = popup.querySelector('.pp__img')
        popup.querySelector('.pp__loader').classList.add('active')
        popupImg.src = imgSrc
        popupImg.onload = () =>{
        popup.querySelector('.pp__loader').classList.remove('active')
        }
        popup.querySelector('.pp__counter').innerHTML = (slideIndex+1) + ' of ' + screenshots.length;
    }

    nextBtn.addEventListener('click', () =>{
        if(slideIndex === screenshots.length-1){
            slideIndex = 0
        }else{
            slideIndex++
        }
        popupSlideshow()
    })

    prevBtn.addEventListener('click', () =>{
        if(slideIndex === 0){
            slideIndex = screenshots.length - 1
        }else{
            slideIndex--
        }
        popupSlideshow()
    })

    function popupDetails(){
        if(!portfolioItems[itemIndex].querySelector('.portfolio__item-details')){
            projectDetailsBtn.style.display = 'none'
            return
        }
        projectDetailsBtn.style.display = 'block'
        const details = portfolioItems[itemIndex].querySelector('.portfolio__item-details').innerHTML
        popup.querySelector('.pp__project-details').innerHTML = details
        const title = portfolioItems[itemIndex].querySelector('.portfolio__item-title').innerHTML
        popup.querySelector('.pp__title h2').innerHTML = title
        const category = portfolioItems[itemIndex].getAttribute('data-category')
        popup.querySelector('.pp__project-category').innerHTML = category.split('-').join(' ')
    }

    projectDetailsBtn.addEventListener('click', () =>{
        popupDetailsToggle()
    })

    function popupDetailsToggle() {
        if(projectDetailsContainer.classList.contains('active')){
            projectDetailsBtn.querySelector('i').classList.remove('fa-minus')
            projectDetailsBtn.querySelector('i').classList.add('fa-plus')
            projectDetailsContainer.classList.remove('active')
            projectDetailsContainer.style.maxHeight = 0 + 'px'
        }else{
            projectDetailsBtn.querySelector('i').classList.remove('fa-plus')
            projectDetailsBtn.querySelector('i').classList.add('fa-minus')
            projectDetailsContainer.classList.add('active')
            projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + 'px'
            popup.scrollTo(0,projectDetailsContainer.offsetTop)
        }
      }

})();

