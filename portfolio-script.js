// =====================
// EMAILJS INITIALIZATION
// =====================
// Initialize EmailJS - Replace with your public key from EmailJS
emailjs.init("126HmNOuNvjOW_3A5"); // Get this from https://dashboard.emailjs.com/

// =====================
// NAVIGATION ACTIVE STATE
// =====================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// =====================
// HAMBURGER MENU
// =====================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// =====================
// CONTACT FORM - EMAILJS
// =====================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const user_name = document.getElementById('user_name').value;
        const user_email = document.getElementById('user_email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Show loading message
        formMessage.textContent = 'Sending your message...';
        formMessage.style.color = '#0066ff';

        // Prepare the email parameters
        const templateParams = {
            to_email: 'isaiahomoruyi4@gmail.com',
            from_email: user_email,
            from_name: user_name,
            subject: subject,
            message: message
        };

        // Send email using EmailJS
        emailjs.send('service_btpu2s5', 'template_q9uk1mx', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                formMessage.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
                formMessage.style.color = '#10b981';
                contactForm.reset();
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    formMessage.textContent = '';
                }, 5000);
            }, function(error) {
                console.log('FAILED...', error);
                formMessage.textContent = '✗ Failed to send message. Please try again or email me directly.';
                formMessage.style.color = '#ef4444';
            });
    });
}

// =====================
// SKILLS TAB FILTERING
// =====================
const tabButtons = document.querySelectorAll('.tab-btn');
const skillCategories = document.querySelectorAll('.skill-category');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabValue = btn.getAttribute('data-tab');
        
        // Remove active class from all buttons and categories
        tabButtons.forEach(b => b.classList.remove('active'));
        skillCategories.forEach(cat => cat.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Show relevant categories
        if (tabValue === 'all') {
            skillCategories.forEach(cat => cat.classList.add('active'));
        } else {
            skillCategories.forEach(cat => {
                if (cat.getAttribute('data-category') === tabValue) {
                    cat.classList.add('active');
                }
            });
        }
    });
});

// Set frontend as default active tab
tabButtons[0].classList.add('active');
skillCategories.forEach(cat => {
    if (cat.getAttribute('data-category') === 'frontend') {
        cat.classList.add('active');
    }
});

// =====================
// SKILL PROGRESS ANIMATION
// =====================
const animateSkillBars = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            skillObserver.unobserve(entry.target);
        }
    });
};

const skillObserver = new IntersectionObserver(animateSkillBars, {
    threshold: 0.1
});

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}

// =====================
// SMOOTH SCROLL
// =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =====================
// ANIMATION ON SCROLL
// =====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project cards, service cards, and testimonial cards
document.querySelectorAll('.project-card, .service-item, .testimonial-card, .stat-box, .desc-item, .skill-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Observe section headers and labels for fade-in
document.querySelectorAll('.section-label, h2, .skills-header, .testimonials-header, .contact-header').forEach(el => {
    el.style.opacity = '0';
    el.style.animation = 'fadeInDown 0.8s ease forwards';
    observer.observe(el);
});

// Intersection Observer for advanced scroll animations
const scrollAnimationOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const scrollObserver = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered animation delays
            const delay = index * 0.08;
            entry.target.style.animationDelay = `${delay}s`;
            entry.target.classList.add('animate-on-scroll');
        }
    });
}, scrollAnimationOptions);

// Observe all animated elements
document.querySelectorAll('.project-card, .service-item, .testimonial-card, .stat-box').forEach(el => {
    scrollObserver.observe(el);
});
