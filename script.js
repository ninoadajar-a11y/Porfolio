// Smooth scroll to section
function scrollToSection(selector){
  document.querySelector(selector).scrollIntoView({behavior:'smooth'});
}

// Fade-in on scroll
const faders=document.querySelectorAll('.hero-text, .hero-image, #stats h2, .stat, #skills h2, .skill-card, #portfolio h2, .portfolio-item, #about h2, .about-text, .about-image, #testimonials h2, .testimonial, #contact h2, .contact-form');
const appearOptions={threshold:0.2};
const appearOnScroll=new IntersectionObserver(function(entries,observer){
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
},appearOptions);
faders.forEach(fader=>{appearOnScroll.observe(fader);});

// Sticky Navbar & active link highlight
const navLinks=document.querySelectorAll('.nav
