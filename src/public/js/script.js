document.addEventListener("DOMContentLoaded", function() {
  var deleteButtons = document.querySelectorAll('[data-bs-target="#deleteCarModal"]');
  deleteButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      var carId = this.getAttribute('data-id');
      var modalInput = document.querySelector('#deleteCarModal input[name="carId"]');
      modalInput.value = carId;
      var deleteForm = document.getElementById("deleteCarForm");
      deleteForm.action = '/cars/delete/' + carId;
    });
  });

  var alerts = document.querySelector(".alert.show");
  if (alerts) {
    setTimeout(function() {
      alerts.remove();
    }, 2000);
  }

  const sidebarToggle = document.querySelector("#sidebar-toggle");
  sidebarToggle.addEventListener("click", function () {
  document.querySelector("#sidebar").classList.toggle("collapsed");
  if(!document.querySelector("#sidebar").classList.contains("collapsed")){
    document.querySelectorAll(".card").forEach(function(card) {
      card.style.width = "23vw";
    });
  }
  else{
    document.querySelectorAll(".card").forEach(function(card) {
      card.style.width = "24rem";
    });
  }
  });
  

  const btnFilter = document.querySelectorAll('.btn-filter-car');
  btnFilter.forEach(btn => {
    btn.addEventListener('click', function() {
      btnFilter.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

