
export class SubscriptionFactory{

  static listSubscription() {
    return [
      {
        planId: "price_1M6rEpCxwaFqJ7ikN85pN7yd",
        type: "STARTER",
        price: 5,
        currency: "$",
        effectiveTime: "MONTHLY",
        permisstion: ["01 project only","No sharing feature","01 group cash in","01 group cash out","03 categories each group"]
      },
      {
        planId: "price_1M6rHQCxwaFqJ7ik5pof4Eec",
        type: "BASIC",
        price: 10,
        currency: "$",
        effectiveTime: "MONTHLY",
        permisstion: ["01 project only","No sharing feature","Unlimited groups cash in","Unlimited group cash out","Unlimited categories"]
      },
      {
        planId: "price_1M6rJjCxwaFqJ7ikWOByTWsq",
        type: "MEDIUM",
        price: 15,
        currency: "$",
        effectiveTime: "MONTHLY",
        permisstion: ["02 projects only","Sharing feature 5$/person/month","Unlimited groups cash in","Unlimited group cash out","Unlimited categories"]
      },
      {
        planId: "price_1M6rNZCxwaFqJ7ikZDUoSHbp",
        type: "PREMIUM",
        price: 25,
        currency: "$",
        effectiveTime: "MONTHLY",
        permisstion: ["Unlimited projects","Sharing feature (without fee)","Unlimited groups cash in","Unlimited group cash out","Unlimited categories"]
      },
    ]
  }
  static listAnnually() {
    return [
      {
        planId: "price_1M6rasCxwaFqJ7ikewYQCb75",
        type: "STARTER",
        price: 59,
        originalPrice: 60,
        currency: "$",
        effectiveTime: "ANNUALLY",
        permisstion: ["01 project only","No sharing feature","01 group cash in","01 group cash out","03 categories each group"]
      },
      {
        planId: "price_1M6rc3CxwaFqJ7ikz72tWs1i",
        type: "BASIC",
        price: 110,
        originalPrice: 120,
        currency: "$",
        effectiveTime: "ANNUALLY",
        permisstion: ["01 project only","No sharing feature","Unlimited groups cash in","Unlimited group cash out","Unlimited categories"]
      },
      {
        planId: "price_1M6rcnCxwaFqJ7ik7FM27nys",
        type: "MEDIUM",
        price: 160,
        originalPrice: 180,
        currency: "$",
        effectiveTime: "ANNUALLY",
        permisstion: ["02 projects only","Sharing feature 5$/person/month","Unlimited groups cash in","Unlimited group cash out","Unlimited categories"]
      },
      {
        planId: "price_1M6rdLCxwaFqJ7ikEgNpMIc2",
        type: "PREMIUM",
        price: 270,
        originalPrice: 300,
        currency: "$",
        effectiveTime: "ANNUALLY",
        permisstion: ["Unlimited projects","Sharing feature (without fee)","Unlimited groups cash in","Unlimited group cash out","Unlimited categories"]
      },
    ]
  }

  static getSubscription(type: string, listSub: any) {
    return listSub.find((sub:any) => sub.type === type)
  }
  static cryptCardInfor = (salt:string, text:string) => {
    const textToChars = (text: string) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n:any) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code:any) => textToChars(salt).reduce((a, b) => a ^ b, code);

    return text
      .split("")
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join("");
  };

  static getExpiredSubscription(expiredDate: Date) {
    var today = new Date()
    var one_day=1000*60*60*24;
    return Math.ceil((expiredDate?.getTime()-today?.getTime())/(one_day))
  }
  static getDateExpriredSubscription(expiredDate: Date) {
    const dateExpired = expiredDate.toString().split(' ')
    return `${dateExpired[2]} ${dateExpired[1]} ${dateExpired[3]}`
  }
}