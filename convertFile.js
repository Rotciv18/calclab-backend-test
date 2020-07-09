const fs = require('fs');

function contains(target, pattern){
  var value = 0;
  pattern.forEach(function(word){
    value = value + target.includes(word);
  });
  return (value === 1)
}

/**
 * 
 * Constrói um objeto a partir da recém string 'Exame:' encontrada
 * A função irá iterar até não encontrar mais palavras chave
 */
function buildObject(index, tokens) {

  const object = {};
  let newIndex = 0;
  const condition = index + 4;

  for (let i = index; i < condition ; i++) {
    
    // Caso específico que não se encontra no arquivo mas poderia acontecer
    if (i !== index && tokens[i].includes('Exame:')) {
      // Novo exame encontrado, finalizar a construção do atual.
      break;
    }
    
    if ( tokens[i] && contains(tokens[i], ['Exame:', 'Resultado:', 'Material:', 'Método:']) ) {

      const detailedTokens = tokens[i].split(/\s+/);

      switch (detailedTokens[0]) {
        case 'Exame:':
          detailedTokens.shift();
          object.name = detailedTokens.join(' ');
          break;
        
        case 'Resultado:':
          detailedTokens.shift();
          object.result = detailedTokens.shift();
          object.unit = detailedTokens.join(' ');
          break;
        
        case 'Material:':
          detailedTokens.shift();
          object.material = detailedTokens.join(' ');
          break;
        
        case 'Método:':
          detailedTokens.shift();
          object.metodo = detailedTokens.join(' ');
          break;
      
        default:
          break;
      }
      newIndex++;
    }
  }

  if (!object.metodo) {
    object.metodo = '-';
  }

  return { object, newIndex };

}

// Adiciona um objeto ao array 'output' sempre que a string 'Exame:' é encontrada
function convertToJSON(tokens) {
  const output = [];
  for (let i = 0; i < tokens.length; i++) {

    if (tokens[i].includes('Exame:')) {
      const {object, newIndex} = buildObject(i, tokens);

      output.push(object);
      i += newIndex;
    }
  }

  const jsonContent = JSON.stringify(output);

  fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log('Ocorreu um erro');
        return console.log(err);
    }
 
    console.log('Objeto salvo em output.json');
});
  
}

function readFileAndTokenize(fileName) {
  fs.readFile(fileName, 'utf8', (error, data) => {
    // Divide toda a string em linhas
    const lineTokens = data.split('\n');

    convertToJSON(lineTokens);
  });
}

readFileAndTokenize('EXAM.txt');