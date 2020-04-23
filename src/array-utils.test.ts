import {ArrDiffs, arrayDiffs, isEquivalent} from "./array-utils";

test("isEquivalent", () => {
  const cases: [any, any, boolean][] = [
    [undefined, undefined, true],
    [null, null, true],
    [null, undefined, true],
    [0, 0, true],
    [0, 1, false],
    [0, NaN, false],
    ["", "", true],
    ["a", "a", true],
    ["a", "b", false],
    ["a", 0, false],
    [true, true, true],
    [true, false, false],
    [true, 1, false],
    [[], [], true],
    [["a"], ["a"], true],
    [["a"], ["b"], false],
    [["a", "b"], ["a", "b"], true],
    [["a", "b"], ["b", "a"], true],
    [{}, {}, true],
    [{a: 1, b: 2}, {a: 1, b: 2}, true],
    [{a: 1, b: 2}, {b: 2, a: 1}, true],
    [{a: 1, b: 2}, {a: 1, b: 2, c: 3}, false],
    [{a: 1, b: ["a", "b"]}, {b: ["b", "a"], a: 1}, true],
    [{a: 1, b: ["a", "c"]}, {b: ["b", "a"], a: 1}, false],
    [{a: 1, b: {c: 1, d: 2}}, {b: {d: 2, c: 1}, a: 1}, true],
    [{a: 1, b: {c: 1, d: ["a", "b"]}}, {b: {d: ["b", "a"], c: 1}, a: 1}, true],
  ];

  for (const [a, b, expectedEquality] of cases) {
    expect(isEquivalent(a, b)).toEqual(expectedEquality);
  }
});

test("String array diff", () => {
  const cases: [string[], string[], ArrDiffs<string>][] = [
    [[], [], []],
    [["a", "b", "c"], ["a", "b", "c"], []],
    [["a", "b", "c"], ["a", "b", "c", "d"], [{type: "create", idx: 3, item: "d"}]],
    [["a", "b", "c"], ["a", "d", "c"], [{type: "update", idx: 1, item: "d"}]],
    [["a", "b", "c"], ["a", "b"], [{type: "delete", idx: 2}]],
    [
      ["a", "b", "c"],
      ["a", "d"],
      [
        {type: "delete", idx: 2},
        {type: "update", idx: 1, item: "d"},
      ],
    ],
    [
      ["a", "b", "c"],
      ["c", "c", "c", "c"],
      [
        {type: "create", idx: 3, item: "c"},
        {type: "update", idx: 1, item: "c"},
        {type: "update", idx: 0, item: "c"},
      ],
    ],
  ];

  for (const [a, b, expectedDiff] of cases) {
    expect(arrayDiffs(a, b)).toEqual(expectedDiff);
  }
});

// PERF

/* let sum; */
/* let total = 10000; */

/* sum = 0; */
/* for (let i = 0; i < total; i++) sum += compare(isEquivalent); */
/* console.log("isEquivalent", sum / total); */

/* sum = 0; */
/* for (let i = 0; i < total; i++) sum += compare(isEqual); */
/* console.log("isEqual", sum / total); */

/* function compare(compare: (a: any, b: any) => any) { */
/*   const t0 = performance.now(); */
/*   compare( */
/*     [ */
/*       { */
/*         _id: "5ea16f05510a228b0ac9f6ca", */
/*         index: 0, */
/*         guid: "0b5ae2c0-f18f-416e-bb25-3f6846419b3a", */
/*         isActive: true, */
/*         balance: "$2,351.11", */
/*         picture: "http://placehold.it/32x32", */
/*         age: 30, */
/*         eyeColor: "brown", */
/*         name: "Isabel Tyler", */
/*         gender: "female", */
/*         company: "WRAPTURE", */
/*         email: "isabeltyler@wrapture.com", */
/*         phone: "+1 (914) 495-2714", */
/*         address: "705 Verona Place, Watchtower, New Mexico, 2187", */
/*         about: */
/*           "Commodo ullamco ullamco enim in culpa duis elit sunt pariatur nisi non voluptate. Exercitation proident sit in ipsum aliqua adipisicing proident dolore. Ut et ea do exercitation proident excepteur laboris nulla consequat. Aute reprehenderit anim velit duis magna eiusmod ipsum pariatur nisi aliquip aliqua eiusmod culpa sunt.\r\n", */
/*         registered: "2018-12-31T06:56:05 -01:00", */
/*         latitude: -62.341833, */
/*         longitude: -25.448392, */
/*         tags: ["Lorem", "elit", "consectetur", "commodo", "exercitation", "duis", "irure"], */
/*         friends: [ */
/*           { */
/*             id: 0, */
/*             name: "Valentine Barker", */
/*           }, */
/*           { */
/*             id: 1, */
/*             name: "Delia Fletcher", */
/*           }, */
/*           { */
/*             id: 2, */
/*             name: "Corine Hogan", */
/*           }, */
/*         ], */
/*         greeting: "Hello, Isabel Tyler! You have 8 unread messages.", */
/*         favoriteFruit: "apple", */
/*       }, */
/*       { */
/*         _id: "5ea16f055c4872fa57770453", */
/*         index: 1, */
/*         guid: "8f84cabe-27b2-4582-92b5-8c39d745fe9f", */
/*         isActive: false, */
/*         balance: "$3,440.03", */
/*         picture: "http://placehold.it/32x32", */
/*         age: 35, */
/*         eyeColor: "brown", */
/*         name: "Love Bernard", */
/*         gender: "male", */
/*         company: "QUILCH", */
/*         email: "lovebernard@quilch.com", */
/*         phone: "+1 (838) 468-3225", */
/*         address: "259 Varick Avenue, Zortman, Florida, 2051", */
/*         about: */
/*           "Dolor sint et nisi nostrud excepteur pariatur ex elit ut voluptate dolor. Culpa amet do commodo anim exercitation est veniam occaecat velit officia ipsum proident culpa. Dolore in culpa aute irure cillum amet. Ipsum culpa elit consectetur consequat eiusmod. Excepteur occaecat cillum amet veniam duis exercitation nostrud dolor magna consequat culpa qui.\r\n", */
/*         registered: "2019-02-22T01:31:01 -01:00", */
/*         latitude: 77.114216, */
/*         longitude: -132.031198, */
/*         tags: ["minim", "ex", "proident", "pariatur", "elit", "id", "mollit"], */
/*         friends: [ */
/*           { */
/*             id: 0, */
/*             name: "Alexander Shelton", */
/*           }, */
/*           { */
/*             id: 1, */
/*             name: "Ferguson Norman", */
/*           }, */
/*           { */
/*             id: 2, */
/*             name: "Ruby Hanson", */
/*           }, */
/*         ], */
/*         greeting: "Hello, Love Bernard! You have 7 unread messages.", */
/*         favoriteFruit: "banana", */
/*       }, */
/*       { */
/*         _id: "5ea16f05134fc8e1ec06b935", */
/*         index: 2, */
/*         guid: "77889d75-a2a9-42bd-a952-0e940de36ec1", */
/*         isActive: true, */
/*         balance: "$3,518.69", */
/*         picture: "http://placehold.it/32x32", */
/*         age: 20, */
/*         eyeColor: "brown", */
/*         name: "Church Woods", */
/*         gender: "male", */
/*         company: "INSURON", */
/*         email: "churchwoods@insuron.com", */
/*         phone: "+1 (922) 461-3211", */
/*         address: "433 Loring Avenue, Fostoria, Connecticut, 3266", */
/*         about: */
/*           "Qui proident aute occaecat ex laboris mollit sint exercitation minim aliqua. Velit pariatur laborum labore labore exercitation culpa pariatur eiusmod mollit quis culpa sit. Enim fugiat magna sit Lorem. Veniam consequat veniam aliquip dolor elit ullamco esse sit velit adipisicing cupidatat non qui.\r\n", */
/*         registered: "2015-11-16T06:42:35 -01:00", */
/*         latitude: 69.859344, */
/*         longitude: 79.442872, */
/*         tags: ["officia", "aliqua", "cupidatat", "minim", "est", "mollit", "excepteur"], */
/*         friends: [ */
/*           { */
/*             id: 0, */
/*             name: "Finley Mcmillan", */
/*           }, */
/*           { */
/*             id: 1, */
/*             name: "Holt Waller", */
/*           }, */
/*           { */
/*             id: 2, */
/*             name: "Ada Newton", */
/*           }, */
/*         ], */
/*         greeting: "Hello, Church Woods! You have 9 unread messages.", */
/*         favoriteFruit: "banana", */
/*       }, */
/*       { */
/*         _id: "5ea16f05f70cbe075692f667", */
/*         index: 3, */
/*         guid: "eaf11022-d904-49e5-ac47-a7ef13d76b10", */
/*         isActive: false, */
/*         balance: "$2,854.25", */
/*         picture: "http://placehold.it/32x32", */
/*         age: 40, */
/*         eyeColor: "blue", */
/*         name: "Ingram Knowles", */
/*         gender: "male", */
/*         company: "VIAGRAND", */
/*         email: "ingramknowles@viagrand.com", */
/*         phone: "+1 (826) 576-2116", */
/*         address: "477 Hoyts Lane, Axis, Maine, 3987", */
/*         about: */
/*           "Aliqua sit ea officia eiusmod veniam reprehenderit amet amet id occaecat sunt dolore excepteur. Tempor dolor ut in ut est cillum commodo Lorem consequat Lorem. Irure ut dolor mollit est culpa elit ut sunt eu pariatur elit. Elit esse sit veniam ullamco exercitation pariatur labore et veniam sit qui officia. Aliquip cillum qui qui dolor ullamco eu ex laboris. Lorem sunt anim veniam ut esse ad.\r\n", */
/*         registered: "2018-09-13T09:04:26 -02:00", */
/*         latitude: 81.950719, */
/*         longitude: 63.823653, */
/*         tags: ["tempor", "quis", "nisi", "laboris", "deserunt", "ullamco", "non"], */
/*         friends: [ */
/*           { */
/*             id: 0, */
/*             name: "Dale Velazquez", */
/*           }, */
/*           { */
/*             id: 1, */
/*             name: "Mercedes Alexander", */
/*           }, */
/*           { */
/*             id: 2, */
/*             name: "Hartman Potter", */
/*           }, */
/*         ], */
/*         greeting: "Hello, Ingram Knowles! You have 3 unread messages.", */
/*         favoriteFruit: "apple", */
/*       }, */
/*       { */
/*         _id: "5ea16f0530b292df4c67aa52", */
/*         index: 4, */
/*         guid: "c7495980-f271-4171-bb8c-83eb63118949", */
/*         isActive: true, */
/*         balance: "$3,580.50", */
/*         picture: "http://placehold.it/32x32", */
/*         age: 38, */
/*         eyeColor: "blue", */
/*         name: "Campbell Alvarado", */
/*         gender: "male", */
/*         company: "GEEKY", */
/*         email: "campbellalvarado@geeky.com", */
/*         phone: "+1 (872) 481-2556", */
/*         address: "141 Berkeley Place, Eagleville, Guam, 3722", */
/*         about: */
/*           "Culpa amet dolor sit duis cillum dolor cillum tempor ut. Cupidatat duis cillum ad aliqua nisi enim excepteur. Velit consequat eiusmod nostrud magna laborum consectetur amet commodo ex commodo aliqua duis. Anim ad magna aliqua excepteur anim mollit sint aliqua aliquip nisi. Aute reprehenderit nisi adipisicing veniam Lorem nostrud ex incididunt qui elit. Aute fugiat id do irure.\r\n", */
/*         registered: "2017-09-18T02:37:13 -02:00", */
/*         latitude: 50.513525, */
/*         longitude: 45.167668, */
/*         tags: ["mollit", "non", "proident", "nulla", "officia", "veniam", "aliqua"], */
/*         friends: [ */
/*           { */
/*             id: 0, */
/*             name: "Gloria Daniel", */
/*           }, */
/*           { */
/*             id: 1, */
/*             name: "Evans Reed", */
/*           }, */
/*           { */
/*             id: 2, */
/*             name: "Ethel Nichols", */
/*           }, */
/*         ], */
/*         greeting: "Hello, Campbell Alvarado! You have 5 unread messages.", */
/*         favoriteFruit: "apple", */
/*       }, */
/*       { */
/*         _id: "5ea16f05bcfa5d8ec758a248", */
/*         index: 5, */
/*         guid: "801bb20c-dd46-4cad-94e4-d7318e7f0a81", */
/*         isActive: false, */
/*         balance: "$1,850.56", */
/*         picture: "http://placehold.it/32x32", */
/*         age: 20, */
/*         eyeColor: "blue", */
/*         name: "Byers Barnett", */
/*         gender: "male", */
/*         company: "SKYPLEX", */
/*         email: "byersbarnett@skyplex.com", */
/*         phone: "+1 (889) 430-2791", */
/*         address: "210 Alabama Avenue, Caroline, New Jersey, 5016", */
/*         about: */
/*           "Exercitation excepteur duis ut laboris aliquip. Aute labore nostrud Lorem adipisicing. Consectetur cillum deserunt tempor officia sint velit excepteur pariatur veniam officia cupidatat sint dolore. Pariatur eu ex irure irure tempor dolore aliqua.\r\n", */
/*         registered: "2020-01-13T03:23:24 -01:00", */
/*         latitude: 22.109328, */
/*         longitude: 104.709605, */
/*         tags: ["dolor", "esse", "laborum", "voluptate", "magna", "do", "id"], */
/*         friends: [ */
/*           { */
/*             id: 0, */
/*             name: "Ingrid Nunez", */
/*           }, */
/*           { */
/*             id: 1, */
/*             name: "Palmer Ferguson", */
/*           }, */
/*           { */
/*             id: 2, */
/*             name: "Viola Russo", */
/*           }, */
/*         ], */
/*         greeting: "Hello, Byers Barnett! You have 8 unread messages.", */
/*         favoriteFruit: "banana", */
/*       }, */
/*       { */
/*         _id: "5ea16f05afea72430016b629", */
/*         index: 6, */
/*         guid: "6d832920-50d1-4e4f-bd6c-4f493fe2ee98", */
/*         isActive: true, */
/*         balance: "$2,293.53", */
/*         picture: "http://placehold.it/32x32", */
/*         age: 26, */
/*         eyeColor: "blue", */
/*         name: "Peters Dickson", */
/*         gender: "male", */
/*         company: "ZILPHUR", */
/*         email: "petersdickson@zilphur.com", */
/*         phone: "+1 (911) 425-3216", */
/*         address: "692 Hubbard Street, Zarephath, Pennsylvania, 4247", */
/*         about: */
/*           "In adipisicing consectetur do non eu. Consectetur aliquip excepteur aliqua consequat excepteur laboris irure qui dolor eu sunt cupidatat ea reprehenderit. Id exercitation officia dolore esse nisi commodo consequat reprehenderit tempor. Officia culpa eu ad ullamco labore veniam culpa cupidatat minim ex consequat eiusmod id ullamco. Enim minim elit incididunt id aliqua elit irure do aliquip cillum. Occaecat reprehenderit sint cillum officia officia incididunt veniam laboris velit culpa enim occaecat. Dolor consectetur ex officia quis culpa sunt nisi.\r\n", */
/*         registered: "2015-07-18T03:50:40 -02:00", */
/*         latitude: -53.276834, */
/*         longitude: -82.9829, */
/*         tags: ["commodo", "pariatur", "est", "deserunt", "labore", "magna", "veniam"], */
/*         friends: [ */
/*           { */
/*             id: 0, */
/*             name: "Darla Mccall", */
/*           }, */
/*           { */
/*             id: 1, */
/*             name: "Hatfield Calhoun", */
/*           }, */
/*           { */
/*             id: 2, */
/*             name: "Mckay Underwood", */
/*           }, */
/*         ], */
/*         greeting: "Hello, Peters Dickson! You have 3 unread messages.", */
/*         favoriteFruit: "apple", */
/*       }, */
/*     ], */
/*     [ */
/*       { */
/*         _id: "5ea16f05510a228b0ac9f6ca", */
/*         index: 0, */
/*         guid: "0b5ae2c0-f18f-416e-bb25-3f6846419b3a", */
/*         isActive: true, */
/*         balance: "$2,351.11", */
/*         picture: "http://placehold.it/32x32", */
/*         age: 30, */
/*         eyeColor: "brown", */
/*         name: "Isabel Tyler", */
/*         gender: "female", */
/*         company: "WRAPTURE", */
/*         email: "isabeltyler@wrapture.com", */
/*         phone: "+1 (914) 495-2714", */
/*         address: "705 Verona Place, Watchtower, New Mexico, 2187", */
/*         about: */
/*           "Commodo ullamco ullamco enim in culpa duis elit sunt pariatur nisi non voluptate. Exercitation proident sit in ipsum aliqua adipisicing proident dolore. Ut et ea do exercitation proident excepteur laboris nulla consequat. Aute reprehenderit anim velit duis magna eiusmod ipsum pariatur nisi aliquip aliqua eiusmod culpa sunt.\r\n", */
/*         registered: "2018-12-31T06:56:05 -01:00", */
/*         latitude: -62.341833, */
/*         longitude: -25.448392, */
/*         tags: ["Lorem", "elit", "consectetur", "commodo", "exercitation", "duis", "irure"], */
/*         friends: [ */
/*           { */
/*             id: 0, */
/*             name: "Valentine Barker", */
/*           }, */
/*           { */
/*             id: 1, */
/*             name: "Delia Fletcher", */
/*           }, */
/*           { */
/*             id: 2, */
/*             name: "Corine Hogan", */
/*           }, */
/*         ], */
/*         greeting: "Hello, Isabel Tyler! You have 8 unread messages.", */
/*         favoriteFruit: "apple", */
/*       }, */
/*       { */
/*         _id: "5ea16f055c4872fa57770453", */
/*         index: 1, */
/*         guid: "8f84cabe-27b2-4582-92b5-8c39d745fe9f", */
/*         isActive: false, */
/*         balance: "$3,440.03", */
/*         picture: "http://placehold.it/32x32", */
/*         age: 35, */
/*         eyeColor: "brown", */
/*         name: "Love Bernard", */
/*         gender: "male", */
/*         company: "QUILCH", */
/*         email: "lovebernard@quilch.com", */
/*         phone: "+1 (838) 468-3225", */
/*         address: "259 Varick Avenue, Zortman, Florida, 2051", */
/*         about: */
/*           "Dolor sint et nisi nostrud excepteur pariatur ex elit ut voluptate dolor. Culpa amet do commodo anim exercitation est veniam occaecat velit officia ipsum proident culpa. Dolore in culpa aute irure cillum amet. Ipsum culpa elit consectetur consequat eiusmod. Excepteur occaecat cillum amet veniam duis exercitation nostrud dolor magna consequat culpa qui.\r\n", */
/*         registered: "2019-02-22T01:31:01 -01:00", */
/*         latitude: 77.114216, */
/*         longitude: -132.031198, */
/*         tags: ["minim", "ex", "proident", "pariatur", "elit", "id", "mollit"], */
/*         friends: [ */
/*           { */
/*             id: 0, */
/*             name: "Alexander Shelton", */
/*           }, */
/*           { */
/*             id: 1, */
/*             name: "Ferguson Norman", */
/*           }, */
/*           { */
/*             id: 2, */
/*             name: "Ruby Hanson", */
/*           }, */
/*         ], */
/*         greeting: "Hello, Love Bernard! You have 7 unread messages.", */
/*         favoriteFruit: "banana", */
/*       }, */
/*       { */
/*         _id: "5ea16f05134fc8e1ec06b935", */
/*         index: 2, */
/*         guid: "77889d75-a2a9-42bd-a952-0e940de36ec1", */
/*         isActive: true, */
/*         balance: "$3,518.69", */
/*         picture: "http://placehold.it/32x32", */
/*         age: 20, */
/*         eyeColor: "brown", */
/*         name: "Church Woods", */
/*         gender: "male", */
/*         company: "INSURON", */
/*         email: "churchwoods@insuron.com", */
/*         phone: "+1 (922) 461-3211", */
/*         address: "433 Loring Avenue, Fostoria, Connecticut, 3266", */
/*         about: */
/*           "Qui proident aute occaecat ex laboris mollit sint exercitation minim aliqua. Velit pariatur laborum labore labore exercitation culpa pariatur eiusmod mollit quis culpa sit. Enim fugiat magna sit Lorem. Veniam consequat veniam aliquip dolor elit ullamco esse sit velit adipisicing cupidatat non qui.\r\n", */
/*         registered: "2015-11-16T06:42:35 -01:00", */
/*         latitude: 69.859344, */
/*         longitude: 79.442872, */
/*         tags: ["officia", "aliqua", "cupidatat", "minim", "est", "mollit", "excepteur"], */
/*         friends: [ */
/*           { */
/*             id: 0, */
/*             name: "Finley Mcmillan", */
/*           }, */
/*           { */
/*             id: 1, */
/*             name: "Holt Waller", */
/*           }, */
/*           { */
/*             id: 2, */
/*             name: "Ada Newton", */
/*           }, */
/*         ], */
/*         greeting: "Hello, Church Woods! You have 9 unread messages.", */
/*         favoriteFruit: "banana", */
/*       }, */
/*       { */
/*         _id: "5ea16f05f70cbe075692f667", */
/*         index: 3, */
/*         guid: "eaf11022-d904-49e5-ac47-a7ef13d76b10", */
/*         isActive: false, */
/*         balance: "$2,854.25", */
/*         picture: "http://placehold.it/32x32", */
/*         age: 40, */
/*         eyeColor: "blue", */
/*         name: "Ingram Knowles", */
/*         gender: "male", */
/*         company: "VIAGRAND", */
/*         email: "ingramknowles@viagrand.com", */
/*         phone: "+1 (826) 576-2116", */
/*         address: "477 Hoyts Lane, Axis, Maine, 3987", */
/*         about: */
/*           "Aliqua sit ea officia eiusmod veniam reprehenderit amet amet id occaecat sunt dolore excepteur. Tempor dolor ut in ut est cillum commodo Lorem consequat Lorem. Irure ut dolor mollit est culpa elit ut sunt eu pariatur elit. Elit esse sit veniam ullamco exercitation pariatur labore et veniam sit qui officia. Aliquip cillum qui qui dolor ullamco eu ex laboris. Lorem sunt anim veniam ut esse ad.\r\n", */
/*         registered: "2018-09-13T09:04:26 -02:00", */
/*         latitude: 81.950719, */
/*         longitude: 63.823653, */
/*         tags: ["tempor", "quis", "nisi", "laboris", "deserunt", "ullamco", "non"], */
/*         friends: [ */
/*           { */
/*             id: 0, */
/*             name: "Dale Velazquez", */
/*           }, */
/*           { */
/*             id: 1, */
/*             name: "Mercedes Alexander", */
/*           }, */
/*           { */
/*             id: 2, */
/*             name: "Hartman Potter", */
/*           }, */
/*         ], */
/*         greeting: "Hello, Ingram Knowles! You have 3 unread messages.", */
/*         favoriteFruit: "apple", */
/*       }, */
/*       { */
/*         _id: "5ea16f0530b292df4c67aa52", */
/*         index: 4, */
/*         guid: "c7495980-f271-4171-bb8c-83eb63118949", */
/*         isActive: true, */
/*         balance: "$3,580.50", */
/*         picture: "http://placehold.it/32x32", */
/*         age: 38, */
/*         eyeColor: "blue", */
/*         name: "Campbell Alvarado", */
/*         gender: "male", */
/*         company: "GEEKY", */
/*         email: "campbellalvarado@geeky.com", */
/*         phone: "+1 (872) 481-2556", */
/*         address: "141 Berkeley Place, Eagleville, Guam, 3722", */
/*         about: */
/*           "Culpa amet dolor sit duis cillum dolor cillum tempor ut. Cupidatat duis cillum ad aliqua nisi enim excepteur. Velit consequat eiusmod nostrud magna laborum consectetur amet commodo ex commodo aliqua duis. Anim ad magna aliqua excepteur anim mollit sint aliqua aliquip nisi. Aute reprehenderit nisi adipisicing veniam Lorem nostrud ex incididunt qui elit. Aute fugiat id do irure.\r\n", */
/*         registered: "2017-09-18T02:37:13 -02:00", */
/*         latitude: 50.513525, */
/*         longitude: 45.167668, */
/*         tags: ["mollit", "non", "proident", "nulla", "officia", "veniam", "aliqua"], */
/*         friends: [ */
/*           { */
/*             id: 0, */
/*             name: "Gloria Daniel", */
/*           }, */
/*           { */
/*             id: 1, */
/*             name: "Evans Reed", */
/*           }, */
/*           { */
/*             id: 2, */
/*             name: "Ethel Nichols", */
/*           }, */
/*         ], */
/*         greeting: "Hello, Campbell Alvarado! You have 5 unread messages.", */
/*         favoriteFruit: "apple", */
/*       }, */
/*       { */
/*         _id: "5ea16f05bcfa5d8ec758a248", */
/*         index: 5, */
/*         guid: "801bb20c-dd46-4cad-94e4-d7318e7f0a81", */
/*         isActive: false, */
/*         balance: "$1,850.56", */
/*         picture: "http://placehold.it/32x32", */
/*         age: 20, */
/*         eyeColor: "blue", */
/*         name: "Byers Barnett", */
/*         gender: "male", */
/*         company: "SKYPLEX", */
/*         email: "byersbarnett@skyplex.com", */
/*         phone: "+1 (889) 430-2791", */
/*         address: "210 Alabama Avenue, Caroline, New Jersey, 5016", */
/*         about: */
/*           "Exercitation excepteur duis ut laboris aliquip. Aute labore nostrud Lorem adipisicing. Consectetur cillum deserunt tempor officia sint velit excepteur pariatur veniam officia cupidatat sint dolore. Pariatur eu ex irure irure tempor dolore aliqua.\r\n", */
/*         registered: "2020-01-13T03:23:24 -01:00", */
/*         latitude: 22.109328, */
/*         longitude: 104.709605, */
/*         tags: ["dolor", "esse", "laborum", "voluptate", "magna", "do", "id"], */
/*         friends: [ */
/*           { */
/*             id: 0, */
/*             name: "Ingrid Nunez", */
/*           }, */
/*           { */
/*             id: 1, */
/*             name: "Palmer Ferguson", */
/*           }, */
/*           { */
/*             id: 2, */
/*             name: "Viola Russo", */
/*           }, */
/*         ], */
/*         greeting: "Hello, Byers Barnett! You have 8 unread messages.", */
/*         favoriteFruit: "banana", */
/*       }, */
/*       { */
/*         _id: "5ea16f05afea72430016b629", */
/*         index: 6, */
/*         guid: "6d832920-50d1-4e4f-bd6c-4f493fe2ee98", */
/*         isActive: true, */
/*         balance: "$2,293.53", */
/*         picture: "http://placehold.it/32x32", */
/*         age: 26, */
/*         eyeColor: "blue", */
/*         name: "Peters Dickson", */
/*         gender: "male", */
/*         company: "ZILPHUR", */
/*         email: "petersdickson@zilphur.com", */
/*         phone: "+1 (911) 425-3216", */
/*         address: "692 Hubbard Street, Zarephath, Pennsylvania, 4247", */
/*         about: */
/*           "In adipisicing consectetur do non eu. Consectetur aliquip excepteur aliqua consequat excepteur laboris irure qui dolor eu sunt cupidatat ea reprehenderit. Id exercitation officia dolore esse nisi commodo consequat reprehenderit tempor. Officia culpa eu ad ullamco labore veniam culpa cupidatat minim ex consequat eiusmod id ullamco. Enim minim elit incididunt id aliqua elit irure do aliquip cillum. Occaecat reprehenderit sint cillum officia officia incididunt veniam laboris velit culpa enim occaecat. Dolor consectetur ex officia quis culpa sunt nisi.\r\n", */
/*         registered: "2015-07-18T03:50:40 -02:00", */
/*         latitude: -53.276834, */
/*         longitude: -82.9829, */
/*         tags: ["commodo", "pariatur", "est", "deserunt", "labore", "magna", "veniam"], */
/*         friends: [ */
/*           { */
/*             id: 0, */
/*             name: "Darla Mccall", */
/*           }, */
/*           { */
/*             id: 1, */
/*             name: "Hatfield Calhoun", */
/*           }, */
/*           { */
/*             id: 2, */
/*             name: "Mckay Underwood", */
/*           }, */
/*         ], */
/*         greeting: "Hello, Peters Dickson! You have 3 unread messages.", */
/*         favoriteFruit: "apple", */
/*       }, */
/*     ], */
/*   ); */
/*   const t1 = performance.now(); */
/*   return t1 - t0; */
/* } */
