    const loginForm = document.getElementById('loginForm'); 

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); 

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                window.location.href = 'index.html';
            } else {
                alert('Identifiants incorrects. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('La requête a échoué:', error);
        }
    });

