const baseItems=[
{id:'bag',name:'小さな布袋',icon:'👜',kind:'storage',w:2,h:2,weight:.4,parent:'main',x:0,y:0,inner:{cols:4,rows:3,maxWeight:4}},
{id:'bottle',name:'水筒',icon:'💧',kind:'water',w:1,h:2,weight:1.1,parent:'main',x:2,y:0,consume:{type:'drink',amount:3,uses:3,maxUses:3,emptyWeight:.2,unitWeight:.3}},
{id:'blanket',name:'毛布',icon:'▤',kind:'cloth',w:3,h:2,weight:1.6,parent:'main',x:3,y:0},
{id:'coins',name:'小銭入れ',icon:'◉',kind:'tool',w:1,h:1,weight:.2,parent:'container:bag',x:0,y:0},
{id:'thread',name:'針と糸',icon:'⌁',kind:'tool',w:1,h:1,weight:.1,parent:'container:bag',x:1,y:0},
{id:'bread',name:'パン',icon:'🥖',kind:'food',w:2,h:1,weight:.35,parent:'loose',consume:{type:'food',amount:3,remove:true}},
{id:'soap',name:'石鹸',icon:'▱',kind:'tool',w:1,h:1,weight:.18,parent:'loose'},
{id:'pot',name:'小鍋',icon:'◒',kind:'tool',w:2,h:2,weight:1.3,parent:'loose'},
{id:'petfood',name:'餌袋',icon:'◫',kind:'food',w:2,h:1,weight:.8,parent:'pet',x:0,y:0}];
