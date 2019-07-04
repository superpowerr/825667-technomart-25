var writeUsPopup = document.querySelector(".modal-write-us");
var mapPopup = document.querySelector(".modal-map");
var cartPopup = document.querySelector(".modal-cart");

var writeUs = document.querySelector(".contacts .button");
var form = document.querySelector(".modal-write-us form");
var nameField = document.querySelector("#user-name");
var emailField = document.querySelector("#user-email");
var commentField = document.querySelector("#user-comment");

var map = document.querySelector(".contacts a:first-of-type");

var addToCartButtons = document.querySelectorAll(".item-cover a");

var isStorageSupport = true;
var storageName = "";
var storageEmail = "";

var tabsLink = document.querySelectorAll(".services-item a");
var currentTab = document.querySelector(".services-item .active");
var currentTabContent = document.querySelector(".services-info-wrapper .active");

var currentSlide = 0;
var slides = document.querySelectorAll(".offers-slider section");
var radio = document.querySelectorAll(".slider-controls span");

var scale = document.querySelector(".range-filter .scale");

try {
  storageName = localStorage.getItem("name");
  storageEmail = localStorage.getItem("email");
} catch (e) {
  isStorageSupport = false;
}

var openModal = function (button, modal) {
  button.addEventListener("click", function (evt) {
    evt.preventDefault();
    modal.classList.add("modal-show");
    if (modal === writeUsPopup) {
      formValidate(writeUsPopup);
    }
    closePopup();
  });
};

var formValidate = function (modal) {
  nameField.focus();
  if (storageName) {
    nameField.value = storageName;
    emailField.focus();
  }
  if (storageEmail) {
    emailField.value = storageEmail;
    commentField.focus();
  }
  if (!storageName && storageEmail) {
    nameField.focus();
  }
  form.addEventListener("submit", function (evt) {
    if (!nameField.value || !emailField.value) {
      evt.preventDefault();
      modal.classList.remove("modal-error");
      modal.offsetWidth = modal.offsetWidth;
      modal.classList.add("modal-error");
    } else {
      if (isStorageSupport) {
        localStorage.setItem("name", nameField.value);
        localStorage.setItem("email", emailField.value);
      }
    }
  });
};

var closePopup = function () {
  var closePopup = document.querySelector(".modal-show .modal-close");
  var popup = document.querySelector(".modal-show");

  closePopup.addEventListener("click", function (evt) {
    evt.preventDefault();
    popup.classList.remove("modal-error");
    popup.classList.remove("modal-show");
  });

  window.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 27) {
      evt.preventDefault();
      popup.classList.remove("modal-error");
      popup.classList.remove("modal-show");
    }
  });

  if (popup === cartPopup) {
    var returnToShopping = document.querySelector(".modal-cart .button-white");

    returnToShopping.addEventListener("click", function (evt) {
      evt.preventDefault();
      popup.classList.remove("modal-show");
    });
  }
};

if (writeUs) {
  openModal(writeUs, writeUsPopup);
}

if (map) {
  openModal(map, mapPopup);
}

if (tabsLink) {
  tabsLink.forEach(function (elem) {
    elem.addEventListener("click", function (evt) {
      event.preventDefault();
      location.hash = this.hash;
      var content = document.querySelector(this.hash);
      content.classList.add("active");
      elem.classList.add("active");
      if (currentTab !== elem) {
        currentTab.classList.remove("active");
        currentTab = elem;
        currentTabContent.classList.remove("active");
        currentTabContent = content;
      }
    });
  });
}

if (addToCartButtons) {
  addToCartButtons.forEach(function (button) {
    openModal(button, cartPopup);
  });
}

if (slides) {
  var firstSlide = document.querySelector('.slider-controls span:nth-child(1)');
  var secondSlide = document.querySelector('.slider-controls span:nth-child(2)');
  var nextSlide = document.querySelector('.offers-slider .next-slide');
  var previousSlide = document.querySelector('.offers-slider .previous-slide');

  var showSlides = function (number) {
    if (number > slides.length - 1) {
      number = 0;
    } else if (number < 0) {
      number = slides.length - 1;
    } else if (number === currentSlide) {
      return;
    }
    i = 0;
    slides[currentSlide].classList.remove("active");
    slides[number].classList.add("active");
    radio[currentSlide].classList.remove("active");
    radio[number].classList.add("active");
    currentSlide = number;
  };

  if (firstSlide && secondSlide) {
    firstSlide.addEventListener("click", function (evt) {
      evt.preventDefault();
      showSlides(0);
    });

    secondSlide.addEventListener("click", function (evt) {
      evt.preventDefault();
      showSlides(1);
    });
  }

  var showNextSlide = function () {
    var next = currentSlide + 1;
    showSlides(next);
  };

  var showPreviousSlide = function () {
    var previous = currentSlide - 1;
    showSlides(previous);
  };

  if (nextSlide && previousSlide) {
    nextSlide.addEventListener("click", function (evt) {
      evt.preventDefault();
      showNextSlide();
    });

    previousSlide.addEventListener("click", function (evt) {
      evt.preventDefault();
      showPreviousSlide();
    });
  }
}

if (scale) {
  var MIN_OFFSET = 18;

  var bar = document.querySelector(".range-filter .bar");
  var toggleMin = document.querySelector(".range-filter .toggle-min");
  var toggleMax = document.querySelector(".range-filter .toggle-max");
  var minInput = document.querySelector("#filter-min-price");
  var maxInput = document.querySelector("#filter-max-price")

  var rangeEnd = scale.offsetWidth;
  var min = parseInt(getComputedStyle(toggleMin).left);
  var max = parseInt(getComputedStyle(toggleMax).left);

  var getLeftSide = function (elem) {
    var box = elem.getBoundingClientRect();
    return box.left;
  };

  var scaleStart = getLeftSide(scale);

  toggleMin.onmousedown = function (evt) {
    var shiftX = - (evt.clientX - getLeftSide(toggleMin));

    document.onmousemove = function (evt) {
      var newPosition = evt.clientX + shiftX - scaleStart + 20;
      if (newPosition < MIN_OFFSET) {
        newPosition = MIN_OFFSET;
      }
      if (newPosition > max - toggleMin.offsetWidth / 2) {
        newPosition = max - toggleMin.offsetWidth / 2;
      }
      min = newPosition;
      toggleMin.style.left = min + "px";
      bar.style.width = max - min + "px";
      bar.style.left = min + "px";
      if (newPosition > MIN_OFFSET) {
        minInput.value = (min / rangeEnd * minInput.max).toFixed();
      } else {
        minInput.value = 0;
      }
    };
    document.onmouseup = function () {
      document.onmousemove = document.onmouseup = null;
    };
  };

  minInput.addEventListener("input", function (evt) {
    var val = minInput.value;
    var newPosition = val * rangeEnd / minInput.max;

    if (newPosition > max - toggleMin.offsetWidth / 2) {
      newPosition = max - toggleMin.offsetWidth / 2;
    }

    if (newPosition > MIN_OFFSET) {
      min = newPosition;
      toggleMin.style.left = min + "px";
      bar.style.width = max - min + "px";
      bar.style.left = min + "px";
    } else {
      min = MIN_OFFSET;
      toggleMin.style.left = min + "px";
      bar.style.width = max - min + "px";
      bar.style.left = min + "px";
    }
  });

  toggleMax.onmousedown = function (evt) {
    var shiftX = - (evt.clientX - getLeftSide(toggleMax));

    document.onmousemove = function (evt) {
      var newPosition = evt.clientX + shiftX - scaleStart + 20;
      if (newPosition < min + toggleMin.offsetWidth / 2) {
        newPosition = min + toggleMin.offsetWidth / 2;
      }

      if (newPosition > rangeEnd) {
        newPosition = rangeEnd;
      }
      max = newPosition;

      toggleMax.style.left = max + "px";
      bar.style.width = max - min + "px";
      maxInput.value = (((max) / rangeEnd) * maxInput.max).toFixed();
    };

    document.onmouseup = function () {
      document.onmousemove = document.onmouseup = null;
    };
  };

  maxInput.addEventListener("input", function (evt) {
    var val = maxInput.value;
    var newPosition = (val * rangeEnd / maxInput.max);

    if (newPosition > rangeEnd) {
      newPosition = rangeEnd;
    }

    if (newPosition - min > scaleStart) {
      max = newPosition;
      toggleMax.style.left = newPosition + "px";
      bar.style.width = max - min + "px";
    } else {
      max = scaleStart;
      toggleMax.style.left = max + "px";
      bar.style.width = max - min + "px";
    }
  });
}
