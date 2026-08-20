const COMPANION_DATA=[
  {id:'none',label:'同行なし',icon:'—',description:'ひとりで旅をする',health:0,dailyFood:0},
  {id:'ox',label:'牛',icon:'🐂',description:'牛を旅の相棒にする',health:8,dailyFood:3},
  {id:'horse',label:'馬',icon:'🐎',description:'馬を旅の相棒にする',health:10,dailyFood:2},
  {id:'dog',label:'犬',icon:'🐕',description:'犬を旅の相棒にする',health:15,dailyFood:1}
];
const COMPANION_RULES={feedRecovery:3};
function companionDefinition(id){return COMPANION_DATA.find(x=>x.id===id)||null}
