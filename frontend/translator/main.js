const form = document.querySelector('form');
const button = document.querySelector('button');


const handleSubmit = async (e) => {
    e.preventDefault();
    let data = new FormData(form);
    let text = data.get('text');
    console.log("data collected" + text);
    // form.reset();

    const response = await fetch('http://localhost:3000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: data.get('text')
        })
    });


    if (response.ok) {
        const { m } = await response.json()
        // console.log(m);
        loadMeaningOnDiv(m);
    }

}

const loadMeaningOnDiv = async (definitions) => {
    const meaningDiv = document.getElementById("answer");
    meaningDiv.innerHTML = `Meaning : <br />`;

    for (let i = 0; i < 2; i++) {
        const { definition } = definitions[i];
        console.log(definition);
        meaningDiv.innerHTML += `<li>${definition}</li>`;
    }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.keyCode == 13) {
        handleSubmit(e);
    }
})

