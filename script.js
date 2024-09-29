const registrationForm = document.querySelector("#registrationForm");
const resultElement = document.querySelector("#result");

registrationForm.addEventListener("submit", async (event) => {
  // Prevent the default behaviour of form from submitting
  event.preventDefault();

  // Get the form data
  const nameInput = document.querySelector("#name");
  const addressInput = document.querySelector("#address");

  const name = nameInput.value.trim();
  const address = addressInput.value.trim();

  // Validate if inputs are not empty
  if (!name || !address) {
    resultElement.classList.add("text-danger");
    resultElement.textContent = "*Please fill in both fields";
    return;
  }

  const data = { name, address };

  try {
    // Send POST request to the backend
    const response = await fetch(
      "https://user-and-address-storage.onrender.com/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    const { message } = result;

    // display the appropriate message from server to user
    resultElement.textContent = message;

    if (response.ok) {
      resultElement.classList.remove("text-danger");
      resultElement.classList.add("text-success");

      // Clear the form data
      nameInput.value = "";
      addressInput.value = "";
    } else {
      resultElement.classList.add("text-danger");
    }
  } catch (error) {
    resultElement.classList.add("text-danger");
    resultElement.textContent = "Failed to connect to the server";
  }
});
