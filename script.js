// Sticky Navbar & active link highlight (continued)
const navLinks = document.querySelectorAll('.nav-links li a');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 70;
    if(pageYOffset >= sectionTop) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if(link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

// Stats animation
function animateValue(id, start, end, duration){
  let obj = document.getElementById(id);
  let current = start;
  let range = end - start;
  let increment = end > start ? 1 : -1;
  let stepTime = Math.abs(Math.floor(duration / range));
  let timer = setInterval(function(){
    current += increment;
    obj.textContent = current;
    if(current == end) clearInterval(timer);
  }, stepTime);
}

// Trigger stats when stats section visible
const statsSection = document.querySelector('#stats');
let statsAnimated = false;
window.addEventListener('scroll', () => {
  const rect = statsSection.getBoundingClientRect();
  if(!statsAnimated && rect.top < window.innerHeight){
    animateValue('projects',0,120,2000);
    animateValue('revenue',0,50000,2000);
    animateValue('ads',0,100000,2000);
    statsAnimated = true;
  }
});

// Contact form simulation
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function(e){
  e.preventDefault();
  alert('Message sent! Thank you for contacting Nico.');
  contactForm.reset();
});

// Floating buttons hover effect
const floatingButtons = document.querySelectorAll('.floating-btn');
floatingButtons.forEach(btn => {
  btn.addEventListener('mouseenter', () => { btn.style.transform = 'scale(1.1)'; });
  btn.addEventListener('mouseleave', () => { btn.style.transform = 'scale(1)'; });
});
