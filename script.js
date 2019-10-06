const continentSelect = document.querySelector('#continent-select');
const countriesList = document.querySelector('#countries-list');

queryFetch(`
    query {
        continents {
            name
            code
        }
    }
`)
.then(data => {
    console.log(data.data.continents);
    
    data.data.continents.forEach(continent => {
        // to populate select element with awailable options
        const option = document.createElement('option');

        option.value = continent.code;
        option.innerText = continent.name;

        continentSelect.append(option);
    });
});

continentSelect.addEventListener('change', async e => {
    const continentCode = e.target.value;
    
    const countries = await getContinentCountries(continentCode);

    countriesList.innerHTML = ``;

    countries.forEach(country => {
        if (country.name === 'Kosovo') {
            return;
        }
        else {
            console.log(country);
            const element = document.createElement('div');
    
            element.innerText = country.name;
    
            countriesList.append(element);
        }
    });
});

function getContinentCountries(continentCode) {
    return queryFetch(`
        query getCountries($code: String) {
            continent(code: $code) {
                countries {
                    name
                }
            }
        }
    `, {
        code: continentCode
    })
    .then(data => {
        return data.data.continent.countries;
    });
}

function queryFetch(query, variables) {
    return fetch('https://countries.trevorblades.com/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    })
    .then(result => result.json());
}