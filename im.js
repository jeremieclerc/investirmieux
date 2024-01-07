function accounts(amount = 7500, risk = 0, bank = "BoursoBank") {
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
    
    let obj = {};
    obj.accounts = [];
    let amt = amount
    const checkingAccount = Math.min(amt, params["maxCheckingAccount"]);
    amt -= checkingAccount;
   
    let unrisked = Math.round(Math.max(amt * (1 - risk) , params["minLivretA"])/100)*100;
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
    obj["referral"] = {"link":params["referralLink"][bank] + params["referralCode"][bank], "code": params["referralCode"][bank]}
    
    // calc avg yearly return
    amt = (livretA + ldds) * 0.03 + unrisked * 0.023 + risked * 0.1037;
    obj["returns"] = {"irr": Math.round(amt / amount * 10000) / 10000, "amount": Math.round(amt)};
    return obj;
  }
