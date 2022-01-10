'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);
const nav = document.querySelector(`.nav`);

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// node list has forEach
btnsOpenModal.forEach(btn => btn.addEventListener(`click`, openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener(`click`, function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log(`Current scroll(X/Y): `, window.pageXOffset, window.pageYOffset);

  console.log(
    `height/width viewport`,
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //Scrolling

  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: `smooth`,
  // });
  // dimensions exclude scroll bars

  // modern
  section1.scrollIntoView({ behavior: `smooth` });
});

// // Page Navigation Event Delegation

// document.querySelectorAll(`.nav__link`).forEach(function (ele) {
//   ele.addEventListener(`click`, function (eve) {
//     eve.preventDefault();
//     const id = this.getAttribute(`href`);
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: `smooth` });
//   });
// });

// add event listener to common parent lement
// determine what element originated the event

document.querySelector(`.nav__links`).addEventListener(`click`, function (eve) {
  eve.preventDefault();

  // matching strategy
  if (eve.target.classList.contains(`nav__link`)) {
    const id = eve.target.getAttribute(`href`);
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: `smooth` });
  }
});

////////////////////////////////////////////////////////////
// Tabbed Component

const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabsContent = document.querySelectorAll(`.operations__content`);

// // bad practice because it makes however many copies
// tabs.forEach(tab =>
//   tab.addEventListener(`click`, () => console.log(`tab soda`))
// );

tabsContainer.addEventListener(`click`, function (eve) {
  // matching strategy
  const clickedButton = eve.target.closest(`.operations__tab`);

  // guard clause
  if (!clickedButton) return;

  tabs.forEach(tab => tab.classList.remove(`operations__tab--active`));
  tabsContent.forEach(tab =>
    tab.classList.remove(`operations__content--active`)
  );

  clickedButton.classList.add(`operations__tab--active`);
  // active tab
  document
    .querySelector(`.operations__content--${clickedButton.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

////////////////////////////////////////////////////////////
// Passing Arguments Into Event Handlers

const hoverOp = function (eve) {
  // console.log(this, eve.currentTarget);
  if (eve.target.classList.contains(`nav__link`)) {
    const hovered = eve.target;
    const nonHovered = hovered.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logo = hovered.closest(`.nav`).querySelector(`img`);

    nonHovered.forEach(ele => {
      if (ele !== hovered) ele.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// add event listener expects a function to be passed in for second value
// bind method
// passing argument into handler
nav.addEventListener(`mouseover`, hoverOp.bind(0.5));

nav.addEventListener(`mouseout`, hoverOp.bind(1));

////////////////////////////////////////////////////////////
// // Scroll Event Sticky Navigation
// const initialPos = section1.getBoundingClientRect();
// console.log(initialPos);

// window.addEventListener(`scroll`, function (eve) {
//   // console.log(window.scrollY);
//   if (window.scrollY > initialPos.top) nav.classList.add(`sticky`);
//   else nav.classList.remove(`sticky`);
// });

// Intersection Observer API Sticky Navigation

// const obsFoo = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };

// const obsOpt = {
//   // observe entire viewpoint
//   root: null,
//   // percentage of intersection at which callback will be called
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsFoo, obsOpt);
// observer.observe(section1);

const header = document.querySelector(`.header`);
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add(`sticky`);
  else nav.classList.remove(`sticky`);
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  // height of the nav bar
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);
////////////////////////////////////////////////////////////
// Revealing Elements On Scroll

const allSections = document.querySelectorAll(`.section`);

const sectionAppear = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove(`section--hidden`);
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(sectionAppear, {
  root: null,
  threshold: [0.2, 0.3],
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add(`section--hidden`);
});

////////////////////////////////////////////////////////////
// Lazy Loading Images
const imgTargets = document.querySelectorAll(`img[data-src]`);
// console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  // replace src with data-src
  entry.target.src = entry.target.dataset.src;
  // if you remove the lazy-img before the img loads then you have a noticeable img load with slower connections
  // entry.target.classList.remove(`lazy-img`);
  entry.target.addEventListener(`load`, function () {
    entry.target.classList.remove(`lazy-img`);
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  // add a rootMargin so the images load before you get to them
  rootMargin: `150px`,
});
imgTargets.forEach(img => imgObserver.observe(img));

////////////////////////////////////////////////////////////
// // DOM Traversing

// const h1 = document.querySelector(`h1`);

// // going downwards, chilcdren

// console.log(h1.querySelectorAll(`.highlight`));
// console.log(h1.childNodes);
// // child elements
// console.log(h1.children);
// h1.firstElementChild.style.color = `green`;
// h1.lastElementChild.style.color = `yellow`;

// // going upwards, parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest(`.header`).style.background = `var(--gradient-primary)`;
// h1.closest(`h1`).style.background = `var(--gradient-primary)`;

// // going sideways, siblings

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// // finding all siblings by getting children of parents

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (ele) {
//   if (ele !== h1) ele.style.transform = `scale(0.75)`;
// });

////////////////////////////////////////////////////////////
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector(`.header`);
// const sections = document.querySelectorAll(`.section`);
// console.log(sections);

// document.getElementById(`section--1`);
// const buttonsAll = document.getElementsByTagName(`button`);
// console.log(buttonsAll);

// // node lists dont update

// console.log(document.getElementsByClassName(`btn`));

// // creating and inserting elements
// // .insertAdjacentHTML

// const message = document.createElement(`div`);
// message.classList.add(`cookie-message`);
// // message.textContent = `Allow us to use cookies for better performance.`;
// message.innerHTML = `Cookies are good for you and me. Do it. Eat cookie. <button class="btn btn--close-cookie">Cookie!</button>`;

// // header.prepend(message);
// // header.append(message);
// // true = all child elements also cloned
// // header.append(message.cloneNode(true));
// // header.before(message);
// header.after(message);

// // Delete elements
// document
//   .querySelector(`.btn--close-cookie`)
//   .addEventListener(`click`, function () {
//     message.remove();
//     // old way had to remove children
//     // message.parentElement.removeChild(message);
//   });

// // Styles
// // inline styles, styles set directly in the dom
// message.style.backgroundColor = `#37383d`;
// message.style.width = `120%`;

// // only works for styles we set ourselves (inline styles)
// console.log(message.style.height);
// console.log(message.style.width);

// console.log(getComputedStyle(message));
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 20 + 'px';

// // css custom properties/css variables
// // can use on all properties
// document.documentElement.style.setProperty(`--color-primary`, `orange`);

// // Attributes

// const logo = document.querySelector(`.nav__logo`);
// console.log(logo.src);
// console.log(logo.className);

// logo.alt = `Average Logo`;
// console.log(logo.alt);

// // doesn't work, only works on standard
// console.log(logo.designer);
// console.log(logo.getAttribute(`designer`));
// logo.setAttribute(`company`, `Bankist`);

// // absolute link
// console.log(logo.src);
// // relative link
// console.log(logo.getAttribute(`src`));

// const link = document.querySelector(`.twitter-link`);
// console.log(link.href);
// console.log(link.getAttribute(`href`));

// const link2 = document.querySelector(`.nav__link--btn`);
// console.log(link2.href);
// console.log(link2.getAttribute(`href`));

// // Data attributes
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add(`a`);
// logo.classList.remove(`b`);
// logo.classList.toggle(`c`);
// logo.classList.contains(`d`);
// console.log(logo);

// // don't use, will override existing classes and only one class
// // logo.className = `steve`;

// const h1 = document.querySelector(`h1`);

// const hAlert = function (e) {
//   alert(`addEventListener: nice heading bro`);
//   // h1.removeEventListener(`mouseenter`, hAlert);
// };

// h1.addEventListener(`mouseenter`, hAlert);

// setTimeout(() => h1.removeEventListener(`mouseenter`, hAlert), 3000);

// // h1.onmouseenter = function (e) {
// //   alert(`addEventListener: nice heading bro`);
// // };

// // can use multiple listeners on one event if you use addEventListener

// // Event Propogation

// // randomcolor rgb(255,255,255)
// const randomInt = (min, max) => Math.round(Math.random() * (max - min) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor());

// // add event listener only listening for bubbling phase, not capturing phase
// document.querySelector(`.nav__link`).addEventListener(`click`, function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(`link`, e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   // stop progagation
//   // e.stopPropagation();
// });
// document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(`container`, e.target);
// });
// // setting third argument to true makes event listener work on capturing phase
// document.querySelector(`.nav`).addEventListener(
//   `click`,
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log(`nav`, e.target);
//   },
//   true
// );
