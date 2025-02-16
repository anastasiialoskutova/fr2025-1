document.getElementById('registrationForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const phone = document.getElementById('phone').value;
  const dob = document.getElementById('dob').value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const country = document.getElementById('country').value;
  const agreement = document.getElementById('agreement').checked;
  const photo = document.getElementById('photo').files[0];
  const result_test = document.getElementById('result_test').value;
  const result_game = document.getElementById('result_game').value;

  if (password !== confirmPassword) {
      alert("Паролі не співпадають!");
      return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('phone', phone);
  formData.append('dob', dob);
  formData.append('gender', gender);
  formData.append('country', country);
  formData.append('agreement', agreement ? 'true' : 'false'); // Виправлено
  formData.append('photo', photo);
  formData.append('result_test', result_test);
  formData.append('result_game', result_game);

  try {
    const response = await fetch('http://localhost:3000/registration', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    alert(result.message);
  } catch (error) {
    console.error('Помилка при реєстрації:', error);
    alert('Сталася помилка. Спробуйте ще раз.');
  }
});
