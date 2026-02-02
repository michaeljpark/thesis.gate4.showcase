document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('slideshow-container');
    const totalSlides = 44; // Max frame index (0 to 44)

    // Function to create an image slide
    const createImageSlide = (index) => {
        const slide = document.createElement('div');
        slide.classList.add('slide');

        const img = document.createElement('img');
        img.src = `Frame-${index}.png`; 
        img.alt = `Gate 4 Showcase - Slide ${index}`;
        
        if (index > 3) {
            img.loading = 'lazy';
        }

        img.onload = () => {
            img.classList.add('loaded');
        };

        const pageNum = document.createElement('div');
        pageNum.classList.add('page-number');
        pageNum.textContent = `${index} / ${totalSlides}`; 

        slide.appendChild(img);
        slide.appendChild(pageNum);
        return slide;
    };

    // Function to create iframe slide
    const createIframeSlide = () => {
        const slide = document.createElement('div');
        slide.classList.add('slide', 'iframe-slide');
        
        // Main container
        const container = document.createElement('div');
        container.classList.add('iframe-content-wrapper');

        // 1. Iframe Page Wrapper
        const iframePage = document.createElement('div');
        iframePage.classList.add('slide-part', 'slide-iframe-page');

        const iframe = document.createElement('iframe');
        iframe.src = "https://michaeljpark.github.io/thesis.gate4/";
        iframe.classList.add('slide-iframe');
        iframe.allow = "autoplay; cleanup; fullscreen; microphone; camera; midi; encrypted-media; picture-in-picture; web-share; clipboard-read; clipboard-write";
        
        iframePage.appendChild(iframe);

        // 2. Video Page Wrapper
        const videoWrapper = document.createElement('div');
        videoWrapper.classList.add('slide-part', 'slide-video-wrapper');

        const video = document.createElement('video');
        video.src = "https://res.cloudinary.com/dhesvrckb/video/upload/v1769232978/2026_michael_joongmin_park_gate_4_yet7yu.mp4";
        video.classList.add('slide-video'); 
        video.controls = false;
        video.autoplay = true;
        video.loop = true;
        video.muted = true; // Needed for autoplay
        video.setAttribute('playsinline', ''); // Needed for mobile autoplay (iOS)

        videoWrapper.appendChild(video);

        container.appendChild(iframePage);
        container.appendChild(videoWrapper);
        slide.appendChild(container);

        return slide;
    };

    for (let i = 0; i <= totalSlides; i++) {
        // Create image slide
        const slide = createImageSlide(i);
        container.appendChild(slide);

        // Insert iframe between 34 and 35
        if (i === 34) {
             const iframeSlide = createIframeSlide();
             iframeSlide.setAttribute('data-type', 'iframe');
             container.appendChild(iframeSlide);
        }
    }

    // Navigation & Scroll Logic
    const navContainer = document.getElementById('top-nav');
    const navLinks = document.querySelectorAll('#nav-links li');
    const navPillBg = document.getElementById('nav-pill-bg');
    
    // Map section names to li indices
    const sectionIndexMap = {
        "Recap": 0,
        "Insights": 1,
        "User Flow": 2,
        "Working Prototype": 3,
        "Branding": 4
    };

    // Recap: 1-7 (DOM 2-8)
    // Insights: 8-17 (DOM 9-18)
    // User Flow: 18-34 (DOM 19-35)
    // Working Prototype (Iframe): (DOM 36)
    // Branding: 35-44 (DOM 37-46)
    const sections = [
        { start: 2, end: 8, label: "Recap" },
        { start: 9, end: 18, label: "Insights" },
        { start: 19, end: 35, label: "User Flow" }, 
        { start: 36, end: 36, label: "Working Prototype" },
        { start: 37, end: 46, label: "Branding" } 
    ];

    const updatePillPosition = (label) => {
        const index = sectionIndexMap[label];
        if (index === undefined) return;

        const targetLi = navLinks[index];
        const isMobile = window.innerWidth <= 768;
        
        // Calculate position relative to the ul container
        // Since nav-pill-bg is absolute inside #top-nav (parent of ul? No, sibling) 
        // Wait, structure is <nav> <pill> <ul> </nav>
        // formatting context is <nav>.
        
        const navRect = navContainer.getBoundingClientRect();
        const liRect = targetLi.getBoundingClientRect();
        
        if (isMobile) {
            const relativeTop = liRect.top - navRect.top;
            const height = liRect.height;
            const width = liRect.width;
            const relativeLeft = liRect.left - navRect.left;

            navPillBg.style.width = `${width}px`;
            navPillBg.style.height = `${height}px`;
            navPillBg.style.top = `${relativeTop}px`;
            navPillBg.style.left = `${relativeLeft}px`;
        } else {
            const relativeLeft = liRect.left - navRect.left;
            const width = liRect.width;

            navPillBg.style.width = `${width}px`;
            navPillBg.style.height = '100%'; // Reset to full height
            navPillBg.style.top = '0'; // Reset top
            navPillBg.style.left = `${relativeLeft}px`;
        }

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

    // View Report Logic
    const viewReportBtn = document.getElementById('view-report-btn');
    const reportModal = document.getElementById('report-modal');
    const reportOverlay = document.getElementById('report-overlay');

    if (viewReportBtn && reportModal && reportOverlay) {
        viewReportBtn.addEventListener('click', () => {
            reportModal.classList.remove('hidden');
        });

        // Close when clicking anywhere on the modal (overlay or image)
        reportModal.addEventListener('click', () => {
            reportModal.classList.add('hidden');
        });
    }
});