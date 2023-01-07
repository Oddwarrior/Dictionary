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
        console.log(res);
        const { definition, partOfSpeech } = res;
        loadMeaningOnDiv(definition, partOfSpeech);

    } else {
        loadMeaningNotFound();
    }

}
const loadMeaningNotFound = async () => {
    const meaningDiv = document.getElementById("answer");
    meaningDiv.style.display = "revert";
    meaningDiv.innerHTML = "Sorry pal, we couldn't find definitions for the word you were looking for";
}

const loadMeaningOnDiv = async (definitions, partOfSpeech) => {
    const meaningDiv = document.getElementById("answer");
    meaningDiv.style.display = "revert";
    meaningDiv.innerHTML = `<strong> Part of Speech :</strong>  ${partOfSpeech} <br />
    <strong>Meaning</strong> : <br />`;

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

