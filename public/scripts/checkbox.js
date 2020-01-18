// jshint esversion:6

const checkboxArray = document.querySelectorAll('input[type="checkbox"]');

checkboxArray.forEach((checkbox) => {
  checkbox.addEventListener('change', (event) => {
    event.srcElement.parentElement.parentElement.submit();
  });
});
