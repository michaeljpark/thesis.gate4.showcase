document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('slideshow-container');
    const totalSlides = 26; // Total number of images

    // Function to create an image slide
    const createImageSlide = (index) => {
        const slide = document.createElement('div');
        slide.classList.add('slide');

        const img = document.createElement('img');
        img.src = `${index}.png`; 
        img.alt = `Gate 4 Showcase - Slide ${index}`;
        
        if (index > 3) {
            img.loading = 'lazy';
        }

        img.onload = () => {
            img.classList.add('loaded');
        };

        const pageNum = document.createElement('div');
        pageNum.classList.add('page-number');
        // page number logic might need adjustment if we count iframe as a page
        // current logic: keeps image numbers same 1..26
        pageNum.textContent = `${index} / ${totalSlides}`; 

        slide.appendChild(img);
        slide.appendChild(pageNum);
        return slide;
    };

    // Function to create iframe slide
    const createIframeSlide = () => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        
        const iframe = document.createElement('iframe');
        iframe.src = "https://michaeljpark.github.io/thesis.gate4/";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        // Allow audio (microphone), autoplay, and other interactive features
        iframe.allow = "autoplay; cleanup; fullscreen; microphone; camera; midi; encrypted-media; picture-in-picture; web-share; clipboard-read; clipboard-write";
        
        slide.appendChild(iframe);
        return slide;
    };

    let slidesCreated = 0;

    for (let i = 1; i <= totalSlides; i++) {
        // Create image slide
        const slide = createImageSlide(i);
        container.appendChild(slide);
        slidesCreated++;

        // Insert iframe between 24 and 25
        if (i === 24) {
             const iframeSlide = createIframeSlide();
             // Mark this as a special slide for tracking if needed, though index order is enough
             iframeSlide.setAttribute('data-type', 'iframe');
             container.appendChild(iframeSlide);
             slidesCreated++;
        }
    }

    // Navigation & Scroll Logic
    const navContainer = document.getElementById('top-nav');
    const navLinks = document.querySelectorAll('#nav-links li');
    const navPillBg = document.getElementById('nav-pill-bg');
    
    // Map section names to li indices
    const sectionIndexMap = {
        "Project recap": 0,
        "User Flow": 1,
        "Working prototype": 2,
        "Branding": 3
    };

    const sections = [
        { start: 2, end: 7, label: "Project recap" },
        { start: 8, end: 24, label: "User Flow" },
        { start: 25, end: 25, label: "Working prototype" }, // The iframe
        { start: 26, end: 27, label: "Branding" } 
    ];

    const updatePillPosition = (label) => {
        const index = sectionIndexMap[label];
        if (index === undefined) return;

        const targetLi = navLinks[index];
        
        // Calculate position relative to the ul container
        // Since nav-pill-bg is absolute inside #top-nav (parent of ul? No, sibling) 
        // Wait, structure is <nav> <pill> <ul> </nav>
        // formatting context is <nav>.
        
        const navRect = navContainer.getBoundingClientRect();
        const liRect = targetLi.getBoundingClientRect();
        
        const relativeLeft = liRect.left - navRect.left;
        const width = liRect.width;

        navPillBg.style.width = `${width}px`;
        navPillBg.style.left = `${relativeLeft}px`;
        navPillBg.classList.add('active'); // Ensure it's visible
    };

    const slides = document.querySelectorAll('.slide');
    
    const observerOptions = {
        root: container,
        threshold: 0.5 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(slides).indexOf(entry.target) + 1;

                if (index === 1) {
                    navContainer.classList.remove('visible');
                } else {
                    navContainer.classList.add('visible'); // Show entire nav

                    const currentSection = sections.find(sec => index >= sec.start && index <= sec.end);
                    
                    if (currentSection) {
                        updatePillPosition(currentSection.label);
                    }
                }
            }
        });
    }, observerOptions);

    slides.forEach(slide => observer.observe(slide));
    
    // Initial hiding/positioning
    navContainer.classList.remove('visible');

    // Click to scroll handling
    navLinks.forEach((link, idx) => {
        link.addEventListener('click', () => {
             // Find target section start index
             // We can map idx 0 -> Project recap -> 2
             // idx 1 -> User Flow -> 8, etc.
             const sectionKeys = Object.keys(sectionIndexMap);
             // Sort by index to be safe? sectionIndexMap order is reliable
             // Better: map sectionIndexMap values to section labels then to start index
             // Or simply use the sections array directly!
             
             // sectionIndexMap: label -> 0,1,2,3
             // sections: array of objects. We need to match order.
             // Our sections array order matches the nav list order implicitly.
             
             const targetSlideIndex = sections[idx].start;
             
             // slides NodeList is 0-indexed, so targetSlideIndex 2 means slides[1]
             if (slides[targetSlideIndex - 1]) {
                 slides[targetSlideIndex - 1].scrollIntoView({ behavior: 'smooth' });
             }
        });
    });
});