function accounts(amount = 7500, risk = 1, bank = "BoursoBank") {
    const params = {
      "maxCheckingAccount": 2000,
      "minLivretA": 5000,
      "maxLivretA": 22950,
      "maxLDDS": 12000,
      "cat1":{"BoursoBank":"Mon Compte Bancaire","Fortuneo":"Compte Courant"},
      "cat2":{"BoursoBank":"Mon épargne","Fortuneo":"Épargne"},
      "cat3":{"BoursoBank":"Mes placements financiers","Fortuneo":"Assurance vie"},
      "checkingAccount":{"BoursoBank":"BoursoBank","Fortuneo":"Compte Courant"},
      "avFE":{"BoursoBank":"Assurance Vie - Euro Exclusif","Fortuneo":"Fortuneo Vie - Opportunités 2"},
      "avMSCI":{"BoursoBank":"Assurance Vie - MSCI World - FR0010315770","Fortuneo":"Fortuneo Vie - MSCI World - FR0010315770"},
      "referralCode":{"BoursoBank":"JECL8857","Fortuneo":"12738112"},
      "referralLink":{"BoursoBank":"https://www.boursobank.com/landing/parrainage?code_parrain=","Fortuneo":"https://mabanque.fortuneo.fr/fr/offres-parrainage/offres-parrainage.jsp?origine=PARRAINAGE&codeParrain="}
    };
    
    if (risk < 1) {risk = 1} else if (risk > 5) {risk = 5};

    let obj = {};
    obj.accounts = [];
    let amt = amount
    const checkingAccount = Math.min(amt, params["maxCheckingAccount"]);
    amt -= checkingAccount;
   

    let unrisked = Math.round(Math.max(amt * ((5 - risk) / 4) , params["minLivretA"])/100)*100;
    let risked = (amt - unrisked);
    
    const livretA = Math.min(unrisked, params["maxLivretA"]);
    unrisked -= livretA;
    
    const ldds = Math.min(unrisked, params["maxLDDS"]);
    unrisked -= ldds;

    
    obj.accounts.push({ "category":params["cat1"][bank], "name": params["checkingAccount"][bank], "amount": checkingAccount });
    if (livretA > 0) obj.accounts.push({ "category":params["cat2"][bank], "name": "Livret A", "amount": livretA });
    if (ldds > 0) obj.accounts.push({ "category":params["cat2"][bank],"name": "LDDS", "amount": ldds });
    if (unrisked > 0) obj.accounts.push({ "category":params["cat3"][bank],"name": params["avFE"][bank], "amount": unrisked });
    if (risked > 0) obj.accounts.push({ "category":params["cat3"][bank],"name": params["avMSCI"][bank], "amount": risked });

    // referral
    obj.accounts.push({"category":"Soutenir le site","name":params["referralLink"][bank] + params["referralCode"][bank], "amount": params["referralCode"][bank]})
    
    // calc avg yearly return
    amt = (livretA + ldds) * 0.03 + unrisked * 0.023 + risked * 0.1037;
    obj["returns"] = {"irr": Math.round(amt / amount * 10000) / 10000, "amount": Math.round(amt)};
    
    return obj;
  }

// Normalize strings
function normalizeString(str) {
    return String(str)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
}

// Function to generate HTML divs
function generateDivs(dataArray) {
    // Selected bank
    const bank = document.getElementById("bank").value;

    // Results div
    const resultsDiv = document.getElementById('results');

    const title = document.createElement('h2')
    title.textContent = 'Voici la répartition idéale:';
    resultsDiv.appendChild(title);

    dataArray.forEach(item => {
        const categoryId = normalizeString(item.category);

        // Check if the div with the ID already exists
        let categoryDiv = document.getElementById(categoryId);
        console.log(categoryDiv)

        if (!categoryDiv) {
            // Create a new div with the corresponding ID
            categoryDiv = document.createElement('div');
            categoryDiv.classList.add('boursorama-card');
            categoryDiv.id = categoryId;

            // Create a div with class "header-card"
            const headerDiv = document.createElement('div');
            headerDiv.classList.add('header-card');
            headerDiv.textContent = item.category; // Set the category name as content

            // Append the headerDiv to the categoryDiv
            categoryDiv.appendChild(headerDiv);

            // Append the categoryDiv to the body or any other container element
            resultsDiv.appendChild(categoryDiv);
        }

        // Create a div with class "row-card"
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row-card');
        const columnDiv = document.createElement('div');
        columnDiv.classList.add('column');
        var text1 = document.createElement('p');
        var text2 = document.createElement('p');
        var text3 = document.createElement('p');
        text1.innerHTML = item.name;
        text2.innerHTML = bank;
        text3.innerHTML = item.amount.toLocaleString('fr-FR', {minimumFractionDigits: 2}) + '€';
        columnDiv.appendChild(text1);
        columnDiv.appendChild(text2);

        rowDiv.appendChild(columnDiv);
        rowDiv.appendChild(text3);

        // Append the rowDiv to the categoryDiv
        categoryDiv.appendChild(rowDiv);
    });
}

function generate() {
    const amount = document.getElementById("amount").value;
    const risk = document.getElementById("risk").value;
    const bank = document.getElementById("bank").value;
    const data = accounts(amount, risk, bank);
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Remove all content inside the div
    generateDivs(data.accounts);
    console.log(data.accounts);
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
    
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    document.getElementById("lancer-la-simulation").addEventListener("click", function(event){
        event.preventDefault()
      });
});
