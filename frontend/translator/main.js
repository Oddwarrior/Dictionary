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
        const res = await response.json()
        const { m } = res;
        loadMeaningOnDiv(m);

    } else {
        loadMeaningNotFound();
    }

}
const loadMeaningNotFound = async () => {
    const meaningDiv = document.getElementById("answer");
    meaningDiv.innerHTML = "Sorry pal, we couldn't find definitions for the word you were looking for";
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

