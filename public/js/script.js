(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

//wishlist

document.addEventListener("click", function (event) {
    const heart = event.target.closest(".wishlist-heart");
    if (!heart) return;   // agar heart pe click nahi hua toh kuch mat karo

    event.preventDefault();     // <a> ka default navigate rokega
    event.stopPropagation();    // click ko upar <a> tak bubble hone se rokega

    const listingId = heart.dataset.id;

    fetch(`/listings/${listingId}/wishlist`, { method: "POST" })
         .then(res => {

        if (res.redirected) {
            window.location.href = res.url;
            return;
        }

        return res.json();
    })
    .then(data => {

        if (!data) return;

        heart.classList.toggle("bi-heart");
        heart.classList.toggle("bi-heart-fill");
        heart.classList.toggle("text-danger");

    })
        .catch(err => console.error("Wishlist error:", err));
});