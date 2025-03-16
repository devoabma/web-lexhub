export function formatFullName(name: string) {
  return name
    .toLowerCase() // Primeiro, converte todo o nome para minúsculas
    .split(' ') // Separa o nome por espaços
    .map(word => {
      // Se a palavra tem mais de 3 caracteres, capitaliza o primeiro caractere
      if (word.length > 2) {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }
      // Caso contrário, mantém a palavra em minúsculas
      return word
    })
    .join(' ') // Junta as palavras novamente com espaços
}
