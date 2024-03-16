document.addEventListener('DOMContentLoaded', function () {
    gsap.config({ trialWarn: false });
  
    gsap.registerPlugin(ScrambleTextPlugin, MorphSVGPlugin);
  
    const BLINK_SPEED = 0.075;
    const TOGGLE_SPEED = 0.125;
    const ENCRYPT_SPEED = 1;
  
    let busy = false;
  
    const EYE = document.querySelector('.eye');
    const TOGGLE = document.querySelectorAll('.eyeButton');
    const PASSWORD_INPUT = document.querySelector('input[name=password]');
    const CONFIRM_INPUT = document.querySelector('input[name=confirm]');
    const PROXY = document.createElement('div');
  
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~,.<>?/;":][}{+_)(*&^%$#@!±=-§';
  
    let blinkTl;
  
    function BLINK() {
      const delay = gsap.utils.random(2, 8);
      const duration = BLINK_SPEED;
      const repeat = Math.random() > 0.5 ? 3 : 1;
      blinkTl = gsap.timeline({
        delay,
        onComplete: BLINK,
        repeat,
        yoyo: true
      });
  
      blinkTl.to('.lid--upper', {
        morphSVG: '.lid--lower',
        duration
      }).to('#eye-open path', {
        morphSVG: '#eye-closed path',
        duration
      }, 0);
    }
  
    BLINK();
  
    const posMapper = gsap.utils.mapRange(-100, 100, 30, -30);
    let reset;
  
    function MOVE_EYE({ x, y }) {
      if (reset) reset.kill();
      reset = gsap.delayedCall(2, () => {
        gsap.to('.eye', { xPercent: 0, yPercent: 0, duration: 0.2 });
      });
      const BOUNDS = EYE.getBoundingClientRect();
      gsap.set('.eye', {
        xPercent: gsap.utils.clamp(-30, 30, posMapper(BOUNDS.x - x)),
        yPercent: gsap.utils.clamp(-30, 30, posMapper(BOUNDS.y - y))
      });
    }
  
    window.addEventListener('pointermove', MOVE_EYE);
  
    TOGGLE.forEach(button => {
      button.addEventListener('click', () => {
        if (busy) return;
        const isText = button.getAttribute('aria-pressed') === 'true';
        const input = button.closest('.input-box').querySelector('input');
        const val = input.value;
        busy = true;
        button.setAttribute('aria-pressed', !isText);
        const duration = TOGGLE_SPEED;
  
        if (isText) {
          if (blinkTl) blinkTl.kill();
  
          gsap.timeline({
            onComplete: () => {
              busy = false;
            }
          }).to('.lid--upper', {
            morphSVG: '.lid--lower',
            duration
          }).to('#eye-open path', {
            morphSVG: '#eye-closed path',
            duration
          }, 0).to(PROXY, {
            duration: ENCRYPT_SPEED,
            onStart: () => {
              input.type = 'text';
            },
            onComplete: () => {
              PROXY.innerHTML = '';
              input.value = val;
            },
            scrambleText: {
              chars,
              text: input.value.charAt(input.value.length - 1) === ' ' ?
                `${input.value.slice(0, input.value.length - 1)}${chars.charAt(Math.floor(Math.random() * chars.length))}` :
                input.value
            },
            onUpdate: () => {
              const len = val.length - PROXY.innerText.length;
              input.value = `${PROXY.innerText}${new Array(len).fill('•').join('')}`;
            }
          }, 0);
        } else {
          gsap.timeline({
            onComplete: () => {
              BLINK();
              busy = false;
            }
          }).to('.lid--upper', {
            morphSVG: '.lid--upper',
            duration
          }).to('#eye-open path', {
            morphSVG: '#eye-open path',
            duration
          }, 0).to(PROXY, {
            duration: ENCRYPT_SPEED,
            onComplete: () => {
              input.type = 'password';
              input.value = val;
              PROXY.innerHTML = '';
            },
            scrambleText: {
              chars,
              text: new Array(input.value.length).fill('•').join('')
            },
            onUpdate: () => {
              input.value = `${PROXY.innerText}${val.slice(PROXY.innerText.length, val.length)}`;
            }
          }, 0);
        }
      });
    });
    
  });



  function onChange() {
    const password = document.querySelector('input[name=password]');
    const confirm = document.querySelector('input[name=confirm]');
    const passwordError = document.getElementById('passwordError');
    
    if (confirm.value === password.value) {
        confirm.setCustomValidity('');
        passwordError.textContent = '';
    } else {
        confirm.setCustomValidity('Passwords do not match');
        passwordError.textContent = 'Passwords do not match';
    }

    // Additional password validations
    if (password.value.length < 8) {
        passwordError.textContent += ' Password must be at least 8 characters long';
    } else if (!/[A-Z]/.test(password.value)) {
        passwordError.textContent += ' Password must contain at least one uppercase letter';
    } else if (!/\d/.test(password.value)) {
        passwordError.textContent += ' Password must contain at least one number';
    } else if (!/[a-zA-Z]/.test(password.value)) {
        passwordError.textContent += ' Password must contain at least one letter';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password.value)) {
        passwordError.textContent += ' Password must contain at least one special character';
    }
}

let rmCheck = document.getElementById("rememberMe"),
    passwordInput = document.getElementById("password"),
    emailInput = document.getElementById("email");

if (localStorage.checkbox && localStorage.checkbox != "") {
  rmCheck.setAttribute("checked", "checked");
  emailInput.value = localStorage.username;
  passwordInput.value = localStorage.password;
} else {
  rmCheck.removeAttribute("checked");
  emailInput.value = "";
  passwordInput.value = "";
}

function lsRememberMe() {
  if (rmCheck.checked && emailInput.value != "" && passwordInput.value != "") {
    localStorage.username = emailInput.value;
    localStorage.password = passwordInput.value;
    localStorage.checkbox = rmCheck.value;
  } else {
    localStorage.username = "";
    localStorage.passoword = "";
    localStorage.checkbox = "";
  }
}


function toggleRememberMe() {
    var rememberMeCheckbox = document.getElementById("rememberMe");
    rememberMeCheckbox.checked = !rememberMeCheckbox.checked;
  }