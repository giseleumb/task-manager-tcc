/**
 * Coleta reprodutível da reutilização de métodos nas suítes Playwright.
 * Uso (na raiz do projeto): node coletar_reutilizacao.cjs
 * Requisito: typescript@5.9.3 como dependência de análise estática.
 *
 * Critério: um método é "reutilizado" se for alcançado (diretamente ou por
 * chamadas this.metodo() entre métodos da mesma classe) por >=2 casos de
 * teste distintos. Não contabiliza callbacks test(), construtores, métodos
 * de bibliotecas externas ou propriedades/locators.
 *
 * Limitações: não resolve chamadas dinâmicas, reflexão, aliases de instância
 * ou chamadas entre classes efetuadas por composição. Os resultados devem
 * ser inspecionados e usados em conjunto com o relatório Lizard.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
let ts;
try { ts = require('typescript'); }
catch (_) {
  console.error('Dependência ausente. Execute: npm install --no-save --no-package-lock --ignore-scripts typescript@5.9.3');
  process.exit(1);
}
const root = process.cwd();
const pomDir = path.join(root,'tests','pom');
const pageDir = path.join(pomDir,'pages');
const outDir = path.join(root,'resultados','estrutura');
if (!fs.existsSync(pageDir)) {
  console.error('Execute na raiz do projeto (não foi encontrada tests/pom/pages).');
  process.exit(1);
}
fs.mkdirSync(outDir,{recursive:true});
const parse = f => ts.createSourceFile(f, fs.readFileSync(f,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
const visit = (node,cb) => { cb(node); ts.forEachChild(node,n=>visit(n,cb)); };
const methods = new Map();
const perClass = new Map();
for (const file of fs.readdirSync(pageDir).filter(f=>f.endsWith('.js')).sort()) {
  const filePath=path.join(pageDir,file), src=parse(filePath);
  visit(src,node=>{
    if(!ts.isClassDeclaration(node) || !node.name) return;
    const className=node.name.text;
    const known = perClass.get(className) || new Set();
    for (const member of node.members) {
      if (!ts.isMethodDeclaration(member)) continue;
      const name=member.name.getText(src);
      known.add(name);
      const key=className+'.'+name;
      const sourcePos=src.getLineAndCharacterOfPosition(member.getStart(src)).line+1;
      const methodCalls=new Set();
      if(member.body) visit(member.body,n=>{
        if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) &&
            n.expression.expression.kind===ts.SyntaxKind.ThisKeyword) {
          methodCalls.add(n.expression.name.text);
        }
      });
      methods.set(key,{key,className,name,file:'tests/pom/pages/'+file,line:sourcePos,internal:methodCalls,usesDirect:new Set(),usesAll:new Set(),directCalls:0});
    }
    perClass.set(className,known);
  });
}
// Somente chamadas this.metodo() que realmente existem nessa classe.
for(const m of methods.values()) m.internal=new Set([...m.internal].filter(name=>perClass.get(m.className)?.has(name)));

const tests=[];
for(const file of fs.readdirSync(pomDir).filter(f=>f.endsWith('.spec.js')).sort()){
  const src=parse(path.join(pomDir,file));
  for(const stmt of src.statements) {
    if(!ts.isExpressionStatement(stmt) || !ts.isCallExpression(stmt.expression))continue;
    const call=stmt.expression;
    if(!ts.isIdentifier(call.expression) || call.expression.text!=='test' ||
       call.arguments.length<2 || !ts.isStringLiteral(call.arguments[0])) continue;
    const title=call.arguments[0].text, testId=title.split(' - ')[0];
    const testKey=file+'::'+title, body=call.arguments[1];
    const instances=new Map();
    visit(body,n=>{
      if(ts.isVariableDeclaration(n)&&ts.isIdentifier(n.name)&&n.initializer&&ts.isNewExpression(n.initializer)) {
        const className=n.initializer.expression.getText(src);
        if(perClass.has(className))instances.set(n.name.text,className);
      }
    });
    const directlyCalled = new Set();
    visit(body,n=>{
      if (!ts.isCallExpression(n)||!ts.isPropertyAccessExpression(n.expression))return;
      const receiver=n.expression.expression;
      if (!ts.isIdentifier(receiver))return;
      const className=instances.get(receiver.text);
      if(!className)return;
      const key=className+'.'+n.expression.name.text;
      if(!methods.has(key))return;
      directlyCalled.add(key);
      methods.get(key).directCalls++;
    });
    const reached=new Set(directlyCalled);
    const queue=[...directlyCalled];
    while(queue.length){
      const current=methods.get(queue.shift());
      for(const internalName of current.internal){
        const dep=current.className+'.'+internalName;
        if(!reached.has(dep)){reached.add(dep);queue.push(dep);}
      }
    }
    for(const key of directlyCalled) methods.get(key).usesDirect.add(testKey);
    for(const key of reached) methods.get(key).usesAll.add(testKey);
    tests.push({file,title,id:testId,methodsDirect:[...directlyCalled].sort(),methodsAll:[...reached].sort()});
  }
}
const csv = vals=>vals.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',');
const methodHeaders=['classe','metodo','arquivo','linha','casos_diretos','casos_diretos_ou_indiretos','chamadas_diretas','reutilizado_dois_ou_mais_casos','ids_casos_diretos','ids_casos_total'];
const rows=[...methods.values()].sort((a,b)=>a.key.localeCompare(b.key));
const idsFrom = set => tests.filter(t=>set.has(t.file+'::'+t.title)).map(t=>t.id).join(';');
const methodCsv=[methodHeaders.join(','),...rows.map(m=>csv([
  m.className,m.name,m.file,m.line,m.usesDirect.size,m.usesAll.size,m.directCalls,
  m.usesAll.size>=2?'SIM':'NAO',idsFrom(m.usesDirect),idsFrom(m.usesAll)
]))].join('\r\n')+'\r\n';
fs.writeFileSync(path.join(outDir,'reutilizacao_metodos_pom.csv'),'\ufeff'+methodCsv,'utf8');
const testCsv=['arquivo,caso_id,titulo,metodos_diretos,metodos_totais,lista_metodos_diretos,lista_metodos_totais',...tests.map(t=>csv([
  t.file,t.id,t.title,t.methodsDirect.length,t.methodsAll.length,t.methodsDirect.join(';'),t.methodsAll.join(';')
]))].join('\r\n')+'\r\n';
fs.writeFileSync(path.join(outDir,'reutilizacao_por_caso.csv'),'\ufeff'+testCsv,'utf8');
const summary={
  ferramenta:'TypeScript Compiler API (analise estatica AST); script coletar_reutilizacao.cjs',
  typescriptVersion:ts.version,
  criterio:'Metodo alcançado diretamente ou via chamadas this.metodo() por >=2 casos de teste distintos',
  casosAnalisados:tests.length,
  arquivosDePageObject:fs.readdirSync(pageDir).filter(f=>f.endsWith('.js')).length,
  metodosPropriosDefinidos:methods.size,
  metodosUtilizadosDiretamente:[...methods.values()].filter(m=>m.usesDirect.size>0).length,
  metodosUtilizadosDiretamenteEmDoisOuMaisCasos:[...methods.values()].filter(m=>m.usesDirect.size>=2).length,
  metodosUtilizadosDiretaOuIndiretamenteEmDoisOuMaisCasos:[...methods.values()].filter(m=>m.usesAll.size>=2).length,
  metodosSemUsoDetectado:[...methods.values()].filter(m=>m.usesAll.size===0).map(m=>m.key).sort(),
  limitacoes:'Sem resolucao de chamadas dinamicas, aliases ou composicao entre classes; revisar a saida manualmente.'
};
fs.writeFileSync(path.join(outDir,'reutilizacao_resumo.json'),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
console.log('Arquivos salvos em '+outDir);
