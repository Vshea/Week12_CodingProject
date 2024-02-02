const submitButton = document.getElementById('addChore');
const newChoreInput = document.getElementById("new-chore");
const taskDescriptionInput = document.getElementById("task-description");
const choresOutput = document.getElementById('chores');

submitButton.addEventListener('click', async function() {
    const myChore = newChoreInput.value;
    const desc = taskDescriptionInput.value;
    const newChore = { chore: myChore, desc: desc };

    try {
        await addChore(newChore);
        newChoreInput.value = '';
        taskDescriptionInput.value = '';
    } catch (error) {
        console.error('Error submitting chore:', error);
    }
});

const addChore = async (newChore) => {
    try {
        // Generate a unique ID (e.g., using timestamp)
        const id = Date.now().toString();
        
        // Assign the generated ID to the newChore object
        newChore.id = id;

        const response = await fetch(
            "https://65a83fbb94c2c5762da885a9.mockapi.io/Chore",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newChore),
            }
        );

        const data = await response.json();
        console.log(data);
        getChores();
    } catch (error) {
        console.error('Error adding chore:', error);
        throw error;
    }
};

const getChores = async () => {
    const response = await fetch(
        "https://65a83fbb94c2c5762da885a9.mockapi.io/Chore"
    );
    const data = await response.json();
    console.log(data);
    displayChores(data);
};

const deleteChore = async (id, event) => {
    event.preventDefault();
    await fetch(
        `https://65a83fbb94c2c5762da885a9.mockapi.io/Chore/${id}`,
        {
            method: "DELETE",
        }
    );
    getChores();
};

const displayChores = (chores) => {
    choresOutput.innerHTML = '';
    chores.forEach(chore => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.innerHTML = `${chore.chore} - ${chore.desc}`;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'ml-2');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', (event) => deleteChore(chore.id, event));

        listItem.appendChild(deleteButton);
        choresOutput.appendChild(listItem);
    });
};

// Initial fetch and display
getChores();
