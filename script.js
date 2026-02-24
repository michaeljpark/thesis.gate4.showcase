document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('slideshow-container');
    const totalSlides = 32; // Max frame index (0 to 32)

    // Function to create an image slide
    const createImageSlide = (index) => {
        const slide = document.createElement('div');
        slide.classList.add('slide');

        const img = document.createElement('img');
        if (index <= 29) {
            img.src = `Frame-${index}.png`; 
        } else {
            img.src = `r${index - 29}.png`; // 30 -> r1, 31 -> r2, 32 -> r3
        }
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

    for (let i = 0; i <= totalSlides; i++) {
        // Create image slide
        const slide = createImageSlide(i);
        container.appendChild(slide);
    }

    // Navigation & Scroll Logic
    const navContainer = document.getElementById('top-nav');
    const navLinks = document.querySelectorAll('#nav-links li');
    const navPillBg = document.getElementById('nav-pill-bg');
    
    // Map section names to li indices
    const sectionIndexMap = {
        "Platform Mapping": 0,
        "Business Value": 1,
        "Value Definition": 2,
        "Service Components": 3,
        "Local Community/Culture": 4,
        "Industrial Operational Radio": 5,
        "Urban Radio Infrastructure": 6,
        "Service Diagram": 7,
        "Report": 8
    };

    const sections = [
        { start: 2, end: 7, label: "Platform Mapping" },
        { start: 8, end: 10, label: "Business Value" },
        { start: 11, end: 16, label: "Value Definition" }, 
        { start: 17, end: 21, label: "Service Components" },
        { start: 22, end: 23, label: "Local Community/Culture" },
        { start: 24, end: 25, label: "Industrial Operational Radio" },
        { start: 26, end: 27, label: "Urban Radio Infrastructure" },
        { start: 28, end: 29, label: "Service Diagram" },
        { start: 30, end: 32, label: "Report" }
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
                const index = Array.from(slides).indexOf(entry.target);

                if (index === 0 || index === 1) {
                    navContainer.classList.remove('visible');
                } else {
                    navContainer.classList.add('visible'); // Show entire nav

                    const currentSection = sections.find(sec => index >= sec.start && index <= sec.end);
                    
                    if (currentSection) {
                        updatePillPosition(currentSection.label);
                    }
                }

                // Update View Report / Home button
                if (index >= 30) {
                    viewReportBtn.textContent = "Home";
                } else {
                    viewReportBtn.textContent = "View Report";
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
             
             // slides NodeList is 0-indexed, so targetSlideIndex 2 means slides[2]
             if (slides[targetSlideIndex]) {
                 slides[targetSlideIndex].scrollIntoView({ behavior: 'smooth' });
             }
        });
    });

    // View Report / Home Logic
    const viewReportBtn = document.getElementById('view-report-btn');

    if (viewReportBtn) {
        viewReportBtn.addEventListener('click', () => {
            if (viewReportBtn.textContent === "Home") {
                // Scroll to Frame-0 (index 0)
                if (slides[0]) {
                    slides[0].scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Scroll to Report section (index 30)
                if (slides[30]) {
                    slides[30].scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
});